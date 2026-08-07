import "./quickStats.css";

function QuickStats({
    stateCount,
    famousCount
}) {

    return (
        <aside className="quick-stats">

            <div className="stats-header">

                <span>
                    INDIASCAPE
                </span>

                <h3>
                    Quick
                    <br />
                    Stats
                </h3>

            </div>


            <div className="stat-item">

                <span className="stat-icon">
                    ◈
                </span>

                <div>

                    <strong>
                        {stateCount}
                    </strong>

                    <small>
                        States to explore
                    </small>

                </div>

            </div>


            <div className="stat-item">

                <span className="stat-icon">
                    ✦
                </span>

                <div>

                    <strong>
                        {famousCount}+
                    </strong>

                    <small>
                        Famous places
                    </small>

                </div>

            </div>


            <div className="stat-item">

                <span className="stat-icon">
                    ◎
                </span>

                <div>

                    <strong>
                        28+
                    </strong>

                    <small>
                        Unique cultures
                    </small>

                </div>

            </div>


            <div className="stats-quote">

                <p>
                    "India is not a country,
                    it's a collection of
                    unforgettable journeys."
                </p>

            </div>


            <button
                className="stats-explore"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })
                }
            >
                Back to Top ↑
            </button>

        </aside>
    );
}

export default QuickStats;