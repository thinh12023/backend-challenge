import { CustomBaseEntity } from '../base-entity';
import { Entity, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Company extends CustomBaseEntity {
  @Column()
  name: string;
}
