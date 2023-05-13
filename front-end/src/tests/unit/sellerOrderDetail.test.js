import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import salesListMock from '../mocks/sales.mock';
import SellerOrdersDetails from '../../pages/Seller/SellerOrderDetail';
import { usersList } from '../mocks/users.mock';

describe('Seller order detail page', () => {
  let history;

  const orderIdTestId = 'seller_order_details__element-order-details-label-order-id';
  const orderDateTestId = 'seller_order_details__element-order-details-label-order-date';
  const deliveryStatusTestId = 'seller_order_details__element-order-details-label-delivery-status';
  const preparingCheckBtnTestId = 'seller_order_details__button-preparing-check';
  const dispatchCheckBtnTestId = 'seller_order_details__button-dispatch-check';

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

    jest.spyOn(api, 'get').mockResolvedValue({ data: salesListMock[0] });

    history = createMemoryHistory({ initialEntries: ['/seller/orders/1'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <SellerOrdersDetails />
        </Router>,
      );
    });
  });

  test('Renders seller order detail page', async () => {
    const orderId = screen.getByTestId(orderIdTestId);
    const orderDate = screen.getByTestId(orderDateTestId);
    const deliveryStatus = screen.getByTestId(deliveryStatusTestId);
    const preparingCheckBtn = screen.getByTestId(preparingCheckBtnTestId);
    const dispatchCheckBtn = screen.getByTestId(dispatchCheckBtnTestId);

    expect(orderId).toBeInTheDocument();
    expect(orderDate).toBeInTheDocument();
    expect(deliveryStatus).toBeInTheDocument();
    expect(preparingCheckBtn).toBeInTheDocument();
    expect(dispatchCheckBtn).toBeInTheDocument();
  });

  test('Tests if update sale button work correctly', async () => {
    const preparingCheckBtn = screen.getByTestId(preparingCheckBtnTestId);
    const dispatchCheckBtn = screen.getByTestId(dispatchCheckBtnTestId);
    expect(preparingCheckBtn).not.toBeDisabled();
    expect(dispatchCheckBtn).toBeDisabled();

    jest.spyOn(api, 'put').mockResolvedValue({ data: [1] });
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: {...salesListMock[0], status: 'Preparando'} });

    expect(screen.getByTestId(deliveryStatusTestId)).toHaveTextContent('Pendente');
    userEvent.click(preparingCheckBtn);
    expect(await screen.findByTestId(deliveryStatusTestId)).toHaveTextContent('Preparando');

    expect(dispatchCheckBtn).not.toBeDisabled();
    jest.spyOn(api, 'get').mockResolvedValueOnce({ data: {...salesListMock[0], status: 'Em Trânsito'} });
    userEvent.click(dispatchCheckBtn);
    expect(await screen.findByTestId(deliveryStatusTestId)).toHaveTextContent('Em Trânsito');
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
