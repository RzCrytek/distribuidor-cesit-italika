const dialogServices = document.getElementById('dialog-services');
const openModalServices = document.getElementById('open-modal-services');
const closeDialogServices = document.querySelectorAll('.close-dialog-services');
const media600 = window.matchMedia('(max-width: 600px)').matches;

const modalServicesSlick = () => {
  $('.slider-services').slick({
    centerMode: true,
    centerPadding: '44px',
    slidesToShow: 1,
    customPaging: '20px',
    arrows: false,
    dots: false,
  });
};

openModalServices.addEventListener('click', () => {
  dialogServices.showModal();

  if (media600) modalServicesSlick();
});

closeDialogServices.forEach((closeDialog) => {
  closeDialog.addEventListener('click', () => dialogServices.close());
});
