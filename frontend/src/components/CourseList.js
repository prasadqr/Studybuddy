import React, { useState } from "react";

const CourseList = ({
    courses,
    selectedCourse,
    onSelectCourse,
    courseTitle,
    setCourseTitle,
    onAddCourse,
    onUpdateCourse,
    onDeleteCourse
}) => {
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editCourseTitle, setEditCourseTitle] = useState("");

    const handleEditClick = (course) => {
        setEditingCourseId(course.id);
        setEditCourseTitle(course.title);
    };

    const handleSaveEdit = () => {
        onUpdateCourse(editingCourseId, editCourseTitle);
        setEditingCourseId(null);
    };

    return (
        <div
            style={{
                width: "30%",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2>Courses</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="New course"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <button
                    onClick={onAddCourse}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Add
                </button>
            </div>

            <ul style={{ paddingLeft: "0", margin: 0 }}>
                {courses.map((course) => (
                    <li
                        key={course.id}
                        style={{
                            listStyle: "none",
                            padding: "10px",
                            marginBottom: "8px",
                            backgroundColor: selectedCourse === course.id ? "#dfe6e9" : "#ecf0f1",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        {editingCourseId === course.id ? (
                            <div style={{ display: "flex", gap: "5px", flex: 1 }}>
                                <input
                                    type="text"
                                    value={editCourseTitle}
                                    onChange={(e) => setEditCourseTitle(e.target.value)}
                                    style={{ flex: 1, padding: "4px" }}
                                />
                                <button onClick={handleSaveEdit} style={{ cursor: "pointer", color: "#27ae60", border: "none", background: "none" }}>✔️</button>
                                <button onClick={() => setEditingCourseId(null)} style={{ cursor: "pointer", color: "#e74c3c", border: "none", background: "none" }}>❌</button>
                            </div>
                        ) : (
                            <>
                                <span
                                    style={{ flex: 1, cursor: "pointer", fontWeight: selectedCourse === course.id ? "bold" : "normal" }}
                                    onClick={() => onSelectCourse(course.id)}
                                >
                                    {course.title}
                                </span>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button onClick={() => handleEditClick(course)} style={{ cursor: "pointer", color: "#f39c12", border: "none", background: "none", fontSize: "14px" }}>✏️</button>
                                    <button onClick={() => onDeleteCourse(course.id)} style={{ cursor: "pointer", color: "#e74c3c", border: "none", background: "none", fontSize: "14px" }}>🗑️</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseList;
