import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { CreateUserDto } from "../dtos/create-users.dto";
import { UsersService } from "../users.service";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserRole, UserStatus } from "src/common/enum";
import { Users } from "src/database/entities/users.entity";
import { UpdateUserDto } from "../dtos/update-users.dto";
import { DeleteResult } from "typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Controller('users')
@ApiTags('users')
export class UsersController {
  private readonly authenRole = UserRole.ADMIN;
  constructor(
    private userService: UsersService,
  ) {}

  @Get(':id')
  @ApiResponse({})
  async getUserById(
    @Param('id') id: number,
    @Query('userId') userId: number,
  ): Promise<CreateUserDto> {
    if(userId != id) throw new Error("Authen failed");
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
  async createtUser(
    @Query('adminId') adminId: number,
    @Body() user: CreateUserDto
  ): Promise<Users> {
    await this.userService.fakeAuthen(+adminId, this.authenRole);
    return await this.userService.createUser(user, UserRole.USER);
  }

  @Put('/update/:id')
  @ApiResponse({})
  async updateUser(
    @Param('id') id: number,
    @Query('adminId') adminId: number,
    @Body() user: UpdateUserDto
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+adminId, this.authenRole);
    return await this.userService.updateUser(+id, user, authenUser);
  }

  @Put('/soft-delete/:id')
  @ApiResponse({})
  async softDeleteUser(
    @Param('id') id: number,
    @Query('adminId') adminId: number,
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+adminId, this.authenRole);
    return await this.userService.softDeleteUser(+id, authenUser);
  }

  @Put('/restore/:id')
  @ApiResponse({})
  async restoretDeleteUser(
    @Param('id') id: number,
    @Query('adminId') adminId: number,
  ): Promise<Users> {
    const authenUser = await this.userService.fakeAuthen(+adminId, this.authenRole);
    return await this.userService.restoreDeleteUser(+id, authenUser);
  }

  @Delete('/delete/:id')
  @ApiResponse({})
  async deleteUser(
    @Param('id') id: number,
    @Query('adminId') adminId: number,
  ): Promise<DeleteResult> {
    const authenUser = await this.userService.fakeAuthen(+adminId, this.authenRole);
    return await this.userService.hardDeleteUser(+id, authenUser);
  }

}