import { Test, TestingModule } from '@nestjs/testing';
import { CarrierController } from './carrier-service.controller';

describe('Carrier Controller', () => {
  let controller: CarrierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarrierController],
    }).compile();

    controller = module.get<CarrierController>(CarrierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
