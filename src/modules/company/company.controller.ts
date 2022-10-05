import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { UserRole, UserStatus } from "src/common/enum";
import { Company } from "src/database/entities/company.entity";
import { Employee } from "src/database/entities/employee.entity";
import { CreateSuperEmployeeDto } from "../employee/dtos/create-super-employee.dto";
import { UsersService } from "../users/users.service";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dtos/create-company.dto";
import { ResultCreateCompanyDto } from "./dtos/result-create-company.dto";

@Controller('company')
@ApiTags('company')
export class CompanyController {
  private readonly authenRole = UserRole.USER;
  constructor(
    private userService: UsersService,
    private companyRepository: CompanyService,
  ) {}

  @Post('/create')
  @ApiResponse({})
  async createCompany(
    @Query('userId') userId: number,
    @Body() company: CreateCompanyDto
  ): Promise<ResultCreateCompanyDto> {
    await this.userService.fakeAuthen(+userId, this.authenRole);
    return await this.companyRepository.createCompany(company, userId);
  }

  @Post('/add-admin')
  @ApiResponse({})
  async createAdmin(
    @Query('userId') userId: number,
    @Body() employee: CreateSuperEmployeeDto
  ): Promise<Employee> {
    await this.userService.fakeAuthen(+userId, this.authenRole);
    return await this.companyRepository.addCompanyAdmin(employee);
  }

  @Get('/list')
  @ApiResponse({})
  async getEmployee(
    @Query('userId') userId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<PaginationDto> {
    if(!page) page = 1;
    if(!pageSize) pageSize = 10
    await this.userService.fakeAuthen(+userId, this.authenRole);
    return await this.companyRepository.getAllCompany(+page,+pageSize);
  }

  @Get(':id')
  @ApiResponse({})
  async getUserById(
    @Param('id') id: number,
    @Query('authenUserId') authenUserId: number,
  ): Promise<Company> {
    await this.userService.fakeAuthen(+authenUserId, this.authenRole);
    return await this.companyRepository.getCompanyById(id);
  }

}