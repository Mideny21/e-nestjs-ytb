import { Test, TestingModule } from '@nestjs/testing';
import { ShippingAdressController } from './shipping-adress.controller';
import { ShippingAdressService } from './shipping-adress.service';

describe('ShippingAdressController', () => {
  let controller: ShippingAdressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingAdressController],
      providers: [ShippingAdressService],
    }).compile();

    controller = module.get<ShippingAdressController>(ShippingAdressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
