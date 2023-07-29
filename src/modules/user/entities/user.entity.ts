import { Column, Entity } from 'typeorm';
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

  @Column({ type: 'text', select: false })
  password: string;
}
