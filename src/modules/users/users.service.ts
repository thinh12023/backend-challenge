import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkRole } from 'src/common/common-function';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UserRole, UserStatus } from 'src/common/enum';
import { Users } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/update-users.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getAllUser(page:number, pageSize:number, authenUser: Users): Promise<PaginationDto> {

    let condition;
    if(authenUser.role == UserRole.SUPER_ADMIN) condition = {role: UserRole.ADMIN };
    else if (authenUser.role == UserRole.ADMIN) condition = {role: UserRole.USER };
    else throw new Error("Invalid permission")

    const count = await this.userRepository.count(condition)
    const data = await this.userRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: condition
    });

    return {
      totalElement: count,
      page,
      pageSize,
      data
    }
  }

  async getActiveUser(id:number): Promise<Users> {
    return await this.userRepository.findOne({where:{
      id: id,
      status: UserStatus.ACTIVE
    }});
  }

  async fakeAuthen(userId: number, role: UserRole): Promise<Users>{
    const checkRole = await this.getActiveUser(userId);
    if(!checkRole || checkRole?.role !== role) throw new Error("Authen failed");
    return checkRole;
  }

  async isElevatedRole(id: number, authenUser: Users){
    const findUser = await this.userRepository.findOne({where:{id: id,}});
    if(!findUser) throw new Error("User not found");
    // Prevent elevated permission - eg: SUPER_ADMIN can update USER (Only Admin can update)
    return checkRole(findUser.role, authenUser.role);
  }

  async createUser(user: CreateUserDto, role: UserRole){

    // passing role here to prevent elevated permission - eg: User can create Admin
    const alterUser = {...user,role}
    const createUser = await this.userRepository.create(alterUser);
    return await this.userRepository.save(createUser)
  }

  async updateUser(id: number, user: UpdateUserDto, authenUser: Users){
    await this.isElevatedRole(id, authenUser);
    const userWithId = {id,...user};
    return await this.userRepository.save(userWithId)
  }

  async softDeleteUser(id: number, authenUser: Users){
    await this.isElevatedRole(id, authenUser);

    const userWithId = {id, status: UserStatus.DELETED };
    return await this.userRepository.save(userWithId);
  }

  async restoreDeleteUser(id: number, authenUser: Users){
    await this.isElevatedRole(id, authenUser);

    const userWithId = {id, status: UserStatus.ACTIVE };
    return await this.userRepository.save(userWithId);
  }

  async hardDeleteUser(id: number, authenUser: Users){
    await this.isElevatedRole(id, authenUser);
    return await this.userRepository.delete(id);
  }

}
