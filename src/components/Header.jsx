import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCart } from '../features/cartSlice';

const Header = () => {
  const cart = useSelector(selectCart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
  <header style={styles.header}>
    <div style={styles.logoWrapper}>
      <div style={styles.logoText}>🛒 TechStore</div>
    </div>
    <nav style={styles.nav}>
      <Link to="/home" style={styles.link}>Home</Link>
      <Link to="/cart" style={styles.cartLink}>
        Cart <span style={styles.cartBadge}>{totalItems}</span>
      </Link>
      <Link to="/checkout" style={styles.link}>Checkout</Link>
    </nav>
  </header>
);

};

const styles = {
  header: {
    width: '100vw',
    background: 'linear-gradient(90deg,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 100%)',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    boxSizing: 'border-box',
  },

  logoWrapper: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#fff',
    whiteSpace: 'nowrap',
  },

  logoText: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1.6rem',
  },

  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },

  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'color 0.3s',
    whiteSpace: 'nowrap',
  },

  cartLink: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    position: 'relative',
    whiteSpace: 'nowrap',
  },

  cartBadge: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    borderRadius: '50%',
    padding: '0.2rem 0.6rem',
    fontSize: '0.8rem',
    minWidth: '1.5rem',
    textAlign: 'center',
  },
};


export default Header;
