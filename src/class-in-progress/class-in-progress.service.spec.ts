import { Test, TestingModule } from '@nestjs/testing';
import { ClassInProgressService } from './class-in-progress.service';

describe('ClassInProgressService', () => {
  let service: ClassInProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassInProgressService],
    }).compile();

    service = module.get<ClassInProgressService>(ClassInProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
