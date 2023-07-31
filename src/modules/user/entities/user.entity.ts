import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseTable } from '../../../base';
import { UserRole } from '../../../interfaces/user.interface';

@Entity({ name: 'users' })
export class Users extends BaseTable {
  @Column({ type: 'varchar', unique: true })
  firstName: string;

  @Column({ type: 'varchar', unique: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  role: UserRole;

  @Exclude()
  @Column({ type: 'text' })
  password: string;
}
