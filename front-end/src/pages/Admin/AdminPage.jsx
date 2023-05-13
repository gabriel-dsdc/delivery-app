import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import UserInfo from '../../components/UserInfo';
import { deleteUser, getAllUsers, registerSubmit } from '../../service/requests';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [invalid, setInvalid] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');

  useEffect(() => {
    const requisition = async () => {
      const info = await getAllUsers();
      setUsers(info);
    };
    requisition();
  }, []);

  const isDisabled = () => {
    const regex = /\S+@\S+\.\S+/i;
    const MIN_LENGTH = 6;
    const MIN_LENGTH_NAME = 12;
    return !(regex.test(email)
      && password.length >= MIN_LENGTH && name.length >= MIN_LENGTH_NAME);
  };

  const handleSubmit = async () => {
    const body = { email, password, name, role };
    const result = await registerSubmit(body);
    if (!result) {
      setInvalid(true);
    } else {
      setUsers(await getAllUsers());
    }
  };

  const handleDelete = async (mail) => {
    const funcdelete = await deleteUser(mail);
    if (funcdelete) {
      const info = await getAllUsers();
      setUsers(info);
    }
  };

  return (
    <div className="products_page">
      <Header />
      <form className="details_form">
        <h2>Cadastrar novo usuário</h2>
        {
          invalid && (
            <span data-testid="admin_manage__element-invalid-register">
              Já existe um usuário usando esse endereço de email
            </span>
          )
        }
        <input
          data-testid="admin_manage__input-name"
          type="text"
          placeholder="nome"
          value={ name }
          onChange={ (event) => setName(event.target.value) }
        />
        <input
          data-testid="admin_manage__input-email"
          type="email"
          placeholder="email"
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
        />
        <input
          data-testid="admin_manage__input-password"
          type="password"
          placeholder="password"
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
        />
        <select
          data-testid="admin_manage__select-role"
          value={ role }
          onChange={ (event) => setRole(event.target.value) }
        >
          <option value="seller">Vendedor</option>
          <option value="admin">Administrador</option>
          <option value="customer">Cliente</option>
        </select>
        <button
          type="button"
          disabled={ isDisabled() }
          onClick={ handleSubmit }
          data-testid="admin_manage__button-register"
        >
          Cadastrar
        </button>
      </form>
      <section>
        <h3>Lista de Usuários</h3>
        <div className="products_container">
          {
            users && (
              users.map((user, index) => (
                <UserInfo
                  key={ user.email }
                  item={ index }
                  handleDelete={ async () => handleDelete(user.email) }
                  { ...user }
                />
              ))
            )
          }
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
