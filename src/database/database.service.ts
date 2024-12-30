import {
  Global,
  Injectable,
} from '@nestjs/common';
import { ExtendedPrismaClient,} from 'src/utils/extend.helper';

@Global()
@Injectable()
export class DatabaseService
  extends ExtendedPrismaClient {}
