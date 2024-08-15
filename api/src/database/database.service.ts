import * as postgres from 'postgres';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  public readonly logger = new Logger(DatabaseService.name);
  sql: postgres.Sql;

  constructor(private readonly configService: ConfigService) {
    const connectUrl = configService.get<string>('DATABASE_URL', '');
    this.sql = postgres(connectUrl, {
      debug: (_, query, params) => {
        if (configService.get<string>('NODE_ENV') !== 'production') {
          this.logger.verbose(
            `executing query: ${query} with params: [${params}]`,
          );
        }
      },
    });
  }
}
