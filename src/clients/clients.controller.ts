import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('/all')
  public async getClients(@Res() response) {
    try {
      await this.clientsService.getClients().then((resClients) => {
        resClients.forEach((data) => {
          console.log(data.FirstName, ' ', data.ClientID);
        });
        // console.log(resClients[0].FirstName, ' ', resClients[0].ClientID);
        return response.status(HttpStatus.OK).json({
          clients: resClients,
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/create')
  async createClient(@Res() response, @Body() userDto: any) {
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
  async createClientAnyway(@Res() response, @Body() userDto: any) {
    try {
      console.log('1createClientAnyway');
      await this.clientsService
        .createClientAnyway(userDto)
        .then((resClient) => {
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

  @Post('/update')
  async clientUpdate(@Res() response, @Body() client: any) {
    try {
      console.log('UpdateClien');
      // const { Client } = client;
      console.log(client);
      await this.clientsService.updateClient(client).then((resData) => {
        if (resData.updateStatus) {
          return response.status(HttpStatus.OK).json({
            resData,
          });
        } else {
          return response.status(HttpStatus.CONFLICT).json({
            resData,
          });
        }
      });
    } catch (error) {
      console.log(
        'An error occurred calling update on client progress: ',
        error,
      );
      return response.status(HttpStatus.CONFLICT).json({
        error,
      });
    }
  }

  @Post('/disable')
  async disableClient(@Res() response, @Body() data: any) {
    try {
      console.log('/disable client');
      await this.clientsService
        .disableClient(data.ClientID, data.disabledTimeStamp)
        .then((resData) => {
          if (resData.updateStatus) {
            console.log('disableClient: ', resData);
            return response.status(HttpStatus.OK).json({
              resData,
            });
          } else {
            console.log('disableClient: ', resData);
            return response.status(HttpStatus.CONFLICT).json({
              resData,
            });
          }
        });
    } catch (error) {}
  }

  @Post('/enable')
  async enableClient(@Res() response, @Body() data: any) {
    try {
      console.log('/disable client');
      await this.clientsService.enableClient(data.ClientID).then((resData) => {
        if (resData.updateStatus) {
          console.log('disableClient: ', resData);
          return response.status(HttpStatus.OK).json({
            resData,
          });
        } else {
          console.log('disableClient: ', resData);
          return response.status(HttpStatus.CONFLICT).json({
            resData,
          });
        }
      });
    } catch (error) {}
  }

  @Post('/purge')
  async purgeInactives(@Res() response, @Body() data) {
    try {
      console.log('/purge');
      console.log(data);
      await this.clientsService
        .purgeInactives(data.dateData)
        .then((resData) => {
          return response.status(HttpStatus.OK).json(resData);
        });
    } catch (error) {
      console.log('An error occurred purging clients: ', error);
      return response.status(HttpStatus.CONFLICT).json(error);
    }
  }

  @Get('/locations')
  async getLocations(@Res() res) {
    try {
      console.log('/locations');
      await this.clientsService.getLocations().then((locations) => {
        if (res.errorStatus) {
          return res.status(HttpStatus.CONFLICT).json({ locations });
        }
        // console.log('locs: ', locations);
        return res.status(HttpStatus.OK).json({ locations });
      });
    } catch (error) {
      console.log('An error occurred return locations: ', error);
      return res.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Get('/servicetypes')
  async getServiceTypes(@Res() response) {
    try {
      console.log('/servicetypes');
      await this.clientsService.getServiceTypes().then((serviceTypes) => {
        if (response.errorStatus) {
          return response.status(HttpStatus.CONFLICT).json({ serviceTypes });
        }
        // console.log('locs: ', locations);
        return response.status(HttpStatus.OK).json({ serviceTypes });
      });
    } catch (error) {
      console.log('An error occurred return serviceTypes: ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Post('/locations/add')
  async addLocation(@Res() response, @Body() location: any) {
    try {
      await this.clientsService.addLocation(location).then((resData) => {
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
  async removeLocation(@Res() response, @Body() location: any) {
    try {
      console.log('remove loc: ', location);
      await this.clientsService.removeLocation(location).then((resData) => {
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

  @Get('/schedule')
  async getSchedule(@Res() response) {
    try {
      await this.clientsService.getSchedule().then((resData) => {
        return response.status(HttpStatus.OK).json(resData);
      });
    } catch (error) {
      return response.status(HttpStatus.CONFLICT).json(error);
    }
  }

  @Post('/custom/delete')
  async deleteCustom(@Res() response) {
    try {
      // console.log('remove loc: ', location);
      await this.clientsService.deleteCustom().then(() => {
        return response
          .status(HttpStatus.OK)
          .json({ message: 'deleteCustom Deleted' });
      });
    } catch (error) {
      console.log('An error occurred calling deleteCustom ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Post('/update/attendance')
  async updateAttendance(@Res() response, @Body() attendanceList) {
    try {
      await this.clientsService
        .updateAttendance(attendanceList)
        .then((resData) => {
          return response.status(HttpStatus.OK).json(resData);
        });
    } catch (error) {
      console.log('An error occurred calling deleteCustom ', error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }
}
