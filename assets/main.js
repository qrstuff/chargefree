import "@popperjs/core";
import "bootstrap";

import "./styles/main.scss";

document.addEventListener("DOMContentLoaded", function () {
  function toggleFeedbackRequired() {
    const otherReason = document.querySelector(
      'input[name="reason"][value="Other"]',
    );
    const feedbackField = document.getElementById("cancel-feedback");
    feedbackField.required = otherReason.checked;
  }

  function validateForm() {
    const otherReason = document.querySelector(
      'input[name="reason"][value="Other"]',
    );
    const feedbackField = document.getElementById("cancel-feedback");
    if (otherReason.checked && feedbackField.value.trim() === "") {
      return false;
    }

    return true;
  }

  const form = document.querySelector('form[action="/cancel"]');
  if (form) {
    form.onsubmit = validateForm;
    const radioButtons = document.querySelectorAll('input[name="reason"]');
    radioButtons.forEach(function (radio) {
      radio.onclick = toggleFeedbackRequired;
    });
  }
});
