import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseHealthIndicator } from './database.health.indicator';

@Controller({
  version: VERSION_NEUTRAL,
  path: '_health',
})
export class HealthController {
  constructor(
    private configService: ConfigService,
    private healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
    private databaseHealthIndicator: DatabaseHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  //   @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () =>
        this.httpHealthIndicator.pingCheck(
          'basic running check',
          `http://localhost:${this.configService.get('PORT')}`,
        ),
      () =>
        this.disk.checkStorage('disk health', {
          thresholdPercent: 0.7,
          path: '/',
        }),
      () => this.databaseHealthIndicator.pingCheck('postgres'),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }
}
