export class VirgilKeyStorageRnError extends Error {
  name: string;
  constructor(
    m: string,
    name: string = 'VirgilError',
    // tslint:disable-next-line variable-name
    DerivedClass: any = VirgilKeyStorageRnError,
  ) {
    super(m);
    Object.setPrototypeOf(this, DerivedClass.prototype);
    this.name = name;
  }
}

export class KeyEntryAlreadyExistsError extends VirgilKeyStorageRnError {
  constructor(name?: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with same name'}already exists`,
      'KeyEntryAlreadyExistsError',
      KeyEntryAlreadyExistsError,
    );
  }
}

export class KeyEntryDoesNotExistError extends VirgilKeyStorageRnError {
  constructor(name: string) {
    super(
      `Key entry ${name ? `named ${name}` : 'with the given name'} does not exist.`,
      'KeyEntryDoesNotExistError',
      KeyEntryDoesNotExistError,
    );
  }
}
