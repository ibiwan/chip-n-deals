import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipService } from '@/features/chip/chip.service';
import {
  ChipSetEntityModel,
  ChipSetRepository,
} from '@/features/chipSet/chipSet.entityModel';
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import { testChipSetDtos, testChipSetEMs } from '@test/fixtures/test.init.data';
import { randomUUID } from 'crypto';
import { EntityManager } from 'typeorm';

describe('chipset service', () => {
  describe('allChipSets', () => {
    let chipSetService: ChipSetService;
    let findFn: (args: any) => ChipSetEntityModel[];

    beforeEach(async () => {
      findFn = jest.fn().mockResolvedValue(testChipSetEMs);
      const chipSetRepository: ChipSetRepository = {
        find: findFn,
      } as unknown as ChipSetRepository;
      chipSetService = new ChipSetService(
        chipSetRepository,
        null /*EntityManager*/,
        null /*ChipService*/,
      );
    });
    it('uses chipset repo and returns results', async () => {
      const result = await chipSetService.allChipSets();

      expect(result).toBe(testChipSetEMs);

      expect(findFn).toHaveBeenCalledTimes(1);
      expect(findFn).toHaveBeenCalledWith(
        expect.objectContaining({ relations: expect.anything() }),
      );
      expect(findFn).toHaveBeenCalledWith(
        expect.not.objectContaining({ where: expect.anything() }),
      );
    });
  });

  describe('chipSet', () => {
    let chipSetService: ChipSetService;
    let findOneFn: (args: any) => ChipSetEntityModel;
    const findParam = randomUUID();
    const findResult = new ChipSetEntityModel('a');

    beforeEach(async () => {
      findOneFn = jest.fn().mockResolvedValue(findResult);

      const chipSetRepository: ChipSetRepository = {
        findOne: findOneFn,
      } as unknown as ChipSetRepository;

      chipSetService = new ChipSetService(chipSetRepository, null, null);
    });

    it('uses chipset repo and returns a result', async () => {
      const result = await chipSetService.chipSet(findParam);

      expect(result).toBe(findResult);

      expect(findOneFn).toHaveBeenCalledTimes(1);
      expect(findOneFn).toHaveBeenCalledWith(
        expect.objectContaining({ relations: expect.anything() }),
      );
      expect(findOneFn).toHaveBeenCalledWith(
        expect.objectContaining({ where: { opaqueId: findParam } }),
      );
    });
  });

  describe('create', () => {
    let chipSetService: ChipSetService;
    const createChipSetDto = testChipSetDtos[0];
    const chipGqlObject = testChipSetEMs[0];

    let createChipFn = (args: any) => ChipEntityModel;
    let emSaveFn: (args: any) => Promise<any>;

    beforeEach(async () => {
      createChipFn = jest.fn().mockResolvedValue(chipGqlObject);
      const chipService = {
        createChipModelForChipSetEntity: createChipFn,
      } as unknown as ChipService;

      emSaveFn = jest.fn((a) => a);
      const em = { save: emSaveFn } as EntityManager;

      chipSetService = new ChipSetService(null, em, chipService);
    });

    it('uses chipset repo and returns created gql object', async () => {
      const result = await chipSetService.create(createChipSetDto);

      expect(createChipFn).toHaveBeenCalledTimes(createChipSetDto.chips.length);

      expect(emSaveFn).toHaveBeenCalledTimes(1);
      expect(emSaveFn).toHaveBeenCalledWith(result)
    });
  });
});
