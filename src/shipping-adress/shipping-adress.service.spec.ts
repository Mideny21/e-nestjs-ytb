import { Test, TestingModule } from '@nestjs/testing';
import { ShippingAdressService } from './shipping-adress.service';

describe('ShippingAdressService', () => {
  let service: ShippingAdressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingAdressService],
    }).compile();

    service = module.get<ShippingAdressService>(ShippingAdressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
