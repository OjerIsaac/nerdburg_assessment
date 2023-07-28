import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  id: string;
}

export const User = createParamDecorator<any, any, IUser>((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { user } = request;

  return user as IUser;
});
