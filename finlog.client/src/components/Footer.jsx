import React from "react";
import "../styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            {/*<div className="footer-content">*/}
            {/*    <div className="brand">*/}
            {/*        <i className="fas fa-chart-line"></i>*/}
            {/*        <span>FinLog</span>*/}
            {/*    </div>*/}
            {/*    */}{/*<div className="links">*/}
            {/*    */}{/*    <a href="#">Privacy Policy</a>*/}
            {/*    */}{/*    <a href="#">Terms of Service</a>*/}
            {/*    */}{/*    <a href="#">Contact Us</a>*/}
            {/*    */}{/*</div>*/}
            {/*    */}{/*<div className="social">*/}
            {/*    */}{/*    <a href="#"><i className="fab fa-twitter"></i></a>*/}
            {/*    */}{/*    <a href="#"><i className="fab fa-facebook"></i></a>*/}
            {/*    */}{/*    <a href="#"><i className="fab fa-instagram"></i></a>*/}
            {/*    */}{/*    <a href="#"><i className="fab fa-linkedin"></i></a>*/}
            {/*    */}{/*</div>*/}
            {/*</div>*/}
            <div className="footer-copy">
                <p>© FinLog - A Personal Finance Tracker.<br/> Designed by Diya & Hasti</p>
            </div>
        </footer>
    );
};

export default Footer;