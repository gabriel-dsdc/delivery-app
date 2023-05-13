const { expect } = require('chai');
const sinon = require('sinon');
const { userController } = require('../../../database/controllers');
const { users } = require('../../../database/services');
const { userMock, newUserBody, userBody, sellersList, usersList } = require('../../mocks/user.mock');

describe('User camada controller', function () {
  let req = {};
  let res = {};

  beforeEach(function () {
    req = {
      params: { id: 1 },
    };
  
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      end: sinon.stub().returnsThis(),
      sendStatus: sinon.stub().returnsThis(),
    };
  });

  describe('login', function () {
    it('Testa caso de sucesso', async function () {
      // Arrange
      req.body = userBody;
      sinon.stub(users, 'login').resolves(userMock);
      // Act
      await userController.login(req, res);
      // Assert
      expect((res.status).calledWith(200)).to.equal(true);
      expect((res.json).calledWith(userMock)).to.equal(true);
    });

    it('Testa quando não tem email e/ou senha', async function () {
      // Arrange
      req.body = userBody;
      sinon.stub(users, 'login').resolves({ type: 400, message: 'Some required fields are missing' });
      // Act
      await userController.login(req, res);
      // Assert
      expect((res.status).calledWith(400)).to.equal(true);
      expect((res.json).calledWith({ hasToken: false })).to.equal(true);
    });

    it('Testa quando não encontra o usuário', async function () {
      // Arrange
      req.body = userBody;
      sinon.stub(users, 'login').resolves({ type: 404, message: 'User not found' });
      // Act
      await userController.login(req, res);
      // Assert
      expect((res.status).calledWith(404)).to.equal(true);
      expect((res.json).calledWith({ hasToken: false })).to.equal(true);
    });
  });

  describe('newUser', function () {
    it('Testa caso de sucesso', async function () {
      // Arrange
      req.body = newUserBody;
      sinon.stub(users, 'newUser').resolves(userMock);
      // Act
      await userController.newUser(req, res);
      // Assert
      expect((res.status).calledWith(201)).to.equal(true);
      expect((res.json).calledWith(userMock)).to.equal(true);
    });

    it('Testa quando o usuário já está registrado', async function () {
      // Arrange
      req.body = newUserBody;
      sinon.stub(users, 'newUser').resolves({ type: 409, message: 'User already registered' });
      // Act
      await userController.newUser(req, res);
      // Assert
      expect((res.status).calledWith(409)).to.equal(true);
      expect((res.json).calledWith({ message: 'User already registered' })).to.equal(true);
    });
  });

  it('getAllSellers', async function () {
    // Arrange
    sinon.stub(users, 'getAllSellers').resolves(sellersList);
    // Act
    await userController.getAllSellers(req, res);
    // Assert
    expect((res.status).calledWith(200)).to.equal(true);
    expect((res.json).calledWith(sellersList)).to.equal(true);
  });

  it('getAll', async function () {
    // Arrange
    sinon.stub(users, 'getAll').resolves(usersList);
    // Act
    await userController.getAll(req, res);
    // Assert
    expect((res.status).calledWith(200)).to.equal(true);
    expect((res.json).calledWith(usersList)).to.equal(true);
  });

  it('deleteByEmail', async function () {
    // Arrange
    req.body = userBody;
    sinon.stub(users, 'deleteByEmail').resolves(1);
    // Act
    await userController.deleteByEmail(req, res);
    // Assert
    expect((res.status).calledWith(200)).to.equal(true);
    expect((res.json).calledWith(1)).to.equal(true);
  });

  afterEach(sinon.restore);
});
