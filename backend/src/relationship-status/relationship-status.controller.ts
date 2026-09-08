import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { RelationshipStatusService } from './relationship-status.service';
import { SetRelationshipStatusDto } from './dto/set-relationship-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('relationship-status')
export class RelationshipStatusController {
  constructor(private readonly relationshipStatusService: RelationshipStatusService) {}

  @Get('options')
  findOptions() {
    return { statuses: this.relationshipStatusService.findOptions() };
  }

  @Get('contacts')
  findForContacts(@CurrentUser() user: CurrentUserPayload) {
    return this.relationshipStatusService.findForContacts(user.userId);
  }

  @Put(':aboutUserId')
  set(
    @CurrentUser() user: CurrentUserPayload,
    @Param('aboutUserId') aboutUserId: string,
    @Body() dto: SetRelationshipStatusDto,
  ) {
    return this.relationshipStatusService.set(user.userId, aboutUserId, dto.statusId);
  }
}
