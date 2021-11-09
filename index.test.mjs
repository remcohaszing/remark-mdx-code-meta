import { promises as fs, readdirSync } from 'fs';
import { createRequire } from 'module';
import { join } from 'path';

import { compile } from '@mdx-js/mdx';
import prettier from 'prettier';
import test from 'tape';
import { toVFile } from 'to-vfile';

const { remarkMdxCodeMeta } = createRequire(import.meta.url)('./src/index.ts');

const tests = readdirSync('__fixtures__');

for (const name of tests) {
  test(name, async (t) => {
    const path = join('__fixtures__', name);
    let input;
    try {
      input = await toVFile.read(join(path, 'input.mdx'));
    } catch {
      input = await toVFile.read(join(path, 'input.md'));
    }
    const expected = join(path, 'expected.jsx');
    const { value } = await compile(input, {
      remarkPlugins: [remarkMdxCodeMeta],
      jsx: true,
    });
    const formatted = prettier.format(value, { parser: 'babel' });
    if (process.argv.includes('--write')) {
      await fs.writeFile(expected, formatted);
    }
    t.equal(formatted, await fs.readFile(expected, 'utf8'));
    t.end();
  });
}
