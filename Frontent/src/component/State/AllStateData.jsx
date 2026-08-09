import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import StateHero from "./StateHero/StateHero";
import StateIntro from "./StateIntro/StateIntro";
import StateFilter from "./StateFilter/StateFilter";
import StateGrid from "./StateGrid/StateGrid";

import "./allStateData.css";

export function AllStateData() {

    const {
        states = [],
        famous = [],
        loading
    } = useSelector((state) => state.states);

    const [activeCategory, setActiveCategory] = useState("All");

    const filteredStates = useMemo(() => {

        if (activeCategory === "All") {
            return states;
        }

        return states.filter(
            (state) =>
                state.category?.toLowerCase() ===
                activeCategory.toLowerCase()
        );

    }, [states, activeCategory]);


    // Show skeleton while data is loading
    if (loading) {
        return (
            <main className="all-states-page">

                <div className="states-loading">

                    <div className="loading-hero">
                        <div className="skeleton skeleton-hero-title"></div>
                        <div className="skeleton skeleton-hero-text"></div>
                        <div className="skeleton skeleton-hero-text short"></div>
                    </div>

                    <div className="loading-content">

                        <div className="skeleton skeleton-heading"></div>

                        <div className="skeleton-grid">

                            {Array.from({ length: 8 }).map((_, index) => (
                                <div
                                    className="skeleton-state-card"
                                    key={index}
                                >
                                    <div className="skeleton skeleton-card-image"></div>

                                    <div className="skeleton-card-content">
                                        <div className="skeleton skeleton-card-title"></div>
                                        <div className="skeleton skeleton-card-text"></div>
                                        <div className="skeleton skeleton-card-text short"></div>
                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    return (
        <main className="all-states-page">

            <StateHero famous={famous} />

            <StateIntro
                stateCount={states.length}
            />

            <StateFilter
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            <section className="states-section">

                <div className="states-section-top">

                    <div>
                        <span className="states-section-eyebrow">
                            DESTINATIONS
                        </span>

                        <h3>
                            Where will you go?
                        </h3>
                    </div>

                    <span className="states-result-count">
                        {filteredStates.length} destinations
                    </span>

                </div>

                <StateGrid states={filteredStates} />

            </section>

        </main>
    );
}