const termsLink = document.getElementById("terms-and-conditions");
const dialog = document.querySelector("dialog");
const closeButton = dialog.querySelector("button");

termsLink.addEventListener("click", (event) => {
  event.preventDefault();
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});
