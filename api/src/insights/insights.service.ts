import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateInsightDto } from './create-insight.dto';
import { Database } from 'src/types/supabase-db';

@Injectable()
export class InsightsService {
  private readonly logger = new Logger(InsightsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async createInsight(createInsightDto: CreateInsightDto, ownerUserId: string) {
    const { projectId, name, value, icon } = createInsightDto;

    this.logger.log(
      `${this.createInsight.name} called with projectId [${projectId}], name [${name}], value [${value}], ownerUserId [${ownerUserId}]`,
    );

    try {
      // check if project exists
      const projects = await this.databaseService.sql<
        Pick<Database['public']['Tables']['projects']['Row'], 'id'>[]
      >`
  SELECT id FROM projects WHERE id = ${projectId} AND created_by = ${ownerUserId}
  `;
      if (projects.length === 0) {
        throw new NotFoundException('project does not exist');
      }

      // check if insight exists
      const insights = await this.databaseService.sql<
        Pick<Database['public']['Tables']['insights']['Row'], 'id' | 'icon'>[]
      >`
  SELECT id, icon FROM insights WHERE project_id = ${projectId} AND name = ${name} AND created_by = ${ownerUserId}
  `;
      if (insights.length > 0) {
        // update the insight value
        await this.databaseService.sql`
      UPDATE insights
      SET value = ${value}, icon = ${
        icon || insights[0].icon
      }, updated_at = NOW()
      WHERE id = ${insights[0].id}
      `;
        return;
      }

      // fetch the total number of insights
      const totalInsights = await this.databaseService.sql<
        Pick<Database['public']['Tables']['insights']['Row'], 'id'>[]
      >`
      SELECT id FROM insights WHERE project_id = ${projectId}
      `;

      // create the insight
      await this.databaseService.sql`
      INSERT INTO insights (project_id, name, value, created_by, icon, position)
      VALUES (${projectId}, ${name}, ${value}, ${ownerUserId}, ${
        icon || null
      }, ${totalInsights.length + 1})
      `;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`[${this.createInsight.name}]  ${error.message}`);

      throw new InternalServerErrorException(
        `[${this.createInsight.name}]  something went wrong!!`,
      );
    }
  }
}
