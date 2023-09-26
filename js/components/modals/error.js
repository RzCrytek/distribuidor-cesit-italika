const dialogErrorModal = document.getElementById('dialog-error-modal');
const dialogErrorModalClose = document.querySelectorAll('.dialog-error-close');
const dialogErrorModalTitle = document.querySelector('.dialog-error-title');
const dialogErrorModalDescription = document.querySelector('.dialog-error-description');

dialogErrorModalClose.forEach((dialogClose) => {
  dialogClose.addEventListener('click', () => dialogErrorModal.close());
});

export { dialogErrorModal, dialogErrorModalClose, dialogErrorModalTitle, dialogErrorModalDescription };
