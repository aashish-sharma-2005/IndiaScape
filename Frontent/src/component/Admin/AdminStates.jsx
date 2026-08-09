import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Search,
    ArrowLeft,
    ChevronRight,
    Check,
    X,
    LoaderCircle
} from "lucide-react";
import "./adminState.css";

function AdminStates() {

    const navigate = useNavigate();
    const { states, setAdminData } = useOutletContext();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [savingId, setSavingId] = useState(null);

    const visibleCount = states.filter(
        state => state.visible
    ).length;

    const hiddenCount = states.length - visibleCount;

    const filteredStates = states.filter(state => {

        const matchSearch = state.name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        const matchFilter =
            filter === "all" ||
            (filter === "visible" && state.visible) ||
            (filter === "hidden" && !state.visible);

        return matchSearch && matchFilter;
    });


    // =========================
    // TOGGLE VISIBILITY
    // =========================

    const toggleVisibility = async (state) => {

        try {

            const response = await fetch(
                `http://localhost:3000/admin/state/${state._id}/visibility`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        visible: !state.visible
                    })
                }
            );

            const result = await response.json();

            if (result.status) {

                setAdminData(prev => ({
                    ...prev,
                    states: prev.states.map(item =>
                        item._id === state._id
                            ? {
                                ...item,
                                visible: !item.visible
                            }
                            : item
                    )
                }));
            }

        } catch (error) {

            console.log(error);

        }
    };


    // =========================
    // START EDIT
    // =========================

    const startEdit = (state) => {

        setEditingId(state._id);
        setEditName(state.name);

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const cancelEdit = () => {

        setEditingId(null);
        setEditName("");

    };


    // =========================
    // SAVE STATE NAME
    // =========================

    const saveStateName = async (state) => {

        const trimmedName = editName.trim();

        if (!trimmedName) {

            alert("State name is required.");
            return;

        }

        // Nothing changed
        if (trimmedName === state.name) {

            cancelEdit();
            return;

        }

        try {

            setSavingId(state._id);

            const response = await fetch(
                `http://localhost:3000/admin/state/${state._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: trimmedName
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.status) {

                alert(
                    result.message ||
                    "Failed to update state name."
                );

                return;
            }


            // Update frontend state
            setAdminData(prev => ({
                ...prev,
                states: prev.states.map(item =>
                    item._id === state._id
                        ? {
                            ...item,
                            name: result.state?.name || trimmedName
                        }
                        : item
                )
            }));

            setEditingId(null);
            setEditName("");

        } catch (error) {

            console.log(error);

            alert(
                "Something went wrong while updating the state."
            );

        } finally {

            setSavingId(null);

        }
    };


    // =========================
    // KEYBOARD HANDLER
    // =========================

    const handleKeyDown = (e, state) => {

        if (e.key === "Enter") {
            saveStateName(state);
        }

        if (e.key === "Escape") {
            cancelEdit();
        }

    };


    return (

        <section className="states-page">

            {/* =========================
                TOP
            ========================= */}

            <div className="states-top">

                <div>

                    <span className="page-label">
                        INDIA SCAPE • ADMIN
                    </span>

                    <h1>States</h1>

                    <p>
                        Control which states are visible on your website.
                    </p>

                </div>


                <button
                    className="dashboard-btn"
                    onClick={() => navigate("/admin")}
                >
                    <ArrowLeft size={17} />
                    Dashboard
                </button>

            </div>


            {/* =========================
                STATS
            ========================= */}

            <div className="state-stats">

                <div className="state-stat">

                    <span>Total States</span>

                    <strong>
                        {states.length}
                    </strong>

                </div>


                <div className="state-stat">

                    <span>Visible</span>

                    <strong>
                        {visibleCount}
                    </strong>

                    <small>
                        ● Live
                    </small>

                </div>


                <div className="state-stat">

                    <span>Hidden</span>

                    <strong>
                        {hiddenCount}
                    </strong>

                    <small>
                        ○ Hidden
                    </small>

                </div>

            </div>


            {/* =========================
                TOOLBAR
            ========================= */}

            <div className="states-toolbar">

                <div className="state-search">

                    <Search size={19} />

                    <input
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search states..."
                    />

                </div>


                <div className="state-filters">

                    <button
                        className={
                            filter === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("all")
                        }
                    >
                        All <b>{states.length}</b>
                    </button>


                    <button
                        className={
                            filter === "visible"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("visible")
                        }
                    >
                        Visible <b>{visibleCount}</b>
                    </button>


                    <button
                        className={
                            filter === "hidden"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("hidden")
                        }
                    >
                        Hidden <b>{hiddenCount}</b>
                    </button>

                </div>

            </div>


            {/* =========================
                HEADING
            ========================= */}

            <div className="states-heading">

                <div>

                    <h2>
                        All States
                    </h2>

                    <span>
                        {filteredStates.length} states found
                    </span>

                </div>

            </div>


            {/* =========================
                STATES
            ========================= */}

            <div className="states-grid">

                {filteredStates.map((state, index) => (

                    <div
                        className="state-card"
                        key={state._id}
                    >

                        <div className="state-number">
                            {String(index + 1).padStart(2, "0")}
                        </div>


                        <div className="state-icon">
                            🇮🇳
                        </div>


                        <div className="state-details">

                            {editingId === state._id ? (

                                <input
                                    className="state-name-input"
                                    value={editName}
                                    autoFocus
                                    onChange={e =>
                                        setEditName(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={e =>
                                        handleKeyDown(
                                            e,
                                            state
                                        )
                                    }
                                />

                            ) : (

                                <h3>
                                    {state.name}
                                </h3>

                            )}


                            <span
                                className={
                                    state.visible
                                        ? "status live"
                                        : "status hidden"
                                }
                            >
                                {state.visible
                                    ? "● Visible"
                                    : "○ Hidden"}
                            </span>

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}

                        <div className="state-actions">

                            {editingId === state._id ? (

                                <>

                                    {/* SAVE */}

                                    <button
                                        title="Save"
                                        disabled={
                                            savingId === state._id
                                        }
                                        onClick={() =>
                                            saveStateName(state)
                                        }
                                    >

                                        {savingId === state._id ? (

                                            <LoaderCircle
                                                size={19}
                                                className="state-saving-spinner"
                                            />

                                        ) : (

                                            <Check size={19} />

                                        )}

                                    </button>


                                    {/* CANCEL */}

                                    <button
                                        title="Cancel"
                                        disabled={
                                            savingId === state._id
                                        }
                                        onClick={cancelEdit}
                                    >
                                        <X size={19} />
                                    </button>

                                </>

                            ) : (

                                <>

                                    {/* VIEW PLACES */}

                                    <button
                                        title="View Places"
                                        onClick={() =>
                                            navigate(
                                                `/admin/states/${state._id}`
                                            )
                                        }
                                    >
                                        <ChevronRight size={19} />
                                    </button>


                                    {/* EDIT */}

                                    <button
                                        title="Edit"
                                        onClick={() =>
                                            startEdit(state)
                                        }
                                    >
                                        ✎
                                    </button>


                                    {/* VISIBILITY */}

                                    <button
                                        title={
                                            state.visible
                                                ? "Hide State"
                                                : "Show State"
                                        }
                                        onClick={() =>
                                            toggleVisibility(state)
                                        }
                                    >
                                        {state.visible
                                            ? (
                                                <Eye size={19} />
                                            )
                                            : (
                                                <EyeOff size={19} />
                                            )}
                                    </button>

                                </>

                            )}

                        </div>

                    </div>

                ))}

            </div>


            {/* =========================
                EMPTY
            ========================= */}

            {filteredStates.length === 0 && (

                <div className="states-empty">

                    <Search size={30} />

                    <h3>
                        No states found
                    </h3>

                    <p>
                        Try a different search or filter.
                    </p>

                </div>

            )}

        </section>

    );
}

export default AdminStates;