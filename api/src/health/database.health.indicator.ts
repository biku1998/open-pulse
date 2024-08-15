import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async pingCheck(dbName: string) {
    try {
      await this.databaseService.sql`SELECT 1`;
      return this.getStatus(dbName, true);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Database check failed', error);
    }
  }
}
