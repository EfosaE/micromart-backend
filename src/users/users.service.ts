import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyLoggerService } from 'src/logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private db: DatabaseService,
    private readonly logger: MyLoggerService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, role, email, password } = createUserDto;
    const newUser = this.db.user.create({
      data: {
        name,
        email,
        role,
        password,
      },
    });
    this.logger.log(
      `A new user ${(await newUser).email} was created`,
      UsersService.name
    );
    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
