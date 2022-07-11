# remark-mdx-code-meta

[![github actions](https://github.com/remcohaszing/remark-mdx-code-meta/actions/workflows/ci.yml/badge.svg)](https://github.com/remcohaszing/remark-mdx-code-meta/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/remark-mdx-code-meta)](https://www.npmjs.com/package/remark-mdx-code-meta)
[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![codecov](https://codecov.io/gh/remcohaszing/remark-mdx-code-meta/branch/main/graph/badge.svg)](https://codecov.io/gh/remcohaszing/remark-mdx-code-meta)

A [remark](https://remark.js.org) MDX plugin for using markdown code block metadata

## Installation

```sh
npm install remark-mdx-code-meta
```

## Usage

This plugin interprets markdown code block metadata as JSX props.

For example, given a file named `example.mdx` with the following contents:

````markdown
```js copy filename="awesome.js" onUsage={props.beAwesome} {...props}
console.log('Everything is awesome!');
```
````

The following script:

```js
import { readFileSync } from 'fs';

import { remarkMdxCodeMeta } from 'remark-mdx-code-meta';
import { compileSync } from 'xdm';

const { contents } = compileSync(readFileSync('example.mdx'), {
  jsx: true,
  remarkPlugins: [remarkMdxCodeMeta],
});
console.log(contents);
```

Roughly yields:

```jsx
export default function MDXContent(props) {
  return (
    <pre copy filename="awesome.js" onUsage={props.beAwesome} {...props}>
      <code className="language-js">{"console.log('Everything is awesome!');\n"}</code>
    </pre>
  );
}
```

Of course the `<pre />` element doesn’t support those custom props. Use custom [components][] to
give the props meaning.

### License

[MIT](LICENSE.md) @ [Remco Haszing](https://github.com/remcohaszing)
