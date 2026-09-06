import { IsString, Matches, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @Matches(/^[a-z0-9_\-]{3,24}$/, {
    message:
      'username must be 3-24 characters long and contain only lowercase letters, numbers, "_" or "-"',
  })
  username!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password!: string;
}
