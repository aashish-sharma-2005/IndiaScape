const placeFields = [
    {
        name: "name",
        label: "Place Name",
        type: "text",
        placeholder: "Enter place name",
        validation: "text"
    },
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter place title",
        validation: "text"
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter place description",
        validation: "required"
    },
    {
        name: "story",
        label: "Story",
        type: "textarea",
        placeholder: "Enter place story",
        validation: "required"
    },
    {
        name: "state_id",
        label: "State",
        type: "select",
        placeholder: "Select state",
        validation: "required"
    },
    {
        name: "placeImages",
        label: "Images",
        type: "file",
        multiple: true,
        validation: "images"
    },
    {
        name: "featured",
        label: "Featured Place",
        type: "checkbox"
    }
];

export default placeFields;