const clonServer = require('supertest');
const app = require('../../app');
const { connect, disconnected, cleanup } = require('../../db');

describe('User', () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await disconnected();
  });

  it('should create a user correctly', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'Testing193!',
    };
    const res = await clonServer(app).post('/auth/local/signup').send(user);
    //console.log(res);
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
    );
  });

  it('should nor create user when there is no email', async () => {
    const user = { password: '12345' };
    const res = await clonServer(app).post('/auth/local/signup').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch('User could not created');
    //expect(res.body.errors.email.message).toMatch(/el correo es requerido/i)
  });

  it('should not create user when email is invalid', async () => {
    const user = { name: 'test', email: 'test', password: 'Testing193!' };
    const res = await clonServer(app).post('/auth/local/signup').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Ingrese un correo electronico valido/i);
  });

  it('should not create user when email already exists', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'Testing193!',
    };
    await clonServer(app).post('/auth/local/signup').send(user);
    const res = await clonServer(app).post('/auth/local/signup').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(
      /Ya existe un usuario registrado con ese correo/i,
    );
  });

  it('should signin user correctly', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'Testing193!',
    };
    await clonServer(app).post('/auth/local/signup').send(user);
    const res = await clonServer(app).post('/auth/local/login').send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/User login successfully/i);
  });

  it('should not login if incorrect password', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'Testing193!',
    };
    await clonServer(app).post('/auth/local/signup').send(user);
    const res = await clonServer(app)
      .post('/auth/local/login')
      .send({ ...user, password: '1' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/User could not login/i);
    expect(res.body.data).toMatch(/Email o contraseña invalidos/i);
  });

  it('should not login user if email does not exist', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'Testing193!',
    };
    const res = await clonServer(app).post('/auth/local/login').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/User could not login/i);
  });
});
