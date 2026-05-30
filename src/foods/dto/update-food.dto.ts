import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFoodDto {

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1000)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId?: number;
}