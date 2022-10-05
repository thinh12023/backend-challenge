import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/database/entities/company.entity';
import { Repository } from 'typeorm';
import { CreateSuperEmployeeDto } from '../employee/dtos/create-super-employee.dto';
import { EmployeeService } from '../employee/employee.service';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { ResultCreateCompanyDto } from './dtos/result-create-company.dto';
import { v4 as uuidv4 } from 'uuid';
import { EmployeeRole } from 'src/common/enum';
import { Employee } from 'src/database/entities/employee.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CompanyService {
  constructor(
    private employeeService: EmployeeService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async getAllCompany(page:number, pageSize:number): Promise<PaginationDto> {
    const count = await this.companyRepository.count()
    const data = await this.companyRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      totalElement: count,
      page,
      pageSize,
      data
    }
  }
  
  async getCompanyById(id: number): Promise<Company> {
    return await this.companyRepository.findOne({where:{id}})
  }

  async createCompany(company: CreateCompanyDto): Promise<ResultCreateCompanyDto>{
    const createCompany = await this.companyRepository.create(company);
    const createCompanyResult = await this.companyRepository.save(createCompany);

    // create default admin
    const superEmployeeAdmin: CreateSuperEmployeeDto = {
      companyId: createCompanyResult.id,
      name: `admin-${createCompanyResult.id}`,
      username: `admin-${createCompanyResult.id}`,
      password: `admin-${uuidv4()}`,
    }
    const createAdminEmployee = await this.employeeService.createEmployee(superEmployeeAdmin, EmployeeRole.ADMIN);

    return {
      company: createCompanyResult,
      clientAdmin: createAdminEmployee
    }
  }

  async addCompanyAdmin(employee: CreateSuperEmployeeDto): Promise<Employee> {
    return  await this.employeeService.createEmployee(employee, EmployeeRole.ADMIN)
  }

}
