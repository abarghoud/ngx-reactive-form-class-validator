import { deserialize, deserializeAs } from 'cerialize';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';

export enum FakeContactType {
  email = 'Email',
  phone = 'Phone',
}

export class FakeContact {
  @ValidateIf(contact => contact.type === FakeContactType.phone)
  @IsMobilePhone('fr-FR')
  @deserialize
  public phoneNumber: string;

  @ValidateIf(contact => contact.type === FakeContactType.email)
  @IsEmail()
  @deserialize
  public email: string;

  @IsEnum(FakeContactType)
  @deserialize
  public type: FakeContactType;
}

export class FakeUser {
  @IsNotEmpty()
  @deserialize
  public firstName: string;

  @deserialize
  public id: string;

  @IsBoolean()
  @deserialize
  public isSessionLocked: boolean;

  @IsOptional()
  @IsDate()
  @deserialize
  public lastActive?: Date;

  @ValidateNested()
  @deserializeAs(FakeContact)
  public contacts: FakeContact[];

  @MinLength(10)
  @deserialize
  public username: string;
}
