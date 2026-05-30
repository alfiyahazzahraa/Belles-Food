import {
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}