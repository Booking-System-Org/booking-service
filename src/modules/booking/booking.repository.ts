import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { BookingEntity } from './booking.entity';
import { DataSource, FindOneOptions, UpdateResult } from 'typeorm';
import { Transactional } from 'src/common/types';
import { getRepository } from 'src/common/helpers';

@Injectable()
export class BookingRepository {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(BookingEntity)
    private readonly datasource: DataSource,
  ) {
    this.logger = new Logger(BookingRepository.name);
  }

  async findOne(
    data: FindOneOptions<BookingEntity>,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<BookingEntity | null> {
    try {
      const bookingRepository = getRepository(activeQueryRunner ?? this.datasource, BookingEntity);
      return bookingRepository.findOne(data);
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async update(
    id: string,
    data: Partial<BookingEntity>,
    { queryRunner: activeQueryRunner }: Transactional = {},
  ): Promise<UpdateResult | null> {
    try {
      const bookingRepository = getRepository(activeQueryRunner ?? this.datasource, BookingEntity);
      const result = bookingRepository.update(id, data);
      return result;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}
