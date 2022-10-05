import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { EmployeeRole, UserRole, UserStatus } from "src/common/enum";
import { Employee } from "src/database/entities/employee.entity";
import { DeleteResult } from "typeorm";
import { CreateSuperEmployeeDto } from "../employee/dtos/create-super-employee.dto";
import { UsersService } from "../users/users.service";
import { CreateEmployeeDto } from "./dtos/create-employee.dto";
import { UpadateEmployeeDto } from "./dtos/update-employee.dto";
import { EmployeeService } from "./employee.service";


@Controller('employee')
@ApiTags('employee')
export class EmployeeController {
  private readonly authenRole = EmployeeRole.ADMIN;
  constructor(
    private employeeService: EmployeeService,
    // private companyRepository: CompanyService,
  ) {}

  @Get('/list')
  @ApiResponse({})
  async getEmployee(
    @Query('clientAdminId') clientAdminId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<PaginationDto> {
    if(!page) page = 1;
    if(!pageSize) pageSize = 10
    await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.getAllEmployee(+page,+pageSize);
  }

  @Get(':id')
  @ApiResponse({})
  async getUserById(
    @Param('id') id: number,
    @Query('authenUserId') authenUserId: number,
  ): Promise<Employee> {
    if(authenUserId != id) throw new Error("Authen failed");
    return await this.employeeService.getActiveEmployee(id);
  }

  @Post('/create')
  @ApiResponse({})
  async createClientUser(
    @Query('clientAdminId') clientAdminId: number,
    @Body() employee: CreateEmployeeDto
  ): Promise<Employee> {
    const authenInfo = await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.createEmployee({...employee, companyId: authenInfo.companyId},EmployeeRole.USER)
  }

  @Put('/update/:id')
  @ApiResponse({})
  async updateClientUser(
    @Query('clientAdminId') clientAdminId: number,
    @Param('id') id: number,
    @Body() employee: UpadateEmployeeDto
  ): Promise<Employee> {
    const authenInfo = await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.updateEmployee(id, employee, authenInfo);
  }

  @Put('/soft-delete/:id')
  @ApiResponse({})
  async softDeleteClientUser(
    @Query('clientAdminId') clientAdminId: number,
    @Param('id') id: number,
  ): Promise<Employee> {
    const authenInfo = await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.changeEmployeeStatus(id, authenInfo, UserStatus.DELETED);
  }

  @Put('/restore/:id')
  @ApiResponse({})
  async restoreClientUser(
    @Query('clientAdminId') clientAdminId: number,
    @Param('id') id: number,
  ): Promise<Employee> {
    const authenInfo = await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.changeEmployeeStatus(id, authenInfo, UserStatus.ACTIVE);
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async deleteClientUser(
    @Query('clientAdminId') clientAdminId: number,
    @Param('id') id: number,
  ): Promise<DeleteResult> {
    const authenInfo = await this.employeeService.fakeAuthen(+clientAdminId, this.authenRole);
    return await this.employeeService.delteEmployee(id, authenInfo);
  }

}