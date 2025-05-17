import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user/user.dto';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  createUser(@Body() body: CreateUserDTO) {
    const { email, firstName, lastName, mobileNo } = body;
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Request body cannot be empty.');
    }

    return this.userService.createUser({
      email,
      firstName,
      lastName,
      mobileNo,
      password: '123456789', // temporary password
    });
  }

  @Post('update')
  updateUser(@Body() body: UpdateUserDTO) {
    const { id, firstName, lastName, mobileNo } = body;
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Request body cannot be empty.');
    }
    return this.userService.updateUser({
      id,
      firstName,
      lastName,
      mobileNo,
    });
  }
}
