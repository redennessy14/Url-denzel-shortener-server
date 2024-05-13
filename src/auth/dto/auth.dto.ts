import { IsEmail, MinLength, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;
  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 знаков',
  })
  @IsString()
  password: string;
}
