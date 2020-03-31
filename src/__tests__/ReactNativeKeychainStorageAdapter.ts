import { Options } from 'react-native-keychain';
import { StorageEntryAlreadyExistsError } from 'virgil-sdk';
import { v4 as uuid } from 'uuid';
import { ReactNativeKeychainStorageAdapter } from '../ReactNativeKeychainStorageAdapter';

jest.mock('react-native-keychain', () => {
  const servicePasswords: { [key: string]: { [key: string]: string } } = {};
  const defaultService = 'com.default.service';
  const setGenericPassword = (username: string, password: string, options: Options = {}) => {
    const service = options.service || defaultService;
    servicePasswords[service] = { username, password };
    return { service, storage: 'keychain' };
  };
  const getGenericPassword = (options: Options = {}) => {
    const service = options.service || defaultService;
    if (!servicePasswords[service]) {
      return false;
    }
    return servicePasswords[service];
  };
  const resetGenericPassword = (serviceOrOptions?: string | Options) => {
    if (typeof serviceOrOptions === 'string') {
      // We don't use it
      return false;
    }
    const options = serviceOrOptions || {};
    const service = options.service || defaultService;
    if (!servicePasswords[service]) {
      return false;
    }
    delete servicePasswords[service];
    return true;
  };
  return {
    setGenericPassword,
    getGenericPassword,
    resetGenericPassword,
  };
});

describe('ReactNativeKeychainStorageAdapter', () => {
  let storageAdapter: ReactNativeKeychainStorageAdapter;

  beforeEach(() => {
    storageAdapter = new ReactNativeKeychainStorageAdapter();
  });

  test('custom service and username', async () => {
    const { getGenericPassword } = jest.requireMock('react-native-keychain');
    const service1 = `com.example.keys-${uuid()}`;
    const service2 = `com.example.keys-${uuid()}`;
    const username1 = uuid();
    const username2 = uuid();
    const key = 'key';
    const data1 = 'data1';
    const data2 = 'data2';
    const myStorageAdapter1 = new ReactNativeKeychainStorageAdapter({
      service: service1,
      username: username1,
    });
    const myStorageAdapter2 = new ReactNativeKeychainStorageAdapter({
      service: service2,
      username: username2,
    });
    await myStorageAdapter1.store(key, data1);
    await myStorageAdapter2.store(key, data2);
    const { username: storeUsername1 } = await getGenericPassword({ service: service1 });
    const { username: storeUsername2 } = await getGenericPassword({ service: service2 });
    expect(storeUsername1).toBe(username1);
    expect(storeUsername2).toBe(username2);
    const myData1 = await myStorageAdapter1.load(key);
    await myStorageAdapter1.clear();
    const myData2 = await myStorageAdapter2.load(key);
    expect(myData1).toBe(data1);
    expect(myData2).toBe(data2);
    const exists = await myStorageAdapter1.exists(key);
    expect(exists).toBe(false);
    const items = await myStorageAdapter2.list();
    expect(items).toHaveLength(1);
  });

  describe('store', () => {
    it('stores entries', async () => {
      const key1 = uuid();
      const data1 = 'data1';
      const key2 = uuid();
      const data2 = 'data2';
      const key3 = uuid();
      const data3 = 'data3';
      await storageAdapter.store(key1, data1);
      await storageAdapter.store(key2, data2);
      await storageAdapter.store(key3, data3);
      const items = await storageAdapter.list();
      const myData1 = await storageAdapter.load(key1);
      const myData2 = await storageAdapter.load(key2);
      const myData3 = await storageAdapter.load(key3);
      expect(items).toHaveLength(3);
      expect(myData1).toBe(data1);
      expect(myData2).toBe(data2);
      expect(myData3).toBe(data3);
    });

    it('throws `StorageEntryAlreadyExistsError` if entry already exists', async () => {
      const key = uuid();
      await storageAdapter.store(key, 'data1');
      try {
        await storageAdapter.store(key, 'data2');
        throw new Error();
      } catch (error) {
        expect(error).toBeInstanceOf(StorageEntryAlreadyExistsError);
      }
    });
  });

  describe('load', () => {
    it('returns data if exists', async () => {
      const key = uuid();
      const data = 'data';
      await storageAdapter.store(key, data);
      const myData = await storageAdapter.load(key);
      expect(myData).toBe(data);
    });

    it('returns null if not exists', async () => {
      const myData = await storageAdapter.load(uuid());
      expect(myData).toBeNull();
    });
  });

  describe('exists', () => {
    it('returns true if exist', async () => {
      const key = uuid();
      await storageAdapter.store(key, 'data');
      const exists = await storageAdapter.exists(key);
      expect(exists).toBe(true);
    });

    it("returns false if doesn't exist", async () => {
      const exists = await storageAdapter.exists(uuid());
      expect(exists).toBe(false);
    });
  });

  describe('remove', () => {
    it('returns true if exist', async () => {
      const key = uuid();
      await storageAdapter.store(key, 'data');
      const result = await storageAdapter.remove(key);
      expect(result).toBe(true);
    });

    it("returns false if doesn't exist", async () => {
      const result = await storageAdapter.remove(uuid());
      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('updates the entry', async () => {
      const key = uuid();
      const updatedData = 'data123';
      await storageAdapter.store(key, 'data');
      await storageAdapter.update(key, updatedData);
      const data = await storageAdapter.load(key);
      expect(data).toBe(updatedData);
    });
  });

  describe('clear', () => {
    it('deletes all entries', async () => {
      await storageAdapter.store(uuid(), 'data1');
      await storageAdapter.store(uuid(), 'data2');
      await storageAdapter.clear();
      const items = await storageAdapter.list();
      expect(items).toHaveLength(0);
    });
  });

  describe('list', () => {
    it('returns all items', async () => {
      const data1 = 'data1';
      const data2 = 'data2';
      await storageAdapter.store(uuid(), data1);
      await storageAdapter.store(uuid(), data2);
      const items = await storageAdapter.list();
      const set = new Set(items);
      expect(items).toHaveLength(2);
      expect(set.has(data1)).toBe(true);
      expect(set.has(data2)).toBe(true);
    });
  });
});
