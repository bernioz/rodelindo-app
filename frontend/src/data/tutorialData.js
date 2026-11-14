export const TUTORIAL_POR_ROL = {
  alumno: {
    badge: 'Vista Alumno / Apoderado',
    pasos: [
      {
        icono: '⚽',
        titulo: '¡Bienvenido a Rodelindo App!',
        descripcion:
          'Aquí podrás revisar tus entrenamientos, partidos, asistencia, estado de pagos y comunicados oficiales de FC Rodelindo Román Concepción.',
        tip: 'Este recorrido aparece automáticamente la primera vez que entras, pero puedes volver a abrirlo cuando quieras desde tu Perfil.',
      },
      {
        icono: '🏠',
        titulo: 'Inicio y Resumen Rápido',
        descripcion:
          'En la pestaña Inicio verás de inmediato tu porcentaje de asistencia, tus meses pagados y las próximas clases o partidos de tu categoría.',
        tip: 'Si tienes alguna mensualidad pendiente, aparecerá un aviso amarillo en la parte superior para revisarla al instante.',
      },
      {
        icono: '📅',
        titulo: 'Calendario de 3 Niveles',
        descripcion:
          'Desde Inicio puedes abrir el Calendario completo y navegar por Año, Mes o Día para conocer horarios, rivales y lugares de cada actividad.',
        tip: 'Solo verás los eventos correspondientes a tu categoría y los eventos generales del club.',
      },
      {
        icono: '🏆',
        titulo: 'Ranking y Perfiles de Compañeros',
        descripcion:
          'En la pestaña Ranking puedes ver tu posición por asistencia, filtrar entre todas las series (Sub-8 a Sub-16) y tocar a cualquier compañero para ver su ficha pública.',
        tip: 'En las fichas públicas se muestran goles, partidos y dorsal, manteniendo privados los datos de pago.',
      },
      {
        icono: '👤',
        titulo: 'Tu Perfil: Ficha Deportiva y Apoderado',
        descripcion:
          'Toca tu foto de perfil para elegir una imagen desde tu teléfono. Además, puedes alternar entre tu "Ficha Deportiva" y la "Gestión Apoderado" (pagos, matrícula y recordatorios).',
        tip: 'En Gestión Apoderado también puedes activar el modo claro o agrandar el tamaño de letra.',
      },
      {
        icono: '📰',
        titulo: 'Noticias y Galería del Club',
        descripcion:
          'Revisa los anuncios importantes en la pestaña Noticias y descarga o mira las fotos de entrenamientos y torneos en Galería.',
        tip: '¡Ya estás listo para usar la aplicación!',
      },
    ],
  },

  profesor: {
    badge: 'Vista Profesor',
    pasos: [
      {
        icono: '📋',
        titulo: 'Bienvenido al Panel del Profesor',
        descripcion:
          'Esta vista está diseñada para agilizar la gestión diaria de tus series: toma de asistencia, seguimiento deportivo de alumnos y programación de actividades.',
        tip: 'Puedes volver a abrir esta guía en cualquier momento desde la pestaña Perfil.',
      },
      {
        icono: '🏠',
        titulo: 'Inicio y Agenda del Día',
        descripcion:
          'Desde Inicio tienes accesos directos a todos tus módulos, además de la agenda de hoy y próximos eventos. Toca "+ Agregar" o cualquier evento para crearlo o editarlo.',
        tip: 'Todo evento que agregues se sincroniza automáticamente con el calendario de los alumnos de esa serie.',
      },
      {
        icono: '✅',
        titulo: 'Registro de Asistencia',
        descripcion:
          'En la pestaña Asistencia selecciona una categoría, marca a los alumnos presentes con la barra de progreso en vivo y presiona "Guardar asistencia".',
        tip: 'Puedes cambiar de fecha con las flechas superiores o tocar la fecha para abrir el calendario.',
      },
      {
        icono: '👥',
        titulo: 'Plantel y Ficha Deportiva',
        descripcion:
          'En la pestaña Alumnos filtra por categoría y entra a la ficha de cualquier jugador para sumar o restar goles y partidos, editar su dorsal o posición y revisar sus pagos.',
        tip: 'Los cambios en goles, partidos y posición se reflejan al instante en el perfil público del alumno.',
      },
      {
        icono: '📅',
        titulo: 'Calendario y Salto Rápido',
        descripcion:
          'En el Calendario puedes revisar la programación de todas las categorías por Año, Mes o Día, e ir directo a tomar asistencia desde cualquier fecha.',
        tip: 'Ideal para regularizar asistencias de entrenamientos anteriores.',
      },
      {
        icono: '🖼',
        titulo: 'Galería y Mi Perfil',
        descripcion:
          'Desde los accesos rápidos de Inicio puedes subir fotos de entrenamientos a la Galería. En Perfil puedes cambiar tu foto, configurar recordatorios y ajustar el tema visual.',
        tip: '¡Todo listo para comenzar la jornada!',
      },
    ],
  },

  admin: {
    badge: 'Panel Director · Administración',
    pasos: [
      {
        icono: '🏟️',
        titulo: 'Bienvenido al Panel de Administración',
        descripcion:
          'Desde este centro de control gestionas de forma integral los usuarios, finanzas, series deportivas y comunicaciones de FC Rodelindo Román.',
        tip: 'Si necesitas repasar alguna función, encontrarás el botón para abrir este tutorial al final de esta misma pantalla.',
      },
      {
        icono: '👥',
        titulo: 'Gestión de Usuarios',
        descripcion:
          'Administra las cuentas de Alumnos, Profesores y Administradores. Puedes buscar por nombre, filtrar por rol, registrar nuevos integrantes o editar sus datos.',
        tip: 'Al crear un alumno nuevo queda disponible inmediatamente en su categoría y en las listas de asistencia.',
      },
      {
        icono: '💳',
        titulo: 'Panel Financiero y Torneos',
        descripcion:
          'Controla el estado de matrícula y mensualidades (Marzo a Diciembre) tocando cada casilla para alternar entre pagado, pendiente o no aplica.',
        tip: 'También incluye una pestaña para crear torneos con cobro en cuotas y fechas límite de vencimiento.',
      },
      {
        icono: '⚽',
        titulo: 'Categorías y Series',
        descripcion:
          'Organiza las 5 series (Sub-8 a Sub-16): asigna o desvincula profesores a cargo de cada plantel y reasigna alumnos de categoría con un toque.',
        tip: 'Mantener las series al día ordena automáticamente los filtros de asistencia y ranking.',
      },
      {
        icono: '📢',
        titulo: 'Noticias, Galería y Eventos',
        descripcion:
          'Publica anuncios oficiales con fotografías desde tu teléfono, sube álbumes a la Galería y programa eventos en el calendario general del club.',
        tip: 'Usa la barra de búsqueda y los botones de editar (✏️) o eliminar (🗑️) para mantener el historial siempre actualizado.',
      },
    ],
  },
};