import { enumServiceType } from '../constants.js';

export const renderCard = async (locations) => {
  let HTMLCard = '';

  if (locations.length > 0) {
    document.getElementById('not-yet-searched').style.display = 'none';
  }

  locations.forEach((item) => {
    let convertedSchedule = 'Horario no disponible.';

    if (item.HORARIO) {
      let scheduleText = '';
      const schedules = item.HORARIO.replace('*;', '').replaceAll('Activo', '').trim().split(';');

      schedules.map((schedule, index) => {
        scheduleText += `${schedule.trim()}`;

        if (index + 1 !== schedules.length) scheduleText += `;<br/>`;
      });

      convertedSchedule = scheduleText;
    }

    const { lat, lng } = item.destinationLocation;
    const linkToHowToGetTo = `https://www.google.com/maps/dir/${lat},${lng}/${item.LATITUD},${item.LONGITUD}`;

    HTMLCard += `
    <div class="card" data-ref="${item.IDSUCURSAL}-${item.LATITUD}-${item.LONGITUD}">
      <div class="card-header">
        <div class="type">
          <img src="/icons/points/${enumServiceType[item.CAPAINFORMACION]}.svg" alt="${
      item.CAPAINFORMACION
    }" width="20" />
          <p class=${enumServiceType[item.CAPAINFORMACION]}>${enumServiceType[item.CAPAINFORMACION]}</p>
        </div>

        <div class="information">
          <p class="info-name">${item.NOMBRE}</p>
          <p class="info-bold">${item.distance ? item.distance : ''}</p>
        </div>

        <div class="how-to-get">
          <p class="info-bold info-number">No.${item.IDSUCURSAL}</p>

          <a class="how-to-get-btn" type="button" href=${linkToHowToGetTo} target="_blank">
            <img src="/icons/how-to-get.svg" alt="Ícono de cómo llegar" />
            <span>¿Cómo llegar?</span>
          </a>
        </div>
      </div>

      <div class="card-body">
        <div class="group">
          <p class="group-title">Información:</p>
          <div class="group-item">
            <div class="icon">
              <img src="/icons/point.svg" alt="Ícono de dirección" />
            </div>
            <p class="description">
              ${item.CALLE.trim()} ${item.NOEXT.trim()} ${item.NOINT.trim()}, ${item.COLONIA.trim()} ${item.CIUDAD.trim()} ${item.CP.trim()}, ${item.ESTADO.trim()}
            </p>
          </div>

          <div class="group-item">
            <div class="icon">
              <img src="/icons/phone.svg" alt="Ícono de teléfono" />
            </div>
            <a class="description phone" href="tel:+${item.TELEFONO}">${item.TELEFONO}</a>
          </div>

          <div class="group-item">
            <div class="icon">
              <img src="/icons/mail.svg" alt="Ícono de correo" />
            </div>
            <p class="description email">
              <a class="link" href="mailto:${item.EMAIL}">${item.EMAIL}</a>
            </p>
          </div>
        </div>

        <div class="group">
          <p class="group-title">Horarios</p>
          <div class="group-item">
            <div class="icon">
              <img src="/icons/schedule.svg" alt="Ícono de horario" />
            </div>
            <p class="description">${convertedSchedule}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  });

  document.getElementById('search-result').style.display = 'grid';

  return HTMLCard;
};
