import bcrypt from 'bcryptjs';

export class HashUtil {
  static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static checkPassword(input: string, hash: string) {
    return bcrypt.compare(input, hash);
  }
}
