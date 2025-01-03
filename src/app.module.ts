import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase.module';
import { UsersModule } from './users/users.module';
import { ClientsController } from './clients/clients.controller';
import { ClientsModule } from './clients/clients.module';
import { ClientsService } from './clients/clients.service';
import { ClassInProgressModule } from './class-in-progress/class-in-progress.module';
// import { GatewayGateway } from './gateway/gateway.gateway';
import { GatewayService } from './gateway/gateway.service';
import { GatewayController } from './gateway/gateway.controller';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    FirebaseModule,
    ConfigModule.forRoot({ cache: true }),
    UsersModule,
    ClientsModule,
    ClassInProgressModule,
    GatewayModule,
  ],
  controllers: [
    AppController,
    UsersController,
    ClientsController,
    GatewayController,
  ],
  providers: [AppService, UsersService, ClientsService, GatewayService],
})
export class AppModule {}
