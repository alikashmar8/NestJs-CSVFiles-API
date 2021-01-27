import { Test, TestingModule } from '@nestjs/testing';
import { CsvfilesController } from './csvfiles.controller';

describe('CsvfilesController', () => {
  let controller: CsvfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsvfilesController],
    }).compile();

    controller = module.get<CsvfilesController>(CsvfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
