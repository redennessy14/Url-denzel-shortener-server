import { IsBoolean, IsOptional, IsString, isString } from 'class-validator';

export class UrlsDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  originalLink: string;

  @IsString()
  @IsOptional()
  qrCode: string;
}
