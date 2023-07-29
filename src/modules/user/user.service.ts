import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from './entities';
import { ErrorHelper, PasswordHelper, Utils } from '../../utils';
import { SignUpDto } from './dto/signup.dto';
import { PaginationResultDto, PaginationMetadataDto, PaginationDto } from '../../queries';
import { LoginAuthDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';

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

  async login(data: LoginAuthDto) {
    const { email } = data;

    const registeredUser = await this.userRepo.findOne({ where: { email } });
    if (registeredUser && registeredUser.deletedAt) {
      ErrorHelper.BadRequestException(
        'Account associated to ID was deleted. Contact support to restore'
      );
    }

    const isPasswordCorrect = registeredUser
      ? await PasswordHelper.comparePassword(data.password, registeredUser.password)
      : null;

    if (!registeredUser || !isPasswordCorrect) {
      ErrorHelper.BadRequestException('User ID or password specified is incorrect');
    }

    return this.signUserToken(registeredUser);
  }

  async getAllUsers(paginationDto: PaginationDto, role: string): Promise<any> {
    if (role !== 'ADMIN') {
      ErrorHelper.UnauthorizedException('Not authorized');
    }

    const [users, count] = await this.userRepo.findAndCount({
      where: { deletedAt: null },
      order: { createdAt: paginationDto.order },
      skip: paginationDto.skip,
      take: paginationDto.limit,
    });

    const result = users.map(p => ({
      id: p.id,
      email: p.email,
    }));

    const pageMetaDto = new PaginationMetadataDto({
      itemCount: count,
      pageOptionsDto: paginationDto,
    });

    return new PaginationResultDto(result, pageMetaDto);
  }

  async getUser(id: string): Promise<Users> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }

  async updateUser(payload: UpdateUserDto, id: string): Promise<void> {
    await this.userRepo.update(id, payload);
  }
}
