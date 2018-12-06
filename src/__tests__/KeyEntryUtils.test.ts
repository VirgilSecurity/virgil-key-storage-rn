import { IKeyEntry } from 'virgil-sdk';

import { serializeKeyEntries, deserializeKeyEntries } from '../KeyEntryUtils';

describe('KeyEntryUtils', () => {
  const keyEntry = {
    name: 'name',
    value: Buffer.from('value'),
    meta: { key: 'value' },
    creationDate: new Date(0),
    modificationDate: new Date(0),
  };
  const keyEntries = new Map<string, IKeyEntry>();
  keyEntries.set(keyEntry.name, keyEntry);
  const serializedKeyEntries =
    '[["name",{"name":"name","value":"dmFsdWU=","meta":{"key":"value"},"creationDate":"1970-01-01T00:00:00.000Z","modificationDate":"1970-01-01T00:00:00.000Z"}]]';

  describe('serializeKeyEntries', () => {
    it("should serialize a 'Map<string, IKeyEntry>' object", () => {
      const value = serializeKeyEntries(keyEntries);
      expect(value).toBe(serializedKeyEntries);
    });
  });

  describe('deserializeKeyEntries', () => {
    it("should deserialize into a 'Map<string, IKeyEntry>' object", () => {
      const myKeyEntries = deserializeKeyEntries(serializedKeyEntries);
      expect(myKeyEntries).toEqual(keyEntries);
    });
  });
});
