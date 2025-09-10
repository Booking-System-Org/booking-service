import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { BookingCreatedEventDto } from './dtos';
import { BookingService } from './booking.service';
import { parseAndValidateEvent } from 'src/common/helpers';

@Controller()
export class BookingEventHandlers {
  private readonly logger: Logger;
  constructor(private readonly bookingService: BookingService) {
    this.logger = new Logger(BookingEventHandlers.name);
  }

  @EventPattern('booking-events')
  async handleBookingCreated(@Payload() payload: any, @Ctx() context: KafkaContext) {
    try {
      const { offset } = context.getMessage();
      const topic = context.getTopic();
      const partition = context.getPartition();

      const bookingCreatedEvent = parseAndValidateEvent(payload.value, BookingCreatedEventDto);

      this.logger.debug(`Received message from topic [${topic}] partition [${partition}] offset [${offset}]`);
      await this.bookingService.handleBooking(bookingCreatedEvent.data);
      await context.getConsumer().commitOffsets([{ topic, partition, offset: (parseInt(offset) + 1).toString() }]);
    } catch (error) {
      this.logger.error(`Error processing notification for order ${JSON.stringify(payload)}: ${error.message}`);
    }
  }
}
