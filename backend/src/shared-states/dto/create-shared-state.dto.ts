import { IsInt, IsString } from 'class-validator';

export class CreateSharedStateDto {
  @IsInt()
  stepId!: number;

  @IsString()
  feeling!: string;
}
