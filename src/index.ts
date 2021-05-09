import * as jsx from 'acorn-jsx';
import { Parser } from 'acorn';
import { Code } from 'mdast';
import { Plugin, Transformer } from 'unified';
import * as visit from 'unist-util-visit';

const parser = Parser.extend(jsx());

export const transformer: Transformer = (ast) => {
  visit<Code>(ast, 'code', (node, index, parent) => {
    if (!node.meta) {
      return;
    }
    const code = JSON.stringify(`${node.value}\n`);
    const codeProps = node.lang ? `className="language-${node.lang}"` : '';
    const value = `<pre ${node.meta}><code ${codeProps}>{${code}}</code></pre>`;
    const estree = parser.parse(value, { ecmaVersion: 'latest' });
    parent!.children[index] = { type: 'mdxFlowExpression', value, data: { estree } };
  });
};

/**
 * A markdown plugin for transforming code metadata.
 *
 * @returns A unified transformer.
 */
export const remarkMdxCodeMeta: Plugin<[]> = () => transformer;
