import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeroPage.css";

import heroBg from "../../assets/1.png";
import indiaMap from "../../assets/2.png";
import rajasthan from "../../assets/3.png";
import kerala from "../../assets/4.png";
import uttarPradesh from "../../assets/5.png";
import sikkim from "../../assets/6.png";
import culturalDiversity from "../../assets/7.png";
import naturalBeauty from "../../assets/8.png";
import travelMadeEasy from "../../assets/9.png";

function HeroPage() {
    const navigate = useNavigate();

    const states = [
        {
            name: "Rajasthan",
            subtitle: "Amber Fort",
            image: rajasthan,
            path: "/state/Rajasthan"
        },
        {
            name: "Kerala",
            subtitle: "Backwaters & Hills",
            image: kerala,
            path: "/state/Kerala"
        },
        {
            name: "Uttar Pradesh",
            subtitle: "Taj Mahal, Agra",
            image: uttarPradesh,
            path: "/state/Uttar-Pradesh"
        },
        {
            name: "Sikkim",
            subtitle: "Himalayan Splendor",
            image: sikkim,
            path: "/state/Sikkim"
        }
    ];

    return (
        <div className="india-home">

            {/* NAVBAR */}
            <nav className="india-navbar">
                <div className="india-logo" onClick={() => navigate("/")}>
                    <div className="logo-circle">
                        <span>✦</span>
                    </div>
                    <span>IndiaScape</span>
                </div>

                <div className="india-nav-links">
                    <a className="active" onClick={() => navigate("/")}>Home</a>
                    <a onClick={() => navigate("/states")}>States</a>
                    <a onClick={() => navigate("/famous-places")}>Famous Places</a>
                    <a onClick={() => navigate("/about")}>About</a>
                    <a onClick={() => navigate("/contact")}>Contact</a>
                </div>
            </nav>

            {/* HERO */}
            <section
                className="hero-section"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1>
                        Discover India's Wonders,
                        <br />
                        State by State
                    </h1>

                    <div className="hero-line"></div>

                    <p>
                        Explore iconic destinations, rich culture and breathtaking
                        <br />
                        beauty—all in one place.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="explore-btn blue"
                            onClick={() => navigate("/states")}
                        >
                            Explore States
                        </button>

                        <button
                            className="explore-btn red"
                            onClick={() => navigate("/famous-places")}
                        >
                            Start Your Journey
                        </button>
                    </div>
                </div>
            </section>

            {/* REGION TITLE */}
            <section className="region-section">

                <div className="section-heading">
                    <span></span>
                    <h2>Explore India by Region</h2>
                    <span></span>
                </div>

                {/* MAP AREA */}
                <div className="region-main">

                    <div className="map-card">

                        <div className="map-background"></div>

                        <img
                            src={indiaMap}
                            alt="India Map"
                            className="india-map"
                        />

                        <div className="map-label">
                            <img src={kerala} alt="India Backwaters" />

                            <div>
                                <strong>INDIA</strong>
                                <b>BACKWATERS</b>
                                <small>⟷ Hills</small>
                            </div>
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="quick-stats">

                        <h3>Quick Stats</h3>

                        <div className="stat-item">
                            <span className="check">✓</span>
                            <div>
                                <b>Popular States</b>
                                <p>Top destinations</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <span className="check">✓</span>
                            <div>
                                <b>Famous Places</b>
                                <p>Iconic landmarks</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <span className="check">✓</span>
                            <div>
                                <b>About India</b>
                                <p>Culture, heritage & beauty</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/states")}
                            className="small-red-btn"
                        >
                            Explore More <span>⌄</span>
                        </button>

                    </div>

                </div>

                {/* STATE CARDS */}
                <div className="state-grid">

                    {states.map((state) => (
                        <div className="state-card" key={state.name}>

                            <img
                                src={state.image}
                                alt={state.name}
                            />

                            <div className="state-info">
                                <h3>{state.name}</h3>
                                <p>{state.subtitle}</p>

                                <button
                                    onClick={() => navigate(state.path)}
                                    className="small-red-btn"
                                >
                                    Explore More <span>⌄</span>
                                </button>
                            </div>

                        </div>
                    ))}

                </div>

            </section>

            {/* WHY CHOOSE */}
            <section className="why-section">

                <div className="section-heading why-heading">
                    <span></span>
                    <h2>Why Choose <strong>IndiaScape?</strong></h2>
                    <span></span>
                </div>

                <div className="why-grid">

                    <div className="why-item">
                        <img src={culturalDiversity} alt="Cultural Diversity" />
                        <div>
                            <h3>Cultural Diversity</h3>
                            <p>Experience Heritage & Traditions</p>
                        </div>
                    </div>

                    <div className="why-item">
                        <img src={naturalBeauty} alt="Natural Beauty" />
                        <div>
                            <h3>Natural Beauty</h3>
                            <p>From Mountains to Beaches</p>
                        </div>
                    </div>

                    <div className="why-item">
                        <img src={travelMadeEasy} alt="Travel Made Easy" />
                        <div>
                            <h3>Travel Made Easy</h3>
                            <p>Plan Your Perfect Trip</p>
                        </div>
                    </div>

                </div>

            </section>
        </div>
    );
}

export default HeroPage;