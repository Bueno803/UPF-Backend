import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config'
import { FirebaseModule } from './firebase.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FirebaseModule,  ConfigModule.forRoot({cache: true}), UsersModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
