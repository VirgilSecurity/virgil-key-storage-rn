import { SecureStore } from 'expo';
import { IKeyEntry } from 'virgil-sdk';

import ExpoStorage from '../ExpoStorage';

jest.mock('expo', () => {
  const items = new Map<string, string>();
  const setItemAsync = function(key: string, value: string): Promise<void> {
    items.set(key, value);
    return Promise.resolve();
  };
  const getItemAsync = function(key: string): Promise<string | null> {
    const value = items.get(key);
    if (typeof value === 'undefined') {
      return Promise.resolve(null);
    }
    return Promise.resolve(value);
  };
  const deleteItemAsync = function(key: string): Promise<void> {
    if (!items.has(key)) {
      throw new Error();
    }
    items.delete(key);
    return Promise.resolve();
  };
  return {
    SecureStore: {
      setItemAsync,
      getItemAsync,
      deleteItemAsync,
    },
  };
});

describe('ExpoStorage', () => {
  const key = 'storage';
  let storage: ExpoStorage;

  beforeEach(() => {
    storage = new ExpoStorage({ key });
  });

  afterEach(async () => {
    await storage.clear();
  });

  describe('getKeyEntries', () => {
    it("should return an empty 'Map<string, IKeyEntry>' object", async () => {
      expect.assertions(1);
      const keyEntries = await storage.getKeyEntries();
      expect(Array.from(keyEntries.values())).toHaveLength(0);
    });

    it("should return 'Map<string, IKeyEntry>' with stored 'IKeyEntry' objects", async () => {
      expect.assertions(2);
      const keyEntry1 = {
        name: 'name1',
        value: Buffer.from('value1'),
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntry2 = {
        name: 'name2',
        value: Buffer.from('value2'),
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntries = new Map<string, IKeyEntry>();
      keyEntries.set(keyEntry1.name, keyEntry1);
      keyEntries.set(keyEntry2.name, keyEntry2);
      await storage.setKeyEntries(keyEntries);
      const storedKeyEntries = await storage.getKeyEntries();
      expect(storedKeyEntries.get(keyEntry1.name)).toEqual(keyEntry1);
      expect(storedKeyEntries.get(keyEntry2.name)).toEqual(keyEntry2);
    });
  });

  describe('setKeyEntries', () => {
    it("should store 'Map<string, IKeyEntry>' in 'SecureStore'", async () => {
      expect.assertions(1);
      const keyEntry = {
        name: 'name',
        value: Buffer.from('value'),
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntries = new Map<string, IKeyEntry>();
      keyEntries.set(keyEntry.name, keyEntry);
      await storage.setKeyEntries(keyEntries);
      const value = await SecureStore.getItemAsync(key);
      expect(typeof value === 'string').toBeTruthy();
    });
  });

  describe('clear', () => {
    it("should delete all stored 'IKeyEntry' objects", async () => {
      expect.assertions(1);
      const keyEntry = {
        name: 'name',
        value: Buffer.from('value'),
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntries = new Map<string, IKeyEntry>();
      keyEntries.set(keyEntry.name, keyEntry);
      await storage.setKeyEntries(keyEntries);
      await storage.clear();
      const newKeyEntries = await storage.getKeyEntries();
      const values = Array.from(newKeyEntries.values());
      expect(values).toHaveLength(0);
    });

    it('should not throw an error if we try to clean an empty storage', async () => {
      expect.assertions(1);
      await expect(storage.clear()).resolves.toBeUndefined();
    });
  });
});
