import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { LoginDto } from 'src/auth/dto/signIn-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

import { Vendor, User } from 'src/interfaces/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService,
    private eventEmitter: EventEmitter2
  ) {}

  async registerUser(user: User | Vendor) {
    const { role } = user;
    if (!role || role === 'USER') {
      return this.createUser(user as User);
    } else if (user.role === 'VENDOR') {
      // create vendor from the newUser
      return this.createUserWithVendorProfile(user as Vendor);
    }
  }

  async createUser(user: User) {
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
  async createUserWithVendorProfile(user: Vendor) {
    // Step 1: If the user is a vendor, create vendor details
    if (!(user.role === 'VENDOR')) {
      throw new BadRequestException(
        'Your role must be set to VENDOR to register as a vendor'
      );
    }

    // Step 2: Create the user with the specified role
    const newVendor = await this.db.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        roles: ['USER', user.role],
        activeRole: user.role,
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

    // Create vendor details
    const vendorDetails = await this.db.vendor.create({
      data: {
        user: {
          connect: { id: newVendor.id },
        }, //  link the vendor to the user
        category: {
          connect: { id: user.categoryId },
        }, //  link the vendor to the user
        businessName: user.businessName, // Business name for the vendor
      },
    });

    console.log('vendor profile created:', vendorDetails);

    return newVendor;
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
