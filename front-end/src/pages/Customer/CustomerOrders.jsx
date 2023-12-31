import { useState, useEffect } from 'react';
import CardSale from '../../components/CardSale';
import Header from '../../components/Header';
import { getAllSales } from '../../service/requests';

function CustomerOrders() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllSales();
      setProducts(data);
    };

    getData();
  }, []);

  return (
    <div className="products_page">
      <Header />
      <main className="products_container">
        { products.map((sale) => <CardSale key={ sale.id } { ...sale } />)}
      </main>
    </div>
  );
}

export default CustomerOrders;
