const { expect } = require('chai');
const sinon = require('sinon');
const { users } = require('../../../database/services');
const { User } = require('../../../database/models');
const { usersList, userMock, sellersList, newUserBody, newUserMock, userBody } = require('../../mocks/user.mock');
const jwt = require('jsonwebtoken');

describe('User camada service', function () {
  describe('login', function () {
    it('Testa caso de sucesso', async function () {
      // Arrange
      sinon.stub(User, 'findOne').resolves(usersList[2]);
      sinon.stub(jwt, 'sign').returns(userMock.token);
      // Act
      const result = await users.login(userBody.email, userBody.password);
      // Assert
      expect(result).to.be.deep.equal(userMock);
    });

    it('Testa quando não tem email e/ou senha', async function () {
      // Act
      const result = await users.login();
      // Assert
      expect(result).to.be.deep.equal({ type: 400, message: 'Some required fields are missing' });
    });

    it('Testa quando o usuário não existe', async function () {
      // Arrange
      sinon.stub(User, 'findOne').resolves(null);
      // Act
      const result = await users.login(userBody.email, userBody.password);
      // Assert
      expect(result).to.be.deep.equal({ type: 404, message: 'User not found' });
    });
  });

  describe('newUser', function () {
    it('Testa caso de sucesso', async function () {
      // Arrange
      sinon.stub(User, 'create').resolves(newUserMock);
      sinon.stub(User, 'findOne')
      .onFirstCall().resolves(null)
      .onSecondCall().resolves({
        id: usersList.length + 1,
        name: newUserMock.name,
        email: newUserMock.email,
        role: newUserMock.role,
      });
      sinon.stub(jwt, 'sign').returns(newUserMock.token);
      // Act
      const result = await users.newUser(newUserBody);
      // Assert
      expect(result).to.be.deep.equal(newUserMock);
    });

    it('Testa quando o usuário já está registrado', async function () {
      // Arrange
      sinon.stub(User, 'findOne').resolves(newUserMock);
      // Act
      const result = await users.newUser(newUserBody);
      // Assert
      expect(result).to.be.deep.equal({ type: 409, message: 'User already registered' });
    });
  });

  it('getAllSellers', async function () {
    // Arrange
    sinon.stub(User, 'findAll').resolves(sellersList);
    // Act
    const result = await users.getAllSellers();
    // Assert
    expect(result).to.be.deep.equal(sellersList);
  });

  it('getAll', async function () {
    // Arrange
    sinon.stub(User, 'findAll').resolves(usersList);
    // Act
    const result = await users.getAll();
    // Assert
    expect(result).to.be.deep.equal(usersList);
  });

  it('deleteByEmail', async function () {
    // Arrange
    sinon.stub(User, 'destroy').resolves(1);
    // Act
    const result = await users.deleteByEmail(userBody.email);
    // Assert
    expect(result).to.be.deep.equal(1);
  });

  afterEach(sinon.restore);
});
