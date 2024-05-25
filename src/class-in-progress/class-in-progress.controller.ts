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
        console.log(resData);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classInProgressService.remove(+id);
  }
}
