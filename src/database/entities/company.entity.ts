import { CustomBaseEntity } from '../base-entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class Company extends CustomBaseEntity {
  @Column()
  name: string;
}
