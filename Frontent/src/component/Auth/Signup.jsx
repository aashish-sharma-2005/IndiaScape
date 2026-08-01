import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import "./Auth.css";

function SignupPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("password")],
          "Passwords do not match"
        )
        .required("Confirm password is required"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const { name, email, password } = values;
        const response = await fetch('http://localhost:3000/signup', {
          method: "POST",
          headers: { 'content-type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({ name, email, password })
        });
        const result = await response.json()
        if (result.status) {
          toast.success(result.message);

          navigate("/verify-otp", {
            state: {
              email,
            },
          });
        }else{
          toast.error(result.message)
        }
        // if (!result.status && !response.ok) {
        //   setStatus(result.message)
        //   return;
        // }
        // navigate("/login");
      } catch (error) {
        console.log(error)
        setStatus("unable to connect server");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">

      <div className="auth-card signup-card">
        <h1>Join IndiaScape</h1>

        <p className="auth-subtitle">
          Start exploring the incredible beauty of India
        </p>


        <form onSubmit={formik.handleSubmit}>

          {/* Name */}
          <div className="input-group-custom">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"

              value={formik.values.name}

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}
            />

            {formik.touched.name &&
              formik.errors.name && (
                <small className="error-text">
                  {formik.errors.name}
                </small>
              )}

          </div>


          {/* Email */}
          <div className="input-group-custom">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"

              value={formik.values.email}

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}
            />

            {formik.touched.email &&
              formik.errors.email && (
                <small className="error-text">
                  {formik.errors.email}
                </small>
              )}

          </div>


          {/* Password */}
          <div className="input-group-custom">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"

              value={formik.values.password}

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}
            />

            {formik.touched.password &&
              formik.errors.password && (
                <small className="error-text">
                  {formik.errors.password}
                </small>
              )}

          </div>


          {/* Confirm Password */}
          <div className="input-group-custom">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"

              value={formik.values.confirmPassword}

              onChange={formik.handleChange}

              onBlur={formik.handleBlur}
            />

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <small className="error-text">
                  {formik.errors.confirmPassword}
                </small>
              )}

          </div>


          {/* Backend Error */}
          {formik.status && (
            <p className="error-text">
              {formik.status}
            </p>
          )}


          <button
            type="submit"
            className="auth-submit-btn"

            disabled={
              formik.isSubmitting ||
              !formik.isValid
            }
          >
            {formik.isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <p className="auth-bottom-text">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default SignupPage;