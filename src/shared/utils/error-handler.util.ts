import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleServiceError(error: any, serviceName: string): never {
  if (error.code) {
    throw new BadRequestException(`Error: ${error.message}`);
  }

  throw new InternalServerErrorException(`${serviceName}: ${error.message}`);
}
