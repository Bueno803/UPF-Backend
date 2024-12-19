import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
// import { Controller } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('gateway')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Post('/verify-email')
  async verifyEmail(@Res() response, @Body() userEmail: { email: string }) {
    try {
      await this.gatewayService.verifyEmail(userEmail).then((res) => {
        // check res if the email exists or not
        console.log('res!!!');
        console.log(res);
        if (res) {
          if (res.isActive && res.isAdmin) {
            console.log('true true');
            return response.status(HttpStatus.OK).json({
              message: 'Admin',
              isActive: true,
              isAdmin: true,
              userExists: true,
            });
          } else if (res.isActive && !res.isAdmin) {
            console.log('true false');
            return response.status(HttpStatus.OK).json({
              message: 'Client',
              isActive: true,
              isAdmin: false,
              userExists: true,
            });
          } else {
            console.log('false false');
            return response.status(HttpStatus.OK).json({
              message: 'Email is inactive',
              isActive: false,
              isAdmin: false,
              userExists: true,
            });
          }
        } else {
          return response.status(HttpStatus.OK).json({
            message: 'Email does not exist',
            userExists: false,
          });
        }
      });
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }
}
