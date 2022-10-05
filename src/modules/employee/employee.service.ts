import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EmployeeRole, UserStatus } from 'src/common/enum';
import { Employee } from 'src/database/entities/employee.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { CreateSuperEmployeeDto } from './dtos/create-super-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getAllEmployee(page:number, pageSize:number): Promise<PaginationDto> {
    const count = await this.employeeRepository.count()
    const data = await this.employeeRepository.find({
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

  async getActiveEmployee(id:number): Promise<Employee> {
    return await this.employeeRepository.findOne({where:{
      id: id,
      status: UserStatus.ACTIVE
    }});
  }

  async fakeAuthen(employeeId: number, role: EmployeeRole): Promise<Employee>{
    const checkRole = await this.getActiveEmployee(employeeId);
    if(!checkRole || checkRole?.role !== role) throw new Error("Authen failed");
    return checkRole;
  }

  async createEmployee(employee: CreateSuperEmployeeDto | CreateEmployeeDto, role: EmployeeRole): Promise<Employee> {
    const mergeData = {...employee, role};
    const createEmployee = await this.employeeRepository.create(mergeData);
    return await this.employeeRepository.save(createEmployee);
  }

  async getUserInCompnay(id: number, companyId: number): Promise<Employee>{
    return await this.employeeRepository.findOne({
      where:{
        id,
        companyId: companyId
      }
    })
  }

  async updateEmployee(id: number, employee: any, authenAdmin: Employee): Promise<Employee> {
    const findEmployee = await this.getUserInCompnay(id,authenAdmin.companyId)
    if(!findEmployee) throw new Error("Cant find user");

    const mergeData = {...employee, id: +id}
    return await this.employeeRepository.save(mergeData);
  }

  async changeEmployeeStatus(id: number, authenAdmin: Employee, status: UserStatus): Promise<Employee> {

    const findEmployee = await this.getUserInCompnay(id,authenAdmin.companyId);
    if(!findEmployee) throw new Error("Cant find user");
    const mergeData = {id: +id, status: status}
    return await this.employeeRepository.save(mergeData);
  }

  async delteEmployee(id: number, authenAdmin: Employee): Promise<DeleteResult> {

    const findEmployee = await this.getUserInCompnay(id, authenAdmin.companyId);
    if(!findEmployee) throw new Error("Cant find user");
    return await this.employeeRepository.delete(+id);
  }


}
