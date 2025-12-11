import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsBoolean()
  consentGiven: boolean;
}
