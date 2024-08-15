import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateInsightDto } from './create-insight.dto';
import { InsightsService } from './insights.service';
import { Request } from 'src/types/express';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async createInsight(
    @Body() createInsightDto: CreateInsightDto,
    @Req() request: Request,
  ) {
    await this.insightsService.createInsight(
      createInsightDto,
      request.token.createdBy,
    );
  }
}
