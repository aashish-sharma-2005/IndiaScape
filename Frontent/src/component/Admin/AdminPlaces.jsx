import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AddPlace from "./AddPlace";
import "./adminPlace.css";
import { toast } from "react-toastify";


function AdminPlaces() {

    const navigate = useNavigate();


    const {
        places,
        setAdminData
    } = useOutletContext();


    const [editPlace, setEditPlace] = useState(null);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("latest");


    const featuredCount = places.filter(
        (place) => place.featured
    ).length;


    const filteredPlaces = places
        .filter((place) => {

            const value =
                search.toLowerCase();


            const matchSearch =
                place.name
                    ?.toLowerCase()
                    .includes(value) ||

                place.title
                    ?.toLowerCase()
                    .includes(value) ||

                place.state_id?.name
                    ?.toLowerCase()
                    .includes(value);


            const matchFilter =
                filter === "all" ||

                (
                    filter === "featured" &&
                    place.featured
                ) ||

                (
                    filter === "normal" &&
                    !place.featured
                );


            return (
                matchSearch &&
                matchFilter
            );

        })
        .sort((a, b) => {

            if (sort === "name") {

                return a.name.localeCompare(
                    b.name
                );

            }


            if (sort === "views") {

                return (
                    (b.views || 0) -
                    (a.views || 0)
                );

            }


            if (sort === "featured") {

                return (
                    b.featured -
                    a.featured
                );

            }


            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

        });


    // =========================================
    // DELETE PLACE
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this place?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:3000/admin/place/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            const result =
                await response.json();


            if (result.status) {

                toast.success(
                    "Place deleted successfully"
                );


                // =================================
                // UPDATE ADMIN DATA
                // =================================

                setAdminData((prev) => ({

                    ...prev,

                    places:
                        prev.places.filter(
                            (place) =>
                                place._id !== id
                        ),

                    featuredPlaces:
                        prev.featuredPlaces.filter(
                            (place) =>
                                place._id !== id
                        )

                }));

            } else {

                toast.error(
                    result.message ||
                    "Failed to delete place"
                );

            }

        } catch (error) {

            console.log(
                "Delete place error:",
                error
            );

            toast.error(
                "Something went wrong"
            );

        }

    };


    // =========================================
    // TOGGLE FEATURED
    // =========================================

    const toggleFeatured = async (place) => {

        try {

            const response = await fetch(
                `http://localhost:3000/admin/place/${place._id}/featured`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        featured:
                            !place.featured
                    })

                }
            );


            const result =
                await response.json();


            if (result.status) {

                toast.success(
                    "Featured updated"
                );


                setAdminData((prev) => ({

                    ...prev,

                    places:
                        prev.places.map(
                            (item) =>
                                item._id === place._id
                                    ? {
                                        ...item,
                                        featured:
                                            !item.featured
                                    }
                                    : item
                        ),

                    featuredPlaces:
                        !place.featured

                            ? [
                                ...prev.featuredPlaces,
                                {
                                    ...place,
                                    featured: true
                                }
                            ]

                            : prev.featuredPlaces.filter(
                                (item) =>
                                    item._id !==
                                    place._id
                            )

                }));

            } else {

                toast.error(
                    result.message
                );

            }

        } catch (error) {

            console.log(error);

            toast.error(
                "Something went wrong"
            );

        }

    };


    return (

        <section className="places-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="places-page-header">

                <div>

                    <h1>
                        Manage Places
                    </h1>

                    <p>
                        Manage all destinations on IndiaScape
                    </p>

                    <div className="featured-count">
                        ⭐ Featured {featuredCount}/6
                    </div>

                </div>


                <div className="places-header-actions">

                    <button
                        className="back-dashboard-btn"
                        onClick={() =>
                            navigate("/admin")
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        className="add-place-btn"
                        onClick={() =>
                            setShowAddModal(true)
                        }
                    >
                        + Add New Place
                    </button>

                </div>

            </div>


            {/* =================================
                TOOLBAR
            ================================= */}

            <div className="places-toolbar">

                <div className="places-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by place, title or state..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    {search && (

                        <button
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>

                    )}

                </div>


                <div className="places-filters">

                    <select
                        value={filter}
                        onChange={(e) => {

                            setFilter(
                                e.target.value
                            );

                            setSort("latest");

                        }}
                    >

                        <option value="all">
                            All Places
                        </option>

                        <option value="featured">
                            Featured
                        </option>

                        <option value="normal">
                            Normal
                        </option>

                    </select>


                    <select
                        value={sort}
                        onChange={(e) =>
                            setSort(
                                e.target.value
                            )
                        }
                    >

                        <option value="latest">
                            Latest
                        </option>

                        <option value="views">
                            Most Views
                        </option>

                        <option value="name">
                            Name A-Z
                        </option>

                    </select>

                </div>


                <span className="places-count">
                    {filteredPlaces.length} Places
                </span>

            </div>


            {/* =================================
                PLACES
            ================================= */}

            <div className="places-list">

                {filteredPlaces.map(
                    (place) => (

                        <div
                            className="place-row"
                            key={place._id}
                        >

                            <div className="place-image-box">

                                <img
                                    src={
                                        place.photos?.[0]?.url
                                    }
                                    alt=""
                                    loading="lazy"

                                    onError={(e) => {

                                        e.currentTarget.style.display =
                                            "none";

                                    }}

                                />

                            </div>


                            <div className="place-row-info">

                                <h3>
                                    {place.name}
                                </h3>


                                <p>
                                    {place.title}
                                </p>


                                <span>

                                    📍{" "}
                                    {place.state_id?.name}

                                    {!place.state_id?.visible && (

                                        <small className="hidden-state-badge">
                                            Hidden
                                        </small>

                                    )}

                                </span>

                            </div>


                            <label className="featured-toggle">

                                <input
                                    type="checkbox"
                                    checked={
                                        place.featured ||
                                        false
                                    }
                                    onChange={() =>
                                        toggleFeatured(
                                            place
                                        )
                                    }
                                />

                                Featured

                            </label>


                            <div className="place-row-views">

                                <small>
                                    Views
                                </small>

                                <strong>
                                    {place.views || 0}
                                </strong>

                            </div>


                            <div className="place-row-actions">

                                <button
                                    onClick={() => {

                                        setEditPlace(
                                            place
                                        );

                                        setShowAddModal(
                                            true
                                        );

                                    }}
                                >
                                    ✎
                                </button>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            place._id
                                        )
                                    }
                                >
                                    🗑
                                </button>

                            </div>

                        </div>

                    )
                )}


                {filteredPlaces.length === 0 && (

                    <div className="empty-search">

                        🔎

                        <p>
                            No place found
                        </p>

                    </div>

                )}

            </div>


            {/* =================================
                ADD / EDIT MODAL
            ================================= */}

            {showAddModal && (

                <AddPlace

                    editPlace={
                        editPlace
                    }

                    onClose={() => {

                        setShowAddModal(
                            false
                        );

                        setEditPlace(
                            null
                        );

                    }}

                />

            )}

        </section>

    );

}


export default AdminPlaces;