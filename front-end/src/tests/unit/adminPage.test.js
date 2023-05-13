import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import { usersList, newUser, newOriginalPassword } from '../mocks/users.mock';
import AdminPage from '../../pages/Admin/AdminPage';
import userEvent from '@testing-library/user-event';

describe('Admin page', () => {
  let history;

  const nameInputTestId = 'admin_manage__input-name';
  const emailInputTestId = 'admin_manage__input-email';
  const passwordInputTestId = 'admin_manage__input-password';
  const roleSelectTestId = 'admin_manage__select-role';
  const registerBtnTestId = 'admin_manage__button-register';

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
    window.localStorage.setItem('user', JSON.stringify(usersList[0]));
    jest.spyOn(api, 'get').mockResolvedValue({ data: usersList });

    history = createMemoryHistory({ initialEntries: ['/admin/manage'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <AdminPage />
        </Router>,
      );
    });
  });

  test('Renders admin page', async () => {
    const nameInput = screen.getByTestId(nameInputTestId);
    const emailInput = screen.getByTestId(emailInputTestId);
    const passwordInput = screen.getByTestId(passwordInputTestId);
    const roleSelect = screen.getByTestId(roleSelectTestId);
    const registerBtn = screen.getByTestId(registerBtnTestId);

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(roleSelect).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
  });

  test('Tests if after registration fails, the warning message appears', async () => {
    jest.spyOn(api, 'post').mockRejectedValueOnce();
    userEvent.type(screen.getByTestId(nameInputTestId), newUser.name);
    userEvent.type(screen.getByTestId(emailInputTestId), newUser.email);
    userEvent.type(screen.getByTestId(passwordInputTestId), newOriginalPassword);
    userEvent.click(screen.getByTestId(registerBtnTestId));
    await waitFor(() => {
      expect(screen.getByTestId('admin_manage__element-invalid-register')).toBeInTheDocument();
    });
  });

  test('Tests if registered user is shown', async () => {
    expect(screen.getAllByTestId(/admin_manage__element-user-table-name-/)).toHaveLength(3);
    userEvent.type(screen.getByTestId(nameInputTestId), newUser.name);
    userEvent.type(screen.getByTestId(emailInputTestId), newUser.email);
    userEvent.type(screen.getByTestId(passwordInputTestId), newUser.password);
    userEvent.selectOptions(screen.getByTestId(roleSelectTestId), newUser.role);
    const registerBtn = screen.getByTestId(registerBtnTestId);
    expect(registerBtn).toBeEnabled();

    jest.spyOn(api, 'post').mockResolvedValueOnce({ data: newUser});
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: [...usersList, newUser]});
    userEvent.click(registerBtn);
    await waitFor(() => {
      expect(screen.getAllByTestId(/admin_manage__element-user-table-name-/)).toHaveLength(4);
    });
  });

  test('Tests if the user is removed', async () => {
    expect(screen.getByText(usersList[2].name)).toBeInTheDocument();
    jest.spyOn(api, 'delete').mockResolvedValueOnce({ data: 1 });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: usersList.filter(({ name }) => name !== usersList[2].name) });
    const removeBtn = screen.getByTestId('admin_manage__element-user-table-remove-2');
    userEvent.click(removeBtn);
    await waitFor(() => {
      expect(screen.queryByText(usersList[2].name)).not.toBeInTheDocument();
    });
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
