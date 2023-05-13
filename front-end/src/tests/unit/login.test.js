import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor,
  waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import App from '../../App';
import { api } from '../../service/requests';

describe('Login page', () => {
  let history;

  const emailTestId = 'common_login__input-email';
  const passwordTestId = 'common_login__input-password';
  const loginBtnTestId = 'common_login__button-login';
  const registerBtnTestId = 'common_login__button-register';
  const customerEmail = 'zebirita@email.com';
  const sellerEmail = 'fulana@deliveryapp.com';
  const adminEmail = 'adm@deliveryapp.com';

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
    history = createMemoryHistory({ initialEntries: ['/'] });
    if (!expect.getState().currentTestName.includes('if already logged')) {
      render(
        <Router history={ history }>
          <App />
        </Router>,
      );
      await waitFor(() => expect(history.location.pathname).toBe('/login'));
    }
  });

  test('Renders login form', async () => {
    const emailInput = screen.getByTestId(emailTestId);
    const passwordInput = screen.getByTestId(passwordTestId);
    const loginBtn = screen.getByTestId(loginBtnTestId);
    const registerBtn = screen.getByTestId(registerBtnTestId);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  test('Redirects to /register after clicking register button', async () => {
    const registerBtn = screen.getByTestId(registerBtnTestId);
    userEvent.click(registerBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/register'));
  });

  test('Redirects to /customer/products after successful login', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({
      data: {
        name: 'Cliente Zé Birita',
        email: customerEmail,
        role: 'customer',
        token: '',
      },
    });

    const emailInput = screen.getByTestId(emailTestId);
    const passwordInput = screen.getByTestId(passwordTestId);
    const loginBtn = screen.getByTestId(loginBtnTestId);

    userEvent.type(emailInput, customerEmail);
    userEvent.type(passwordInput, '$#zebirita#$');
    waitForElementToBeRemoved(() => loginBtn);
    userEvent.click(loginBtn);

    await waitFor(() => expect(history.location.pathname).toBe('/customer/products'));
  });

  test('Redirects to /seller/orders after successful login', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({
      data: {
        name: 'Fulana Pereira',
        email: sellerEmail,
        role: 'seller',
        token: '',
      },
    });

    const emailInput = screen.getByTestId(emailTestId);
    const passwordInput = screen.getByTestId(passwordTestId);
    const loginBtn = screen.getByTestId(loginBtnTestId);

    userEvent.type(emailInput, sellerEmail);
    userEvent.type(passwordInput, 'fulana@123');
    waitForElementToBeRemoved(() => loginBtn);
    userEvent.click(loginBtn);

    await waitFor(() => expect(history.location.pathname).toBe('/seller/orders'));
  });

  test('Redirects to /admin/manage after successful login', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({
      data: {
        name: 'Delivery App Admin',
        email: adminEmail,
        role: 'administrator',
        token: '',
      },
    });

    const emailInput = screen.getByTestId(emailTestId);
    const passwordInput = screen.getByTestId(passwordTestId);
    const loginBtn = screen.getByTestId(loginBtnTestId);

    userEvent.type(emailInput, adminEmail);
    userEvent.type(passwordInput, '--adm2@21!!--');
    waitForElementToBeRemoved(() => loginBtn);
    userEvent.click(loginBtn);

    await waitFor(() => expect(history.location.pathname).toBe('/admin/manage'));
  });

  test('Redirects to /customer/products if already logged', async () => {
    window.localStorage.setItem('user', JSON.stringify({
      name: 'Cliente Zé Birita',
      email: customerEmail,
      role: 'customer',
      token: '',
    }));
    await waitFor(() => render(<Router history={ history }><App /></Router>));
    await waitFor(() => expect(history.location.pathname).toBe('/customer/products'));
  });

  test('Redirects to /seller/orders if already logged', async () => {
    window.localStorage.setItem('user', JSON.stringify({
      name: 'Fulana Pereira',
      email: sellerEmail,
      role: 'seller',
      token: '',
    }));
    render(<Router history={ history }><App /></Router>);
    await waitFor(() => expect(history.location.pathname).toBe('/seller/orders'));
  });

  test('Redirects to /admin/manage if already logged', async () => {
    window.localStorage.setItem('user', JSON.stringify({
      name: 'Delivery App Admin',
      email: adminEmail,
      role: 'administrator',
      token: '',
    }));
    render(<Router history={ history }><App /></Router>);
    await waitFor(() => expect(history.location.pathname).toBe('/admin/manage'));
  });

  test('Should not redirect if user is not registered', async () => {
    jest.spyOn(api, 'post').mockResolvedValue(null);

    const emailInput = screen.getByTestId(emailTestId);
    const passwordInput = screen.getByTestId(passwordTestId);
    const loginBtn = screen.getByTestId(loginBtnTestId);

    userEvent.type(emailInput, 'guest@email.com');
    userEvent.type(passwordInput, '123456');
    userEvent.click(loginBtn);

    const invalidCredentials = await screen
      .findByTestId('common_login__element-invalid-email');
    expect(invalidCredentials).toBeInTheDocument();
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
