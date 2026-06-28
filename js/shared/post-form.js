import { getPostError } from "../utils/validation.js";
import { setHelperText } from "../utils/ui.js";

export function setupPostForm({
  form,
  titleInput,
  contentInput,
  helper,
  submitButton,
  onSubmit
}) {
  function getError() {
    return getPostError(titleInput.value, contentInput.value);
  }

  function validate() {
    const error = getError();
    setHelperText(helper, error);
    return error === "";
  }

  function updateButtonState() {
    submitButton.disabled = getError() !== "";
  }

  titleInput.addEventListener("blur", validate);
  contentInput.addEventListener("blur", validate);

  [titleInput, contentInput].forEach(function(input) {
    input.addEventListener("input", updateButtonState);
  });

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const isValid = validate();
    updateButtonState();

    if (isValid) {
      submitButton.disabled = true;

      try {
        await onSubmit();
      } finally {
        updateButtonState();
      }
    }
  });

  updateButtonState();

  return {
    updateButtonState,
    validate
  };
}
