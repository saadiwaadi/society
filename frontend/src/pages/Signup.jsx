import { useState } from "react";
import api from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    unit_no: "",
    contact: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/register", formData);
      
      // Auto-login after signup
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration Successful!");
      navigate("/dashboard");

    } catch (err) {
      console.error("Signup Error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join the Society Portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            name="name"
            type="text"
            required
            className="w-full rounded border p-3 outline-none focus:border-blue-500"
            placeholder="Full Name"
            onChange={handleChange}
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            required
            className="w-full rounded border p-3 outline-none focus:border-blue-500"
            placeholder="Email Address"
            onChange={handleChange}
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            required
            className="w-full rounded border p-3 outline-none focus:border-blue-500"
            placeholder="Password (min 6 chars)"
            onChange={handleChange}
          />

          {/* Unit & Contact (Grid Layout) */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="unit_no"
              type="text"
              required
              className="w-full rounded border p-3 outline-none focus:border-blue-500"
              placeholder="Unit No (e.g. A-101)"
              onChange={handleChange}
            />
            <input
              name="contact"
              type="text"
              required
              className="w-full rounded border p-3 outline-none focus:border-blue-500"
              placeholder="Phone Number"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-medium"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link to="/" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;