import * as isemail from 'isemail';
import { ErrorHelper } from './error.utils';

export class Utils {
  static isEmailOrFail(email: string) {
    const valid = isemail.validate(email);

    if (!valid) {
      ErrorHelper.BadRequestException('Invalid email');
    }

    return email;
  }

  static isEmail(email: string) {
    return isemail.validate(email);
  }
}
