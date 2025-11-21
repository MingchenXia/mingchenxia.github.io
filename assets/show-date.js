document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  const formatted = now.toLocaleDateString('en-US', options);

  const dateDiv = document.getElementById('current-date');
  if (dateDiv) {
    dateDiv.textContent = `I have not received the reimbursement for the lunch before this talk until ${formatted}`;
  }
});
