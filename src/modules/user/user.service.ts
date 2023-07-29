import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities';
import { ErrorHelper, PasswordHelper, Utils } from '../../utils';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private jwtService: JwtService
  ) {}

  async createUser(payload: SignUpDto): Promise<any> {
    // check if user exist
    const userExist = await this.checkIfUserExist({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
    if (userExist) {
      ErrorHelper.ForbiddenException('User already exist');
    }

    const hashedPassword = await PasswordHelper.hashPassword(payload.password);

    const newUser = await this.userRepo.save(
      this.userRepo.create({ ...payload, password: hashedPassword })
    );

    return this.signUserToken(newUser);
  }

  async checkIfUserExist(payload: any): Promise<boolean> {
    const { email, firstName, lastName } = payload;
    const validEmail = Utils.isEmailOrFail(email);

    const userCount = await this.userRepo.count({
      where: [{ email: validEmail }, { firstName }, { lastName }],
    });

    return userCount > 0;
  }

  private async signUserToken(user: Users) {
    const userInfo = {
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    };

    const token = this.jwtService.sign(userInfo);
    return {
      ...userInfo,
      accessToken: token,
    };
  }
}
