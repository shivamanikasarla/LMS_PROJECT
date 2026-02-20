import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [scheduleData, setScheduleData] = useState({
    course: "",
    startTime: "",
    endTime: "",
    duration: "",
    emailNotify: false
  });

  // Load exams
  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
    setExams(storedExams);
  }, []);

  const handleSchedule = (e) => {
    e.preventDefault();

    if (!selectedExam || !scheduleData.startTime) {
      toast.error("Please select an exam and start time");
      return;
    }

    if (
      scheduleData.endTime &&
      scheduleData.endTime <= scheduleData.startTime
    ) {
      toast.error("End time must be after start time");
      return;
    }

    if (scheduleData.duration && scheduleData.duration <= 0) {
      toast.error("Duration must be greater than 0");
      return;
    }

    const schedules =
      JSON.parse(localStorage.getItem("examSchedules")) || [];

    schedules.push({
      examId: selectedExam,
      ...scheduleData
    });

    localStorage.setItem("examSchedules", JSON.stringify(schedules));

    toast.success("Exam scheduled successfully");

    setSelectedExam("");
    setScheduleData({
      course: "",
      startTime: "",
      endTime: "",
      duration: "",
      emailNotify: false
    });
  };

  const handleReset = () => {
    setSelectedExam("");
    setScheduleData({
      course: "",
      startTime: "",
      endTime: "",
      duration: "",
      emailNotify: false
    });
  };

  return (
    <div className="min-vh-100" style={{ background: '#f8f9fa', paddingTop: '40px', paddingBottom: '60px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">

            {/* Page Header */}
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>
                <i className="bi bi-calendar-check me-2 text-primary"></i>
                Schedule Exam
              </h2>
              <p className="text-muted">Set up exam schedules and notify your students</p>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '24px' }}>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSchedule}>

                  {/* Section 1: Exam Selection */}
                  <div className="mb-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-file-text text-primary fs-5"></i>
                      </div>
                      <h5 className="mb-0 fw-bold">Exam Details</h5>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-clipboard-check me-2 text-primary"></i>
                          Select Exam
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={selectedExam}
                          onChange={(e) => setSelectedExam(e.target.value)}
                          style={{ borderRadius: '12px' }}
                        >
                          <option value="">Choose an exam...</option>
                          {exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                              {exam.title} ({exam.course})
                            </option>
                          ))}
                        </select>
                        {exams.length === 0 && (
                          <small className="text-muted d-block mt-2">
                            <i className="bi bi-info-circle me-1"></i>
                            No exams found. Create one first.
                          </small>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-people me-2 text-success"></i>
                          Assign Course / Group
                        </label>
                        <select
                          className="form-select form-select-lg"
                          value={scheduleData.course}
                          onChange={(e) =>
                            setScheduleData({
                              ...scheduleData,
                              course: e.target.value
                            })
                          }
                          style={{ borderRadius: '12px' }}
                        >
                          <option value="">Select course...</option>
                          <option value="java">Java Programming</option>
                          <option value="web">Web Development</option>
                          <option value="cs101">CS 101</option>
                          <option value="backend">Backend Engineering</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Time Settings */}
                  <div className="mb-5">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-clock text-success fs-5"></i>
                      </div>
                      <h5 className="mb-0 fw-bold">Schedule Settings</h5>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-calendar-event me-2 text-success"></i>
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={scheduleData.startTime}
                          onChange={(e) =>
                            setScheduleData({
                              ...scheduleData,
                              startTime: e.target.value
                            })
                          }
                          style={{ borderRadius: '12px' }}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-calendar-x me-2 text-danger"></i>
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          className="form-control form-control-lg"
                          value={scheduleData.endTime}
                          onChange={(e) =>
                            setScheduleData({
                              ...scheduleData,
                              endTime: e.target.value
                            })
                          }
                          style={{ borderRadius: '12px' }}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold">
                          <i className="bi bi-hourglass-split me-2 text-warning"></i>
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-lg"
                          placeholder="60"
                          value={scheduleData.duration}
                          onChange={(e) =>
                            setScheduleData({
                              ...scheduleData,
                              duration: Number(e.target.value)
                            })
                          }
                          style={{ borderRadius: '12px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Notifications */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                        <i className="bi bi-bell text-info fs-5"></i>
                      </div>
                      <h5 className="mb-0 fw-bold">Notifications</h5>
                    </div>

                    <div className="bg-light p-4 rounded-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailNotify"
                          checked={scheduleData.emailNotify}
                          onChange={(e) =>
                            setScheduleData({
                              ...scheduleData,
                              emailNotify: e.target.checked
                            })
                          }
                          style={{ width: '50px', height: '25px' }}
                        />
                        <label
                          className="form-check-label fw-medium ms-2"
                          htmlFor="emailNotify"
                          style={{ fontSize: '1.05rem' }}
                        >
                          <i className="bi bi-envelope me-2 text-primary"></i>
                          Send email notification to students
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-end mt-5">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg px-5"
                      style={{ borderRadius: '12px' }}
                      onClick={handleReset}
                    >
                      <i className="bi bi-x-circle me-2"></i>Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-lg px-5 fw-bold shadow-sm"
                      style={{ borderRadius: '12px' }}
                    >
                      <i className="bi bi-calendar-check me-2"></i>Schedule Exam
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule;
