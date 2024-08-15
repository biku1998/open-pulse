import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ChartsService } from './charts.service';
import { convertSnakeCaseObjectToCamelCase } from 'src/lib/utils';

@Controller('charts')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get(':id/data')
  async getChartData(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    const events = convertSnakeCaseObjectToCamelCase(
      // TODO extract user id from jwt
      await this.chartsService.getChartData(id, userId),
    );

    return {
      data: events,
    };
  }
}
