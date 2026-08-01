import { Formik, Form } from "formik";
import * as Yup from "yup";
import placeFields from "./placesField";
import { useState, useEffect } from "react";
import "./addPlace.css";
import { toast } from "react-toastify";

function AddPlace({ onClose, editPlace }) {
    const [states, setStates] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [existingPhotos, setExistingPhotos] = useState(
        editPlace?.photos || []
    );

    const [deletingImage, setDeletingImage] = useState(null);

    useEffect(() => {
        const getStates = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/stateData", {
                    credentials: "include"
                });
                const result = await response.json();
                if (result.status) setStates(result.states);
            } catch (error) {
                toast.error("States load nahi hui");
            }
        };
        getStates();
    }, []);

    const initialValues = placeFields.reduce((values, field) => {
        if (editPlace) {
            if (field.type === "checkbox") {
                values[field.name] = editPlace[field.name] || false;
            } else if (field.type === "file") {
                values[field.name] = [];
            } else if (field.name === "state_id") {
                values[field.name] =
                    editPlace.state_id?._id || editPlace.state_id || "";
            } else {
                values[field.name] = editPlace[field.name] || "";
            }
        } else {
            values[field.name] =
                field.type === "checkbox"
                    ? false
                    : field.type === "file"
                        ? []
                        : "";
        }

        return values;
    }, {});

    const validationSchema = Yup.object(
        placeFields.reduce((schema, field) => {
            switch (field.validation) {
                case "text":
                    schema[field.name] = Yup.string()
                        .trim()
                        .required(`${field.label} is required`)
                        .matches(
                            /^[A-Za-z0-9 ]+$/,
                            `${field.label} contains invalid characters`
                        );
                    break;

                case "description":
                    schema[field.name] = Yup.string()
                        .trim()
                        .required(`${field.label} is required`)
                        .min(20, `${field.label} must be at least 20 characters`);
                    break;

                case "required":
                    schema[field.name] = Yup.string()
                        .trim()
                        .required(`${field.label} is required`);
                    break;

                case "images":
                    schema[field.name] = Yup.array()
                        .min(1, `${field.label} is required`);
                    break;

                default:
                    break;
            }

            return schema;
        }, {})
    );

    function renderField(field, values, setFieldValue, errors, touched) {
        let input;

        switch (field.type) {
            case "textarea":
                input = (
                    <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        value={values[field.name] || ""}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                    />
                );
                break;

            case "select":
                input = (
                    <select
                        name={field.name}
                        value={values[field.name] || ""}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                    >
                        <option value="">{field.placeholder}</option>

                        {states.map((state) => (
                            <option key={state._id} value={state._id}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                );
                break;

            case "checkbox":
                input = (
                    <input
                        type="checkbox"
                        name={field.name}
                        checked={values[field.name] || false}
                        onChange={(e) => setFieldValue(field.name, e.target.checked)}
                    />
                );
                break;

            case "file":
                input = (
                    <>
                        {existingPhotos.length > 0 && (
                            <div className="existing-images">
                                {existingPhotos.map((photo) => (
                                    <div
                                        className="existing-image"
                                        key={photo.url}
                                    >
                                        <img
                                            src={photo.url}
                                            alt="Place"
                                        />

                                        <button
                                            type="button"
                                            className="delete-image-btn"
                                            onClick={() => deleteImage(photo)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            name={field.name}
                            multiple={field.multiple}
                            onChange={(e) =>
                                setFieldValue(
                                    field.name,
                                    Array.from(e.target.files)
                                )
                            }
                        />
                    </>
                );
                break;

            default:
                input = (
                    <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={values[field.name] || ""}
                        onChange={(e) => setFieldValue(field.name, e.target.value)}
                    />
                );
        }

        return (
            <>
                {input}

                {touched[field.name] && errors[field.name] && (
                    <small className="field-error">
                        {errors[field.name]}
                    </small>
                )}
            </>
        );
    }

    const validateData = async (validateForm, setTouched) => {
        const errors = await validateForm();

        if (Object.keys(errors).length > 0) {
            const touchedFields = placeFields.reduce((obj, field) => {
                obj[field.name] = true;
                return obj;
            }, {});

            setTouched(touchedFields);
            toast.error("Please fill all required fields");
            return false;
        }

        return true;
    };

    const saveDraft = async (values) => {
        setIsSaving(true);

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "placeImages") {
                    values[key].forEach((file) => {
                        formData.append("placeImages", file);
                    });
                } else if (values[key] !== "") {
                    formData.append(key, values[key]);
                }
            });

            const response = await fetch(
                "http://localhost:3000/admin/savedDraft",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

            const result = await response.json();

            if (result.status) {
                toast.success(result.message || "Draft saved successfully");
                setTimeout(onClose, 500);
            } else {
                toast.error(result.message || "Draft save nahi hua");
            }
        } catch (error) {
            toast.error("Server Error");
        } finally {
            setIsSaving(false);
        }
    };

    const publishPlace = async (
        values,
        validateForm,
        setTouched
    ) => {
        const isValid = await validateData(validateForm, setTouched);

        if (!isValid) return;

        setIsSaving(true);

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "placeImages") {
                    values[key].forEach((file) => {
                        formData.append("placeImages", file);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            const response = await fetch(
                "http://localhost:3000/admin/savedplace",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData
                }
            );

            const result = await response.json();

            if (result.status) {
                toast.success(
                    result.message || "Place published successfully"
                );

                setTimeout(onClose, 500);
            } else {
                toast.error(
                    result.message || "Place publish nahi hua"
                );
            }
        } catch (error) {
            toast.error("Server Error");
        } finally {
            setIsSaving(false);
        }
    };

    const updatePlace = async (
        values,
        validateForm,
        setTouched
    ) => {
        const isValid = await validateData(validateForm, setTouched);

        if (!isValid) return;

        setIsSaving(true);

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "placeImages") {
                    values[key].forEach((file) => {
                        formData.append("placeImages", file);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            const response = await fetch(
                `http://localhost:3000/admin/place/${editPlace._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData
                }
            );

            const result = await response.json();

            if (result.status) {
                toast.success(
                    result.message || "Place updated successfully"
                );

                setTimeout(onClose, 500);
            } else {
                toast.error(
                    result.message || "Place update nahi hua"
                );
            }
        } catch (error) {
            console.log(error);
            toast.error("Server Error");
        } finally {
            setIsSaving(false);
        }
    };
    const deleteImage = async (photo) => {
        try {
            console.log(`http://localhost:3000/admin/place/${editPlace._id}/image`);
            const response = await fetch(
                `http://localhost:3000/admin/place/${editPlace._id}/image`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        photoId: photo._id
                    })
                }
            );

            const result = await response.json();

            if (result.status) {
                setExistingPhotos(result.photos);
                toast.success("Image deleted successfully");
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            toast.error("Image delete failed");
        }
    };
    return (
        <div
            className="add-place-overlay"
            onClick={onClose}
        >
            {isSaving && (
                <div className="saving-overlay">
                    <div className="saving-spinner"></div>
                </div>
            )}

            <div
                className="add-place-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="add-place-modal-header">
                    <div>
                        <h2>
                            {editPlace
                                ? "Edit Place"
                                : "Add New Place"}
                        </h2>

                        <p>
                            {editPlace
                                ? "Update destination details"
                                : "Add a new destination to IndiaScape"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="close-modal-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={() => { }}
                >
                    {({
                        values,
                        setFieldValue,
                        errors,
                        touched,
                        validateForm,
                        setTouched
                    }) => (
                        <Form className="add-place-form">
                            <div className="add-place-modal-body">
                                {placeFields.map((field) => (
                                    <div
                                        className="form-group"
                                        key={field.name}
                                    >
                                        <label>
                                            {field.label}
                                        </label>

                                        {renderField(
                                            field,
                                            values,
                                            setFieldValue,
                                            errors,
                                            touched
                                        )}
                                    </div>
                                ))}

                                <div className="place-action-buttons">
                                    {editPlace ? (
                                        <button
                                            type="button"
                                            className="publish-place-btn"
                                            onClick={() =>
                                                updatePlace(
                                                    values,
                                                    validateForm,
                                                    setTouched
                                                )
                                            }
                                            disabled={isSaving}
                                        >
                                            Update Data
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                className="save-draft-btn"
                                                onClick={() =>
                                                    saveDraft(values)
                                                }
                                                disabled={isSaving}
                                            >
                                                Save Draft
                                            </button>

                                            <button
                                                type="button"
                                                className="publish-place-btn"
                                                onClick={() =>
                                                    publishPlace(
                                                        values,
                                                        validateForm,
                                                        setTouched
                                                    )
                                                }
                                                disabled={isSaving}
                                            >
                                                Publish
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default AddPlace;