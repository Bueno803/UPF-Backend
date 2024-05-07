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
      await this.clientsService.getClients().then((resClients) => {
        console.log(resClients);
        return response.status(HttpStatus.OK).json({
          clients: resClients,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/create')
  async createClient(
    @Res() response,
    @Req() req: Request,
    @Body() userDto: any,
  ) {
    try {
      await this.clientsService.createClient(userDto).then((resClient) => {
        console.log('resClient: ', resClient);
        if (resClient.clientCreated) {
          return response.status(HttpStatus.OK).json({
            message: 'User successfully created',
            resClient,
          });
        } else {
          return response.status(HttpStatus.CONFLICT).json({
            message: 'User already exists',
            resClient,
          });
        }
      });
    } catch (error) {
      console.log('error: ', error);
    }
    return null;
  }

  @Post('/create-force')
  async createClientAnyway(
    @Res() response,
    @Req() req: Request,
    @Body() userDto: any,
  ) {
    try {
      console.log("1createClientAnyway");
      await this.clientsService.createClientAnyway(userDto).then((resClient) => {
        console.log('resClient: ', resClient);
        if (resClient.clientCreated) {
          return response.status(HttpStatus.OK).json({
            message: 'User successfully created',
            resClient,
          });
        } else {
          return response.status(HttpStatus.CONFLICT).json({
            message: 'User already exists',
            resClient,
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
          return response.status(HttpStatus.CONFLICT).json({ locations });
        }
        // console.log('locs: ', locations);
        return response.status(HttpStatus.OK).json({ locations });
      });
    } catch (error) {
      console.log('An error occurred returning locations: ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Post('/locations/add')
  async addLocation(@Res() response, @Body() userDto: any) {
    try {
      await this.clientsService.addLocation(userDto).then((resData) => {
        if (resData == null) {
          return response
            .status(HttpStatus.CONFLICT)
            .json({ message: 'Location already Exists' });
        } else {
          return response.status(HttpStatus.OK).json(resData);
        }
      });
    } catch (error) {
      console.log('An error occurred calling addLocation ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Post('/locations/remove')
  async removeLocation(@Res() response, @Body() userDto: any) {
    try {
      console.log('remove loc: ', userDto);
      await this.clientsService.removeLocation(userDto).then((resData) => {
        if (resData != null) {
          return response.status(HttpStatus.CONFLICT).json(resData);
        } else {
          return response
            .status(HttpStatus.OK)
            .json({ message: 'Service Location Deleted' });
        }
      });
    } catch (error) {
      console.log('An error occurred calling addLocation ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }
}
