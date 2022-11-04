const clonServer = require('supertest');
const app = require('../../app');
const { connect, disconnected, cleanup } = require('../../db');
const Users = require('../Users/Users.model');
const jwt = require('jsonwebtoken');

describe('List', () => {
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

  it('should create a list with a fav correctly', async () => {
    const favs = {
      title: 'Google San knows everything',
      description: 'I really like Google',
      link: 'google.com',
    };
    const user = await loginUser();
    const authHeader = createHeader(user);

    const resFavs = await clonServer(app)
      .post('/api/favs/')
      .set('Authorization', authHeader)
      .send(favs);
    const resLists = await clonServer(app)
      .post(`/api/lists/${resFavs.body.data._id}`)
      .set('Authorization', authHeader);

    //console.log(res);
    expect(resLists.statusCode).toBe(201);
    expect(resLists.body.message).toMatch(/Lists Created/i);
  });

  it('should update a list and add the fav to the array correctly', async () => {
    const favs = {
      title: 'Google San knows everything',
      description: 'I really like Google',
      link: 'google.com',
    };
    const user = await loginUser();
    const authHeader = createHeader(user);

    const resFavs = await clonServer(app)
      .post('/api/favs/')
      .set('Authorization', authHeader)
      .send(favs);
    const resLists = await clonServer(app)
      .post(`/api/lists/${resFavs.body.data._id}`)
      .set('Authorization', authHeader);
    const favs2 = {
      title: 'You know nothing Jhon Snow',
      description: '404 knowlege not found ',
      link: '404.com',
    };
    const resFavs2 = await clonServer(app)
      .post('/api/favs/')
      .set('Authorization', authHeader)
      .send(favs2);
    const resListsUpdate = await clonServer(app)
      .put(`/api/lists/${resLists.body.data._id}/${resFavs2.body.data._id}`)
      .set('Authorization', authHeader);

    //console.log(res);
    expect(resListsUpdate.statusCode).toBe(201);
    expect(resListsUpdate.body.message).toMatch(/Lists Updated/i);
  });
  /*
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
    const anotherUser = await loginUser('otromail@mail.com');
    const anotherAuthHeader = createHeader(anotherUser);
    const resDelete = await clonServer(app)
      .delete(`/api/favs/${favs._id}`)
      .set('Authorization', anotherAuthHeader);
    //console.log(res);
    expect(resDelete.statusCode).toBe(400);
    expect(resDelete.body.message).toMatch(/Favs could not be Deleted/i);
  });
  */
});
