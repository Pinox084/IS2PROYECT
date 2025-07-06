import { Box, Typography, Avatar, Paper, useTheme } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { getWeatherIconUrl } from '../../services/weatherservice';
import { getActividadesUsuario } from '../../services/actividadService';
import { UserContext } from '../../context/UserContext';
import { esClimaCompatibleConPerfil, generarMensajeActividadClima } from '../../utils/mensajesActividadClima';
import { getEmojiActividad } from '../../utils/actividadesConEmoji';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { generarRecomendacionExtendida } from '../../utils/recomendacionesClima';
import axios from 'axios';

const DayWeatherDetails = ({ dayWeather }) => {
  const [selectedWeather, setSelectedWeather] = useState(dayWeather.weathers[0]);
  const [actividadesUsuario, setActividadesUsuario] = useState([]);
  const [perfilesUsuario, setPerfilesUsuario] = useState([]);
  const theme = useTheme();
  const { userData } = useContext(UserContext);
  const rut_usuario = userData?.rut;
  const isGuest = userData?.isGuest;
  const [loadingActividades, setLoadingActividades] = useState(false);

  useEffect(() => {
    setSelectedWeather(dayWeather.weathers[0]);
  }, [dayWeather]);

  useEffect(() => {
    if (!rut_usuario) return;

    setLoadingActividades(true);

    Promise.all([
      getActividadesUsuario(rut_usuario),
      axios.get(`http://localhost:4000/api/perfiles?rut_usuario=${rut_usuario}`)
    ])
      .then(([actividadesRes, perfilesRes]) => {
        const actividades = actividadesRes.actividades || actividadesRes;
        const perfiles = perfilesRes.data || [];

        const actividadesFormateadas = actividades.map((a) => ({
          nombre: a.nombre,
          dias: a.dia || []
        }));

        setActividadesUsuario(actividadesFormateadas);
        setPerfilesUsuario(perfiles);
      })
      .catch((err) => {
        console.error("❌ Error al obtener datos del usuario:", err);
        setActividadesUsuario([]);
        setPerfilesUsuario([]);
      })
      .finally(() => {
        setLoadingActividades(false);
      });
  }, [rut_usuario]);

  const changeWeather = (dt) => {
    setSelectedWeather(dayWeather.weathers.find((weather) => weather.dt === dt));
  };

  const abreviaturas = {
    'LUN': 'Lunes', 'MAR': 'Martes', 'MIÉ': 'Miércoles', 'MIE': 'Miércoles',
    'JUE': 'Jueves', 'VIE': 'Viernes', 'SÁB': 'Sábado', 'SAB': 'Sábado', 'DOM': 'Domingo'
  };

  const diaActualCompleto = abreviaturas[dayWeather.day_txt.toUpperCase().slice(0, 3)] || dayWeather.day_txt;

  const actividadDelDia = actividadesUsuario.find((a) =>
    a.dias.some((d) => d.toLowerCase() === diaActualCompleto.toLowerCase())
  );

  const actividadesAlternativas = actividadesUsuario.filter(
    (a) => {
      const perfil = perfilesUsuario.find(p => p.actividad?.nombre === a.nombre);
      const yaAsignadaHoy = a.nombre === actividadDelDia?.nombre || a.dias.some(d => d.toLowerCase() === diaActualCompleto.toLowerCase());
      return !yaAsignadaHoy && (
        perfil
          ? esClimaCompatibleConPerfil(perfil, selectedWeather)
          : esClimaCompatible(a.nombre, selectedWeather)
      );
    }
  );

  const tieneTemperaturaExtrema = (temp) => temp < 5 || temp > 15;

  return (
    <Paper sx={{ background: 'white', borderRadius: 3, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
      {/* encabezado y clima actual */}
      <Box sx={{ p: 3, background: 'linear-gradient(to right, #1a73e8, #4285f4)', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {dayWeather.dt_day_formatted_long}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 3 }}>
          <img src={getWeatherIconUrl(selectedWeather.icon)} alt={selectedWeather.condition} style={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 300, lineHeight: 1 }}>
              {selectedWeather.temp + '°C'}
            </Typography>
            <Typography variant="body1">
              {selectedWeather.description[0].toUpperCase() + selectedWeather.description.slice(1)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* carrusel por hora */}
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, p: 2, borderBottom: '1px solid #e0e0e0' }}>
        {dayWeather.weathers
          .sort((a, b) => a.dt_hour.localeCompare(b.dt_hour))
          .map((weather) => (
            <Box
              key={weather.dt}
              sx={{
                minWidth: 50,
                textAlign: 'center',
                p: 1,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: selectedWeather.dt === weather.dt ? '#e8f0fe' : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
              onClick={() => changeWeather(weather.dt)}
            >
              <Typography variant="body2">{weather.dt_hour}</Typography>
              <Avatar src={getWeatherIconUrl(weather.icon)} sx={{ width: 36, height: 36, mx: 'auto', my: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {weather.temp + '°'}
              </Typography>
            </Box>
          ))}
      </Box>

      {/* datos climáticos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, p: 3 }}>
        <DetailItem icon="💧" title="Humedad" value={selectedWeather.humidity + '%'} />
        <DetailItem icon="🌬️" title="Viento" value={(selectedWeather.wind * 3.6).toFixed(0) + ' km/h'} />
        <DetailItem icon="☔" title="Precipitaciones" value={`${selectedWeather.precipitation.toFixed(1)} mm/h`} />
        <DetailItem icon="🌡️" title="Sensación" value={`${parseInt(selectedWeather.feels_like)}°C`} />
      </Box>

      {/* advertencia por temperatura extrema */}
      {tieneTemperaturaExtrema(selectedWeather.temp) && (
        <Box sx={{
          p: 3,
          bgcolor: selectedWeather.temp < 5 ? '#e3f2fd' : '#fff3e0',
          borderTop: '1px solid #e0e0e0',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportProblemIcon
              sx={{ color: selectedWeather.temp < 5 ? '#1565c0' : '#f57c00', fontSize: 20 }}
            />
            <Typography variant="body2" sx={{
              fontWeight: 600,
              color: selectedWeather.temp < 5 ? '#0d47a1' : '#5d4037',
            }}>
              {selectedWeather.temp < 5 ? '🧊' : '🔥'} ¡Precaución! temperatura extrema
            </Typography>
          </Box>
        </Box>
      )}

      {/* actividad principal */}
      {!isGuest && (
        <Box sx={{ p: 3, bgcolor: '#f1f3f4', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Actividad asignada para hoy
          </Typography>
          {loadingActividades ? (
            <Typography variant="body2" color="text.secondary">Cargando actividades...</Typography>
          ) : actividadDelDia ? (
            <Typography variant="body1">
              {
generarMensajeActividadClima(
  actividadDelDia.nombre,
  selectedWeather,
  perfilesUsuario.find(p => p.actividad?.nombre === actividadDelDia.nombre)
)

              }
            </Typography>
          ) : (
            <Typography variant="body1">No tienes actividades asignadas específicamente para este día.</Typography>
          )}
        </Box>
      )}

      {/* sugerencias alternativas */}
      {!isGuest && (
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Otras actividades que podrías hacer en este horario
          </Typography>
          {loadingActividades ? (
            <Typography variant="body2" color="text.secondary">Cargando actividades...</Typography>
          ) : actividadesAlternativas.length > 0 ? (
            <Box sx={{
              display: 'flex', overflowX: 'auto', gap: 1, py: 1, maxWidth: '100%',
              '&::-webkit-scrollbar': { height: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 2 }
            }}>
              {actividadesAlternativas.map((act, i) => (
                <Box key={i} sx={{
                  px: 2, py: 1, bgcolor: '#ffffff', borderRadius: 2,
                  border: '1px solid #ccc', whiteSpace: 'nowrap',
                  boxShadow: 1, fontSize: '0.85rem', fontWeight: 500
                }}>
                  {getEmojiActividad(act.nombre)} {act.nombre}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">No hay otras actividades compatibles con el clima actual.</Typography>
          )}
        </Box>
      )}

      {/* recomendación extendida */}
      <Box sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #e0e0e0' }}>
        {loadingActividades ? (
          <Typography variant="body2" color="text.secondary">Cargando recomendación...</Typography>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {generarRecomendacionExtendida(selectedWeather)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

const DetailItem = ({ icon, title, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography sx={{ fontSize: '1.5rem' }}>{icon}</Typography>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  </Box>
);

export default DayWeatherDetails;