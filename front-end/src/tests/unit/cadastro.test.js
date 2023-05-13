import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen,
  waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import Cadastro from '../../pages/Cadastro';
import { newUser } from '../mocks/users.mock';

describe.only('Register page', () => {
  let history;

  const nameInputTestId = 'common_register__input-name';
  const emailInputTestId = 'common_register__input-email';
  const passwordInputTestId = 'common_register__input-password';
  const registerBtnTestId = 'common_register__button-register';

  const localStorageMock = (() => {
    let storage = {};

    return {
      getItem: (key) => storage[key] ?? null,
      setItem(key, value) { storage[key] = value.toString(); },
      removeItem: (key) => delete storage[key],
      clear() { storage = {}; },
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  beforeEach(async () => {
    jest.spyOn(api, 'post').mockResolvedValue({
      data: newUser,
    });

    history = createMemoryHistory({ initialEntries: ['/register'] });
    render(
      <Router history={ history }>
        <Cadastro history={ history } />
      </Router>,
    );
  });

  test('Renders register page', async () => {
    const nameInput = screen.getByTestId(nameInputTestId);
    const emailInput = screen.getByTestId(emailInputTestId);
    const passwordInput = screen.getByTestId(passwordInputTestId);
    const registerBtn = screen.getByTestId(registerBtnTestId);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  test('Test invalid register', async () => {
    userEvent.type(screen.getByTestId(nameInputTestId), 'invalid');
    userEvent.type(screen.getByTestId(emailInputTestId), 'invalidemail.com');
    userEvent.type(screen.getByTestId(passwordInputTestId), '12345');
    expect(screen.getByTestId(registerBtnTestId)).toBeDisabled();
  });

  test('Test unsuccessful registration', async () => {
    jest.restoreAllMocks();
    jest.spyOn(api, 'post').mockRejectedValueOnce(null);
    const nameInput = screen.getByTestId(nameInputTestId);
    const emailInput = screen.getByTestId(emailInputTestId);
    const passwordInput = screen.getByTestId(passwordInputTestId);
    const registerBtn = screen.getByTestId(registerBtnTestId);

    userEvent.type(nameInput, newUser.name);
    userEvent.type(emailInput, newUser.email);
    userEvent.type(passwordInput, newUser.password);
    userEvent.click(registerBtn);
    expect(await screen.findByTestId('common_register__element-invalid_register')).toBeInTheDocument();
  });

  test('Test successfully register', async () => {
    const nameInput = screen.getByTestId(nameInputTestId);
    const emailInput = screen.getByTestId(emailInputTestId);
    const passwordInput = screen.getByTestId(passwordInputTestId);
    const registerBtn = screen.getByTestId(registerBtnTestId);

    userEvent.type(nameInput, newUser.name);
    userEvent.type(emailInput, newUser.email);
    userEvent.type(passwordInput, newUser.password);
    waitForElementToBeRemoved(registerBtn);
    userEvent.click(registerBtn);
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
