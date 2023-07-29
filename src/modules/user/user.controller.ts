import { Controller, Body, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpResponse } from '../../utils';
import { SignUpDto } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signupWaitlist(@Body() createUserDto: SignUpDto) {
    const data = await this.userService.createUser(createUserDto);

    return HttpResponse.success({ data, message: 'record created successfully' });
  }
}
