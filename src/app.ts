// src/app.ts
import express from 'express';

// Inicializa a aplicação Express
const app = express();

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota simples para teste
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

export default app;