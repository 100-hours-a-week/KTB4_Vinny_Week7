function isEvent(name) {
  return name.startsWith("on");
}

function isDomProperty(name) {
  return [
    "value",
    "checked",
    "disabled",
    "required",
    "noValidate",
    "readOnly",
    "multiple",
    "selected"
  ].includes(name);
}

function getEventName(name) {
  return name.slice(2).toLowerCase();
}

export function updateProps(element, nextProps, previousProps) {
  for (const [name, previousValue] of Object.entries(previousProps)) {
    if (!isEvent(name)) continue;

    if (nextProps[name] === previousValue) continue;

    element.removeEventListener(getEventName(name), previousValue);
  }

  for (const name of Object.keys(previousProps)) {
    if (nextProps[name] !== undefined) continue;

    if (isEvent(name)) continue;

    if (isDomProperty(name)) {
      element[name] = typeof previousProps[name] === "boolean" ? false : "";
      continue;
    }

    element.removeAttribute(name);
  }

  for (const [name, value] of Object.entries(nextProps)) {
    if (previousProps[name] === value) continue;

    if (isEvent(name)) {
      if (typeof value === "function") {
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

    element.setAttribute(name, value === true ? "" : value);
  }
}
