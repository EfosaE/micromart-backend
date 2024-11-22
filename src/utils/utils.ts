import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const handlePrismaError = (err: PrismaClientKnownRequestError) => {
  console.log(err);
  switch (err.code) {
    case 'P1001':
      return { message: `The server is down please try again later` };
    case 'P2002':
      // handling duplicate key errors
      return { message: `This ${err.meta.target} is taken` };
    case 'P2014':
      // handling invalid id errors
      return { message: `invalid ID: ${err.meta.target}` };
    case 'P2003':
      // handling invalid data errors
      return { message: `Inavlid input: ${err.meta.target}` };
    case 'P2025':
      // handling no records errors
      return { message: `${err.meta.cause}` };
    default:
      return { message: `Internal server error` };
  }
};


