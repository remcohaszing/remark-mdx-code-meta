import { Parser } from 'acorn';
import jsx from 'acorn-jsx';
import { BaseNode, Program } from 'estree';
import { Code, Parent, Root } from 'mdast';
import { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';

const parser = Parser.extend(jsx());

const transformer: Transformer<Root> = (ast) => {
  visit(ast, 'code', (node: Code, index: number | null, parent: Parent | null) => {
    if (!node.meta) {
      return;
    }
    const code = JSON.stringify(`${node.value}\n`);
    const codeProps = node.lang ? `className="language-${node.lang}"` : '';
    const value = `<pre ${node.meta}><code ${codeProps}>{${code}}</code></pre>`;
    const estree = parser.parse(value, { ecmaVersion: 'latest' }) as BaseNode as Program;
    parent!.children[index!] = {
      type: 'mdxFlowExpression',
      value,
      data: { estree },
    };
  });
};

/**
 * A markdown plugin for transforming code metadata.
 *
 * @returns A unified transformer.
 */
const remarkMdxCodeMeta: Plugin<[], Root> = () => transformer;

export default remarkMdxCodeMeta;
