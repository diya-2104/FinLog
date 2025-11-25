import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="brand">
                    <i className="fas fa-chart-line text-xl text-blue-400"></i>
                    <span className="font-bold">FinTrack</span>
                </div>

                <div className="links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Us</a>
                </div>

                <div className="social">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                </div>
            </div>

            <div className="footer-copy">
                <p>© 2023 FinTrack. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
