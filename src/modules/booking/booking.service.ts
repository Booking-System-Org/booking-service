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

  async checkBooking(data: BookingCreatedEventDataDto): Promise<void> {
    try {
      const updatedBookingResult = await this.bookingRepository.update(data.id, {
        status: BookingStatus.CHECKING_AVAILABILITY,
      });
      if (!updatedBookingResult) {
        return;
      }

      const checkIsAvailable = await this.bookingRepository.findOne({
        where: {
          restaurantId: data.restaurantId,
          bookingDate: data.bookingDate,
          status: In([BookingStatus.CHECKING_AVAILABILITY, BookingStatus.CONFIRMED]),
          id: Not(data.id),
        },
      });
      if (!checkIsAvailable) {
        await this.bookingRepository.update(data.id, { status: BookingStatus.CONFIRMED });
        return;
      }

      await this.bookingRepository.update(data.id, { status: BookingStatus.REJECTED });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
