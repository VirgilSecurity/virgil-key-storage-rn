type IKeyEntry = import('virgil-sdk').IKeyEntry;

interface SerializedKeyEntry {
  name: string;
  value: string;
  meta?: { [key: string]: string };
  creationDate: string;
  modificationDate: string;
}

const VALUE_ENCODING = 'base64';

function serializeKeyEntry(keyEntry: IKeyEntry): SerializedKeyEntry {
  return {
    name: keyEntry.name,
    value: keyEntry.value.toString(VALUE_ENCODING),
    meta: keyEntry.meta,
    creationDate: keyEntry.creationDate.toISOString(),
    modificationDate: keyEntry.modificationDate.toISOString(),
  };
}

function deserializeKeyEntry(serializedKeyEntry: SerializedKeyEntry): IKeyEntry {
  return {
    name: serializedKeyEntry.name,
    value: Buffer.from(serializedKeyEntry.value, VALUE_ENCODING),
    meta: serializedKeyEntry.meta,
    creationDate: new Date(serializedKeyEntry.creationDate),
    modificationDate: new Date(serializedKeyEntry.modificationDate),
  };
}

export function serializeKeyEntries(keyEntries: Map<string, IKeyEntry>): string {
  const rawEntries = Array.from(keyEntries.entries());
  const entries = rawEntries.map(
    ([key, value]) => [key, serializeKeyEntry(value)] as [string, SerializedKeyEntry],
  );
  return JSON.stringify(entries);
}

export function deserializeKeyEntries(value: string): Map<string, IKeyEntry> {
  const values = JSON.parse(value) as [string, SerializedKeyEntry][];
  const deserializedValues = values.map(
    ([key, value]) => [key, deserializeKeyEntry(value)] as [string, IKeyEntry],
  );
  return new Map<string, IKeyEntry>(deserializedValues);
}
