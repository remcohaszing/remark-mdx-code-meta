import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { compile } from '@mdx-js/mdx';
import prettier from 'prettier';
import { toVFile } from 'to-vfile';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

import remarkMdxCodeMeta from './index.js';

const tests = await readdir('__fixtures__');

for (const name of tests) {
  test(name, async () => {
    const path = join('__fixtures__', name);
    let input;
    try {
      input = await toVFile.read(join(path, 'input.mdx'));
    } catch {
      input = await toVFile.read(join(path, 'input.md'));
    }
    const expected = join(path, 'expected.jsx');
    const result = await compile(input, {
      remarkPlugins: [remarkMdxCodeMeta],
      jsx: true,
    });
    const formatted = prettier.format(String(result), { parser: 'babel' });
    if (process.argv.includes('--write')) {
      await writeFile(expected, formatted);
    }
    equal(formatted, await readFile(expected, 'utf8'));
  });
}

test.run();
