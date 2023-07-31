import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { Users } from './entities';
import { PasswordHelper } from '../../utils';
import { SignUpDto } from './dto/signup.dto';
import { LoginAuthDto } from './dto/login.dto';
import { UserRole } from '../../interfaces';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('createUser', () => {
    it('should create a new user with a valid SignUpDto', async () => {
      const payload: SignUpDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        password: 'password123',
      };

      const mockUser = {
        id: 'id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'checkIfUserExist').mockResolvedValue(false);

      jest.spyOn(PasswordHelper, 'hashPassword').mockResolvedValue('hashed-password');

      jest.spyOn(userRepository, 'create').mockReturnValue({ ...mockUser });

      jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser });

      const result = await userService.createUser(payload);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw an error if the user already exists', async () => {
      const payload: SignUpDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        password: 'password123',
      };

      jest.spyOn(userService, 'checkIfUserExist').mockResolvedValue(true);

      await expect(userService.createUser(payload)).rejects.toThrow('User already exist');
    });
  });

  describe('login', () => {
    it('should return an access token for a valid login', async () => {
      const loginDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null, // Assuming no deletion
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      jest.spyOn(PasswordHelper, 'comparePassword').mockResolvedValue(true);

      const result = await userService.login(loginDto);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw an error for incorrect credentials', async () => {
      const loginDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'wrongPassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        'User ID or password specified is incorrect'
      );
    });

    it('should throw an error if the account is deleted', async () => {
      const loginDto: LoginAuthDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(), // Simulating account deletion
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(userService.login(loginDto)).rejects.toThrow(
        'Account associated to ID was deleted. Contact support to restore'
      );
    });
  });
});
