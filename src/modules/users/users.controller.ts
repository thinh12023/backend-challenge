import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./dtos/users.dto";
import { UsersService } from "./users.service";
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserRole } from "src/common/enum";
import { Users } from "src/database/entities/users.entity";

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private userService: UsersService,
  ) {}

  @Get(':id')
  @ApiResponse({})
  async getUserById(
    @Param('id') id: number 
  ): Promise<CreateUserDto> {
    return await this.userService.getUserById(id);
  }

  // @Get('/get-by-role')
  // @ApiResponse({})
  // async getUserByRole(
  //   @Query('role') role: UserRole,
  //   @Query('superAdminId') superAdminId: string,
  // ): Promise<Users[] | any> {

  //   console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
  //   await this.userService.checkAuthen(+superAdminId, UserRole.SUPER_ADMIN);
  //   console.log("here",role,superAdminId)
  //   return await this.userService.getUserByRole(role);
  // }

  @Post('/create-admin')
  @ApiResponse({})
  async createAdmin(
    @Query('superAdminId') superAdminId: number,
    @Body() admin: CreateUserDto
  ): Promise<Users> {
    await this.userService.checkAuthen(+superAdminId, UserRole.SUPER_ADMIN);
    return await this.userService.createUsers(admin);
  }

  @Post('/create-user')
  @ApiResponse({})
  async getListUser(
    @Query('adminId') adminId: number,
    @Body() user: CreateUserDto
  ): Promise<Users> {
    const checkRole = await this.userService.getUserById(adminId);
    if(!checkRole && checkRole.role === UserRole.ADMIN) throw new Error("Authen failed");
    return await this.userService.createUsers(user);
  }

}