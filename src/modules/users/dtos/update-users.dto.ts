


import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserGender, UserStatus } from 'src/common/enum';

export class UpdateUserDto {

  @ApiProperty()
  @IsOptional()
  fullName: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty({
    enum: UserGender,
  })
  @IsNotEmpty()
  @IsOptional()
  gender: UserGender;

  @ApiProperty({
    enum: UserStatus,
  })
  @IsOptional()
  status: UserStatus;
}

