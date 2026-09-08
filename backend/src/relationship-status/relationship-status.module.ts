import { Module } from '@nestjs/common';
import { RelationshipStatusController } from './relationship-status.controller';
import { RelationshipStatusService } from './relationship-status.service';

@Module({
  controllers: [RelationshipStatusController],
  providers: [RelationshipStatusService],
})
export class RelationshipStatusModule {}
