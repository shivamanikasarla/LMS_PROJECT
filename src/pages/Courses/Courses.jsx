import { useState, useEffect } from "react"

function Courses() {
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [flipped, setFlipped] = useState({})
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState("")
  const [trainer, setTrainer] = useState("")
  const [img, setImg] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [courseType, setCourseType] = useState("")
  const [mentorName, setMentorName] = useState("")
  const [mentorId, setMentorId] = useState("")
  const [mentorPhone, setMentorPhone] = useState("")
  const [editIndex, setEditIndex] = useState(null)
  const [step, setStep] = useState(1)
  const [flipCardHeight, setFlipCardHeight] = useState(500)


  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth <= 576) {
        setFlipCardHeight(350)
      } else if (window.innerWidth <= 768) {
        setFlipCardHeight(400)
      } else if (window.innerWidth <= 992) {
        setFlipCardHeight(450)
      } else {
        setFlipCardHeight(500)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const resetForm = () => {
    setName("")
    setDesc("")
    setPrice("")
    setTrainer("")
    setImg(null)
    setImgPreview(null)
    setCourseType("")
    setMentorName("")
    setMentorId("")
    setMentorPhone("")
    setEditIndex(null)
    setStep(1)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImg(file)
      setImgPreview(URL.createObjectURL(file))
    }
  }

  const addCourse = () => {
    const imgURL = img ? URL.createObjectURL(img) : imgPreview
    const newCourse = {
      name,
      desc,
      price,
      trainer,
      courseType,
      mentorName,
      mentorId,
      mentorPhone,
      img: imgURL
    }

    if (editIndex !== null) {
      setCourses(courses.map((c, i) => (i === editIndex ? newCourse : c)))
    } else {
      setCourses([...courses, newCourse])
    }

    resetForm()
    setShowForm(false)
    setSelected(null)
  }

  const editCourse = (index) => {
    const c = courses[index]
    setName(c.name)
    setDesc(c.desc)
    setPrice(c.price)
    setTrainer(c.trainer)
    setCourseType(c.courseType)
    setMentorName(c.mentorName)
    setMentorId(c.mentorId)
    setMentorPhone(c.mentorPhone)
    setImgPreview(c.img)
    setEditIndex(index)
    setShowForm(true)
    setSelected(null)
  }

  const deleteCourse = (index) => {
    if (window.confirm("Delete this course?")) {
      setCourses(courses.filter((_, i) => i !== index))
      setSelected(null)
    }
  }

  const toggleFlip = (index) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  })

  return (
    <div className="container-fluid py-4">
      {/* Empty State */}
      {courses.length === 0 && !showForm && (
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border-0 text-center">
              <div className="card-body p-5">
                <h2 className="text-primary fw-bold mb-3">Course Administration Panel</h2>
                <div className="text-muted mb-4">
                  <p className="mb-2">
                    <i className="bi bi-journal-text me-2 text-primary"></i>
                    No courses are currently configured in the system.
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-plus-circle me-2 text-success"></i>
                    As an administrator, you can create and publish new courses.
                  </p>
                  <p className="mb-2">
                    <i className="bi bi-person-badge me-2 text-warning"></i>
                    Assign trainers and manage course ownership.
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelected(null)
                    resetForm()
                    setShowForm(true)
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add New Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {courses.length > 0 && !showForm && (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search course..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <select className="form-select">
              <option value="">All Types</option>
              <option value="Free">Free Courses</option>
              <option value="Paid">Paid Courses</option>
            </select>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button 
              className="btn btn-success w-20 w-md"
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Course
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="text-primary mb-4 text-center">
                  {step === 1 ? "Course Details" : "Mentor Details"}
                </h4>

                {step === 1 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Course Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter course name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Trainer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter trainer name"
                        value={trainer}
                        onChange={e => setTrainer(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course Description</label>
                      <textarea
                        className="form-control"
                        placeholder="Enter course description (use Enter for line breaks)"
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows="6"
                        style={{ whiteSpace: "pre-wrap" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Course Type</label>
                      <select
                        className="form-select"
                        value={courseType}
                        onChange={e => setCourseType(e.target.value)}
                      >
                        <option value="">Select Course Type</option>
                        <option value="Free">Free Course</option>
                        <option value="Paid">Paid Course</option>
                      </select>
                    </div>
                    {courseType === "Paid" && (
                      <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter price"
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Course Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setStep(2)}
                      >
                        Next <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Mentor Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter mentor name"
                        value={mentorName}
                        onChange={e => setMentorName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mentor ID</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter mentor ID"
                        value={mentorId}
                        onChange={e => setMentorId(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Mentor Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter mentor phone"
                        value={mentorPhone}
                        onChange={e => setMentorPhone(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between">
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setStep(1)}
                      >
                        <i className="bi bi-arrow-left me-2"></i>Back
                      </button>
                      <button 
                        className="btn btn-success"
                        onClick={addCourse}
                      >
                        <i className="bi bi-check-circle me-2"></i>Save Course
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div className="row g-4">
        {filteredCourses.map((c, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <div 
              style={{ 
                perspective: '1000px', 
                height: `${flipCardHeight}px`,
                width: '100%'
              }}
            >
              <div 
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformStyle: 'preserve-3d',
                  transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* FRONT */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <div className="card h-100 shadow border-0">
                    <img
                      src={c.img}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                      alt="course"
                    />
                    <div className="card-body">
                      <h5 className="fw-bold text-primary">{c.name}</h5>
                      <p className="text-muted small">{c.trainer}</p>

                      {c.courseType === "Free" ? (
                        <p className="fw-bold text-danger">Free</p>
                      ) : (
                        <p className="fw-bold text-success">₹ {c.price}</p>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                          onClick={() => toggleFlip(i)}
                        >
                          <i className="bi bi-info-circle fs-6"></i>
                          <span className="fs-6">Details</span>
                        </button>

                        <button
                          className="btn btn-outline-warning btn-sm d-flex align-items-center gap-1"
                          onClick={() => editCourse(i)}
                        >
                          <i className="bi bi-pencil fs-6"></i>
                          <span className="fs-6">Edit</span>
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => deleteCourse(i)}
                        >
                          <i className="bi bi-trash fs-6"></i>
                          <span className="fs-6">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="card h-100 shadow border-0">
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold text-primary mb-3">{c.name}</h5>
                      <p className="text-muted small mb-2">
                        <strong className="text-danger fs-5">Course Details:</strong>
                      </p>
                      <div>
                        {c.desc.split("\n").map((line, idx) => (
                          <p key={idx} className="mb-1">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <p className="mb-2">
                          <strong>Trainer:</strong> {c.trainer}
                        </p>
                        <p className="mb-3">
                          <strong>Mentor:</strong> {c.mentorName}
                        </p>
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => toggleFlip(i)}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COURSE DETAILS */}
      {selected && !showForm && (
        <div className="card shadow mt-4 mx-auto col-12 col-md-8 col-lg-6">
          <img src={selected.img} className="card-img-top" alt="course" />
          <div className="card-body">
            <h4 className="text-primary fw-bold">{selected.name}</h4>
            <p>{selected.desc}</p>
            <p>
              <strong>Trainer:</strong> {selected.trainer}
            </p>
            <p>
              <strong>Mentor:</strong> {selected.mentorName}
            </p>

            {selected.courseType === "Free" ? (
              <p className="fw-bold text-danger">Free</p>
            ) : (
              <p className="fw-bold text-success">₹ {selected.price}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses