// app.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Redirección raíz
app.get('/', (req, res) => {
  res.redirect('/turnos');
});

// LISTADO DE TURNOS
app.get('/turnos', async (req, res) => {
  try {
    const [turnos] = await db.query(
      `SELECT 
          t.id,
          t.numero_turno_clinica,
          p.nombre AS paciente,
          c.nombre AS clinica,
          DATE_FORMAT(t.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora
       FROM turno t
       JOIN paciente p ON t.paciente_id = p.id
       JOIN clinica c  ON t.clinica_id  = c.id
       ORDER BY c.nombre, t.numero_turno_clinica;`
    );

    const [clinicas] = await db.query(
      `SELECT id, nombre FROM clinica ORDER BY nombre;`
    );

    res.render('turnos', { turnos, clinicas });
  } catch (err) {
    console.error('Error al obtener turnos:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// REASIGNAR TURNO ENTRE CLÍNICAS
app.post('/turnos/:id/reasignar', async (req, res) => {
  const turnoId = req.params.id;
  const { clinica_nueva_id, motivo } = req.body;

  if (!clinica_nueva_id || !motivo || !motivo.trim()) {
    return res.status(400).json({
      ok: false,
      message: 'La clínica nueva y el motivo son obligatorios.'
    });
  }

  let conn;

  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // 1) Obtener la clínica actual del turno
    const [rows] = await conn.query(
      'SELECT clinica_id FROM turno WHERE id = ?',
      [turnoId]
    );

    if (rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({
        ok: false,
        message: 'Turno no encontrado'
      });
    }

    const clinicaAnteriorId = rows[0].clinica_id;

    // 2) Guardar el historial de reasignación
    await conn.query(
      `INSERT INTO turno_reasignacion 
        (turno_id, clinica_anterior_id, clinica_nueva_id, motivo, fecha_hora)
       VALUES (?, ?, ?, ?, NOW())`,
      [turnoId, clinicaAnteriorId, clinica_nueva_id, motivo]
    );

    // 3) Obtener el siguiente número de turno en la clínica nueva
    const [maxRows] = await conn.query(
      `SELECT COALESCE(MAX(numero_turno_clinica), 0) AS maxTurno
       FROM turno
       WHERE clinica_id = ?`,
      [clinica_nueva_id]
    );

    const nuevoNumeroTurno = maxRows[0].maxTurno + 1;

    // 4) Actualizar SOLO este turno con la nueva clínica y su nuevo número de turno
    await conn.query(
      `UPDATE turno
       SET clinica_id = ?, 
           numero_turno_clinica = ?, 
           updated_at = NOW()
       WHERE id = ?`,
      [clinica_nueva_id, nuevoNumeroTurno, turnoId]
    );

    await conn.commit();
    conn.release();

    return res.json({
      ok: true,
      message: 'Turno reasignado correctamente.'
    });
  } catch (err) {
    console.error('Error al reasignar turno:', err);
    if (conn) {
      try {
        await conn.rollback();
        conn.release();
      } catch (rollbackErr) {
        console.error('Error en rollback:', rollbackErr);
      }
    }
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
