import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        cart: [],
      });
      alert("Signup successful! Now login.");
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
       <h2>Create an Account - testing page</h2>
        <p>Sign up</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <p className="redirect">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>signin here</span>
        </p>
      </form>

      <style jsx="true">{`
  .signup-container {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    box-sizing: border-box;
  }

  .signup-form {
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

  .signup-form h1 {
    font-size: 2rem;
    color: #203a43;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: 600;
  }

  .signup-form input {
    padding: 0.9rem 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .signup-form input:focus {
    border-color: #1e88e5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.15);
  }

  .signup-form button {
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

  .signup-form button:hover {
    background: #1565c0;
  }

  .redirect {
    margin-top: 0.8rem;
    font-size: 0.95rem;
    text-align: center;
    color: #333;
  }

  .signup-form h2 {
  font-size: 30px;
  margin-bottom: 10px;
  color:rgb(19, 99, 156);
  text-align: center;
  text-shadow: 0 0 8px rgba(242, 242, 242, 0.9), 0 0 12px rgb(255, 255, 255);
}

.signup-form p {
  font-size: 18px;
  margin-bottom: 25px;
  color:rgb(44, 163, 228); /* Stylish golden shade */
  text-align: center;
  text-shadow: 0 0 6px rgba(55, 181, 212, 0.7);
}


  .redirect span {
    color:rgb(30, 229, 176);
    font-weight: 800;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .redirect span:hover {
    color:rgb(29, 158, 92);
  }

  @media (max-width: 480px) {
    .signup-form {
      padding: 2rem 1.2rem;
    }

    .signup-form h1 {
      font-size: 1.6rem;
    }

    .signup-form button {
      font-size: 1rem;
    }
  }
`}</style>

    </div>
  );
};

export default Signup;
