// pages/api/get-coordinates.js
export default async function handler(req:any, res: any) {
    const { address } = req.query;
  
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return res.status(200).json({ lat, lng });
      } else {
        return res.status(400).json({ error: 'No se pudo obtener la ubicación' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error en la solicitud' });
    }
  }
  