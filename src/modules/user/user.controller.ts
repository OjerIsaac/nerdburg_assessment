import { Controller, Body, Post, Query, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from '../../utils';
import { SignUpDto } from './dto/signup.dto';
import { IUser, User } from '../../decorators';
import { PaginationDto } from '../../queries/page-options';
import { AuthGuard } from '../../guards';
import { LoginAuthDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupWaitlist(@Body() createUserDto: SignUpDto) {
    const data = await this.userService.createUser(createUserDto);

    return HttpResponse.success({ data, message: 'record created successfully' });
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const data = await this.userService.login(loginAuthDto);

    return HttpResponse.success({ data, message: 'User login successfully' });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(@Query() paginationDto: PaginationDto, @User() user: IUser) {
    const data = await this.userService.getAllUsers(paginationDto, user.role);

    return HttpResponse.success({ data, message: 'record fetched successfully' });
  }
}
