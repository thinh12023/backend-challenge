import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/users.entity';
import { AdminController } from './controllers/admin.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AdminController, UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
