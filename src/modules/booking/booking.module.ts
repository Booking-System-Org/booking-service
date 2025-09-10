import { Module } from '@nestjs/common';
import { BookingEventHandlers } from './booking.event-handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BookingEntity } from './booking.entity';
import { BookingRepository } from './booking.repository';
import { BookingService } from './booking.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), ConfigModule],
  providers: [BookingRepository, BookingService],
  exports: [BookingService],
  controllers: [BookingEventHandlers],
})
export class BookingModule {}
