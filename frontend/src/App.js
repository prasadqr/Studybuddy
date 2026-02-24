import React, { useEffect, useState } from "react";
import CourseList from "./components/CourseList";
import NotesPanel from "./components/NotesPanel";

function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const fetchNotes = async (courseId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/courses/${courseId}/notes`
      );
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const addCourse = async () => {
    if (!courseTitle) return;

    try {
      await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: courseTitle }),
      });

      setCourseTitle("");
      fetchCourses();
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  const updateCourse = async (courseId, newTitle) => {
    if (!newTitle) return;
    try {
      await fetch(`http://localhost:5000/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      fetchCourses();
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await fetch(`http://localhost:5000/courses/${courseId}`, {
        method: "DELETE",
      });
      if (selectedCourse === courseId) {
        setSelectedCourse(null);
        setNotes([]);
      }
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const addNote = async () => {
    if (!noteTitle || !selectedCourse) return;

    try {
      await fetch(
        `http://localhost:5000/courses/${selectedCourse}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: noteTitle,
            content: noteContent,
          }),
        }
      );

      setNoteTitle("");
      setNoteContent("");
      fetchNotes(selectedCourse);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const updateNote = async (noteId, newTitle, newContent) => {
    if (!newTitle) return;
    try {
      await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      fetchNotes(selectedCourse);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await fetch(`http://localhost:5000/notes/${noteId}`, {
        method: "DELETE",
      });
      fetchNotes(selectedCourse);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const summarizeNote = async (noteId, onSuccess) => {
    try {
      const res = await fetch(
        `http://localhost:5000/notes/${noteId}/summarize`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.summary) {
        onSuccess(data.summary);
        return true;
      } else if (data.error) {
        alert("Error: " + JSON.stringify(data.error));
        return false;
      } else {
        alert("No summary returned");
        return false;
      }
    } catch (error) {
      console.error("Failed to summarize note:", error);
      alert("Failed to summarize note. See console for details.");
      return false;
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    fetchNotes(courseId);
  };

  const selectedCourseObj = courses.find((c) => c.id === selectedCourse);

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      minHeight: "100vh",
      backgroundColor: "#f4f6f8",
      padding: "30px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "30px" }}>
        <h1 style={{ textAlign: "center", color: "#2c3e50", margin: "0 0 10px 0" }}>
          StudyBuddy
        </h1>
        {/* Breadcrumbs Placeholder */}
        <div style={{ fontSize: "14px", color: "#7f8c8d", textAlign: "center" }}>
          Home {selectedCourseObj && `> ${selectedCourseObj.title}`}
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        <CourseList
          courses={courses}
          selectedCourse={selectedCourse}
          onSelectCourse={handleSelectCourse}
          courseTitle={courseTitle}
          setCourseTitle={setCourseTitle}
          onAddCourse={addCourse}
          onUpdateCourse={updateCourse}
          onDeleteCourse={deleteCourse}
        />

        <NotesPanel
          selectedCourse={selectedCourse}
          notes={notes}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteContent={noteContent}
          setNoteContent={setNoteContent}
          onAddNote={addNote}
          onSummarizeNote={summarizeNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
        />
      </div>
    </div>
  );
}

export default App;