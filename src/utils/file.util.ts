import { BadRequestException } from '@nestjs/common';


// Max file size (in bytes)
const MAX_FILE_SIZE = 1500000; // 500KB
const ALLOWED_FILE_TYPES = /^(image\/jpeg|image\/png|image\/jpg)$/;

export function validateFile(file: Express.Multer.File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds the ${MAX_FILE_SIZE / 1000}KB limit.`
    );
  }

  if (!ALLOWED_FILE_TYPES.test(file.mimetype)) {
    throw new BadRequestException(
      'Invalid file type. Only JPEG, PNG, and JPG are allowed.'
    );
  }
}
