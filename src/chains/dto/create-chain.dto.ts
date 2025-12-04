import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateChainDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  benefit?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}