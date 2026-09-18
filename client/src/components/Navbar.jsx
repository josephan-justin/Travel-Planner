import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authslice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <nav className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <NavLink
            to="/"
            className="cursor-pointer text-2xl font-bold text-blue-600"
          >
            TravelPlanner
          </NavLink>

          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="cursor-pointer font-medium text-gray-700 transition hover:text-blue-600"
            >
              Home
            </NavLink>

            <NavLink
              to="/create-travel-plan"
              className="cursor-pointer font-medium text-gray-700 transition hover:text-blue-600"
            >
              Create Plan
            </NavLink>

            <NavLink
              to="/generate-travel-plan"
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Generate AI
            </NavLink>

            <NavLink
              to="/profile"
              className="cursor-pointer font-medium text-gray-700 transition hover:text-blue-600"
            >
              Profile
            </NavLink>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
