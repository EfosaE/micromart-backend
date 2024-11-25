import {
  Global,
  Injectable,
} from '@nestjs/common';
import { ExtendedPrismaClient,} from 'src/utils/helpers';

@Global()
@Injectable()
export class DatabaseService
  extends ExtendedPrismaClient {}
