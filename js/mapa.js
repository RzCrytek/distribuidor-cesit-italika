import { enumServiceType } from './constants.js';
import { dialogErrorModal, dialogErrorModalDescription, dialogErrorModalTitle } from './components/modals/error.js';
import { getAllServices, getUbicacionesTop } from './components/ubicacionesTop.js';
import { renderCard } from './components/card.js';

let map,
  initLat,
  initLng,
  initZoom,
  marker,
  markerServices = [],
  infoWindow,
  infoWindowContent;
let allServiceTypeLocations = [];
const selectServices = document.getElementById('select-services');
const filterButtons = document.getElementById('filter-buttons');
const viewType = document.getElementById('view-type');
const media767 = window.matchMedia('(max-width: 767px)').matches;

const removeServiceLocationMarkers = () => {
  if (Boolean(markerServices.length)) {
    for (let i = 0; i < markerServices.length; i++) {
      markerServices[i].setMap(null);
    }
    markerServices = [];
  }
};

const getDistance = async (startPosition, locations) => {
  const service = new google.maps.DistanceMatrixService();

  const placesWithDistance = await Promise.all(
    locations.map(async (location) => {
      const request = {
        origins: [startPosition],
        destinations: [{ lat: Number(location.LATITUD), lng: Number(location.LONGITUD) }],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };

      const response = await service.getDistanceMatrix(request);
      const distanceText = response.rows[0].elements[0].distance?.text;

      return { ...location, destinationLocation: startPosition, distance: distanceText };
    })
  );

  return placesWithDistance;
};

const changePlace = (autocomplete, map) => {
  autocomplete.addListener('place_changed', function () {
    infoWindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();
    const searchResultPosition = {
      lat: null,
      lng: null,
    };

    if (!place.geometry || !place.geometry.location) {
      window.alert(`Seleccione una opción del resultado para la búsqueda: ${place.name}`);
      document.getElementById('input-autocomplete-search').blur();
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setZoom(12);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(12);
    }

    searchResultPosition.lat = place.geometry.location.lat();
    searchResultPosition.lng = place.geometry.location.lng();

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infoWindowContent.textContent = `${place.name}`;

    setMarkers(map, searchResultPosition);
  });
};

const autocompleteSearch = (map, idAutocompleteSearch) => {
  const input = document.getElementById(idAutocompleteSearch);
  const options = {
    fields: ['formatted_address', 'geometry', 'name'],
    strictBounds: false,
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.bindTo('bounds', map);

  infoWindow = new google.maps.InfoWindow();
  infoWindowContent = document.getElementById('infowindow-content');

  infoWindow.setContent(infoWindowContent);

  marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  changePlace(autocomplete, map);
};

const setMarkers = async (map, position) => {
  const selectServicesValue = selectServices.value;

  removeServiceLocationMarkers();
  showLoader();

  if (selectServicesValue) {
    filterButtons.style.display = 'none';
    viewType.style.display = 'none';

    allServiceTypeLocations = await getUbicacionesTop({ ...position, serviceType: selectServicesValue });

    viewType.style.display = 'block';
  } else {
    allServiceTypeLocations = await getAllServices(position);

    filterButtons.style.display = 'flex';
    viewType.style.display = 'block';
  }

  allServiceTypeLocations = await getDistance(position, allServiceTypeLocations);

  renderMarkers(allServiceTypeLocations, map);
  filterTabsButton(allServiceTypeLocations);

  hideLoader();
};

const renderMarkers = async (allLocations, map) => {
  const image = (iconName) => ({
    url: `/icons/points/${iconName}.png`,
    size: new google.maps.Size(47, 70),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 70),
  });

  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly',
  };

  allLocations.forEach((item) => {
    const marker = new google.maps.Marker({
      position: { lat: Number(item.LATITUD), lng: Number(item.LONGITUD) },
      map,
      icon: image(enumServiceType[item.CAPAINFORMACION]),
      shape: shape,
      title: item.NOMBRE,
    });

    markerServices.push(marker);

    marker.addListener('click', function () {
      infoWindowContent.textContent = `${item.NOMBRE}`;
      infoWindow.open(map, marker);

      const searchHeight = 180;
      const dataRef = `${item.IDSUCURSAL}-${item.LATITUD}-${item.LONGITUD}`;
      const cardPosition = document.querySelector(`[data-ref="${dataRef}"]`).offsetTop;

      if (media767) {
        window.scrollTo({ top: cardPosition - 16, behavior: 'smooth' });
      } else {
        document.querySelector('.content-search-engine').scrollTop = cardPosition - searchHeight;
      }
    });
  });

  document.querySelector('#search-result').innerHTML = await renderCard(allLocations);
};

const showErrorModal = (errorInfo) => {
  dialogErrorModalTitle.innerHTML = errorInfo.title;
  dialogErrorModalDescription.innerHTML = errorInfo.description;

  dialogErrorModal.showModal();
};

const handleLocationError = (browserHasGeolocation) => {
  const error = {
    title: 'Error en servicio de geolocalización',
    description: '',
  };

  if (browserHasGeolocation) {
    error.description =
      'Ocurrió un error al tratar de obtener tu ubicación. Valida que la ubicación de tu dispositivo este activa.';
  } else {
    error.description = 'Su navegador no soporta geolocalización.';
  }

  showErrorModal(error);
};

const getCurrentLocation = () => {
  showLoader();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        marker = new google.maps.Marker({
          position: pos,
          map,
        });

        setMarkers(map, pos);

        map.panTo(pos);
        map.setZoom(12);
      },
      () => {
        hideLoader();
        console.log('error');
        document.getElementById('not-yet-searched').style.display = 'block';
      }
    );
  } else {
    hideLoader();
    handleLocationError(false);
  }
};

const filterTabsButton = (allServiceTypeLocations) => {
  if (selectServices.value) return;

  let locationsFilteredByService;
  const filterButtons = document.querySelectorAll('.filter-buttons button');

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', (e) => {
      const el = e.currentTarget;
      const dataFilter = el.dataset.filter;

      if (el.classList.contains('active')) {
        el.classList.remove('active');
        locationsFilteredByService = allServiceTypeLocations;
      } else {
        filterButtons.forEach((element) => element.classList.remove('active'));
        el.classList.add('active');

        locationsFilteredByService = allServiceTypeLocations.filter(
          (location) => enumServiceType[location.CAPAINFORMACION] === dataFilter
        );
      }

      removeServiceLocationMarkers();
      renderMarkers(locationsFilteredByService, map);
    });
  });
};

const showLoader = () => (document.getElementById('distributor-loader').style.display = 'flex');

const hideLoader = () => (document.getElementById('distributor-loader').style.display = 'none');

function initMap() {
  initLat = 19.4328716;
  initLng = -99.1333887;
  initZoom = 4;

  const limitsMexico = {
    north: 36,
    south: 5,
    west: -130,
    east: -75,
  };

  const mapConfig = {
    zoom: initZoom,
    // restriction: {
    //   latLngBounds: limitsMexico,
    //   strictBounds: false,
    // },
    center: { lat: initLat, lng: initLng },
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
  };

  map = new google.maps.Map(document.getElementById('map'), mapConfig);

  if (media767) {
    map = new google.maps.Map(document.getElementById('map-responsive'), mapConfig);
  }

  infoWindow = new google.maps.InfoWindow();

  getCurrentLocation();
  autocompleteSearch(map, 'input-autocomplete-search');
}

window.initMap = initMap;
