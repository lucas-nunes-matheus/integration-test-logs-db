import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app'; // Importa a aplicação configurada

describe('Teste de Integração - MongoDB e Express', () => {
  beforeAll(async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('[TEST] Conexão com MongoDB estabelecida com sucesso.');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[TEST] Erro ao conectar ao MongoDB:', error.message);
      }
      process.exit(1); // Encerra o Jest com falha se o banco não estiver disponível
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    console.log('[TEST] Conexão com MongoDB fechada.');
  });

  it('Deve retornar "Hello, world!" na rota raiz', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, world!');
  });
});