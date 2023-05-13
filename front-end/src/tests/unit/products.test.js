import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor,
  waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import Products from '../../pages/Products';
import { productsList } from '../mocks/products.mock';

describe('Products page', () => {
  let history;

  const customerEmail = 'zebirita@email.com';
  const addBtnTestId = 'customer_products__button-card-add-item-1';
  const quantityInputTestId = 'customer_products__input-card-quantity-1';
  const removeBtnTestId = 'customer_products__button-card-rm-item-1';
  const cartBtnTestId = 'customer_products__checkout-bottom-value';

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
    window.localStorage.setItem('user', JSON.stringify({
      name: 'Cliente Zé Birita',
      email: customerEmail,
      role: 'customer',
      token: '',
    }));

    jest.spyOn(api, 'get').mockResolvedValue({ data: productsList });

    history = createMemoryHistory({ initialEntries: ['/customer/products'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <Products />
        </Router>,
      );
    });
  });

  test('Renders product page', async () => {
    const addBtn = screen.getByTestId(addBtnTestId);
    const quantityInput = screen.getByTestId(quantityInputTestId);
    const removeBtn = screen.getByTestId(removeBtnTestId);
    const cartBtn = screen.getByTestId(cartBtnTestId);

    expect(addBtn).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(removeBtn).toBeInTheDocument();
    expect(cartBtn).toBeInTheDocument();
  });

  test('Tests if the add and remove buttons work properly', async () => {
    const addBtn = screen.getByTestId(addBtnTestId);
    const removeBtn = screen.getByTestId(removeBtnTestId);
    const quantityInput = screen.getByTestId(quantityInputTestId);

    userEvent.click(addBtn);
    userEvent.click(addBtn);
    expect(quantityInput).toHaveValue(2);

    userEvent.click(removeBtn);
    userEvent.click(removeBtn);
    expect(quantityInput).toHaveValue(0);

    userEvent.click(removeBtn);
    expect(quantityInput).toHaveValue(0);
  });

  test('Test changing the quantity directly', async () => {
    const quantityInput = screen.getByTestId(quantityInputTestId);
    userEvent.type(quantityInput, '42');
    expect(quantityInput).toHaveValue(42);
  });

  test('Test logout', async () => {
    expect(window.localStorage.getItem('user')).not.toBeNull();
    const logoutBtn = screen.getByTestId('customer_products__element-navbar-link-logout');
    userEvent.click(logoutBtn);
    expect(window.localStorage.getItem('user')).toBeNull();
    await waitFor(() => expect(history.location.pathname).toBe('/login'));
  });

  test('Test cart button', async () => {
    const cartBtn = screen.getByTestId(cartBtnTestId);
    const addBtn = screen.getByTestId(addBtnTestId);
    userEvent.click(addBtn);
    waitForElementToBeRemoved(cartBtn);
    userEvent.click(cartBtn);
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
