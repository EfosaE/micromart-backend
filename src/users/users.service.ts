import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/auth/dto/signIn-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService,
    private eventEmitter: EventEmitter2
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = await this.db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        roles: user.role ? [user.role] : ['USER'], // Default to 'user' if user.role is not set
        activeRole: user.role || 'USER', // Default to 'user' if user.role is not set
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        activeRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(newUser.name, newUser.email)
    );
    return newUser;
  }

  async findAll() {
    const users = await this.db.user.findMany();
    return { length: users.length, users };
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
        roles: true,
        activeRole: true,
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
