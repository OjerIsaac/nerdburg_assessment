import { Controller, Get } from '@nestjs/common';
import { HttpResponse } from './utils';

@Controller()
export class AppController {
  @Get()
  root(): HttpResponse {
    return {
      success: true,
      data: '',
      message: 'Welcome to Nerdburg backend service',
    };
  }
}
