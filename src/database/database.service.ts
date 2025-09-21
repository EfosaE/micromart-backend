import {
  Global,
  Injectable,
} from '@nestjs/common';
// import { PrismaService } from 'src/utils/extend.helper';
import { ExtendedPrismaClient,} from 'src/utils/extend.helper';

@Global()
@Injectable()
export class DatabaseService
  extends ExtendedPrismaClient {}
