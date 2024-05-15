"use client";
import React from "react";
import Link from 'next/link';
import styles from '../about.module.css'; // Import CSS module

const AvoutComponent: React.FC = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About UsedTube</h1>
      <p className={styles['about-text']}>
        UsedTube is a cloud storage application developed by three computer science students.
        It allows users to upload personal data and stores it for free by encoding it into
        videos uploaded to YouTube.
      </p>
      <div className={styles.buttons}>
        <Link href="/login" passHref>
          <button className={styles.log}>Login</button>
        </Link>
        <Link href="/register" passHref>
          <button className={styles.reg}>Register</button>
        </Link>
      </div>
    </div>
  );
};


export default AvoutComponent;
