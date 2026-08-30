import { IsEmail, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Matches(/^[a-z0-9_\-]{3,24}$/, {
    message:
      'username must be 3-24 characters long and contain only lowercase letters, numbers, "_" or "-"',
  })
  username!: string;

  @IsEmail()
  email!: string;
}
