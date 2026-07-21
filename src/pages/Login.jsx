import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import { getUserCart } from '../services/firebaseCartService';
import { setCart } from '../features/cartSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Save user to Redux
    dispatch(setUser({ uid: user.uid, email: user.email }));

    // ✅ Fetch user's cart from Firestore
    const cartItems = await getUserCart(user.uid);

    // ✅ Save cart to Redux store
    dispatch(setCart(cartItems));

    alert("Login successful! Now redirecting to home page.");
    navigate('/home');
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Welcome Back to sign-in page</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">signin</button>
        <p className="redirect">
          New user?{' '}
          <span onClick={() => navigate('/')}>
            Create an account
          </span>
        </p>
      </form>

    <style jsx="true">{`
  .login-container {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    box-sizing: border-box;
  }

  .login-form {
    background-color: #ffffff;
    padding: 2.5rem 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .login-form h1 {
    font-size: 2rem;
    color: #203a43;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 600;
  }

  .login-form input {
    padding: 0.9rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .login-form input:focus {
    border-color: #1e88e5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.15);
  }

  .login-form button {
    padding: 0.9rem;
    background: #1e88e5;
    color: #ffffff;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .login-form button:hover {
    background: #1565c0;
  }

  .redirect {
    margin-top: 0.8rem;
    font-size: 0.95rem;
    text-align: center;
    color: #333;
  }

  .redirect span {
    color: #1e88e5;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .redirect span:hover {
    color: #1565c0;
  }

  @media (max-width: 480px) {
    .login-form {
      padding: 2rem 1.2rem;
    }

    .login-form h1 {
      font-size: 1.6rem;
    }

    .login-form button {
      font-size: 1rem;
    }
  }
`}</style>

    </div>
  );
};

export default Login;
