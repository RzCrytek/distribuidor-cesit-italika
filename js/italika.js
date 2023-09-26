import './components/modals/services.js';

const init = async () => {
  const containerBranchesMap = document.querySelector('.container-branches-map');
  const filterButtons = document.querySelectorAll('.filter-buttons button');
  const viewTypeFilterButton = document.querySelectorAll('.view-type .btn-icon');
  const inputAutocompleteSearch = document.getElementById('input-autocomplete-search');
  var scrollToTopBtn = document.getElementById('btn-back-to-top');
  const media767 = window.matchMedia('(max-width: 767px)').matches;

  viewTypeFilterButton.forEach((buttonViewType) => {
    buttonViewType.addEventListener('click', (e) => {
      const el = e.currentTarget;
      const isList = buttonViewType.classList.contains('list');

      viewTypeFilterButton.forEach((element) => element.classList.remove('active'));

      el.classList.add('active');

      if (isList) {
        containerBranchesMap.classList.add('show-list-type');
      } else {
        containerBranchesMap.classList.remove('show-list-type');
      }
    });
  });

  document.getElementById('btn-icon-search').addEventListener('click', () => {
    inputAutocompleteSearch.focus();
  });

  inputAutocompleteSearch.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      inputAutocompleteSearch.blur();
      inputAutocompleteSearch.focus();

      setTimeout(() => {}, 500);
    }
  });

  const smoothToScroll = () => {
    const scrollableHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var ratio = 0.5;

    if (currentScroll / scrollableHeight > ratio) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  };

  if (media767) {
    document.addEventListener('scroll', smoothToScroll);
    scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};

window.addEventListener('DOMContentLoaded', () => {
  init();
});
