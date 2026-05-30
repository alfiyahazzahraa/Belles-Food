import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateFoodDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1000)
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  categoryId: number;
}