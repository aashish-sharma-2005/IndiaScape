import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";


function AdminLayout() {

    // =========================================
    // USER
    // =========================================

    const user = useSelector(
        (state) => state.loginReducer.user
    );


    // =========================================
    // REDUX PLACES
    // =========================================

    const reduxPlaces = useSelector(
        (state) => state.places.places
    );


    // =========================================
    // ADMIN DATA
    // =========================================

    const [adminData, setAdminData] = useState({

        places: [],
        states: [],
        drafts: [],
        featuredPlaces: [],
        stats: {}

    });


    // =========================================
    // FETCH ADMIN DATA
    // =========================================

    useEffect(() => {

        const getAdminData = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/admin/data",
                    {
                        credentials: "include"
                    }
                );


                const result =
                    await response.json();


                if (result.status) {

                    setAdminData({

                        places:
                            result.places || [],

                        states:
                            result.states || [],

                        drafts:
                            result.drafts || [],

                        featuredPlaces:
                            result.featuredPlaces || [],

                        stats:
                            result.stats || {}

                    });

                }

            } catch (error) {

                console.log(
                    "Admin data error:",
                    error
                );

            }

        };


        getAdminData();

    }, []);


    // =========================================
    // SYNC REDUX PLACES
    // =========================================

    useEffect(() => {

        if (!reduxPlaces) {
            return;
        }


        setAdminData((prev) => ({

            ...prev,

            places: reduxPlaces

        }));

    }, [reduxPlaces]);


    // =========================================
    // RETURN
    // =========================================

    return (

        <div className="admin-page">

            <AdminSidebar
                placesCount={
                    adminData.places.length
                }

                statesCount={
                    adminData.states.length
                }
            />


            <main className="admin-main">

                <AdminTopbar
                    user={user}
                />


                <Outlet
                    context={{

                        ...adminData,

                        setAdminData

                    }}
                />

            </main>

        </div>

    );

}


export default AdminLayout;