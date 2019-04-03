export class VirgilKeyStorageRnError extends Error {
  name: string;
  constructor(m: string, name: string = 'VirgilError') {
    super(m);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
  }
}

export class KeyEntryAlreadyExistsError extends VirgilKeyStorageRnError {
  constructor(name?: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with same name'}already exists`,
      'KeyEntryAlreadyExistsError',
    );
  }
}

export class KeyEntryDoesNotExistError extends VirgilKeyStorageRnError {
  constructor(name: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with the given name'} does not exist.`,
      'KeyEntryDoesNotExistError',
    );
  }
}
