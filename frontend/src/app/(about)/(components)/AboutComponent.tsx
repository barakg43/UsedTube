"use client";
import React from "react";
import Link from "next/link";
import styles from "../about.module.css"; // Import CSS module
import Logo from "@/app/(common)/(components)/Logo";
import "@/app/globals.css";

const AboutComponent: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className="mb-[3%]">
                <Logo />
            </div>
            <p className={styles["about-text"]}>
                UsedTube is a cloud storage application developed by three
                computer science students. It allows users to upload personal
                data and stores it for free by encoding it into videos uploaded
                to YouTube.
            </p>
            <div className={styles.buttons}>
                <Link href="/login">
                    <button className={styles.log}>Login</button>
                </Link>
                <Link href="/register">
                    <button className={styles.reg}>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default AboutComponent;
