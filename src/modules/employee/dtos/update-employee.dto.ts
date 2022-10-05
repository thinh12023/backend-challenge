


import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpadateEmployeeDto {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  salary?: number;

  @ApiProperty()
  @IsOptional()
  salaryAdvance?: number;

  @ApiProperty()
  @IsOptional()
  email?: string;
}

