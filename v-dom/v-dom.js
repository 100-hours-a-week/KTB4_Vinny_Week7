function isTextValue(value) {
  return typeof value === 'string';
}

function isVNode(node) {
  return (
    typeof node === 'object' &&
    node !== null &&
    typeof node.type === 'string' &&
    node.type.length > 0 &&
    typeof node.props === 'object' &&
    node.props !== null &&
    Array.isArray(node.children)
  );
}

export function createVNode(type, props, ...children) {
  const normalizedProps = props || {}; 

  const { key, ...domProps } = normalizedProps;

  const normalizedChildren = children.flat(Infinity)
    .filter((child) => child !== null && child !== undefined && typeof child !== "boolean")
    .map((child) => typeof child === "number" ? String(child) : child);
  
  return {
    type,
    key,
    props: domProps,
    children: normalizedChildren
  };
}

function createDOMNode(node) {
  if (isTextValue(node)) {
    return document.createTextNode(node);
  }

  if (!isVNode(node)) {
    throw new TypeError(
      '렌더링할 node는 문자열 또는 유효한 VNode여야 합니다.'
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

export function patch(parentElement, nextNode, prevNode, index = 0) {
  if (!(parentElement instanceof Element)) {
    throw new TypeError("patch parent는 유효한 DOM Element여야 한다.");
  }

  if (prevNode == null && nextNode == null) {
    return;
  }

  if (prevNode != null && nextNode == null) {
    return parentElement.removeChild(parentElement.childNodes[index]);
  }

  if (prevNode == null && nextNode != null) {
    return parentElement.insertBefore(
      createDOMNode(nextNode),
      parentElement.childNodes[index] || null
    );
  }

  const nextNodeIsText = isTextValue(nextNode);
  const prevNodeIsText = isTextValue(prevNode);

  if (nextNodeIsText || prevNodeIsText) {
    if (nextNodeIsText && prevNodeIsText && nextNode === prevNode) {
      return;
    }

    return parentElement.replaceChild(
      createDOMNode(nextNode),
      parentElement.childNodes[index]
    );
  }

  if (!isVNode(nextNode) || !isVNode(prevNode)) {
    throw new TypeError(
      "patch 대상은 문자열 또는 유효한 VNode여야 한다."
    );
  }
  
  if (nextNode.type !== prevNode.type) {
    return parentElement.replaceChild(
      createDOMNode(nextNode),
      parentElement.childNodes[index]
    );
  }

  updateProps(
    parentElement.childNodes[index],
    nextNode.props || {},
    prevNode.props || {}
  );

  patchChildren(
    parentElement.childNodes[index],
    nextNode.children,
    prevNode.children
  );
}

function isKeyedVNode(node) {
  return (
    typeof node === 'object' &&
    node !== null &&
    node.key !== null &&
    node.key !== undefined
  );
}

function hasUniqueVNodeKeys(children) {
  const keys = children.map((child) => child.key);
  return new Set(keys).size === keys.length;
}

function patchChildren(parentElement, nextChildren, previousChildren) {
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

function patchIndexedChildren(parentElement, nextChildren, previousChildren) {
  const commonLength = Math.min(
    nextChildren.length,
    previousChildren.length
  );

  for (let i = 0; i < commonLength; i++) {
    patch(parentElement, nextChildren[i], previousChildren[i], i);
  }

  for (let i = commonLength; i < nextChildren.length; i++) {
    patch(parentElement, nextChildren[i], null, i);
  }

  for (let i = previousChildren.length - 1; i >= nextChildren.length; i--) {
    patch(parentElement, null, previousChildren[i], i);
  }
}

function patchKeyedChildren(parentElement, nextChildren, previousChildren) {
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

function updateProps(element, nextProps, previousProps) {
  const isEvent = (name) => name.startsWith('on');

  const isDomProperty = (name) => [
    'value',
    'checked',
    'disabled',
    'required',
    'noValidate',
    'readOnly',
    'multiple',
    'selected'
  ].includes(name);

  const getEventName = (name) => name.slice(2).toLowerCase();

  for (const [name, previousValue] of Object.entries(previousProps)) {
    if (!isEvent(name)) continue;

    if (nextProps[name] === previousValue) continue;

    element.removeEventListener(getEventName(name), previousValue);
  }

  for (const name of Object.keys(previousProps)) {
    if (nextProps[name] !== undefined) continue;

    if (isEvent(name)) continue;

    if (isDomProperty(name)) {
      element[name] = typeof previousProps[name] === 'boolean' ? false : '';
      continue;
    }

    element.removeAttribute(name);
  }

  for (const [name, value] of Object.entries(nextProps)) {
    if (previousProps[name] === value) continue;

    if (isEvent(name)) {
      if (typeof value === 'function') {
        element.addEventListener(getEventName(name), value);
      }
      continue;
    }

    if (isDomProperty(name)) {
      element[name] = value;
      continue;
    }

    if (value === false || value === null || value === undefined) {
      element.removeAttribute(name);
      continue;
    }

    element.setAttribute(name, value === true ? '' : value);
  }
}
