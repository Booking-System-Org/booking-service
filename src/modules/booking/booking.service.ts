import { Injectable, Logger } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { BookingCreatedEventDataDto } from './dtos';
import { BookingStatus } from './enums';
import { In, Not } from 'typeorm';

@Injectable()
export class BookingService {
  private readonly logger: Logger;
  constructor(private readonly bookingRepository: BookingRepository) {
    this.logger = new Logger(BookingService.name);
  }

  async handleBooking(data: BookingCreatedEventDataDto): Promise<void> {
    try {
      // Update booking status to CHECKING_AVAILABILITY
      const updatedBookingResult = await this.bookingRepository.update(data.id, {
        status: BookingStatus.CHECKING_AVAILABILITY,
      });
      if (!updatedBookingResult) {
        return;
      }

      // Check if the same time booking is already exists
      const checkIsSameTimeBookingExists = await this.bookingRepository.findOne({
        where: {
          restaurantId: data.restaurantId,
          bookingDate: data.bookingDate,
          status: In([BookingStatus.CHECKING_AVAILABILITY, BookingStatus.CONFIRMED]),
          id: Not(data.id),
        },
      });
      if (!checkIsSameTimeBookingExists) {
        // Update booking status from CHECKING_AVAILABILITY to CONFIRMED if the booking is not exists
        await this.bookingRepository.update(data.id, { status: BookingStatus.CONFIRMED });
        return;
      }

      // Update booking status from CHECKING_AVAILABILITY to REJECTED if the booking is already exists
      await this.bookingRepository.update(data.id, { status: BookingStatus.REJECTED });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
