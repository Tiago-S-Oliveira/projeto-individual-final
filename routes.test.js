const supertest = require('supertest');
const app = require('./src/server');
const request = supertest(app);
const db = require('./src/database/db');
const User = require('./src/models/User');

describe('GET /', () => {
  describe('Testando a Rota', () => {
    it('Deve Retornar o Status HTTP 200', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
    });

    it('Retorna um array userData', async () => {
      const response = await request.get('/');
      expect(Array.isArray(response.body.userData)).toBe(true);
    });

    it('Deve retornar uma resposta JSON', async () => {
      const response = await request.get('/');
      expect(response.type).toBe('application/json');
    });
  });
});

describe('POST /adduser', () => {
  beforeAll(async () => {
    await db.sync({ force: true });
  });

  afterAll(async () => {
    await db.close();
  });

  describe('Testando a Rota', () => {
    it('Deve Retornar o Status HTTP 200', async () => {
      const novoUsuario = {
        name: 'Tiago',
        age: 23,
        email: 'Tiago@email.com'
      }
      const response = await request.post('/adduser').send(novoUsuario);

      expect(response.status).toBe(200);
    });

    it('Deve adicionar um novo usuário', async () => {
      const novoUsuario = {
        name: 'Juan',
        age: 23,
        email: 'Juan@email.com'
      }
      const response = await request.post('/adduser').send(novoUsuario);
  
      const usuarioAdicionado = await User.findOne({ where: { email: novoUsuario.email } });
      expect(usuarioAdicionado).toBeTruthy();
    });

    it('Deve retornar uma resposta JSON', async () => {
      const novoUsuario = {
        name: 'Igor',
        age: 23,
        email: 'Igor@email.com'
      }
      const response = await request.post('/adduser').send(novoUsuario);
      expect(response.type).toBe('application/json');
    });
  });
});