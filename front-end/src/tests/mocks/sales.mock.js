const salesListMock = [
  {
    id: 1,
    userId: 3,
    sellerId: 2,
    totalPrice: '26.90',
    deliveryAddress: 'Isis Alameda',
    deliveryNumber: '87',
    saleDate: '2022-12-01T00:00:00.000Z',
    status: 'Pendente',
    products: [
      {
        id: 1,
        name: 'Skol Lata 250ml',
        price: '2.20',
        urlImage: 'http://localhost:3001/images/skol_lata_350ml.jpg',
        SaleProduct: {
          saleId: 1,
          productId: 1,
          quantity: 2,
        },
      },
      {
        id: 2,
        name: 'Heineken 600ml',
        price: '7.50',
        urlImage: 'http://localhost:3001/images/heineken_600ml.jpg',
        SaleProduct: {
          saleId: 1,
          productId: 2,
          quantity: 3,
        },
      },
    ],
  }, {
    id: 2,
    userId: 3,
    sellerId: 2,
    totalPrice: '78.60',
    deliveryAddress: 'Isadora Travessa',
    deliveryNumber: '584',
    saleDate: '2022-12-01T00:00:00.000Z',
    status: 'Preparando',
    products: [
      {
        id: 1,
        name: 'Skol Lata 250ml',
        price: '2.20',
        urlImage: 'http://localhost:3001/images/skol_lata_350ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 1,
          quantity: 3,
        },
      },
      {
        id: 2,
        name: 'Heineken 600ml',
        price: '7.50',
        urlImage: 'http://localhost:3001/images/heineken_600ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 2,
          quantity: 2,
        },
      },
      {
        id: 4,
        name: 'Brahma 600ml',
        price: '7.50',
        urlImage: 'http://localhost:3001/images/brahma_600ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 4,
          quantity: 1,
        },
      },
      {
        id: 5,
        name: 'Skol 269ml',
        price: '2.19',
        urlImage: 'http://localhost:3001/images/skol_269ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 5,
          quantity: 2,
        },
      },
      {
        id: 6,
        name: 'Skol Beats Senses 313ml',
        price: '4.49',
        urlImage: 'http://localhost:3001/images/skol_beats_senses_313ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 6,
          quantity: 1,
        },
      },
      {
        id: 9,
        name: 'Becks 600ml',
        price: '8.89',
        urlImage: 'http://localhost:3001/images/becks_600ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 9,
          quantity: 3,
        },
      },
      {
        id: 11,
        name: 'Stella Artois 275ml',
        price: '3.49',
        urlImage: 'http://localhost:3001/images/stella_artois_275ml.jpg',
        SaleProduct: {
          saleId: 2,
          productId: 11,
          quantity: 4,
        },
      },
    ],
  },
];

export default salesListMock;
