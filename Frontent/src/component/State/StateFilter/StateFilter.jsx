import "./stateFilter.css";

function StateFilter({
    activeCategory,
    setActiveCategory
}) {

    const categories = [
        "All",
        "North",
        "South",
        "East",
        "West"
    ];


    return (
        <div className="state-filter">

            {categories.map((category) => (

                <button
                    key={category}
                    className={
                        activeCategory === category
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveCategory(category)
                    }
                >
                    {category}
                </button>

            ))}

        </div>
    );
}

export default StateFilter;