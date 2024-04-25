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
      await this.clientsService
        .createClient(userDto)
        .then((resClient) => {
          console.log("resClient: ", resClient);
          if(resClient.clientExists) {
              return response.status(HttpStatus.CONFLICT).json({
                  message: 'User already exists',
                  data: resClient.client
              });
          } else {
              return response.status(HttpStatus.OK).json({
                  message: 'User successfully created',
                  resClient
              });
          }
        });
    } catch (error) {
      console.log('error: ', error);
    }
    return null;
  }

  @Get('/locations')
  async getLocations(@Res() response) {
    try {
        await this.clientsService.getLocations().then((locations) => {
            if (response.errorStatus) {
                return response.status(HttpStatus.CONFLICT).json({locations});
            }
            return response.status(HttpStatus.OK).json({locations});
        });
    } catch (error) {
        console.log("An error occurred returning locations: ", error);
        return response.status(HttpStatus.CONFLICT).json({error});
    }
  }
}
