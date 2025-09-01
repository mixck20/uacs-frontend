import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Patients.css";
import { FaEnvelope } from "react-icons/fa";

const Patients = ({ setActivePage, activePage, patients, setPatients, sidebarOpen, setSidebarOpen }) => {
  // Form state for adding new patient
  const [form, setForm] = useState({
    name: "",
    schoolId: "",
    dob: "",
    gender: "",
    role: "Student",
    courseYear: "",
    contact: "",
    address: "",
    guardian: "",
    guardianContact: "",
    allergies: "",
    notes: "",
    emailUpdates: false,
  });

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddPatient(e) {
    e.preventDefault();
    if (form.name && form.schoolId) {
      setPatients([
        ...patients,
        {
          id: Date.now(),
          name: form.name,
          schoolId: form.schoolId,
          dob: form.dob,
          gender: form.gender,
          role: form.role,
          courseYear: form.courseYear,
          contact: form.contact,
          address: form.address,
          guardian: form.guardian,
          guardianContact: form.guardianContact,
          allergies: form.allergies,
          notes: form.notes,
          emailUpdates: form.emailUpdates,
          history: [],
        },
      ]);
      setForm({
        name: "",
        schoolId: "",
        dob: "",
        gender: "",
        role: "Student",
        courseYear: "",
        contact: "",
        address: "",
        guardian: "",
        guardianContact: "",
        allergies: "",
        notes: "",
        emailUpdates: false,
      });
    }
  }

  return (
    <div className="clinic-dashboard-root">
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        onSidebarToggle={setSidebarOpen}
        isOpen={sidebarOpen}
      />
      <main className={`patients-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="patients-title">PATIENTS</div>
        <input
          className="patients-search"
          placeholder="Search by Name, School ID, Course"
        />

        <div className="patients-table-card">
          <div className="patients-table-header">
            <span>PATIENT TABLE</span>
            <span className="patients-view-link">View Full List &gt;&gt;</span>
          </div>
          <div className="patients-table">
            <div className="patients-table-row patients-table-row-header">
              <div>Name</div>
              <div>School ID</div>
              <div>Date of Birth</div>
              <div>Gender</div>
              <div>Course/Year</div>
              <div>Contact</div>
              <div>Allergies/Medical History</div>
              <div>View</div>
            </div>
            {/* Patient rows */}
            {patients.map((p) => (
              <div className="patients-table-row" key={p.id}>
                <div>{p.name}</div>
                <div>{p.schoolId}</div>
                <div>{p.dob}</div>
                <div>{p.gender}</div>
                <div>{p.courseYear}</div>
                <div>{p.contact}</div>
                <div>{p.allergies}</div>
                <div>{/* You can add a button to view full record */}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="patients-actions-row">
          <button className="patients-action-btn">BULK UPLOAD</button>
          <button className="patients-action-btn">EXPORT TO PDF/EXCEL</button>
        </div>

        <div className="patients-form-card">
          <div className="patients-form-title">NEW PATIENT</div>
          <form className="patients-form" onSubmit={handleAddPatient}>
            <div className="patients-form-row">
              <input className="patients-input" name="name" placeholder="Student Name" value={form.name} onChange={handleFormChange} required />
              <input className="patients-input" name="schoolId" placeholder="School ID / Student Number" value={form.schoolId} onChange={handleFormChange} required />
              <input className="patients-input" name="dob" type="date" placeholder="mm/dd/yyyy" value={form.dob} onChange={handleFormChange} />
            </div>
            <div className="patients-form-row">
              <select className="patients-input" name="gender" value={form.gender} onChange={handleFormChange}>
                <option value="">Sex / Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <select className="patients-input" name="role" value={form.role} onChange={handleFormChange}>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <div className="patients-form-row">
              <input className="patients-input" name="courseYear" placeholder="Course / Year Level" value={form.courseYear} onChange={handleFormChange} />
              <input className="patients-input" name="contact" placeholder="Contact Information (phone/email)" value={form.contact} onChange={handleFormChange} />
              <input className="patients-input" name="address" placeholder="Address (optional)" value={form.address} onChange={handleFormChange} />
            </div>
            <div className="patients-form-row">
              <input className="patients-input" name="guardian" placeholder="Guardian/Parent Name (optional)" value={form.guardian} onChange={handleFormChange} />
              <input className="patients-input" name="guardianContact" placeholder="Guardian Contact (optional)" value={form.guardianContact} onChange={handleFormChange} />
              <input className="patients-input" name="allergies" placeholder="Allergies / Medical History (optional)" value={form.allergies} onChange={handleFormChange} />
            </div>
            <div className="patients-form-row">
              <input className="patients-input" name="notes" placeholder="Other Notes (optional)" value={form.notes} onChange={handleFormChange} />
            </div>
            <div className="patients-form-row-checkbox">
              <label className="patients-checkbox-label">
                <input
                  type="checkbox"
                  name="emailUpdates"
                  checked={form.emailUpdates}
                  onChange={(e) => setForm({...form, emailUpdates: e.target.checked})}
                  className="patients-checkbox"
                />
                <FaEnvelope /> I would like to receive email updates and notifications from the School Clinic.
              </label>
            </div>
            <div className="patients-form-row">
              <button className="patients-form-submit" type="submit">
                ADD NEW PATIENT
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Patients;