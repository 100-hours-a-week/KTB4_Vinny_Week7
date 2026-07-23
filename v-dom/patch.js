import { updateProps } from "./props.js";
import { createDOMNode } from "./render.js";
import { isTextValue, isVNode } from "./vnode.js";

function isKeyedVNode(node) {
  return (
    typeof node === "object" &&
    node !== null &&
    node.key !== null &&
    node.key !== undefined
  );
}

function hasUniqueVNodeKeys(children) {
  const keys = children.map((child) => child.key);
  return new Set(keys).size === keys.length;
}

function patchIndexedChildren(
  parentElement,
  nextChildren,
  previousChildren
) {
  const commonLength = Math.min(
    nextChildren.length,
    previousChildren.length
  );

  for (let index = 0; index < commonLength; index += 1) {
    patch(
      parentElement,
      nextChildren[index],
      previousChildren[index],
      index
    );
  }

  for (
    let index = commonLength;
    index < nextChildren.length;
    index += 1
  ) {
    patch(parentElement, nextChildren[index], null, index);
  }

  for (
    let index = previousChildren.length - 1;
    index >= nextChildren.length;
    index -= 1
  ) {
    patch(parentElement, null, previousChildren[index], index);
  }
}

function patchKeyedChildren(
  parentElement,
  nextChildren,
  previousChildren
) {
  const previousEntriesByKey = new Map();

  previousChildren.forEach((child, index) => {
    previousEntriesByKey.set(child.key, {
      vNode: child,
      domNode: parentElement.childNodes[index]
    });
  });

  const reusedKeys = new Set();

  nextChildren.forEach((nextChild, index) => {
    const previousEntry = previousEntriesByKey.get(nextChild.key);

    if (previousEntry) {
      const domNodeAtIndex = parentElement.childNodes[index] || null;

      if (previousEntry.domNode !== domNodeAtIndex) {
        parentElement.insertBefore(previousEntry.domNode, domNodeAtIndex);
      }

      patch(parentElement, nextChild, previousEntry.vNode, index);
      reusedKeys.add(nextChild.key);
      return;
    }

    patch(parentElement, nextChild, null, index);
  });

  for (const [key, previousEntry] of previousEntriesByKey) {
    if (reusedKeys.has(key)) continue;

    if (previousEntry.domNode.parentNode === parentElement) {
      parentElement.removeChild(previousEntry.domNode);
    }
  }
}

function patchChildren(
  parentElement,
  nextChildren,
  previousChildren
) {
  const allChildren = [...nextChildren, ...previousChildren];
  const isKeyedList = (
    allChildren.length > 0 &&
    allChildren.every(isKeyedVNode) &&
    hasUniqueVNodeKeys(nextChildren) &&
    hasUniqueVNodeKeys(previousChildren)
  );

  if (isKeyedList) {
    patchKeyedChildren(parentElement, nextChildren, previousChildren);
    return;
  }

  patchIndexedChildren(parentElement, nextChildren, previousChildren);
}

export function patch(parentElement, nextNode, previousNode, index = 0) {
  if (!(parentElement instanceof Element)) {
    throw new TypeError("patch parent는 유효한 DOM Element여야 한다.");
  }

  if (previousNode == null && nextNode == null) {
    return;
  }

  if (previousNode != null && nextNode == null) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (previousNode == null && nextNode != null) {
    return parentElement.insertBefore(
      createDOMNode(nextNode),
      parentElement.childNodes[index] || null
    );
  }

  const nextNodeIsText = isTextValue(nextNode);
  const previousNodeIsText = isTextValue(previousNode);

  if (nextNodeIsText || previousNodeIsText) {
    if (
      nextNodeIsText &&
      previousNodeIsText &&
      nextNode === previousNode
    ) {
      return;
    }

    return parentElement.replaceChild(
      createDOMNode(nextNode),
      parentElement.childNodes[index]
    );
  }

  if (!isVNode(nextNode) || !isVNode(previousNode)) {
    throw new TypeError(
      "patch 대상은 문자열 또는 유효한 VNode여야 한다."
    );
  }

  if (nextNode.type !== previousNode.type) {
    return parentElement.replaceChild(
      createDOMNode(nextNode),
      parentElement.childNodes[index]
    );
  }

  const targetElement = parentElement.childNodes[index];

  updateProps(
    targetElement,
    nextNode.props || {},
    previousNode.props || {}
  );

  patchChildren(
    targetElement,
    nextNode.children,
    previousNode.children
  );
}
