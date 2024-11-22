import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/signIn-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private db: DatabaseService,
    private readonly logger: MyLoggerService
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = await this.db.user.create({
      data: { ...user },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(credentials: LoginDto) {
    const { email } = credentials;

    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        password: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
