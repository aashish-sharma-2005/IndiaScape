import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Auth.css";

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(
          /^[0-9]{6}$/,
          "OTP must be 6 digits"
        )
        .required("OTP is required"),
    }),

    onSubmit: async (
      values,
      { setSubmitting }
    ) => {
      try {
        const response = await fetch("http://localhost:3000/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          body: JSON.stringify({
            email,
            otp: values.otp,
          }),
        }
        );

        const result = await response.json();
        if (!result.status) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        navigate("/login");
      } catch (error) {
        toast.error("Unable to connect to server");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendOtp = async () => {
    try {

      const response = await fetch(
        "http://localhost:3000/resend-otp",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
        body: JSON.stringify({
            email,
          }),
        }
      );


      const result =
        await response.json();


      if (!result.status) {
        toast.error(result.message);
        return;
      }


      toast.success(
        result.message
      );


      // Old OTP clear
      formik.setFieldValue(
        "otp",
        ""
      );


    } catch (error) {

      toast.error(
        "Unable to connect to server"
      );
    }
  };
  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-icon">
          🔐
        </div>

        <h1>Verify Your Email</h1>

        <p className="auth-subtitle">
          Enter the 6-digit OTP sent to
        </p>

        <p className="otp-email">
          {email}
        </p>


        <form
          onSubmit={
            formik.handleSubmit
          }
        >

          <div
            className=
            "input-group-custom"
          >

            <label>
              Enter OTP
            </label>

            <input
              type="text"

              name="otp"

              placeholder="Enter 6-digit OTP"

              maxLength="6"

              value={
                formik.values.otp
              }

              onChange={(e) => {

                const value =
                  e.target.value
                    .replace(/\D/g, "");

                formik.setFieldValue(
                  "otp",
                  value
                );
              }}

              onBlur={
                formik.handleBlur
              }
            />


            {formik.touched.otp &&
              formik.errors.otp && (

                <small
                  className="error-text"
                >
                  {formik.errors.otp}
                </small>

              )}

          </div>


          <button
            type="submit"

            className=
            "auth-submit-btn"

            disabled={
              formik.isSubmitting ||
              !formik.isValid
            }
          >

            {formik.isSubmitting
              ? "Verifying..."
              : "Verify OTP"}

          </button>

        </form>


        <p
          className=
          "auth-bottom-text"
        >
          Didn't receive OTP?

          <button
            onClick={handleResendOtp}
            type="button"
            className="resend-btn"
          >
            Resend OTP
          </button>

        </p>

      </div>

    </div>
  );
}

export default VerifyOtpPage;