import * as express from 'express';
import { AppModule } from './app.module';

const server = express();
import { http } from '@google-cloud/functions-framework';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints);
          return accumulator;
        }, {});
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  app.enableCors();
  return app.init();
};
createNestServer(server)
  .then((v) => {
    if (process.env.environment === 'development') {
      Logger.log(
        `🚀 Starting development server on http://localhost:${process.env.PORT || 3333}`,
      );
      v.listen(process.env.PORT || 3333);
    } else {
      Logger.log('🚀 Starting production server...');
    }
  })
  .catch((err) => Logger.error('Nest broken', err));

http('apiNEST', server); // <- entry point definition
