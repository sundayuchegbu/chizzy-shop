import { useEffect, useState } from 'react';
import styles from './Auth.module.scss';
import loginImg from '../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/card/Card';
import { toast } from 'react-toastify';
import { validateEmail } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { REST_AUTH, register } from '../../Redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
  name: '',
  email: '',
  password: '',
  password2: '',
};
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const RegisterUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('All fields are required');
    }

    if (password.length < 6) {
      return toast.error('Password must be 6 or more characters');
    }

    if (!validateEmail(email)) {
      return toast.error('Enter valid email address');
    }

    if (password !== password2) {
      return toast.error('Password do not match');
    }
    const userData = {
      name,
      email,
      password,
    };
    await dispatch(register(userData));
  };
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate('/');
    }
    dispatch(REST_AUTH());
  }, [isSuccess, isLoggedIn, dispatch, navigate]);
  return (
    <>
      {isLoading && <Loader />}
      <section className={`container ${styles.auth}`}>
        <Card>
          <div className={styles.form}>
            <h2>Login</h2>
            <form onSubmit={RegisterUser}>
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                name="name"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                name="email"
                onChange={handleInputChange}
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                name="password"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={password2}
                name="password2"
                onChange={handleInputChange}
              />
              <button type="subnit" className="--btn --btn-primary --btn-block">
                Rgister
              </button>
            </form>
            <span className={styles.register}>
              <p>Already have an account?</p>
              <Link to="/register">Register</Link>
            </span>
          </div>
        </Card>
        <div className={styles.img}>
          <img src={loginImg} alt="login" width="400" />
        </div>
      </section>
    </>
  );
};

export default Register;
