let toastTimer;

export function setHelperText(helper, message) {
  helper.textContent = message;
  helper.classList.toggle("helper--visible", message !== "");
}

export function showToast(toast, duration = 2000) {
  window.clearTimeout(toastTimer);
  toast.classList.add("toast--visible");

  toastTimer = window.setTimeout(function() {
    toast.classList.remove("toast--visible");
  }, duration);
}

export function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add("modal-open");
}

export function closeDialog(dialog, returnValue = "cancel") {
  dialog.close(returnValue);
}
