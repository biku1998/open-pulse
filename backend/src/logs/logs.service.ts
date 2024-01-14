import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateLogDto } from './create-log.dto';
import { Database } from '../types/supabase-db';
import { PostgresError } from 'postgres';
import PostgresErrorCode from 'src/database/error-code';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async createLog(createLogDto: CreateLogDto, ownerUserId: string) {
    const {
      projectId,
      channelId,
      event,
      userId = null,
      description = null,
      icon = null,
      tags = [],
    } = createLogDto;

    this.logger.log(
      `${
        this.createLog.name
      } called with projectId [${projectId}], channelId [${channelId}], event [${event}], userId [${userId}], description [${description}], icon [${icon}], ownerUserId [${ownerUserId}], tags [${JSON.stringify(
        tags,
      )}]`,
    );

    try {
      // check if project exists
      const projects = await this.databaseService.sql<
        Pick<Database['public']['Tables']['projects']['Row'], 'id'>[]
      >`
    SELECT id FROM projects WHERE id = ${projectId} AND created_by = ${ownerUserId}
    `;

      if (projects.length === 0) {
        throw new NotFoundException('project or channel does not exist');
      }

      const createEventResp = await this.databaseService.sql<
        Database['public']['Tables']['events']['Row'][]
      >`
      INSERT INTO events (channel_id, name, user_id, description, icon, created_by)
      VALUES (${channelId}, ${event}, ${userId}, ${description}, ${icon}, ${ownerUserId})
      RETURNING id
      `;

      if (tags.length === 0) return;

      const eventId = createEventResp[0].id;

      const tagsPayload = tags.map((tag) => ({
        event_id: eventId,
        key: tag.key,
        value: tag.value,
        created_by: ownerUserId,
      }));
      await this.databaseService.sql`
      INSERT INTO event_tags ${this.databaseService.sql(
        tagsPayload,
        'event_id',
        'key',
        'value',
        'created_by',
      )}
      RETURNING id;
      `;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      if (error instanceof PostgresError) {
        if (error.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION) {
          this.logger.error(`[${this.createLog.name}] foreign key violation`);
          throw new NotFoundException('project or channel does not exist');
        }
      }

      this.logger.error(`[${this.createLog.name}] ${error.message}}`);

      throw new InternalServerErrorException(
        `[${this.createLog.name}] something went wrong!!`,
      );
    }
  }
}
