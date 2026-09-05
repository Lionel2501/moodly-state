import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStateDto {
  @IsInt()
  stepId!: number;

  @IsString()
  feeling!: string;

  @IsOptional()
  @IsUUID()
  aboutUserId?: string;
}
