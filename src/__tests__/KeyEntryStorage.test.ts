import { IKeyEntry } from 'virgil-sdk';

import IStorage from '../IStorage';
import KeyEntryStorage from '../KeyEntryStorage';
import { KeyEntryAlreadyExistsError, KeyEntryDoesNotExistError } from '../errors';

class Storage implements IStorage {
  private keyEntries: Map<string, IKeyEntry> = new Map();

  getKeyEntries(): Promise<Map<string, IKeyEntry>> {
    return Promise.resolve(this.keyEntries);
  }

  setKeyEntries(keyEntries: Map<string, IKeyEntry>): Promise<void> {
    this.keyEntries = keyEntries;
    return Promise.resolve();
  }

  clear(): Promise<void> {
    this.keyEntries = new Map<string, IKeyEntry>();
    return Promise.resolve();
  }
}

function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe('KeyEntryStorage', () => {
  let storage: IStorage;
  let keyEntryStorage: KeyEntryStorage;

  beforeEach(() => {
    storage = new Storage();
    keyEntryStorage = new KeyEntryStorage(storage);
  });

  describe('save', () => {
    it("should save entry in 'Storage'", async () => {
      expect.assertions(1);
      const params = { name: 'name', value: 'dmFsdWU=' };
      const keyEntry = await keyEntryStorage.save(params);
      const keyEntries = await storage.getKeyEntries();
      expect(keyEntry).toEqual(keyEntries.get(params.name));
    });

    it("should throw 'KeyEntryAlreadyExistsError' if entry already exists", async () => {
      expect.assertions(1);
      const params1 = { name: 'name', value: 'dmFsdWUx' };
      const params2 = { name: params1.name, value: 'dmFsdWUy' };
      await keyEntryStorage.save(params1);
      await expect(keyEntryStorage.save(params2)).rejects.toBeInstanceOf(
        KeyEntryAlreadyExistsError,
      );
    });
  });

  describe('load', () => {
    it("should return 'IKeyEntry' if entry exists", async () => {
      expect.assertions(1);
      const params = {
        name: 'name',
        value: 'dmFsdWU=',
        meta: {
          key: 'value',
        },
      };
      const storedKeyEntry = await keyEntryStorage.save(params);
      const loadedKeyEntry = await keyEntryStorage.load(params.name);
      expect(loadedKeyEntry).toEqual(storedKeyEntry);
    });

    it("should return 'null' if entry does not exist", async () => {
      expect.assertions(1);
      const keyEntry = await keyEntryStorage.load('name');
      expect(keyEntry).toBeNull();
    });
  });

  describe('exists', () => {
    it("should return 'true' if entry exists", async () => {
      expect.assertions(1);
      const params = { name: 'name', value: 'dmFsdWU=' };
      await keyEntryStorage.save(params);
      const result = await keyEntryStorage.exists(params.name);
      expect(result).toBeTruthy();
    });

    it("should return 'false' if entry does not exist", async () => {
      expect.assertions(1);
      const result = await keyEntryStorage.exists('name');
      expect(result).toBeFalsy();
    });
  });

  describe('remove', () => {
    it("should delete entry from 'Storage'", async () => {
      expect.assertions(1);
      const params = { name: 'name', value: 'dmFsdWU=' };
      await keyEntryStorage.save(params);
      await keyEntryStorage.remove(params.name);
      const keyEntries = await storage.getKeyEntries();
      expect(keyEntries.get(params.name)).toBeUndefined();
    });

    it("should return 'true' if entry was deleted", async () => {
      expect.assertions(1);
      const params = { name: 'name', value: 'dmFsdWU=' };
      await keyEntryStorage.save(params);
      await expect(keyEntryStorage.remove(params.name)).resolves.toBeTruthy();
    });

    it("should return 'false' if entry was not deleted", async () => {
      expect.assertions(1);
      await expect(keyEntryStorage.remove('name')).resolves.toBeFalsy();
    });
  });

  describe('list', () => {
    it('should return all existing entries', async () => {
      expect.assertions(1);
      await keyEntryStorage.save({ name: 'name1', value: 'dmFsdWUx' });
      await keyEntryStorage.save({ name: 'name2', value: 'dmFsdWUy' });
      await keyEntryStorage.save({ name: 'name3', value: 'dmFsdWU0' });
      const keyEntries = await keyEntryStorage.list();
      expect(keyEntries).toHaveLength(3);
    });
  });

  describe('update', () => {
    it("should update entry in 'Storage'", async () => {
      expect.assertions(1);
      const params1 = {
        name: 'name',
        value: 'dmFsdWUx',
        meta: {
          key: 'value1',
        },
      };
      const params2 = {
        name: params1.name,
        value: 'dmFsdWUy',
        meta: {
          key: 'value2',
        },
      };
      const keyEntry1 = await keyEntryStorage.save(params1);
      const keyEntry2 = await keyEntryStorage.update(params2);
      expect(keyEntry2).not.toBe(keyEntry1);
    });

    it("should update 'modificationDate' of existing 'IKeyEntry'", async () => {
      expect.assertions(2);
      const params1 = {
        name: 'name',
        value: 'dmFsdWUx',
        meta: {
          key: 'value1',
        },
      };
      const params2 = {
        name: params1.name,
        value: 'dmFsdWUy',
        meta: {
          key: 'value2',
        },
      };
      const keyEntry1 = await keyEntryStorage.save(params1);
      await sleep(5);
      const keyEntry2 = await keyEntryStorage.update(params2);
      expect(keyEntry2.creationDate).toEqual(keyEntry1.creationDate);
      expect(keyEntry2.modificationDate).not.toEqual(keyEntry1.modificationDate);
    });

    it("should throw 'KeyEntryDoesNotExistError' if entry does not exist", async () => {
      expect.assertions(1);
      const params = { name: 'name', value: 'dmFsdWU=' };
      await expect(keyEntryStorage.update(params)).rejects.toBeInstanceOf(
        KeyEntryDoesNotExistError,
      );
    });
  });

  describe('clear', () => {
    it('should deleted all entries', async () => {
      expect.assertions(1);
      await keyEntryStorage.save({ name: 'name1', value: 'dmFsdWUx' });
      await keyEntryStorage.save({ name: 'name2', value: 'dmFsdWUy' });
      await keyEntryStorage.save({ name: 'name3', value: 'dmFsdWUz' });
      await keyEntryStorage.clear();
      const keyEntries = await keyEntryStorage.list();
      expect(keyEntries).toHaveLength(0);
    });
  });
});
