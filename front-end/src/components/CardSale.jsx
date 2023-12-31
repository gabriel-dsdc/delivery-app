import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const colors = { Pendente: '',
  Preparando: 'yellow',
  'Em Trânsito': 'orange',
  Entregue: 'green' };
function CardSale({ id,
  totalPrice, deliveryAddress, deliveryNumber, saleDate, status }) {
  const { role } = JSON.parse(localStorage.getItem('user'));

  return (
    <Link to={ `/${role}/orders/${id}` }>
      <section className={ `users_card ${colors[status]}` }>
        <p data-testid={ `${role}_orders__element-order-id-${id}` }>{id}</p>
        <p data-testid={ `${role}_orders__element-delivery-status-${id}` }>{status}</p>
        <p data-testid={ `${role}_orders__element-order-date-${id}` }>
          {moment(saleDate).format('DD/MM/YYYY')}
        </p>
        <p data-testid={ `${role}_orders__element-card-price-${id}` }>{totalPrice.replace(/\./, ',')}</p>
        <p data-testid={ `${role}_orders__element-card-address-${id}` }>
          {`${deliveryAddress}, ${deliveryNumber}`}
        </p>
      </section>
    </Link>
  );
}

CardSale.propTypes = {
  id: PropTypes.number,
  totalPrice: PropTypes.number,
  deliveryAddress: PropTypes.string,
  deliveryNumber: PropTypes.number,
  saleDate: PropTypes.string,
  status: PropTypes.string,
}.isRequired;

export default CardSale;
