import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ClinicDashboard from "./components/ClinicDashboard";
import Patients from "./components/Patients";
import Inventory from "./components/Inventory";
import Appointment from "./components/Appointment";
import Email from "./components/Email";
import EHR from "./components/EHR";

function App() {
  const [authPage, setAuthPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthPage("login");
    setActivePage("dashboard");
  };

  if (!isLoggedIn) {
    return authPage === "login" ? (
      <Login onSwitch={() => setAuthPage("signup")} onLogin={handleLoginSuccess} />
    ) : (
      <Signup onSwitch={() => setAuthPage("login")} />
    );
  }

  const commonProps = {
    setActivePage,
    activePage,
    sidebarOpen,
    setSidebarOpen,
    onLogout: handleLogout
  };

  if (activePage === "dashboard") {
    return (
      <ClinicDashboard
        {...commonProps}
        patients={patients}
        inventory={inventory}
        appointments={appointments}
      />
    );
  } else if (activePage === "patients") {
    return (
      <Patients
        {...commonProps}
        patients={patients}
        setPatients={setPatients}
      />
    );
  } else if (activePage === "ehr") {
    return (
      <EHR
        {...commonProps}
        patients={patients}
        setPatients={setPatients}
      />
    );
  } else if (activePage === "inventory") {
    return (
      <Inventory
        {...commonProps}
        inventory={inventory}
        setInventory={setInventory}
      />
    );
  } else if (activePage === "appointment") {
    return (
      <Appointment
        {...commonProps}
        patients={patients}
        appointments={appointments}
        setAppointments={setAppointments}
      />
    );
  } else if (activePage === "email") {
    return (
      <Email
        {...commonProps}
        patients={patients}
        appointments={appointments}
        inventory={inventory}
      />
    );
  }

  return <ClinicDashboard {...commonProps} />;
}

export default App;
