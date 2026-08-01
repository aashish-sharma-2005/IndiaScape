function AdminStats({ places = [], states = [], drafts = [] }) {
    return (
        <section className="admin-stats">
            <div className="stat-card orange">
                <div className="stat-icon">📍</div>

                <div>
                    <span>Total Places</span>
                    <strong>{places.length}</strong>
                    <small>All destinations</small>
                </div>

                <div className="stat-shape">✦</div>
            </div>

            <div className="stat-card purple">
                <div className="stat-icon">🗺️</div>

                <div>
                    <span>Total States</span>
                    <strong>{states.length}</strong>
                    <small>Across India</small>
                </div>

                <div className="stat-shape">✦</div>
            </div>

            <div className="stat-card green">
                <div className="stat-icon">🖼️</div>

                <div>
                    <span>Destination Images</span>
                    <strong>
                        {places.reduce(
                            (total, place) =>
                                total + (place.photos?.length || 0),
                            0
                        )}
                    </strong>
                    <small>Travel memories</small>
                </div>

                <div className="stat-shape">✦</div>
            </div>

            <div className="stat-card blue">
                <div className="stat-icon">📝</div>

                <div>
                    <span>Total Drafts</span>
                    <strong>{drafts.length}</strong>
                    <small>Pending destinations</small>
                </div>

                <div className="stat-shape">✦</div>
            </div>
        </section>
    );
}

export default AdminStats;