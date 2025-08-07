require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// POST para criar agendamento
app.post('/api/agendamento', async (req, res) => {
  const { service, location, date, hour, address } = req.body;

  if (!service || !location || !date || !hour || !address) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    await pool.query(
      'INSERT INTO agendamentos (service, location, date, hour, address) VALUES ($1, $2, $3, $4, $5)',
      [service, location, date, hour, address]
    );
    return res.status(200).json({ message: 'Agendamento recebido com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    return res.status(500).json({ error: 'Erro ao salvar agendamento.' });
  }
});

// GET para consultar agendamentos
app.get('/getAgendamento', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agendamentos ORDER BY id DESC');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});