import { updateProps } from "./props.js";
import { isTextValue, isVNode } from "./vnode.js";

export function createDOMNode(node) {
  if (isTextValue(node)) {
    return document.createTextNode(node);
  }

  if (!isVNode(node)) {
    throw new TypeError(
      "렌더링할 node는 문자열 또는 유효한 VNode여야 합니다."
    );
  }

  const element = document.createElement(node.type);

  updateProps(element, node.props, {});

  node.children.forEach((child) => {
    element.appendChild(createDOMNode(child));
  });

  return element;
}

export function mount(node, targetElement) {
  if (!(targetElement instanceof Element)) {
    throw new TypeError("mount target은 유효한 DOM Element여야 한다.");
  }

  const domNode = createDOMNode(node);
  targetElement.replaceChildren(domNode);

  return domNode;
}
