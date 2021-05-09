/*@jsxRuntime automatic @jsxImportSource react*/
function MDXContent(props) {
  const _components = Object.assign(
      {
        pre: "pre",
        code: "code",
      },
      props.components
    ),
    { wrapper: MDXLayout } = _components;
  const _content = (
    <>
      {
        <_components.pre {...props}>
          <_components.code className="language-js">
            {"console.log('Hello World!');\n"}
          </_components.code>
        </_components.pre>
      }
    </>
  );
  return MDXLayout ? <MDXLayout {...props}>{_content}</MDXLayout> : _content;
}
export default MDXContent;
