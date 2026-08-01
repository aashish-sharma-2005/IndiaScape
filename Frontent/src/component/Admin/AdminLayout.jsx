import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout() {

    const user = useSelector(
        (state) => state.loginReducer.user
    );

    const [adminData, setAdminData] = useState({
        places: [],
        states: [],
        drafts: [],
        featuredPlaces: [],
        stats: {}
    });

    useEffect(() => {
        const getAdminData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/admin/data",
                    {
                        credentials: "include"
                    }
                );

                const result = await response.json();

                if (result.status) {
                    setAdminData({
                        places: result.places,
                        states: result.states,
                        drafts: result.drafts,
                        featuredPlaces: result.featuredPlaces,
                        stats: result.stats
                    });
                }

            } catch (error) {
                console.log(error);
            }
        };

        getAdminData();

    }, []);

    return (
        <div className="admin-page">

            <AdminSidebar
                placesCount={adminData.places.length}
                statesCount={adminData.states.length}
            />

            <main className="admin-main">

                <AdminTopbar user={user} />

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