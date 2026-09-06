import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateStateDto {
  @IsInt()
  categoryId!: number;

  @IsOptional()
  @IsUUID()
  aboutUserId?: string;
}
