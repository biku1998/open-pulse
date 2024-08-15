import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { InsightsModule } from './insights/insights.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ChartsModule } from './charts/charts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    HealthModule,
    HttpModule,
    DatabaseModule,
    EventsModule,
    ProjectsModule,
    InsightsModule,
    SupabaseModule,
    ChartsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
