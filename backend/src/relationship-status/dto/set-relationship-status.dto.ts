import { IsInt } from 'class-validator';

export class SetRelationshipStatusDto {
  @IsInt()
  statusId!: number;
}
