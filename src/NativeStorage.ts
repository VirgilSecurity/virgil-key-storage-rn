import {
  Options,
  setGenericPassword,
  getGenericPassword,
  resetGenericPassword,
} from 'react-native-keychain';
import { IKeyEntry } from 'virgil-sdk';

import IStorage from './IStorage';
import { serializeKeyEntries, deserializeKeyEntries } from './KeyEntryUtils';

export interface NativeStorageOptions extends Options {
  username?: string;
}

export default class NativeStorage implements IStorage {
  private static readonly DEFAULT_USERNAME: string = '_VIRGIL_KEY_ENTRY_STORAGE';

  private readonly username: string = NativeStorage.DEFAULT_USERNAME;
  private readonly options?: Options;

  constructor(options?: NativeStorageOptions) {
    if (typeof options !== 'undefined') {
      const { username, ...keychainOptions } = options;
      this.username = username || NativeStorage.DEFAULT_USERNAME;
      this.options = keychainOptions;
    }
  }

  async getKeyEntries(): Promise<Map<string, IKeyEntry>> {
    const obj = await getGenericPassword(this.options);
    if (typeof obj === 'boolean') {
      return new Map<string, IKeyEntry>();
    }
    return deserializeKeyEntries(obj.password);
  }

  async setKeyEntries(keyEntries: Map<string, IKeyEntry>): Promise<void> {
    const value = serializeKeyEntries(keyEntries);
    await setGenericPassword(this.username, value, this.options);
  }

  async clear(): Promise<void> {
    await resetGenericPassword(this.options);
  }
}
