import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./ClinicDashboard.css";
import { FaUsers, FaClipboardList, FaClock, FaBoxes, FaExclamationTriangle, FaChartLine, FaPlus, FaFileAlt, FaBox } from "react-icons/fa";

const ClinicDashboard = ({ setActivePage, activePage, sidebarOpen, setSidebarOpen, patients, inventory, appointments }) => {
  // Real data from patients and inventory state
  const name = "Clinic Staff";
  const totalPatients = patients.length;
  
  // Real appointment data
  const totalAppointments = appointments ? appointments.length : 0;
  const pendingAppointments = appointments ? appointments.filter(apt => apt.status === "Pending").length : 0;
  const confirmedAppointments = appointments ? appointments.filter(apt => apt.status === "Confirmed").length : 0;
  const completedAppointments = appointments ? appointments.filter(apt => apt.status === "Completed").length : 0;
  
  // Real inventory data
  const totalInventoryItems = inventory.length;
  const medicineItems = inventory.filter(item => item.category === "Medicine");
  const availableMedicines = medicineItems.filter(item => item.quantity > 10).length;
  const shortageMedicines = medicineItems.filter(item => item.quantity <= 10).length;
  
  const lastBackup = new Date().toLocaleDateString();
  
  // Today's activity metrics
  const todayPatients = patients.filter(p => {
    const today = new Date().toDateString();
    const patientDate = new Date(p.id).toDateString(); // Using id as creation date
    return patientDate === today;
  }).length;

  return (
    <div className="clinic-dashboard-root">
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        onSidebarToggle={setSidebarOpen}
        isOpen={sidebarOpen}
      />
      <main className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <input className="dashboard-search" placeholder="Search" />
        <div className="dashboard-header-row">
          <div>
            <div className="dashboard-title">DASHBOARD</div>
            <div className="dashboard-welcome">
              Welcome, <span className="dashboard-staff-name">{name}</span>
            </div>
          </div>
          <button className="dashboard-download-btn">
            Download Report <span className="arrow">&#9662;</span>
          </button>
        </div>

        <div className="dashboard-cards-row">
          <div className="dashboard-card" onClick={() => setActivePage("patients")} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              Total Patient
              <span className="card-link">View Full List &gt;&gt;</span>
            </div>
            <div className="card-number">{totalPatients}</div>
          </div>
          <div className="dashboard-card" onClick={() => setActivePage("appointment")} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              Total Appointments
              <span className="card-link">View Full List &gt;&gt;</span>
            </div>
            <div className="card-number">{totalAppointments}</div>
          </div>
          <div className="dashboard-card" onClick={() => setActivePage("appointment")} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              Pending Requests
              <span className="card-link">View Full List &gt;&gt;</span>
            </div>
            <div className="card-number">{pendingAppointments}</div>
          </div>
        </div>

        <div className="dashboard-cards-row">
          <div className="dashboard-card inventory-card" onClick={() => setActivePage("inventory")} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              Inventory
              <span className="card-link">View Full List &gt;&gt;</span>
            </div>
            <div className="inventory-stats">
              <div>
                <div className="inventory-number">{availableMedicines}</div>
                <div className="inventory-label">Medicine Available</div>
              </div>
              <div>
                <div className="inventory-number">{shortageMedicines}</div>
                <div className="inventory-label">Medicine Shortage</div>
              </div>
            </div>
          </div>
          <div className="dashboard-card total-inventory-card" onClick={() => setActivePage("inventory")} style={{ cursor: 'pointer' }}>
            <div className="card-header">
              Total Inventory
              <span className="card-link">View All Items &gt;&gt;</span>
            </div>
            <div className="total-inventory-stats">
              <div className="total-inventory-number">{totalInventoryItems}</div>
              <div className="total-inventory-label">Total Items</div>
            </div>
          </div>
          <div className="dashboard-card today-card">
            <div className="card-header">
              Today's Activity
              <span className="card-link">View Details &gt;&gt;</span>
            </div>
            <div className="today-stats">
              <div className="today-number">{todayPatients}</div>
              <div className="today-label">New Patients Today</div>
            </div>
          </div>
        </div>

        <div className="dashboard-cards-row">
          <div className="dashboard-card activity-card">
            <div className="card-header">Recent Activity</div>
            <div className="recent-activity">
              {patients.length > 0 ? (
                <div className="activity-item">
                  <div className="activity-icon"><FaUsers /></div>
                  <div className="activity-details">
                    <div className="activity-text">Latest patient added: <strong>{patients[patients.length - 1]?.name || 'Unknown'}</strong></div>
                    <div className="activity-time">Just now</div>
                  </div>
                </div>
              ) : (
                <div className="activity-item">
                  <div className="activity-icon"><FaFileAlt /></div>
                  <div className="activity-details">
                    <div className="activity-text">No patients added yet</div>
                    <div className="activity-time">Add your first patient</div>
                  </div>
                </div>
              )}
              {patients.length > 1 && (
                <div className="activity-item">
                  <div className="activity-icon"><FaChartLine /></div>
                  <div className="activity-details">
                    <div className="activity-text">Total patients: <strong>{totalPatients}</strong></div>
                    <div className="activity-time">Updated today</div>
                  </div>
                </div>
              )}
              {inventory.length > 0 && (
                <div className="activity-item">
                  <div className="activity-icon"><FaBox /></div>
                  <div className="activity-details">
                    <div className="activity-text">Total inventory items: <strong>{totalInventoryItems}</strong></div>
                    <div className="activity-time">Updated today</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClinicDashboard;