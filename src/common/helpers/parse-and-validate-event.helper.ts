import { plainToInstance } from 'class-transformer';

export const parseAndValidateEvent = <T extends object>(event: any, dto: new () => T): T => {
  const parsedData = JSON.parse(event);
  return plainToInstance(dto, parsedData);
};
