import { CustomBaseEntity } from '../base-entity';
import { Entity, Column } from 'typeorm';
import { UserGender, UserRole, UserStatus } from 'src/common/enum';

@Entity()
export class Users extends CustomBaseEntity {
  @Column()
  fullName: string;

  @Column({nullable: true, unique: true})
  username: string;

  @Column({nullable: true})
  password: string;

  @Column({ length: 255, nullable: true, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.OTHER,
  })
  gender: UserGender;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

}
