import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return <div className={styles.footer}> &copy; {year} All right reserve</div>;
};

export default Footer;
