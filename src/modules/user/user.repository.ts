// import { Repository } from 'typeorm';
// import { CustomRepository } from '../../typeorm-extension';
// import { Users } from './entities';

// @CustomRepository(Users)
// export class UsersRepository extends Repository<Users> {
//   async findByEmailOrPhoneNumber(userIdentifier: string): Promise<Users> {
//     return this.findOne({
//       where: [
//         {
//           email: userIdentifier,
//           deletedAt: null,
//         },
//         {
//           phoneNumber: userIdentifier,
//           deletedAt: null,
//         },
//       ],
//     });
//   }
// }
