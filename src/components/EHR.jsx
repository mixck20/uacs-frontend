import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./EHR.css";

function EHR({ setActivePage, activePage, patients, setPatients, sidebarOpen, setSidebarOpen }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // EHR record form state
  const [newRecord, setNewRecord] = useState({
    date: "",
    complaint: "",
    vitals: {
      bp: "",
      temp: "",
      pulse: "",
    },
    diagnosis: "",
    treatment: "",
    prescriptions: "",
    tests: [],
    followUp: "",
    staff: "",
    notes: "",
  });

  const filteredPatients = patients.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleSelectPatient(patient) {
    setSelectedPatient(patient);
    setShowForm(false);
  }

  function handleFileUpload(e) {
    setNewRecord({
      ...newRecord,
      tests: [...newRecord.tests, ...Array.from(e.target.files).map(f => f.name)],
    });
  }

  function handleRecordChange(e) {
    const { name, value } = e.target;
    if (["bp", "temp", "pulse"].includes(name)) {
      setNewRecord({
        ...newRecord,
        vitals: { ...newRecord.vitals, [name]: value },
      });
    } else {
      setNewRecord({ ...newRecord, [name]: value });
    }
  }

  function handleAddRecord() {
    if (!selectedPatient) return;
    if (
      newRecord.date &&
      newRecord.complaint &&
      newRecord.diagnosis &&
      newRecord.treatment
    ) {
      const updatedPatients = patients.map(p => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            history: [...(p.history || []), newRecord],
          };
        }
        return p;
      });
      setPatients(updatedPatients);
      setSelectedPatient(
        updatedPatients.find(p => p.id === selectedPatient.id)
      );
      setNewRecord({
        date: "",
        complaint: "",
        vitals: { bp: "", temp: "", pulse: "" },
        diagnosis: "",
        treatment: "",
        prescriptions: "",
        tests: [],
        followUp: "",
        staff: "",
        notes: "",
      });
      setShowForm(false);
    } else {
      alert("Please fill in all required fields for the medical record.");
    }
  }

  function handleExportPDF() {
    alert("Export to PDF functionality will go here.");
  }

  return (
    <div className="clinic-dashboard-root">
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        onSidebarToggle={setSidebarOpen}
        isOpen={sidebarOpen}
      />
      <main className={`ehr-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <h1 className="ehr-title">Electronic Health Records</h1>

        {/* Search Bar */}
        <input
          type="text"
          className="ehr-search"
          placeholder="Search by patient name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Patient List */}
        <div className="ehr-patient-list">
          <h2>Patients</h2>
          {filteredPatients.length === 0 ? (
            <p className="ehr-empty">No patients found</p>
          ) : (
            filteredPatients.map(p => (
              <div
                key={p.id}
                className={`ehr-patient ${
                  selectedPatient?.id === p.id ? "active" : ""
                }`}
                onClick={() => handleSelectPatient(p)}
              >
                {p.name}
              </div>
            ))
          )}
        </div>

        {/* Medical Records Section */}
        {selectedPatient && (
          <div className="ehr-records">
            <h2>{selectedPatient.name}'s Medical History</h2>
            <button className="ehr-btn" onClick={() => setShowForm(true)}>
              Add Record
            </button>
            <button className="ehr-btn" onClick={handleExportPDF}>
              Export as PDF
            </button>

            {(!selectedPatient.history || selectedPatient.history.length === 0) ? (
              <p className="ehr-empty">No medical history available.</p>
            ) : (
              selectedPatient.history.map((rec, index) => (
                <div key={index} className="ehr-record">
                  <h3>Visit on {rec.date}</h3>
                  <p><strong>Complaint:</strong> {rec.complaint}</p>
                  <p>
                    <strong>Vitals:</strong>
                    {` BP: ${rec.vitals?.bp || "-"}, Temp: ${rec.vitals?.temp || "-"}, Pulse: ${rec.vitals?.pulse || "-"}`}
                  </p>
                  <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                  <p><strong>Treatment:</strong> {rec.treatment}</p>
                  <p><strong>Prescriptions:</strong> {rec.prescriptions}</p>
                  {rec.tests.length > 0 && (
                    <div>
                      <strong>Test Results:</strong>
                      <ul>
                        {rec.tests.map((file, idx) => (
                          <li key={idx}>{file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p><strong>Follow-up:</strong> {rec.followUp}</p>
                  <p><strong>Attending Nurse/Doctor:</strong> {rec.staff}</p>
                  <p><strong>Notes:</strong> {rec.notes}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Add Record Modal */}
        {showForm && (
          <div className="ehr-modal">
            <div className="ehr-modal-content">
              <h2>Add New Record</h2>
              <input
                type="date"
                name="date"
                placeholder="Visit Date"
                value={newRecord.date}
                onChange={handleRecordChange}
                required
              />
              <input
                type="text"
                name="complaint"
                placeholder="Complaint / Reason for Visit"
                value={newRecord.complaint}
                onChange={handleRecordChange}
                required
              />
              <div className="ehr-vitals-row">
                <input
                  type="text"
                  name="bp"
                  placeholder="Blood Pressure"
                  value={newRecord.vitals.bp}
                  onChange={handleRecordChange}
                />
                <input
                  type="text"
                  name="temp"
                  placeholder="Temperature"
                  value={newRecord.vitals.temp}
                  onChange={handleRecordChange}
                />
                <input
                  type="text"
                  name="pulse"
                  placeholder="Pulse"
                  value={newRecord.vitals.pulse}
                  onChange={handleRecordChange}
                />
              </div>
              <input
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                value={newRecord.diagnosis}
                onChange={handleRecordChange}
                required
              />
              <input
                type="text"
                name="treatment"
                placeholder="Treatment"
                value={newRecord.treatment}
                onChange={handleRecordChange}
                required
              />
              <input
                type="text"
                name="prescriptions"
                placeholder="Prescriptions"
                value={newRecord.prescriptions}
                onChange={handleRecordChange}
              />
              <input
                type="text"
                name="followUp"
                placeholder="Follow-up / Next Steps"
                value={newRecord.followUp}
                onChange={handleRecordChange}
              />
              <input
                type="text"
                name="staff"
                placeholder="Attending Nurse/Doctor"
                value={newRecord.staff}
                onChange={handleRecordChange}
              />
              <input
                type="text"
                name="notes"
                placeholder="Additional Notes (optional)"
                value={newRecord.notes}
                onChange={handleRecordChange}
              />
              <input type="file" multiple onChange={handleFileUpload} />
              <div className="ehr-modal-actions">
                <button className="ehr-btn" onClick={handleAddRecord}>
                  Save
                </button>
                <button className="ehr-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EHR;