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
  public phoneNumber: string;

  @ValidateIf(contact => contact.type === FakeContactType.email)
  @IsEmail()
  public email: string;

  @IsEnum(FakeContactType)
  public type: FakeContactType;
}

export class FakeUser {
  @IsNotEmpty()
  public firstName: string;

  public id: string;

  @IsBoolean()
  public isSessionLocked: boolean;

  @IsOptional()
  @IsDate()
  public lastActive?: Date;

  @ValidateNested()
  public contacts: FakeContact[];

  @MinLength(10)
  public username: string;
}
