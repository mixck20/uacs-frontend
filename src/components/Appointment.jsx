import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Appointment.css";
import { FaCalendarPlus, FaPhone, FaCheck, FaTimes, FaComments, FaUser, FaClock, FaVideo, FaMicrophone } from "react-icons/fa";

function Appointment({ setActivePage, activePage, sidebarOpen, setSidebarOpen, patients, appointments, setAppointments }) {
  const [showForm, setShowForm] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    appointmentType: "Check-up",
    date: "",
    time: "",
    reason: "",
    status: "Pending"
  });

  const [consultationForm, setConsultationForm] = useState({
    patientId: "",
    patientName: "",
    consultationType: "Video Call",
    reason: "",
    status: "Waiting"
  });

  // Mock student requests (in real app, these would come from student portal)
  const [studentRequests, setStudentRequests] = useState([
    {
      id: 1,
      studentName: "Adrian Peralta",
      studentId: "2025-001",
      requestType: "Consultation",
      reason: "Headache and fever for 2 days",
      status: "Pending",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      source: "Student Portal"
    },
    {
      id: 2,
      studentName: "Johnroy Loverboy",
      studentId: "2025-015",
      requestType: "Appointment",
      reason: "Regular check-up",
      status: "Confirmed",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      source: "Student Portal"
    }
  ]);

  // Initialize appointments if not provided
  useEffect(() => {
    if (!appointments) {
      setAppointments([]);
    }
  }, [appointments, setAppointments]);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleConsultationFormChange(e) {
    setConsultationForm({ ...consultationForm, [e.target.name]: e.target.value });
  }

  function handleAddAppointment(e) {
    e.preventDefault();
    if (form.patientId && form.date && form.time) {
      const newAppointment = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString()
      };
      setAppointments([...appointments, newAppointment]);
      setForm({ patientId: "", patientName: "", appointmentType: "Check-up", date: "", time: "", reason: "", status: "Pending" });
      setShowForm(false);
    } else {
      alert("Please fill all required fields.");
    }
  }

  function handleStartConsultation(e) {
    e.preventDefault();
    if (consultationForm.patientId) {
      const newConsultation = {
        id: Date.now(),
        ...consultationForm,
        startTime: new Date().toISOString(),
        status: "In Progress"
      };
      setCurrentCall(newConsultation);
      setShowConsultation(false);
      setConsultationForm({ patientId: "", patientName: "", consultationType: "Video Call", reason: "", status: "Waiting" });
    } else {
      alert("Please select a patient for consultation.");
    }
    // Here you would integrate with actual video calling service
    // For now, we'll simulate the call interface
  }

  function handleEndCall() {
    if (currentCall) {
      const endedConsultation = {
        ...currentCall,
        endTime: new Date().toISOString(),
        status: "Completed",
        duration: Math.floor((new Date() - new Date(currentCall.startTime)) / 1000 / 60) // minutes
      };
      setAppointments([...appointments, endedConsultation]);
      setCurrentCall(null);
    }
  }

  function updateAppointmentStatus(id, newStatus) {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  }

  // Handle student request status updates
  function updateStudentRequestStatus(id, newStatus) {
    setStudentRequests(requests => 
      requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  }

  // Handle chat functionality
  function handleSendChatMessage() {
    if (chatMessage.trim() && selectedRequest) {
      // In real app, this would send message to student
      console.log(`Sending message to ${selectedRequest.studentName}: ${chatMessage}`);
      setChatMessage("");
    }
  }

  // Open chat for confirmed requests
  function openChat(request) {
    if (request.status === "Confirmed") {
      setSelectedRequest(request);
      setShowChat(true);
    }
  }

  // Filter appointments by status
  const pendingAppointments = appointments.filter(apt => apt.status === "Pending");
  const confirmedAppointments = appointments.filter(apt => apt.status === "Confirmed");
  const completedAppointments = appointments.filter(apt => apt.status === "Completed");
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    const aptDate = new Date(apt.date).toDateString();
    return aptDate === today;
  });

  return (
    <div className="clinic-dashboard-root">
      <Sidebar 
        setActivePage={setActivePage} 
        activePage={activePage} 
        onSidebarToggle={setSidebarOpen}
        isOpen={sidebarOpen}
      />
      <main className={`appointment-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="appointment-header">
          <h1 className="appointment-title">Appointments & Consultations</h1>
          <div className="appointment-actions">
                         <button className="appointment-btn primary" onClick={() => setShowForm(true)}>
               <FaCalendarPlus /> Add Appointment
             </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="appointment-stats">
          <div className="stat-card">
            <div className="stat-number">{todayAppointments.length}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{pendingAppointments.length}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{confirmedAppointments.length}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedAppointments.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Current Call Interface */}
                 {currentCall && (
           <div className="call-interface">
             <div className="call-header">
               <h3><FaUser style={{color: '#28a745'}} /> Active Consultation</h3>
               <span className="call-status">In Progress</span>
             </div>
             <div className="call-info">
               <div className="call-patient">
                 <strong>Patient:</strong> {currentCall.patientName}
               </div>
               <div className="call-type">
                 <strong>Type:</strong> {currentCall.consultationType}
               </div>
               <div className="call-duration">
                 <strong>Duration:</strong> {Math.floor((new Date() - new Date(currentCall.startTime)) / 1000 / 60)}m
               </div>
             </div>
             <div className="call-controls">
               <button className="call-btn end-call" onClick={handleEndCall}>
                 <FaPhone /> End Call
               </button>
               <button className="call-btn mute"><FaMicrophone /> Mute</button>
               <button className="call-btn video"><FaVideo /> Video</button>
             </div>
           </div>
         )}

        {/* Appointments Table */}
        <div className="appointments-section">
          <h2>Appointments</h2>
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">No appointments scheduled</td>
                </tr>
              ) : (
                appointments.map(appointment => (
                  <tr key={appointment.id} className={`appointment-row ${appointment.status.toLowerCase()}`}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.appointmentType}</td>
                    <td>{new Date(appointment.date + 'T' + appointment.time).toLocaleString()}</td>
                    <td>{appointment.reason}</td>
                    <td>
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="appointment-actions-cell">
                                             {appointment.status === "Pending" && (
                         <>
                           <button 
                             className="action-btn confirm"
                             onClick={() => updateAppointmentStatus(appointment.id, "Confirmed")}
                           >
                             <FaCheck /> Confirm
                           </button>
                           <button 
                             className="action-btn reject"
                             onClick={() => updateAppointmentStatus(appointment.id, "Cancelled")}
                           >
                             <FaTimes /> Cancel
                           </button>
                         </>
                       )}
                       {appointment.status === "Confirmed" && (
                         <button 
                           className="action-btn complete"
                           onClick={() => updateAppointmentStatus(appointment.id, "Completed")}
                         >
                           <FaCheck /> Complete
                         </button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

                 {/* Student Requests Section */}
         <div className="student-requests-section">
           <h2><FaUser />Consultation Requests</h2>
          <div className="student-requests-grid">
            {studentRequests.map(request => (
              <div key={request.id} className={`student-request-card ${request.status.toLowerCase()}`}>
                <div className="request-header">
                  <div className="request-info">
                    <h4>{request.studentName}</h4>
                    <span className="student-id">ID: {request.studentId}</span>
                    <span className="request-source">{request.source}</span>
                  </div>
                  <div className="request-status">
                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="request-details">
                  <p><strong>Type:</strong> {request.requestType}</p>
                  <p><strong>Reason:</strong> {request.reason}</p>
                  <p><strong>Time:</strong> {new Date(request.timestamp).toLocaleString()}</p>
                </div>
                <div className="request-actions">
                                     {request.status === "Pending" && (
                     <>
                       <button 
                         className="action-btn confirm"
                         onClick={() => updateStudentRequestStatus(request.id, "Confirmed")}
                       >
                         <FaCheck /> Confirm
                       </button>
                       <button 
                         className="action-btn reject"
                         onClick={() => updateStudentRequestStatus(request.id, "Rejected")}
                       >
                         <FaTimes /> Reject
                       </button>
                     </>
                   )}
                   {request.status === "Confirmed" && (
                     <>
                       <button 
                         className="action-btn chat"
                         onClick={() => openChat(request)}
                       >
                         <FaComments /> Open Chat
                       </button>
                       <button 
                         className="action-btn complete"
                         onClick={() => updateStudentRequestStatus(request.id, "Completed")}
                       >
                         <FaCheck /> Complete
                       </button>
                     </>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>

                 {/* Chat Interface */}
         {showChat && selectedRequest && (
           <div className="chat-modal">
             <div className="chat-modal-content">
               <div className="chat-header">
                 <h3><FaComments /> Chat with {selectedRequest.studentName}</h3>
                 <button className="close-btn" onClick={() => setShowChat(false)}><FaTimes /></button>
               </div>
              <div className="chat-messages">
                <div className="message clinic">
                  <div className="message-content">
                    Hello {selectedRequest.studentName}! Your consultation request has been confirmed. How can I help you today?
                  </div>
                  <div className="message-time">Just now</div>
                </div>
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                />
                <button onClick={handleSendChatMessage}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Appointment Modal */}
        {showForm && (
          <div className="appointment-modal">
            <div className="appointment-modal-content">
              <h2>Schedule New Appointment</h2>
              <form onSubmit={handleAddAppointment}>
                <div className="form-row">
                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === parseInt(e.target.value));
                      setForm({
                        ...form,
                        patientId: e.target.value,
                        patientName: patient ? patient.name : ""
                      });
                    }}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                  <select
                    name="appointmentType"
                    value={form.appointmentType}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Check-up">Check-up</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
                <div className="form-row">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <textarea
                  name="reason"
                  placeholder="Reason for appointment"
                  value={form.reason}
                  onChange={handleFormChange}
                  rows="3"
                />
                <div className="modal-actions">
                  <button type="submit" className="appointment-btn primary">Schedule</button>
                  <button type="button" className="appointment-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Start Consultation Modal */}
        {showConsultation && (
          <div className="appointment-modal">
            <div className="appointment-modal-content">
              <h2>Start Online Consultation</h2>
              <form onSubmit={handleStartConsultation}>
                <div className="form-row">
                  <select
                    name="patientId"
                    value={consultationForm.patientId}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === parseInt(e.target.value));
                      setConsultationForm({
                        ...consultationForm,
                        patientId: e.target.value,
                        patientName: patient ? patient.name : ""
                      });
                    }}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                  <select
                    name="consultationType"
                    value={consultationForm.consultationType}
                    onChange={handleConsultationFormChange}
                    required
                  >
                    <option value="Video Call">Video Call</option>
                    <option value="Voice Call">Voice Call</option>
                    <option value="Chat">Chat</option>
                  </select>
                </div>
                <textarea
                  name="reason"
                  placeholder="Reason for consultation"
                  value={consultationForm.reason}
                  onChange={handleConsultationFormChange}
                  rows="3"
                />
                                 <div className="modal-actions">
                   <button type="submit" className="appointment-btn primary"><FaPhone /> Start Call</button>
                   <button type="button" className="appointment-btn secondary" onClick={() => setShowConsultation(false)}>Cancel</button>
                 </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Appointment;
