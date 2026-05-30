import { IsInt, IsOptional } from 'class-validator';

export class UpdateOrdersDto {
  @IsOptional()
  @IsInt()
  total?: number;
}