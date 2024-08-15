import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';

@Module({
  providers: [ChartsService],
  controllers: [ChartsController]
})
export class ChartsModule {}
