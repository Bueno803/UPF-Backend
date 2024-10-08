import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ClassInProgressService } from './class-in-progress.service';
// import { CreateClassInProgressDto } from './dto/create-class-in-progress.dto';
// import { UpdateClassInProgressDto } from './dto/update-class-in-progress.dto';

@Controller('class-in-progress')
export class ClassInProgressController {
  constructor(
    private readonly classInProgressService: ClassInProgressService,
  ) {}

  @Post()
  create(@Body() createClassInProgressDto: any) {
    return this.classInProgressService.create(createClassInProgressDto);
  }

  @Get('/find/all')
  async findAll(@Res() response) {
    try {
      await this.classInProgressService.findAll().then((resData) => {
        return response.status(HttpStatus.OK).json({ resData });
      });
    } catch (error) {
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Patch('/update')
  async update(@Res() response, @Body() updateClassInProgressDto: any) {
    try {
      await this.classInProgressService
        .update(updateClassInProgressDto)
        .then((resData) => {
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

  @Get('/settings')
  async getClassSettings(@Res() response) {
    await this.classInProgressService.getClassStamps().then((resData) => {
      return response.status(HttpStatus.OK).json({
        resData,
      });
    });
  }

  @Get('/TechInfo')
  async getAllTechInfo(@Res() response) {
    await this.classInProgressService.getAllTechInfo().then((resData) => {
      return response.status(HttpStatus.OK).json({
        resData,
      });
    });
  }

  @Get('/testlist')
  async getTestList(@Res() response) {
    await this.classInProgressService.getTestList().then((resData) => {
      return response.status(HttpStatus.OK).json({
        resData,
      });
    });
  }

  @Patch('/emailSentFlag')
  async emailSentFlag(@Res() response, @Body() data) {
    try {
      await this.classInProgressService.emailSentFlag(data).then((resData) => {
        if (resData.error) {
          return response.status(HttpStatus.CONFLICT).json({ resData });
        } else {
          return response.status(HttpStatus.OK).json({ resData });
        }
      });
    } catch (error) {
      console.error(error);
      return response.status(HttpStatus.CONFLICT).json({ error });
    }
  }

  @Patch('/update/ready')
  async updateStudentReady(@Res() response, @Body() data) {
    try {
      await this.classInProgressService
        .updateStudentReady(data)
        .then((resData) => {
          return response.status(HttpStatus.OK).json({ resData });
        });
    } catch (error) {
      console.log('An error occurred calling update on Student Ready: ', error);
      return response.status(HttpStatus.CONFLICT).json({
        error,
      });
    }
  }

  @Patch('/update/class')
  async updateStudentClass(@Res() response, @Body() data) {
    try {
      await this.classInProgressService
        .updateStudentClass(data)
        .then((resData) => {
          return response.status(HttpStatus.OK).json({ resData });
        });
    } catch (error) {
      console.log('An error occurred calling update on Student Ready: ', error);
      return response.status(HttpStatus.CONFLICT).json({
        error,
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classInProgressService.remove(+id);
  }
}
