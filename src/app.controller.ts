import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  sayHello() {
    return {
      message: `Hello world from Dorm system 🥳 The time now is ${new Date().getTime().toLocaleString()}`,
    };
  }
  
  
}
