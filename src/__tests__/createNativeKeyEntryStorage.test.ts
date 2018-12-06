import createNativeKeyEntryStorage from '../createNativeKeyEntryStorage';
import KeyEntryStorage from '../KeyEntryStorage';

jest.mock('../NativeStorage', () => ({
  default: jest.fn(),
}));

describe('createNativeKeyEntryStorage', () => {
  it("should return a 'KeyEntryStorage' object", () => {
    const keyEntryStorage = createNativeKeyEntryStorage();
    expect(keyEntryStorage).toBeInstanceOf(KeyEntryStorage);
  });
});
