// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender matchers de jest-dom
expect.extend(matchers);

// Limpiar después de cada test
afterEach(() => {
    cleanup();
});

// Mock de localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

(globalThis as any).localStorage = localStorageMock;