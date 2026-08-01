function RecentDrafts({ drafts = [] }) {
    return (
        <div className="recent-drafts-card">
            <div className="recent-drafts-top">
                <div>
                    <h2>Recent Drafts</h2>
                    <p>Recently saved destinations</p>
                </div>

                <button>View All →</button>
            </div>

            <div className="draft-list">
                {drafts.slice(0, 3).map((draft) => (
                    <div className="draft-row" key={draft._id}>
                        <div className="draft-image">
                            📝
                        </div>

                        <div className="draft-info">
                            <h4>{draft.name}</h4>
                            <p>{draft.state_id?.name || "Unknown State"}</p>
                        </div>

                        <span className="draft-status">
                            Draft
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentDrafts;