import createExpoKeyEntryStorage from '../createExpoKeyEntryStorage';
import KeyEntryStorage from '../KeyEntryStorage';

jest.mock('../ExpoStorage', () => ({
  default: jest.fn(),
}));

describe('createExpoKeyEntryStorage', () => {
  it.only("should return a 'KeyEntryStorage' object", () => {
    const keyEntryStorage = createExpoKeyEntryStorage();
    expect(keyEntryStorage).toBeInstanceOf(KeyEntryStorage);
  });
});
