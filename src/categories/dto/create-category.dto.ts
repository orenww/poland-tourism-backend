import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
