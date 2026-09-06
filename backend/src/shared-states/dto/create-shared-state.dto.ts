import { IsInt } from 'class-validator';

export class CreateSharedStateDto {
  @IsInt()
  categoryId!: number;
}
