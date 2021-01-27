import { Test, TestingModule } from '@nestjs/testing';
import { CsvfilesService } from './csvfiles.service';

describe('CsvfilesService', () => {
  let service: CsvfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvfilesService],
    }).compile();

    service = module.get<CsvfilesService>(CsvfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
