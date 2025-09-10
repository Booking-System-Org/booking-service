import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { Partitioners } from 'kafkajs';
// import { KafkaConfig } from 'src/config/types';

@Module({
    imports: [
        ConfigModule,
        // ClientsModule.registerAsync([
        //     {
        //         name: 'KAFKA_CLIENT',
        //         imports: [ConfigModule],
        //         inject: [ConfigService],
        //         useFactory: (configService: ConfigService) => {
        //             const kafka = configService.getOrThrow<KafkaConfig>('kafka');

        //             return {
        //                 transport: Transport.KAFKA,
        //                 options: {
        //                     client: {
        //                         clientId: kafka.clientId,
        //                         brokers: kafka.brokers,
        //                     },
        //                     consumer: {
        //                       // TODO: move to config
        //                       groupId: "booking-consumer-group-server",
        //                       allowAutoTopicCreation: true,
        //                       sessionTimeout: 30000,
        //                       rebalanceTimeout: 60000,
        //                       heartbeatInterval: 5000,
        //                     },
        //                     producer: {
        //                       createPartitioner: Partitioners.LegacyPartitioner,
        //                     },
        //                     run: {
        //                       autoCommit: false,
        //                     },
        //                 },
        //             };
        //         },
        //     },
        // ]),
    ],
    providers: [],
    exports: [],
})
export class KafkaModule {}
