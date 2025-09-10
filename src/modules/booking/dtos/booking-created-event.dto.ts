import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class BookingCreatedEventDataDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public restaurantId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  public id: string;

  @IsDefined()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public bookingDate: Date;
}

export class BookingCreatedEventDto {
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BookingCreatedEventDataDto)
  public data: BookingCreatedEventDataDto;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  public eventType: string;

  @IsDefined()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public timestamp: Date;
}
