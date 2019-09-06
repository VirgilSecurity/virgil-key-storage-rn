import { getGenericPassword } from 'react-native-keychain';
import { IKeyEntry } from 'virgil-sdk';

import NativeStorage from '../NativeStorage';

jest.mock('react-native-keychain', () => {
  const items = new Map<string, string>();
  let currentUsername: string | undefined;
  const setGenericPassword = (username: string, password: string) => {
    currentUsername = username;
    items.set(username, password);
    return true;
  };
  const getGenericPassword = () => {
    if (typeof currentUsername === 'undefined' || !items.has(currentUsername)) {
      return false;
    }
    return { username: currentUsername, password: items.get(currentUsername) };
  };
  const resetGenericPassword = () => {
    if (typeof currentUsername === 'undefined') {
      return false;
    }
    items.delete(currentUsername);
    return true;
  };
  return {
    setGenericPassword,
    getGenericPassword,
    resetGenericPassword,
  };
});

describe('NativeStorage', () => {
  let storage: NativeStorage;

  beforeEach(() => {
    storage = new NativeStorage();
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
        value: 'dmFsdWUx',
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntry2 = {
        name: 'name2',
        value: 'dmFsdWUy',
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
        value: 'dmFsdWU=',
        meta: { key: 'value' },
        creationDate: new Date(),
        modificationDate: new Date(),
      };
      const keyEntries = new Map<string, IKeyEntry>();
      keyEntries.set(keyEntry.name, keyEntry);
      await storage.setKeyEntries(keyEntries);
      const obj = (await getGenericPassword()) as { username: string; password: string };
      expect(typeof obj.password === 'string').toBeTruthy();
    });
  });

  describe('clear', () => {
    it("should delete all stored 'IKeyEntry' objects", async () => {
      expect.assertions(1);
      const keyEntry = {
        name: 'name',
        value: 'dmFsdWU=',
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
  });
});
