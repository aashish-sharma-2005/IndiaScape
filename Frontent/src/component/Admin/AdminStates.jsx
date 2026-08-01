import { useState } from "react";
import { useNavigate,useOutletContext } from "react-router-dom";
import { Eye,EyeOff,Search,ArrowLeft,ChevronRight } from "lucide-react";
import "./adminState.css";

function AdminStates(){
    const navigate=useNavigate();
    const {states,setAdminData}=useOutletContext();
    const [search,setSearch]=useState("");
    const [filter,setFilter]=useState("all");

    const visibleCount=states.filter(s=>s.visible).length;
    const hiddenCount=states.length-visibleCount;

    const filteredStates=states.filter(state=>{
        const matchSearch=state.name?.toLowerCase().includes(search.toLowerCase());
        const matchFilter=filter==="all"||filter==="visible"&&state.visible||filter==="hidden"&&!state.visible;
        return matchSearch&&matchFilter;
    });

    const toggleVisibility=async(state)=>{
        try{
            const response=await fetch(`http://localhost:3000/admin/state/${state._id}/visibility`,{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify({visible:!state.visible})
            });
            const result=await response.json();
            if(result.status){
                setAdminData(prev=>({...prev,states:prev.states.map(item=>item._id===state._id?{...item,visible:!item.visible}:item)}));
            }
        }catch(error){
            console.log(error);
        }
    };

    return(
        <section className="states-page">
            <div className="states-top">
                <div>
                    <span className="page-label">INDIA SCAPE • ADMIN</span>
                    <h1>States</h1>
                    <p>Control which states are visible on your website.</p>
                </div>
                <button className="dashboard-btn" onClick={()=>navigate("/admin")}><ArrowLeft size={17}/> Dashboard</button>
            </div>

            <div className="state-stats">
                <div className="state-stat"><span>Total States</span><strong>{states.length}</strong></div>
                <div className="state-stat"><span>Visible</span><strong>{visibleCount}</strong><small>● Live</small></div>
                <div className="state-stat"><span>Hidden</span><strong>{hiddenCount}</strong><small>○ Hidden</small></div>
            </div>

            <div className="states-toolbar">
                <div className="state-search">
                    <Search size={19}/>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search states..."/>
                </div>
                <div className="state-filters">
                    <button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>All <b>{states.length}</b></button>
                    <button className={filter==="visible"?"active":""} onClick={()=>setFilter("visible")}>Visible <b>{visibleCount}</b></button>
                    <button className={filter==="hidden"?"active":""} onClick={()=>setFilter("hidden")}>Hidden <b>{hiddenCount}</b></button>
                </div>
            </div>

            <div className="states-heading">
                <div><h2>All States</h2><span>{filteredStates.length} states found</span></div>
            </div>

            <div className="states-grid">
                {filteredStates.map((state,index)=>(
                    <div className="state-card" key={state._id}>
                        <div className="state-number">{String(index+1).padStart(2,"0")}</div>
                        <div className="state-icon">🇮🇳</div>
                        <div className="state-details">
                            <h3>{state.name}</h3>
                            <span className={state.visible?"status live":"status hidden"}>{state.visible?"● Visible":"○ Hidden"}</span>
                        </div>
                        <div className="state-actions">
                            <button title="View Places" onClick={()=>navigate(`/admin/states/${state._id}`)}><ChevronRight size={19}/></button>
                            <button title="Edit">✎</button>
                            <button title={state.visible?"Hide State":"Show State"} onClick={()=>toggleVisibility(state)}>{state.visible?<Eye size={19}/>:<EyeOff size={19}/>}</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStates.length===0&&<div className="states-empty"><Search size={30}/><h3>No states found</h3><p>Try a different search or filter.</p></div>}
        </section>
    );
}

export default AdminStates;