import { CustomBaseEntity } from '../base-entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { EmployeeRole, UserStatus } from 'src/common/enum';
import { Company } from './company.entity';

@Entity()
export class Employee extends CustomBaseEntity {
  @Column()
  name: string;

  @Column({nullable: true, unique: true})
  username: string;

  @Column({nullable: true})
  password: string;

  @Column({ length: 255, nullable: true})
  email: string;

  @Column()
  companyId: number;

  @ManyToOne(type => Company)
  @JoinColumn({name:'companyId'})
  user: Company;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.USER,
  })
  role: EmployeeRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({default:0})
  salary: number;

  @Column({default:0})
  salaryAdvance: number;

}
