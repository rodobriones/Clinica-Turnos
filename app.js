// app.js
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/turnos');
});

app.get('/turnos', async (req, res) => {
  try {
    const [turnos] = await db.query(
  `SELECT 
      t.id,                                   
      p.nombre AS paciente,
      c.nombre AS clinica,
      DATE_FORMAT(t.fecha_hora, '%Y-%m-%d %H:%i') AS fecha_hora,
      (
        SELECT COUNT(*) 
        FROM turno t2
        WHERE t2.clinica_id = t.clinica_id
          AND t2.fecha_hora <= t.fecha_hora
      ) AS numero_turno_clinica            
   FROM turno t
   JOIN paciente p ON t.paciente_id = p.id
   JOIN clinica c  ON t.clinica_id  = c.id
   ORDER BY c.nombre, t.fecha_hora;`
);


    const [clinicas] = await db.query(
      `SELECT id, nombre FROM clinica ORDER BY nombre;`
    );

    res.render('turnos', { turnos, clinicas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno');
  }
});

app.post('/turnos/:id/reasignar', async (req, res) => {
  const turnoId = req.params.id;
  const { clinica_nueva_id, motivo } = req.body;

  if (!clinica_nueva_id || !motivo) {
    return res.status(400).json({ ok: false, message: 'Datos incompletos' });
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT clinica_id FROM turno WHERE id = ?', [turnoId]
    );

    if (rows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    }

    const clinicaAnteriorId = rows[0].clinica_id;

    await conn.query(
      `INSERT INTO turno_reasignacion (turno_id, clinica_anterior_id, clinica_nueva_id, motivo, fecha_hora)
      VALUES (?, ?, ?, ?, NOW())`,
      [turnoId, clinicaAnteriorId, clinica_nueva_id, motivo]
    );

    await conn.query(
      `UPDATE turno SET clinica_id = ?, updated_at = NOW() WHERE id = ?`,
      [clinica_nueva_id, turnoId]
    );

    await conn.commit();
    conn.release();

    res.json({ ok: true });
  } catch (err) {
    if (conn) {
      await conn.rollback();
      conn.release();
    }
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
