const clonServer = require('supertest');
const app = require('../../app');
const { connect, disconnected, cleanup } = require('../../db');
const Users = require('../Users/Users.model');
const jwt = require('jsonwebtoken');

describe('Favs', () => {
  beforeAll(async () => {
    await connect();
  });

  beforeEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await disconnected();
  });

  async function loginUser(email = 'test@mail.com') {
    const newUser = {
      name: 'test',
      email,
      password: 'Testing193!',
    };
    return await Users.create(newUser);
  }

  function createHeader(user) {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    });
    return `Bearer ${token}`;
  }

  it('should create a fav correctly', async () => {
    const favs = {
      title: 'Google San knows everything',
      description: 'I really like Google',
      link: 'google.com',
    };
    const user = await loginUser();
    const authHeader = createHeader(user);

    const res = await clonServer(app)
      .post('/api/favs/')
      .set('Authorization', authHeader)
      .send(favs);
    //console.log(res);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/Favs Created/i);
  });

  it('shouldnt delete another user fav', async () => {
    const favs = {
      title: 'Google San knows everything',
      description: 'I really like Google',
      link: 'google.com',
    };
    const user = await loginUser();
    const authHeader = createHeader(user);
    const res = await clonServer(app)
      .post('/api/favs/')
      .set('Authorization', authHeader)
      .send(favs);
    //console.log('res_body', res.body.data._id);
    const anotherUser = await loginUser('otromail@mail.com');
    const anotherAuthHeader = createHeader(anotherUser);
    const resDelete = await clonServer(app)
      .delete(`/api/favs/${res.body.data._id}`)
      .set('Authorization', anotherAuthHeader);

    expect(resDelete.statusCode).toBe(400);
    expect(resDelete.body.message).toMatch(/Favs could not be Deleted/i);
  });
});
