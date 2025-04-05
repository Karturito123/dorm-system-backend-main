import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserContactDTO {
  @IsNotEmpty()
  uid: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  mobileNo: string;
}

export class SendMessageDTO {
  @ValidateNested({ each: true })
  @Type(() => UserContactDTO)
  userContacts: UserContactDTO[];

  @IsNotEmpty()
  @IsString()
  message: string;
}
