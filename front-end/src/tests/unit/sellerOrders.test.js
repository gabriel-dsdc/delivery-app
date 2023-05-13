import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import salesListMock from '../mocks/sales.mock';
import { usersList } from '../mocks/users.mock';
import SellerOrders from '../../pages/Seller/SellerOrders';

describe('Seller orders page', () => {
  let history;

  const orderIdTestId = 'seller_orders__element-order-id-1';
  const deliveryStatusTestId = 'seller_orders__element-delivery-status-1';
  const orderDateTestId = 'seller_orders__element-order-date-1';
  const cardPriceTestId = 'seller_orders__element-card-price-1';
  const cardAddressTestId = 'seller_orders__element-card-address-1';

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
    window.localStorage.setItem('user', JSON.stringify(usersList[1]));

    jest.spyOn(api, 'get').mockResolvedValue({ data: salesListMock });

    history = createMemoryHistory({ initialEntries: ['/seller/orders'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <SellerOrders />
        </Router>,
      );
    });
  });

  test('Renders seller orders page', async () => {
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
