import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import CustomerOrdersDetails from '../../pages/Customer/CustomerOrderDetail';
import salesListMock from '../mocks/sales.mock';
import { usersList } from '../mocks/users.mock';

describe('Customer order detail page', () => {
  let history;

  const orderIdTestId = 'customer_order_details__element-order-details-label-order-id';
  const sellerNameTestId = 'customer_order_details__element-order-details-label-seller-name';
  const orderDateTestId = 'customer_order_details__element-order-details-label-order-date';
  const deliveryStatusTestId = 'customer_order_details__element-order-details-label-delivery-status';
  const checkBtnTestId = 'customer_order_details__button-delivery-check';

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

    jest.spyOn(api, 'get').mockImplementation((url) => {
      if (url.startsWith('/sales/')) {
        return Promise.resolve({
          data: { ...salesListMock[0], status: 'Em Trânsito' }
        });
      }
      if (url === '/users/sellers') {
        return Promise.resolve({
          data: [{
            id: 2,
            name: "Fulana Pereira",
          }]
        });
      }
    });

    history = createMemoryHistory({ initialEntries: ['/customer/orders/1'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <CustomerOrdersDetails />
        </Router>,
      );
    });
  });

  test('Renders customer order detail page', async () => {
    const orderId = screen.getByTestId(orderIdTestId);
    const sellerName = screen.getByTestId(sellerNameTestId);
    const orderDate = screen.getByTestId(orderDateTestId);
    const deliveryStatus = screen.getByTestId(deliveryStatusTestId);
    const checkBtn = screen.getByTestId(checkBtnTestId);

    expect(orderId).toBeInTheDocument();
    expect(sellerName).toBeInTheDocument();
    expect(orderDate).toBeInTheDocument();
    expect(deliveryStatus).toBeInTheDocument();
    expect(checkBtn).toBeInTheDocument();
  });

  test('Tests if update sale button change status from "In Transit" to "Delivered"', async () => {
    jest.spyOn(api, 'put').mockResolvedValue({ data: [1] });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: {...salesListMock[0], status: 'Entregue'} });
    const checkBtn = screen.getByTestId(checkBtnTestId);
    expect(checkBtn).not.toBeDisabled();
    expect(screen.getByTestId(deliveryStatusTestId)).toHaveTextContent('Em Trânsito');
    userEvent.click(checkBtn);
    expect(await screen.findByTestId(deliveryStatusTestId)).toHaveTextContent('Entregue');
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
