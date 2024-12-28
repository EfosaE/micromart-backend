import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    // value is an object containing the file's attributes and metadata
    const maxSize = 5 * 1024 * 1024; // Maximum size in bytes (5 MB)

    if (value.size > maxSize) {
      throw new BadRequestException(
        'File size is too large. Maximum size is 5MB.'
      );
    }

    return value.size < maxSize; // Return the value (file) if the validation passes
  }
}
