import "./stateIntro.css";

function StateIntro({ stateCount }) {

    return (
        <section
            className="state-intro"
            id="states-explorer"
        >

            <div>

                <span className="state-section-label">
                    DISCOVER INDIA
                </span>

                <h2>
                    Explore Indian
                    <span> States</span>
                </h2>

                <p>
                    From majestic mountains to tropical
                    beaches, ancient forts to vibrant cities —
                    every state has a story waiting to be
                    discovered.
                </p>

            </div>


            <div className="state-count">

                <strong>
                    {stateCount}
                </strong>

                <span>
                    States &
                    <br />
                    Union Territories
                </span>

            </div>

        </section>
    );
}

export default StateIntro;