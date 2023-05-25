import { EntityManager, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipService } from '@/features/chip/chip.service';
import { ChipSetService } from '@/features/chipSet/chipSet.service';

import {
  testChipDtos,
  testChipSetEMs,
  testOrphanChipEMs,
} from '@test/fixtures/test.init.data';
import {
  gqlChipFromChipDto,
  shallowGqlChipFromDbEntity,
} from '@test/helpers/types';

describe('chip service', () => {
  describe('allChips', () => {
    const testOrphanChips = testOrphanChipEMs;
    let chipService: ChipService;
    let findFn: (args: any) => ChipEntityModel[];

    beforeEach(async () => {
      findFn = jest.fn().mockResolvedValue(testOrphanChips);
      const chipRepo = {
        find: findFn,
      } as unknown as Repository<ChipEntityModel>;

      chipService = new ChipService(
        chipRepo,
        null /*ChipSetService*/,
        null /*EntityManager*/,
      );
    });

    it('uses chip repo and returns result', async () => {
      const fetchedChips: ChipEntityModel[] = await chipService.allChips();

      expect(findFn).toBeCalledTimes(1);
      expect(findFn).toBeCalledWith();

      expect(fetchedChips).toStrictEqual(testOrphanChips);
    });
  });

  describe('chipsForChipSet', () => {
    let chipService: ChipService;
    let findFn: (args: any) => ChipEntityModel[];

    const testChipSet = testChipSetEMs[0];
    const expectedChipResults = testChipSetEMs[0].chips;

    beforeEach(async () => {
      findFn = jest.fn().mockResolvedValue(expectedChipResults);

      const chipRepo = {
        findBy: findFn,
      } as unknown as Repository<ChipEntityModel>;

      chipService = new ChipService(
        chipRepo,
        null /*ChipSetService*/,
        null /*EntityManager*/,
      );
    });

    it('uses chipSetService to search on id', async () => {
      const fetchedChips: ChipEntityModel[] = await chipService.chipsForChipSet(
        testChipSet.id,
      );

      expect(findFn).toBeCalledTimes(1);
      expect(findFn).toBeCalledWith({ id: testChipSet.id });

      expect(fetchedChips).toEqual(expectedChipResults);
    });
  });

  describe('create', () => {
    const testChipDto = testChipDtos[0];
    const targetChipSet = testChipSetEMs[0];

    let chipService: ChipService;
    const emSaveFn = jest.fn();
    const chipSetFetchFn = jest.fn().mockResolvedValue(targetChipSet);

    beforeEach(() => {
      const em = { save: emSaveFn } as unknown as EntityManager;

      const chipSetService = {
        chipSet: chipSetFetchFn,
      } as unknown as ChipSetService;

      chipService = new ChipService(null /*ChipRepo*/, chipSetService, em);
    });

    it('fetches set, creates, associates, AND persists', async () => {
      const createdChip: ChipEntityModel = await chipService.create(
        testChipDto,
        null,
      );
      expect(emSaveFn).toBeCalled();

      const createdShallow = shallowGqlChipFromDbEntity(createdChip);
      const expectedChip = gqlChipFromChipDto(testChipDto);

      expect(createdShallow).toEqual(expectedChip);

      expect(createdChip.opaqueId).toBeInstanceOf<UUID>;
      expect(createdChip.chipSet).toBe(targetChipSet);
    });
  });

  describe('createFor', () => {
    const testChipDto = testChipDtos[0];
    const targetChipSet = testChipSetEMs[0];

    let chipService: ChipService;
    const emSaveFn = jest.fn();

    beforeEach(async () => {
      const em = { save: emSaveFn } as unknown as EntityManager;

      chipService = new ChipService(null, null, em);
    });

    it('associates to set but does not persist', async () => {
      const createdChip: ChipEntityModel =
        await chipService.createChipModelForChipSetEntity(
          testChipDto,
          targetChipSet,
          null,
        );
      expect(emSaveFn).not.toBeCalled();

      const createdShallow = shallowGqlChipFromDbEntity(createdChip);
      const expectedChip = gqlChipFromChipDto(testChipDto);

      expect(createdShallow).toEqual(expectedChip);

      expect(createdChip.opaqueId).toBeInstanceOf<UUID>;
      expect(createdChip.chipSet).toBe(targetChipSet);
    });
  });
});
