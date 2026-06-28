const toastTimers = new WeakMap();

export function setHelperText(helper, message) {
  helper.textContent = message;
  helper.classList.toggle("helper--visible", message !== "");
}

export function showToast(toast, duration = 2000) {
  window.clearTimeout(toastTimers.get(toast));
  toast.classList.add("toast--visible");

  const timer = window.setTimeout(function() {
    toast.classList.remove("toast--visible");
  }, duration);

  toastTimers.set(toast, timer);
}

export function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add("modal-open");
}

export function closeDialog(dialog, returnValue = "cancel") {
  dialog.close(returnValue);
}
