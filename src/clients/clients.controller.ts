import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('/all')
  async getClients(@Res() response) {
    try {
    } catch (error) {}
  }

  @Post('/create')
  async createClient(
    @Res() response,
    @Req() req: Request,
    @Body() userDto: any,
  ) {
    try {
      const clients = await this.clientsService
        .createClient(userDto)
        .then(() => {
          // console.log("resUser: ", resClient);
          // if(resClient.resData == 'user exists') {
          //     return response.status(HttpStatus.CONFLICT).json({
          //         message: 'User already exists',
          //         data: resClient.client
          //     });
          // } else {
          //     return response.status(HttpStatus.OK).json({
          //         message: 'User successfully created',
          //         resClient
          //     });
          // }
        });
    } catch (error) {
      console.log('error: ', error);
    }
    return null;
  }
}
