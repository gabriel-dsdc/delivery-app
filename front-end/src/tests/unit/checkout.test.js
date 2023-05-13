import { describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { render, screen,
  waitFor,
  waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { api } from '../../service/requests';
import Checkout from '../../pages/Checkout';
import { checkoutList } from '../mocks/products.mock';
import { usersList } from '../mocks/users.mock';

describe('Checkout page', () => {
  let history;

  const tableItemNumberTestId = 'customer_checkout__element-order-table-item-number-0';
  const tableNameTestId = 'customer_checkout__element-order-table-name-0';
  const tableQuantityTestId = 'customer_checkout__element-order-table-quantity-0';
  const tablePriceTestId = 'customer_checkout__element-order-table-unit-price-0';
  const tableSubtotalTestId = 'customer_checkout__element-order-table-sub-total-0';
  const tableRemoveBtnTestId = 'customer_checkout__element-order-table-remove-0';
  const tableTotalPriceTestId = 'customer_checkout__element-order-total-price';

  const selectSellerTestId = 'customer_checkout__select-seller';
  const inputAddressTestId = 'customer_checkout__input-address';
  const inputAddressNumberTestId = 'customer_checkout__input-address-number';
  const submitOrderBtnTestId = 'customer_checkout__button-submit-order';

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
    jest.spyOn(api, 'get').mockResolvedValue({
      data: [{
        id: 2, name: 'Fulana Pereira',
      }],
    });
  
    jest.spyOn(api, 'post').mockResolvedValue({ data: { saleId: 1 } });

    window.localStorage.setItem('cart', JSON.stringify(checkoutList));
    window.localStorage.setItem('user', JSON.stringify(usersList[2]));

    history = createMemoryHistory({ initialEntries: ['/customer/checkout'] });
    await waitFor(() => {
      render(
        <Router history={ history }>
          <Checkout />
        </Router>,
      );
    });
  });

  test('Renders the checkout page', async () => {
    const tableItemNumber = screen.getByTestId(tableItemNumberTestId);
    const tableName = screen.getByTestId(tableNameTestId);
    const tableQuantity = screen.getByTestId(tableQuantityTestId);
    const tablePrice = screen.getByTestId(tablePriceTestId);
    const tableSubtotal = screen.getByTestId(tableSubtotalTestId);
    const tableRemoveBtn = screen.getByTestId(tableRemoveBtnTestId);
    const tableTotalPrice = screen.getByTestId(tableTotalPriceTestId);

    const selectSeller = screen.getByTestId(selectSellerTestId);
    const inputAddress = screen.getByTestId(inputAddressTestId);
    const inputAddressNumber = screen.getByTestId(inputAddressNumberTestId);
    const submitOrderBtn = screen.getByTestId(submitOrderBtnTestId);

    expect(tableItemNumber).toHaveTextContent(1);
    expect(tableName).toHaveTextContent(checkoutList[0].name);
    expect(tableQuantity).toHaveTextContent(checkoutList[0].quantity);
    expect(tablePrice).toHaveTextContent('2,20');
    expect(tableSubtotal).toHaveTextContent('24,20');
    expect(tableRemoveBtn).toBeInTheDocument();
    expect(tableTotalPrice).toHaveTextContent(/297,29/);

    expect(selectSeller).toBeInTheDocument();
    expect(inputAddress).toBeInTheDocument();
    expect(inputAddressNumber).toBeInTheDocument();
    expect(submitOrderBtn).toBeInTheDocument();
  });

  test('Test if the product is removed', async () => {
    const tableRemoveBtn = screen.getByTestId(tableRemoveBtnTestId);
    expect(screen.getByTestId(tableTotalPriceTestId)).toHaveTextContent(/297,29$/);
    userEvent.click(tableRemoveBtn);
    waitForElementToBeRemoved(tableRemoveBtn);
    expect(screen.getByTestId(tableTotalPriceTestId)).toHaveTextContent(/273,09$/);
  });

  test('Test if the order is completed successfully', async () => {
    const selectSeller = screen.getByTestId(selectSellerTestId);
    const submitOrderBtn = screen.getByTestId(submitOrderBtnTestId);
    expect(await screen.findByRole("option", { name: usersList[1].name })).toBeInTheDocument();
    userEvent.selectOptions(selectSeller, '2');
    userEvent.type(screen.getByTestId(inputAddressTestId), 'Address');
    userEvent.type(screen.getByTestId(inputAddressNumberTestId), '42');
    waitForElementToBeRemoved(submitOrderBtn);
    userEvent.click(submitOrderBtn);
    await waitFor(() => expect(history.location.pathname).toBe('/customer/orders/1'));
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
  });
});
