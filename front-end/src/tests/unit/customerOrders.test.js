import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import salesListMock from '../mocks/sales.mock';
import CustomerOrders from '../../pages/Customer/CustomerOrders';
import { usersList } from '../mocks/users.mock';

describe('Customer orders page', () => {
  let history;

  const orderIdTestId = 'customer_orders__element-order-id-1';
  const deliveryStatusTestId = 'customer_orders__element-delivery-status-1';
  const orderDateTestId = 'customer_orders__element-order-date-1';
  const cardPriceTestId = 'customer_orders__element-card-price-1';
  const cardAddressTestId = 'customer_orders__element-card-address-1';

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
    window.localStorage.setItem('user', JSON.stringify(usersList[2]));

    jest.spyOn(api, 'get').mockResolvedValue({ data: salesListMock });

    history = createMemoryHistory({ initialEntries: ['/customer/orders'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <CustomerOrders />
        </Router>,
      );
    });
  });

  test('Renders customer orders page', async () => {
    const orderId = screen.getByTestId(orderIdTestId);
    const deliveryStatus = screen.getByTestId(deliveryStatusTestId);
    const orderDate = screen.getByTestId(orderDateTestId);
    const cardPrice = screen.getByTestId(cardPriceTestId);
    const cardAddress = screen.getByTestId(cardAddressTestId);

    expect(orderId).toBeInTheDocument();
    expect(deliveryStatus).toBeInTheDocument();
    expect(orderDate).toBeInTheDocument();
    expect(cardPrice).toBeInTheDocument();
    expect(cardAddress).toBeInTheDocument();
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
