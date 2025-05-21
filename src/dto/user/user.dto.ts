import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  mobileNo: string;

  @IsOptional()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

export class CreateUserDTO extends OmitType(UserDTO, ['id'] as const) {}

export class UpdateUserDTO extends PartialType(
  OmitType(UserDTO, ['email'] as const),
) {}
