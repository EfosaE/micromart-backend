import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from './hash.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/signIn-user.dto';
import { UsersService } from 'src/users/users.service';
import { Seller, TokenPayload, User } from 'src/interfaces/types';
import { CreateSellerDto } from 'src/users/dto/create-seller.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private user: UsersService,
    private readonly logger: MyLoggerService,
    private jwtService: JwtService
  ) {}

  async signUpUser(userDetails: CreateUserDto) {
    const hashedPassword = await this.hashService.hashPassword(
      userDetails.password
    );

    const updatedUserObject = { ...userDetails, password: hashedPassword };
    const newUser = await this.user.registerUser(updatedUserObject as User);

    this.logger.log(
      `A new user ${newUser.email} of role ${newUser.activeRole} was created`,
      AuthService.name
    );

    return `${newUser.email} created successfully`;
  }

  async signUpSeller(userDetails: CreateSellerDto) {
    const hashedPassword = await this.hashService.hashPassword(
      userDetails.password
    );

    const updatedUserObject = { ...userDetails, password: hashedPassword };
    const newUser = await this.user.registerUser(updatedUserObject as Seller);

    this.logger.log(
      `A new user ${newUser.email} of role ${newUser.activeRole} was created`,
      AuthService.name
    );

    return `${newUser.email} created successfully`;
  }
  async login(userCredentials: LoginDto, res: Response) {
    const { password } = userCredentials;
    const user = await this.user.findOne(userCredentials);

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

    // Extract id and email
    const { id, name, activeRole } = user;
    const requiredUserPayload = { id, name, activeRole };
    const accessToken = await this.createAccessToken(requiredUserPayload);
    const refreshToken = await this.createRefreshToken(requiredUserPayload);
    this.setRefreshTokenCookie(refreshToken, res);
    this.logger.log(`A user: ${user.email} logged in`, AuthService.name);
    // Explicitly return the access token and user in the response body
    return res.status(200).json({ accessToken, user: requiredUserPayload });
  }

  // Create access token
  async createAccessToken(user: TokenPayload): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.name,
      role: user.activeRole,
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    return token;
  }

  // Create refresh token
  async createRefreshToken(user: TokenPayload) {
    const payload = {
      sub: user.id,
      username: user.name,
      role: user.activeRole,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: '2d',
    });
  }

  // set refreshToken
  setRefreshTokenCookie(token: string, res: Response) {
    // Set the refresh token in an HTTP-only cookie
    res.cookie('refresh_token', token, {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'none', // allow for CORS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
  }
  // Validate refresh token
  async validateRefreshToken(token: string) {
    try {
      // Decode and verify the refresh token
      const payload = this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN,
      });
      return payload;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired refresh token, please login'
      );
    }
  }

  // extract userID
  extractUserID(req: Request): string {
    const authToken = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!authToken) {
      throw new UnauthorizedException('Missing token: please login');
    }
    try {
      // Verify the token and decode it
      const decodedToken = this.jwtService.verify(authToken);
      return decodedToken.sub; //ID is stored in the payload.sub
    } catch (error) {
      if (error) throw new ForbiddenException('Invalid or expired token');
    }
  }
}
