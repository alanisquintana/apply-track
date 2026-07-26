import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApplicationStatus, WorkModel } from '../application.entity';

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

  @IsNumber()
  @IsOptional()
  salaryMin?: number;

  @IsNumber()
  @IsOptional()
  salaryMax?: number;

  @IsString()
  @IsOptional()
  recruiterLink?: string;

  @IsEnum(WorkModel)
  @IsOptional()
  workModel?: WorkModel;

  @IsString()
  @IsOptional()
  interviewLink?: string;
}
