import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';

@UseGuards(JwtAuthGuard)
@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateStateDto) {
    return this.statesService.create(user.userId, user.username, dto);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.statesService.findAllForUser(user.userId, user.username);
  }
}
