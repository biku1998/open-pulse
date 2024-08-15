import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { EventsService } from './events.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { Request } from 'src/types/express';

@Controller('logs')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async createLog(
    @Body() createEventDto: CreateEventDto,
    @Req() request: Request,
  ) {
    await this.eventsService.logEvent(createEventDto, request.token.createdBy);
  }
}
