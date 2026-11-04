import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useEventos } from '../../../context/EventosContext';
import { useAlumnos } from '../../../context/AlumnosContext';
import EventoRow from '../../../components/EventoRow';
import EventoModal from '../../../components/EventoModal';
import { CATEGORIAS } from '../../../utils/eventos';

// esProfesor → puede crear/editar eventos y abrir la toma de asistencia
// categoriaAlumno / alumnoId → vista del alumno (solo lectura, ve su categoría)
export default function VistaDia({
  dia, hoy, esProfesor, categoriaAlumno, alumnoId, onTomarAsistencia,
}) {
  const { theme, fontSize } = useTheme();
  const { getEventosDia } = useEventos();
  const { alumnos, getSesion } = useAlumnos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);

  const fs = (s) => s * fontSize;
  const categoriaFiltro = esProfesor ? undefined : categoriaAlumno;
  const eventos = getEventosDia(dia, categoriaFiltro);

  const esFuturo = dia > hoy;

  // Asistencia por categoría de ese día (el profesor ve todas, el alumno la suya)
  const categoriasAsistencia = esProfesor ? CATEGORIAS : [categoriaAlumno];
  const filas = categoriasAsistencia.map((cat) => {
    const inscritos = alumnos.filter((a) => a.categoria === cat && a.fechaIngreso <= dia);
    const sesion = getSesion(cat, dia);
    const presentes = sesion ? sesion.presentes.filter((id) => inscritos.some((a) => a.id === id)).length : 0;
    return {
      cat,
      sesion,
      inscritos: inscritos.length,
      presentes,
      pct: sesion && inscritos.length > 0 ? Math.round((presentes / inscritos.length) * 100) : 0,
    };
  });

  const registradas = filas.filter((f) => f.sesion);
  const totalPresentes = registradas.reduce((s, f) => s + f.presentes, 0);
  const totalInscritos = registradas.reduce((s, f) => s + f.inscritos, 0);
  const pctTotal = totalInscritos > 0 ? Math.round((totalPresentes / totalInscritos) * 100) : 0;

  // Estado del propio alumno ese día
  const yo = alumnoId ? alumnos.find((a) => a.id === alumnoId) : null;
  const filaYo = filas[0];
  const yoAsistio =
    !esProfesor && yo && filaYo?.sesion && yo.fechaIngreso <= dia
      ? filaYo.sesion.presentes.includes(yo.id)
      : null;

  const abrirNuevo = () => { setEditando(null); setModalVisible(true); };
  const abrirEditar = (ev) => { setEditando(ev); setModalVisible(true); };

  return (
    <View>
      {/* ---- Eventos ---- */}
      <View style={styles.seccionHeader}>
        <Text style={[styles.seccion, { color: theme.textPrim, fontSize: fs(16) }]}>Eventos</Text>
        {esProfesor && (
          <TouchableOpacity onPress={abrirNuevo}>
            <Text style={{ color: theme.accent, fontSize: fs(13), fontWeight: 'bold' }}>+ Agregar</Text>
          </TouchableOpacity>
        )}
      </View>

      {eventos.length === 0 ? (
        <View style={[styles.vacio, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <Text style={{ color: theme.textMuted, fontSize: fs(13), textAlign: 'center' }}>
            No hay eventos este día.
          </Text>
          {esProfesor && (
            <TouchableOpacity onPress={abrirNuevo}>
              <Text style={{ color: theme.accent, fontSize: fs(13), marginTop: 6 }}>Agregar un evento</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        eventos.map((ev) => (
          <EventoRow
            key={ev.id}
            ev={ev}
            badge="hora"
            onPress={esProfesor ? () => abrirEditar(ev) : undefined}
          />
        ))
      )}
      {esProfesor && eventos.length > 0 && (
        <Text style={{ color: theme.textMuted, fontSize: fs(11), marginBottom: 8 }}>
          Toca un evento para editarlo o eliminarlo.
        </Text>
      )}

      {/* ---- Asistencia del día ---- */}
      <Text style={[styles.seccion, { color: theme.textPrim, fontSize: fs(16), marginTop: 20 }]}>
        Asistencia del día
      </Text>

      {esFuturo ? (
        <View style={[styles.vacio, { backgroundColor: theme.surface1, borderColor: theme.border }]}>
          <Text style={{ color: theme.textMuted, fontSize: fs(13), textAlign: 'center' }}>
            Este día aún no ocurre.
          </Text>
        </View>
      ) : (
        <View style={[styles.asistCard, { backgroundColor: theme.surface1 }]}>
          {/* Total del día */}
          {esProfesor && (
            <View style={[styles.totalBox, { backgroundColor: theme.surface2 }]}>
              {registradas.length > 0 ? (
                <>
                  <Text style={{ color: theme.textSec, fontSize: fs(12) }}>Asistencia total del día</Text>
                  <Text style={{ color: theme.accent, fontSize: fs(26), fontWeight: 'bold' }}>
                    {totalPresentes} / {totalInscritos}
                    <Text style={{ color: theme.textSec, fontSize: fs(14), fontWeight: 'normal' }}>
                      {'  '}({pctTotal}%)
                    </Text>
                  </Text>
                </>
              ) : (
                <Text style={{ color: theme.textMuted, fontSize: fs(13) }}>
                  No hay asistencia registrada este día.
                </Text>
              )}
            </View>
          )}

          {/* Estado del alumno */}
          {!esProfesor && (
            <View style={[styles.totalBox, { backgroundColor: theme.surface2 }]}>
              <Text style={{ color: theme.textSec, fontSize: fs(12) }}>Tu asistencia</Text>
              <Text
                style={{
                  fontSize: fs(18), fontWeight: 'bold',
                  color: yoAsistio === true ? '#3DDC84' : yoAsistio === false ? '#FF5A5F' : theme.textMuted,
                }}
              >
                {yoAsistio === true ? '✓ Asististe' : yoAsistio === false ? '✗ Faltaste' : 'Sin clase registrada'}
              </Text>
            </View>
          )}

          {/* Por categoría */}
          {filas
            .filter((f) => esProfesor || f.sesion)
            .map((f) => (
              <View key={f.cat} style={[styles.catRow, { borderBottomColor: theme.border }]}>
                <View style={styles.catInfo}>
                  <Text style={{ color: theme.textPrim, fontSize: fs(14), fontWeight: '600' }}>{f.cat}</Text>
                  {f.sesion ? (
                    <>
                      <Text style={{ color: theme.textSec, fontSize: fs(12) }}>
                        {f.presentes} de {f.inscritos} presentes · {f.pct}%
                      </Text>
                      <View style={[styles.barra, { backgroundColor: theme.border }]}>
                        <View style={[styles.barraFill, { width: `${f.pct}%`, backgroundColor: '#3DDC84' }]} />
                      </View>
                    </>
                  ) : (
                    <Text style={{ color: theme.textMuted, fontSize: fs(12) }}>Sin registrar</Text>
                  )}
                </View>
                {esProfesor && (
                  <TouchableOpacity
                    onPress={() => onTomarAsistencia(f.cat)}
                    style={[styles.btnAsist, { borderColor: theme.accent }]}
                  >
                    <Text style={{ color: theme.accent, fontSize: fs(12), fontWeight: 'bold' }}>
                      {f.sesion ? 'Editar' : 'Registrar'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
        </View>
      )}

      {esProfesor && (
        <EventoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          fechaInicial={dia}
          evento={editando}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  seccionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seccion: { fontWeight: 'bold', marginBottom: 10 },
  vacio: { borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed' },
  asistCard: { borderRadius: 12, padding: 14 },
  totalBox: { borderRadius: 10, padding: 12, marginBottom: 6, gap: 2 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  catInfo: { flex: 1, gap: 3 },
  barra: { height: 4, borderRadius: 2, overflow: 'hidden', marginTop: 2 },
  barraFill: { height: '100%', borderRadius: 2 },
  btnAsist: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
});
