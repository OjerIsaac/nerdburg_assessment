import * as util from 'util';
import { validateOrReject } from 'class-validator';
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

  static async validateObject(Schema: any, data: object) {
    const object = Object.assign(new Schema(), data);

    try {
      await validateOrReject(object, { validationError: { target: false } });
      return object;
    } catch (errors) {
      const error = Object.values(errors[0]?.constraints)[0] as string;
      throw new Error(error || 'validation error');
    }
  }

  static formatString(format: string, ...values: any[]): string {
    return util.format(format, ...values);
  }

  static removeEmptyFields(obj: any) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== '' && value !== null && value !== undefined) {
        newObj[key] = value;
      }
    });
    return newObj;
  }
}
