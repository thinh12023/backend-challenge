import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum';
import { Users } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/users.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async checkAuthen(superAdminId: number, role: UserRole){
    const checkRole = await this.userRepository.findOne({where:{id: superAdminId}});
    if(!checkRole && checkRole.role === role) throw new Error("Authen failed");
    return true;
  }

  async createUsers(user:CreateUserDto){
    const createUser = await this.userRepository.create(user);
    return await this.userRepository.save(createUser)
  }

  async getUserById(id:number): Promise<Users> {
    const user = await this.userRepository.findOne({where:{id: id}});
    return user;
  }

  async getUserByRole(role:UserRole): Promise<Users[]> {
    const user = await this.userRepository.find({where:{role}});
    return user;
  }

}
