import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// import {JwtModule,  } from '@nestjs/jwt'
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Users } from 'src/models/users.model';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from 'src/utils/local.strategy';
// import { JwtStrategy } from 'src/utils/jwt.strategy';
// import { LocalStrategy } from './../utils/local.strategy';
// import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        // PassportModule,
        // JwtModule.register({
        //     secret: 'guessablesecret123',
        //     signOptions: {expiresIn: '1m'},
        // }),
        // TypeOrmModule.forFeature([Users]),
    ],

    controllers: [UsersController],
    providers: [UsersService
        // , LocalStrategy, JwtStrategy
    ]
})

export class UsersModule {}
