


import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserRole, UserStatus } from 'src/common/enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    enum: UserGender,
  })
  @IsNotEmpty()
  @IsString()
  gender: UserGender;

  @ApiProperty({
    enum: UserStatus,
  })
  @IsOptional()
  status: UserStatus;
}

