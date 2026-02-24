import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const NotesPanel = ({
    selectedCourse,
    notes,
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    onAddNote,
    onSummarizeNote,
    onUpdateNote,
    onDeleteNote
}) => {
    const [loadingNoteId, setLoadingNoteId] = useState(null);
    const [summaryResult, setSummaryResult] = useState({ id: null, text: "" });

    // Inline editing states for notes
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editNoteTitle, setEditNoteTitle] = useState("");
    const [editNoteContent, setEditNoteContent] = useState("");

    const handleEditClick = (note) => {
        setEditingNoteId(note.id);
        setEditNoteTitle(note.title);
        setEditNoteContent(note.content);
    };

    const handleSaveEdit = () => {
        onUpdateNote(editingNoteId, editNoteTitle, editNoteContent);
        setEditingNoteId(null);
    };

    const handleSummarize = async (noteId) => {
        setLoadingNoteId(noteId);
        setSummaryResult({ id: null, text: "" });

        const success = await onSummarizeNote(noteId, (summaryText) => {
            setSummaryResult({ id: noteId, text: summaryText });
        });

        if (!success) {
            setSummaryResult({ id: null, text: "" });
        }

        setLoadingNoteId(null);
    };

    if (!selectedCourse) {
        return (
            <div
                style={{
                    width: "70%",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#7f8c8d"
                }}
            >
                <p>Select a course to view notes</p>
            </div>
        );
    }

    return (
        <div
            style={{
                width: "70%",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <h2>Notes</h2>

            <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fdfefe", border: "1px dashed #bdc3c7", borderRadius: "6px" }}>
                <h3 style={{ marginTop: 0, fontSize: "16px", color: "#34495e" }}>Add New Note</h3>
                <input
                    type="text"
                    placeholder="Note title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <textarea
                    rows="5"
                    placeholder="Note content (Supports Markdown)"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box", fontFamily: "monospace", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <button
                    onClick={onAddNote}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#27ae60",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Save Note
                </button>
            </div>

            <div style={{ marginTop: "20px" }}>
                {notes.length === 0 ? (
                    <p style={{ color: "#7f8c8d" }}>No notes available for this course.</p>
                ) : (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            style={{
                                backgroundColor: "#f9f9f9",
                                padding: "20px",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                            }}
                        >
                            {editingNoteId === note.id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editNoteTitle}
                                        onChange={(e) => setEditNoteTitle(e.target.value)}
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box", fontWeight: "bold" }}
                                    />
                                    <textarea
                                        rows="6"
                                        value={editNoteContent}
                                        onChange={(e) => setEditNoteContent(e.target.value)}
                                        style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box", fontFamily: "monospace" }}
                                    />
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <button onClick={handleSaveEdit} style={{ padding: "6px 12px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Save</button>
                                        <button onClick={() => setEditingNoteId(null)} style={{ padding: "6px 12px", backgroundColor: "#95a5a6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <h3 style={{ marginTop: 0, color: "#2c3e50" }}>{note.title}</h3>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleEditClick(note)} style={{ cursor: "pointer", color: "#f39c12", border: "none", background: "none", fontSize: "16px" }}>✏️</button>
                                            <button onClick={() => onDeleteNote(note.id)} style={{ cursor: "pointer", color: "#e74c3c", border: "none", background: "none", fontSize: "16px" }}>🗑️</button>
                                        </div>
                                    </div>

                                    {/* Render Markdown Content */}
                                    <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "6px", border: "1px solid #eee", fontSize: "15px", lineHeight: "1.6", color: "#34495e" }}>
                                        <ReactMarkdown>{note.content}</ReactMarkdown>
                                    </div>

                                    <button
                                        onClick={() => handleSummarize(note.id)}
                                        disabled={loadingNoteId === note.id}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: loadingNoteId === note.id ? "#e0b284" : "#e67e22",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: loadingNoteId === note.id ? "not-allowed" : "pointer",
                                            marginTop: "15px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {loadingNoteId === note.id ? "✨ Summarizing with AI..." : "✨ Summarize"}
                                    </button>

                                    {summaryResult.id === note.id && summaryResult.text && (
                                        <div
                                            style={{
                                                marginTop: "15px",
                                                padding: "15px",
                                                backgroundColor: "#fef9e7",
                                                borderLeft: "4px solid #f1c40f",
                                                borderRadius: "6px",
                                            }}
                                        >
                                            <strong style={{ display: "block", marginBottom: "8px", color: "#d35400" }}>
                                                AI Summary:
                                            </strong>
                                            <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.95em", lineHeight: "1.5" }}>
                                                {summaryResult.text}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesPanel;
