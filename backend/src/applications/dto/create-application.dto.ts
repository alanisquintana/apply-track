import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../application.entity';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsString()
  @IsNotEmpty()
  appliedAt: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  interviewDate?: string;

  @IsString()
  @IsOptional()
  interviewTime?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  appliedWhere?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;
}
