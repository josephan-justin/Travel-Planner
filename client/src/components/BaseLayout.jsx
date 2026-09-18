import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function BaseLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}
