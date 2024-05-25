import { Module } from '@nestjs/common';
import { ClassInProgressService } from './class-in-progress.service';
import { ClassInProgressController } from './class-in-progress.controller';

@Module({
  controllers: [ClassInProgressController],
  providers: [ClassInProgressService],
})
export class ClassInProgressModule {}
