import * as SecureStore from 'expo-secure-store';

import IStorage from './IStorage';
import { serializeKeyEntries, deserializeKeyEntries } from './KeyEntryUtils';

type IKeyEntry = import('virgil-sdk').IKeyEntry;

export interface ExpoStorageOptions extends SecureStore.SecureStoreOptions {
  key?: string;
}

export default class ExpoStorage implements IStorage {
  private static readonly DEFAULT_KEY: string = '_VIRGIL_KEY_ENTRY_STORAGE';

  private readonly key: string = ExpoStorage.DEFAULT_KEY;
  private readonly options?: SecureStore.SecureStoreOptions;

  constructor(options?: ExpoStorageOptions) {
    console.warn('Deprecated: (ノಠ益ಠ)ノ彡┻━┻ ExpoStorage will be removed in next major release.');
    if (typeof options !== 'undefined') {
      const { key, ...secureStoreOptions } = options;
      this.key = key || ExpoStorage.DEFAULT_KEY;
      this.options = secureStoreOptions;
    }
  }

  async getKeyEntries(): Promise<Map<string, IKeyEntry>> {
    const value = await SecureStore.getItemAsync(this.key, this.options);
    if (value === null) {
      return new Map<string, IKeyEntry>();
    }
    return deserializeKeyEntries(value);
  }

  async setKeyEntries(keyEntries: Map<string, IKeyEntry>): Promise<void> {
    const value = serializeKeyEntries(keyEntries);
    await SecureStore.setItemAsync(this.key, value, this.options);
  }

  async clear(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.key, this.options);
    } catch (error) {}
  }
}
