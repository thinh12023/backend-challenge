


import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/database/entities/employee.entity';
import { Company } from 'src/database/entities/company.entity';

export class ResultCreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  company: Company;

  @ApiProperty()
  @IsNotEmpty()
  clientAdmin: Employee;
}

