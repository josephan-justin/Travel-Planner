import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./views/Login";
import Register from "./views/Register";
import Home from "./views/Home";
import CreateTravelPlan from "./views/CreateTravelPlan";
import Profile from "./views/Profile";
import TravelPlanDetail from "./views/TravelPlanDetail";
import EditTravelPlan from "./views/EditTravelPlan";
import BaseLayout from "./components/BaseLayout";
import GenerateTravelPlan from "./views/GenerateTravelPlan";
import AddItinerary from "./views/AddItinerary";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>

      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/create-travel-plan" element={<CreateTravelPlan />}/>
          <Route path="/generate-travel-plan" element={<GenerateTravelPlan />}/>
          <Route path="/travel-plan/:id" element={<TravelPlanDetail />}/>
          <Route path="/travel-plan/:id/add-itinerary" element={<AddItinerary />}/>
          <Route path="/edit-travel-plan/:id" element={<EditTravelPlan />}/>
        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
