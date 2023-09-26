import { baseUrl } from '../constants.js';

const getFetchLocation = async (token, { lat, lng, serviceType }) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${baseUrl}/ObtenerUbicacionesTop?lat=${lat}&lng=${lng}&tipos=${serviceType}&top=5`,
    requestOptions
  );

  const result = await response.json();

  if (response.ok) return result.Table;

  throw new Error('Error al cargar el servicio ObtenerUbicacionesTop');
};

const getToken = async () => {
  const response = await fetch(`${baseUrl}/ObtenerToken`);

  const result = await response.json();

  if (response.ok) return result[0];

  throw new Error('Error al cargar el servicio ObtenerToken');
};

const getUbicacionesTop = async ({ lat, lng, serviceType }) => {
  const token = await getToken();

  if (!token) return;

  try {
    const result = await getFetchLocation(token, { lat, lng, serviceType });
    return result;
  } catch (error) {
    throw new Error(`Error al cargar el servicio getUbicacionesTop: ${error}`);
  }
};

const getAllServices = async ({ lat, lng }) => {
  const token = await getToken();

  if (!token) return;

  try {
    const responses = await Promise.all([
      await getFetchLocation(token, { lat, lng, serviceType: 1 }),
      await getFetchLocation(token, { lat, lng, serviceType: 2 }),
      await getFetchLocation(token, { lat, lng, serviceType: 3 }),
    ]);

    return responses.flat();
  } catch (error) {
    throw new Error(`Error al cargar el servicio getAllServices: ${error}`);
  }
};

export { getUbicacionesTop, getAllServices };
