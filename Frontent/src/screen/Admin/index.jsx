import { useOutletContext } from "react-router-dom";

import AdminStats from "../../component/Admin/AdminStats";
import TopDestinations from "../../component/Admin/TopDestinations";
import RecentPlaces from "../../component/Admin/RecentPlaces";
import PlacesManagement from "../../component/Admin/PlacesManagement";
import RecentDrafts from "../../component/Admin/RecentDrafts";
import "./admin.css";

function Admin() {

    const {
        places,
        states,
        drafts,
        featuredPlaces,
        stats,
        setAdminData
    } = useOutletContext();


    return (
        <>

            <AdminStats
                places={places}
                states={states}
                drafts={drafts}
                stats={stats}
            />


            <div className="admin-content-grid">

                <div className="admin-left-content">

                    <TopDestinations 
                        places={featuredPlaces}
                    />

                    <RecentPlaces 
                        places={places}
                    />

                </div>


                <div className="admin-right-content">

                    <PlacesManagement
                        places={places}
                        setAdminData={setAdminData}
                    />

                    <RecentDrafts
                        drafts={drafts}
                    />

                </div>

            </div>

        </>
    );
}

export default Admin;