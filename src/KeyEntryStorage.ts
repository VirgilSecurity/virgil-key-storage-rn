import IStorage from './IStorage';
import { KeyEntryAlreadyExistsError, KeyEntryDoesNotExistError } from './errors';

type IKeyEntryStorage = import('virgil-sdk').IKeyEntryStorage;
type IKeyEntry = import('virgil-sdk').IKeyEntry;
type ISaveKeyEntryParams = import('virgil-sdk').ISaveKeyEntryParams;
type IUpdateKeyEntryParams = import('virgil-sdk').IUpdateKeyEntryParams;

export default class KeyEntryStorage implements IKeyEntryStorage {
  private readonly storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async save(params: ISaveKeyEntryParams): Promise<IKeyEntry> {
    const keyEntries = await this.storage.getKeyEntries();
    if (keyEntries.has(params.name)) {
      throw new KeyEntryAlreadyExistsError(params.name);
    }
    const keyEntry = {
      name: params.name,
      value: params.value,
      meta: params.meta,
      creationDate: new Date(),
      modificationDate: new Date(),
    };
    keyEntries.set(params.name, keyEntry);
    await this.storage.setKeyEntries(keyEntries);
    return keyEntry;
  }

  async load(name: string): Promise<IKeyEntry | null> {
    const keyEntries = await this.storage.getKeyEntries();
    const keyEntry = keyEntries.get(name);
    if (typeof keyEntry === 'undefined') {
      return null;
    }
    return keyEntry;
  }

  async exists(name: string): Promise<boolean> {
    const keyEntries = await this.storage.getKeyEntries();
    return keyEntries.has(name);
  }

  async remove(name: string): Promise<boolean> {
    const keyEntries = await this.storage.getKeyEntries();
    const deleteSuccessful = keyEntries.delete(name);
    if (!deleteSuccessful) {
      return false;
    }
    await this.storage.setKeyEntries(keyEntries);
    return true;
  }

  async list(): Promise<IKeyEntry[]> {
    const keyEntries = await this.storage.getKeyEntries();
    return Array.from(keyEntries.values());
  }

  async update(params: IUpdateKeyEntryParams): Promise<IKeyEntry> {
    const keyEntries = await this.storage.getKeyEntries();
    const keyEntry = keyEntries.get(params.name);
    if (typeof keyEntry === 'undefined') {
      throw new KeyEntryDoesNotExistError(params.name);
    }
    const updatedKeyEntry = {
      name: params.name,
      value: params.value || keyEntry.value,
      meta: params.meta || keyEntry.meta,
      creationDate: keyEntry.creationDate,
      modificationDate: new Date(),
    };
    keyEntries.set(params.name, updatedKeyEntry);
    await this.storage.setKeyEntries(keyEntries);
    return updatedKeyEntry;
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }
}
