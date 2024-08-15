import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostgresError } from 'postgres';
import { DatabaseService } from 'src/database/database.service';
import { Tables } from 'src/types/supabase-db';
import { keyBy } from 'lodash';
import dayjs from 'src/lib/dayjs';

@Injectable()
export class ChartsService {
  private readonly logger = new Logger(ChartsService.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async getChartData(id: number, userId: string) {
    this.logger.log(
      `${this.getChartData.name} called with id [${id}], userId [${userId}]`,
    );
    try {
      // check if chart exists
      const charts = await this.databaseService.sql<
        Pick<Tables<'charts'>, 'id'>[]
      >`SELECT id FROM public.charts WHERE id = ${id} AND created_by = ${userId}`;

      if (charts.length === 0) {
        throw new NotFoundException('chart does not exist');
      }

      // check if the chart has any condition and aggregations attached
      const conditions = await this.databaseService.sql<
        Tables<'chart_conditions'>[]
      >`SELECT * FROM public.chart_conditions WHERE chart_id = ${id} AND created_by = ${userId} order by created_at asc`;

      if (conditions.length === 0) {
        throw new BadRequestException('chart does not have any conditions');
      }

      const aggregations = await this.databaseService.sql<
        Tables<'chart_aggregations'>[]
      >`SELECT * FROM public.chart_aggregations WHERE chart_id = ${id} AND created_by = ${userId}`;

      if (aggregations.length === 0) {
        throw new BadRequestException('chart does not have any aggregations');
      }

      const nestedConditionsArr: Tables<'chart_conditions'>[][] = [];
      const childConditionIds: number[] = [];

      conditions.forEach((condition) => {
        const childConditions = conditions.filter((c) => {
          if (c.field === 'TAG_VALUE') {
            const tagKeyCondition = conditions.find(
              (c) => c.parent_id === condition.id,
            );

            if (!tagKeyCondition) {
              return false;
            }

            return condition.id === tagKeyCondition.parent_id;
          }

          return c.parent_id === condition.id;
        });

        if (childConditions.length === 0) {
          if (childConditionIds.includes(Number(condition.id)) === false) {
            nestedConditionsArr.push([condition]);
          }
        } else {
          if (condition.parent_id === null) {
            childConditionIds.push(...childConditions.map((c) => Number(c.id)));
            nestedConditionsArr.push([condition, ...childConditions]);
          }
        }
      });

      const events: Tables<'events'>[] = [];

      for (const condition of nestedConditionsArr) {
        const results = await this.filterEventsByChartConditions(condition);
        events.push(...results);
      }

      const uniqueEvents = Object.values(keyBy(events, 'id')).map(
        (uniqueEvent) => ({
          ...uniqueEvent,
          id: Number(uniqueEvent.id),
        }),
      );

      const aggregatedEvents = await this.applyAggregationToEvents(
        uniqueEvents,
        aggregations,
      );

      return aggregatedEvents;
    } catch (error) {
      if (error instanceof PostgresError) {
        this.logger.error(
          `[${this.getChartData.name}]  Postgres error: ${error.message}`,
        );
        throw new InternalServerErrorException('database error');
      }
      throw error;
    }
  }

  async applyAggregationToEvents(
    events: Tables<'events'>[],
    aggregations: Tables<'chart_aggregations'>[],
  ) {
    const aggregatedEvents: Record<string, number> = {};

    aggregations.forEach((aggregation) => {
      switch (aggregation.aggregation_type) {
        case 'COUNT': {
          events.forEach((event) => {
            const dateStr = dayjs(event.created_at).format('DD-MM-YYYY');
            if (aggregatedEvents[dateStr]) {
              aggregatedEvents[dateStr]++;
            } else {
              aggregatedEvents[dateStr] = 1;
            }
          });

          break;
        }
        default: {
          break;
        }
      }
    });

    const aggregatedEventsArr = Object.entries(aggregatedEvents).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

    return aggregatedEventsArr;
  }

  async filterEventsByChartConditions(
    conditions: Tables<'chart_conditions'>[],
  ) {
    this.logger.log(
      `${
        this.filterEventsByChartConditions.name
      } called with conditions [${JSON.stringify(conditions)}]`,
    );
    const events: Tables<'events'>[] = [];
    try {
      const eventNameConditions = conditions.filter(
        (condition) => condition.field === 'EVENT_NAME',
      );

      if (eventNameConditions.length !== 0) {
        // we have both event name and event tag conditions
        const filteredEventsByEventNameConditions =
          await this.filterEventsByNameConditions(eventNameConditions);

        if (eventNameConditions.length !== conditions.length) {
          const filteredEventsByEventTagConditions =
            await this.filterEventsByTagConditions(
              conditions.filter(
                (condition) => condition.field !== 'EVENT_NAME',
              ),
              filteredEventsByEventNameConditions,
            );
          events.push(...filteredEventsByEventTagConditions);
        } else {
          events.push(...filteredEventsByEventNameConditions);
        }
      }

      const filteredEventsByEventTagConditions =
        await this.filterEventsByTagConditions(
          conditions.filter((condition) => condition.field !== 'EVENT_NAME'),
          [],
        );

      events.push(...filteredEventsByEventTagConditions);
    } catch (error) {
      if (error instanceof PostgresError) {
        this.logger.error(
          `[${this.filterEventsByChartConditions.name}]  Postgres error: ${error.message}`,
        );
        throw new InternalServerErrorException('database error');
      }
    } finally {
      return events;
    }
  }

  async filterEventsByNameConditions(
    conditions: Tables<'chart_conditions'>[],
  ): Promise<Tables<'events'>[]> {
    this.logger.log(
      `${
        this.filterEventsByNameConditions.name
      } called with conditions [${JSON.stringify(conditions)}]`,
    );

    if (conditions.length === 0) return [];

    if (conditions.some((condition) => condition.field !== 'EVENT_NAME'))
      return [];

    let whereCondition = '';

    conditions.forEach((condition) => {
      const childConditions = conditions.filter(
        (c) => c.parent_id === condition.id,
      );

      if (childConditions.length > 0) {
        whereCondition += '(';
        childConditions.forEach((childCondition) => {
          whereCondition += ` name ${
            childCondition.operator === 'EQUALS' ? '=' : '<>'
          } '${childCondition.value}' ${childCondition.logical_operator}`;
        });
        whereCondition += ` name = '${condition.value}')`;
      } else {
        if (condition.parent_id === null) {
          if (whereCondition === '') {
            whereCondition += ` name ${
              condition.operator === 'EQUALS' ? '=' : '<>'
            } '${condition.value}'`;
          } else {
            whereCondition += ` OR name ${
              condition.operator === 'EQUALS' ? '=' : '<>'
            } '${condition.value}'`;
          }
        }
      }
    });

    const events = await this.databaseService.sql<Tables<'events'>[]>`
      SELECT * FROM public.events WHERE ${this.databaseService.sql.unsafe(
        whereCondition,
      )}`;

    return events;
  }

  async filterEventsByTagConditions(
    conditions: Tables<'chart_conditions'>[],
    events: Tables<'events'>[],
  ): Promise<Tables<'events'>[]> {
    this.logger.log(
      `${
        this.filterEventsByTagConditions.name
      } called with conditions [${JSON.stringify(conditions)}] and ${
        events.length
      } events`,
    );
    const tagKeyConditions = conditions.filter(
      (condition) => condition.field === 'TAG_KEY',
    );

    if (tagKeyConditions.length === 0) return [];

    const tagValueConditions = conditions.filter(
      (condition) => condition.field === 'TAG_VALUE',
    );

    if (tagValueConditions.length === 0) return [];

    let whereCondition = '';

    tagKeyConditions.forEach((tagKeyCondition) => {
      const childConditions = tagValueConditions.filter(
        (c) => c.parent_id === tagKeyCondition.id,
      );

      if (childConditions.length !== 0) {
        const logicalOperator = childConditions[0].logical_operator;

        if (logicalOperator) {
          whereCondition += `(key ${
            tagKeyCondition.operator === 'EQUALS' ? '=' : '<>'
          } '${tagKeyCondition.value}' AND (`;
          childConditions.forEach((childCondition, index) => {
            const isLast = index === childConditions.length - 1;

            whereCondition += isLast
              ? `value ${childCondition.operator === 'EQUALS' ? '=' : '<>'} '${
                  childCondition.value
                }')`
              : `value ${childCondition.operator === 'EQUALS' ? '=' : '<>'} '${
                  childCondition.value
                }' ${logicalOperator} `;
          });
          whereCondition += ') ';
        }
      }
    });

    const eventTags = await this.databaseService.sql<
      Pick<Tables<'event_tags'>, 'event_id'>[]
    >`
    SELECT event_id FROM public.event_tags WHERE ${this.databaseService.sql.unsafe(
      whereCondition,
    )}`;

    if (eventTags.length === 0) return [];

    const eventIds = new Set(
      eventTags.map((eventTag) => Number(eventTag.event_id)),
    );

    return events.filter((event) => eventIds.has(Number(event.id)));
  }
}
