/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Use Express Request type for HTTP request objects

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext
  ): any {
    const request = context.switchToHttp().getRequest<Request>(); // Explicitly type the request as Express Request
    const query: Record<string, string> = request.query as Record<
      string,
      string
    >; // Type query as a key-value pair of strings

    // Allow processing of the query, even if there's an error or no user
    if (query.error) {
      return null; // Prevent the guard from blocking further processing
    }

    // Default error handling for Passport
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(info?.message || 'Authentication failed')
      );
    }

    return user;
  }
}
