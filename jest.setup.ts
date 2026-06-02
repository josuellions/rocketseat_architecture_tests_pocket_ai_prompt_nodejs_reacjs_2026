import '@testing-library/jest-dom';

import { webcrypto } from 'crypto';
import { TextDecoder, TextEncoder } from 'util';

Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
});

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: () => ({ refresh: jest.fn() }),
}));

expect.extend({});
