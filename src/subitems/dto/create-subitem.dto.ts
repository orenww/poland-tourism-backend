import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateSubItemDto {
  @IsInt()
  itemId: number;

  @IsString()
  sectionType: string; // "hotels", "restaurants", "attractions", "shopping"

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @IsString()
  hours?: string;

  @IsOptional()
  @IsString()
  ticketPrice?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  benefit?: string; // ADD THIS LINE

  @IsOptional()
  images?: string[];
}
