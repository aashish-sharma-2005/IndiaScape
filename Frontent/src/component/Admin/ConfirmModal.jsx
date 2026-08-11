import "./confirmModal.css";

function ConfirmModal({
    open,
    title,
    message,
    warning,
    confirmText,
    cancelText = "Cancel",
    icon = "⚠",
    type = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="confirm-modal-overlay"
            onClick={onCancel}
        >
            <div
                className={`confirm-modal ${type}`}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* ICON */}

                <div className="confirm-modal-icon">
                    {icon}
                </div>

                {/* CONTENT */}

                <h2>
                    {title}
                </h2>

                <p>
                    {message}
                </p>

                {warning && (
                    <span className="confirm-modal-warning">
                        {warning}
                    </span>
                )}

                {/* ACTIONS */}

                <div className="confirm-modal-actions">

                    <button
                        type="button"
                        className="confirm-modal-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className="confirm-modal-confirm"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : confirmText}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;