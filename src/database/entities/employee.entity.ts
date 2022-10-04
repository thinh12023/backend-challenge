import { CustomBaseEntity } from '../base-entity';
import { Entity, Column } from 'typeorm';
import { employeeRole } from 'src/common/enum';

@Entity()
export class Employee extends CustomBaseEntity {
  @Column()
  name: string;

  @Column()
  companyId: number;

  @Column()
  role: employeeRole
}
