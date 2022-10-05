import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-users.dto";
import { UsersService } from "../users.service";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserRole, UserStatus } from "src/common/enum";
import { Users } from "src/database/entities/users.entity";
import { UpdateUserDto } from "../dtos/update-users.dto";
import { DeleteResult } from "typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  private readonly authenRole = UserRole.SUPER_ADMIN;
  constructor(
    private userService: UsersService,
  ) {}

  @Get(':id')
  @ApiResponse({})
  async getUserById(
    @Param('id') id: number,
    @Query('superAdminId') superAdminId: number,
  ): Promise<CreateUserDto> {
    if(superAdminId != id) throw new Error("Authen failed");
    return await this.userService.getActiveUser(id);
  }

  @Get('/list')
  @ApiResponse({})
  async getUser(
    @Query('superAdminId') superAdminId: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<PaginationDto> {
    if(!page) page = 1;
    if(!pageSize) pageSize = 10
    const authenUser = await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.getAllUser(+page, +pageSize, authenUser);
  }

  @Post('/create')
  @ApiResponse({})
  async createAdmin(
    @Query('superAdminId') superAdminId: number,
    @Body() admin: CreateUserDto
  ): Promise<Users> {
    await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.createUser(admin, UserRole.ADMIN);
  }

  @Put('/update/:id')
  @ApiResponse({})
  async updateAdmin(
    @Param('id') id: number,
    @Query('superAdminId') superAdminId: number,
    @Body() admin: UpdateUserDto
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.updateUser(+id, admin, authenUser);
  }

  @Put('/soft-delete/:id')
  @ApiResponse({})
  async softDeleteAdmin(
    @Param('id') id: number,
    @Query('superAdminId') superAdminId: number,
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.softDeleteUser(+id, authenUser);
  }

  @Put('/restore/:id')
  @ApiResponse({})
  async restoreDeleteAdmin(
    @Param('id') id: number,
    @Query('superAdminId') superAdminId: number,
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.restoreDeleteUser(+id, authenUser);
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async deleteUser(
    @Param('id') id: number,
    @Query('superAdminId') superAdminId: number,
  ): Promise<DeleteResult> {
    const authenUser = await this.userService.fakeAuthen(+superAdminId, this.authenRole);
    return await this.userService.hardDeleteUser(+id, authenUser);
  }

}