import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string; 

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string; 

  @IsString()
  @IsNotEmpty()
  password: string;
}