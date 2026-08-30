import { IsString, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  username!: string;

  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password!: string;
}
