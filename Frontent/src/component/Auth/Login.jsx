import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "./Auth.css";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../store/loginSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!result.status) {
          toast.error(result.message);
          return;
        }

        if (result.status) {
          // Latest user data Redux me load hoga
          await dispatch(fetchUser()).unwrap();

          // Uske baad dashboard open hoga
          navigate(result.location);
        }

      } catch (error) {
        toast.error("Unable to connect to server");

      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Continue your journey across Incredible India
        </p>

        <form onSubmit={formik.handleSubmit}>

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

            {formik.touched.email && formik.errors.email && (
              <small className="error-text">
                {formik.errors.email}
              </small>
            )}
          </div>

          <div className="input-group-custom">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password && (
              <small className="error-text">
                {formik.errors.password}
              </small>
            )}
          </div>

          <div className="auth-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={
              formik.isSubmitting || !formik.isValid
            }
          >
            {formik.isSubmitting
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-bottom-text">
          Don't have an account?

          <Link to="/signup">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default LoginPage;