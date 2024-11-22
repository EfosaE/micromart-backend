import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from './hash.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { MyLoggerService } from 'src/logger/logger.service';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private db: DatabaseService,
    private readonly logger: MyLoggerService,
    private jwtService: JwtService
  ) {}

  async signUpUser(userDetails: CreateUserDto) {
    const { name, role, email, password } = userDetails;
    const hashedPassword = await this.hashService.hashPassword(password);

    const newUser = await this.db.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(
      `A new user ${newUser.email} was created`,
      AuthService.name
    );

    return newUser;
  }

  async login(userDetails: LoginDto) {
    const { email, password } = userDetails;

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

    // If no user is found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.hashService.comparePasswords(
      password,
      user.password
    );
    // if password verification fails throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, username: user.name };

    this.logger.log(`A user: ${email} logged in`, AuthService.name);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
