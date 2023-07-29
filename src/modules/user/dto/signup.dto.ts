import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../../interfaces';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole, {
    message: 'Invalid user role',
  })
  @IsNotEmpty()
  role: UserRole;
}
