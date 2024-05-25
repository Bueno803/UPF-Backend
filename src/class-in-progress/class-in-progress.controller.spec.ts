import { Test, TestingModule } from '@nestjs/testing';
import { ClassInProgressController } from './class-in-progress.controller';
import { ClassInProgressService } from './class-in-progress.service';

describe('ClassInProgressController', () => {
  let controller: ClassInProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassInProgressController],
      providers: [ClassInProgressService],
    }).compile();

    controller = module.get<ClassInProgressController>(ClassInProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
