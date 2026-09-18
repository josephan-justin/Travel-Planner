import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/auth/authslice";
import axios from "axios";
import baseUrl from "../helpers/baseUrl";
import { toastError, toastSuccess } from "../helpers/toast";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const profile = data.profile;
        dispatch(setUser(profile));

        setFullName(profile.fullName || "");
        setAddress(profile.address || "");
        setPhone(profile.phone || "");
        setBirthDate(profile.birthDate ? profile.birthDate.slice(0, 10) : "");
        setGender(profile.gender || "");
      } catch (err) {
        toastError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, accessToken]);

  async function handleSave(e) {
    e.preventDefault();

    if (!fullName) {
      toastError("Full name is required");
      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${baseUrl}/profile`,
        {
          fullName,
          address,
          phone,
          birthDate,
          gender,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      dispatch(
        setUser({
          ...user,
          fullName,
          address,
          phone,
          birthDate,
          gender,
        }),
      );

      toastSuccess("Profile updated successfully!");
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A9FFF] via-[#0E7FD4] to-[#0A5FA8]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
              My Profile
            </div>

            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Your Travel Profile
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-50">
              Keep your personal information up to date so we can tailor your
              travel experience.
            </p>
          </div>
        </div>
      </section>

      {/* PROFILE SECTION */}
      <section className="relative z-10 mx-auto -mt-10 max-w-4xl px-6 pb-16">
        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center rounded-2xl bg-white py-16 shadow-xl shadow-blue-900/5">
            <div className="flex items-center gap-3 text-gray-500">
              <svg
                className="h-6 w-6 animate-spin text-[#1A9FFF]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading your profile...
            </div>
          </div>
        )}

        {!loading && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-900/5">
            {/* PROFILE HEADER */}
            <div className="border-b border-gray-100 px-8 py-6">
              <div className="flex items-center gap-4">
                {/* AVATAR */}
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A9FFF] to-[#0A5FA8] text-2xl font-bold text-white shadow-lg shadow-[#1A9FFF]/25">
                  {initials || "👤"}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {fullName || "Your Profile"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage your personal information
                  </p>
                </div>
              </div>
            </div>

            {/* PROFILE FORM */}
            <form onSubmit={handleSave} className="space-y-8 px-8 py-8">
              {/* FULL NAME + GENDER */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name <span className="text-[#FF5C1A]">*</span>
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Gender
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PHONE + BIRTH DATE */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="birthDate"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Birth Date
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Address
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    rows="3"
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1A9FFF] focus:bg-white focus:ring-4 focus:ring-[#1A9FFF]/10"
                  />
                </div>
              </div>

              {/* SAVE */}
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg
                    className="h-4 w-4 text-[#1A9FFF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Your information is kept private and secure.
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FF5C1A] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#FF5C1A]/25 transition hover:bg-[#E84E0F] active:bg-[#D6450D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
