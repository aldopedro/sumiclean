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

app.post(`https://sumiclean-q7p6.onrender.com/api/agendamento`, async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});