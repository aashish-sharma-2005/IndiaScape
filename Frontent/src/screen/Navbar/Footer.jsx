import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {

    const navigate = useNavigate();

    return (
        <footer className="india-footer">

                <div className="footer-top">

                    <div className="social-section">
                        <span>Follow Us</span>

                        <div className="social-icons">
                            <span>f</span>
                            <span>♥</span>
                            <span>◎</span>
                            <span>▶</span>
                        </div>
                    </div>

                    <div className="footer-links">
                        <a>About Us</a>
                        <i></i>
                        <a>Contact Us</a>
                        <i></i>
                        <a>Help</a>
                        <i></i>
                        <a>Privacy Policy</a>
                    </div>

                </div>

                <div className="footer-bottom">
                    © 2023 IndiaScape. All rights reserved.
                </div>

            </footer>
    );
}

export default Footer;