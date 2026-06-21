import { readFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { splitbraille } from './brailleParser';
import { describe, it, expect } from 'vitest';

const testDir = path.resolve(__dirname, '../../test_files');
const privateDir = path.join(testDir, 'private');

const sampleFiles: { name: string; path: string }[] = [];

// test_files 直下のファイルをスキャン
if (existsSync(testDir)) {
  readdirSync(testDir).forEach((f) => {
    if (/\.(brf|brl|bse)$/i.test(f)) {
      sampleFiles.push({ name: f, path: path.join(testDir, f) });
    }
  });
}

// test_files/private 直下のファイルをスキャン (ローカルの著作権保護サンプル用)
if (existsSync(privateDir)) {
  readdirSync(privateDir).forEach((f) => {
    if (/\.(brf|brl|bse)$/i.test(f)) {
      sampleFiles.push({ name: `private/${f}`, path: path.join(privateDir, f) });
    }
  });
}

describe('Braille sample files parsing', () => {
  for (const file of sampleFiles) {
    it(`parses ${file.name} without throwing`, () => {
      const content = readFileSync(file.path, { encoding: 'utf8' });
      expect(() => splitbraille(content)).not.toThrow();
    });
  }
});
