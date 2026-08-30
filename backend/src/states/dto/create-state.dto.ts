import { IsInt, IsString } from 'class-validator';

export class CreateStateDto {
  @IsInt()
  stepId!: number;

  @IsString()
  feeling!: string;
}
