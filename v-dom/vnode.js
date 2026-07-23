export function isTextValue(value) {
  return typeof value === "string";
}

export function isVNode(node) {
  return (
    typeof node === "object" &&
    node !== null &&
    typeof node.type === "string" &&
    node.type.length > 0 &&
    typeof node.props === "object" &&
    node.props !== null &&
    Array.isArray(node.children)
  );
}

export function createVNode(type, props, ...children) {
  const normalizedProps = props || {};
  const { key, ...domProps } = normalizedProps;
  const normalizedChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        typeof child !== "boolean"
    )
    .map((child) => typeof child === "number" ? String(child) : child);

  return {
    type,
    key,
    props: domProps,
    children: normalizedChildren
  };
}
