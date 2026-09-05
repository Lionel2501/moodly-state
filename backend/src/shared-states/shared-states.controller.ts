import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SharedStatesService } from './shared-states.service';
import { CreateSharedStateDto } from './dto/create-shared-state.dto';

@Controller('shared-states')
export class SharedStatesController {
  constructor(private readonly sharedStatesService: SharedStatesService) {}

  @Post()
  create(@Body() dto: CreateSharedStateDto) {
    return this.sharedStatesService.create(dto);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.sharedStatesService.findByCode(code);
  }
}
