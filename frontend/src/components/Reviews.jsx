import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Reviews() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  let currentUserId = null;
  let currentUserRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id || payload._id;
      currentUserRole = payload.role;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const [rating, setRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [totalRaters, setTotalRaters] = useState(0);
  const [percentages, setPercentages] = useState([0, 0, 0, 0, 0]);
  const [successMsg, setSuccessMsg] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    fetchRatings();
    fetchComments();
    if (token) fetchUserRating();
  }, []);

  // ================= Ratings =================
  const fetchRatings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews/ratings");
      const data = await res.json();
      setAverage(data.average);
      setTotalRaters(data.totalRaters);
      setPercentages(data.percentages || [0, 0, 0, 0, 0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRating = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.rating) setRating(data.rating);
    } catch (err) {
      console.error(err);
    }
  };

  const submitRating = async () => {
    if (!token) return alert(t("ratings_must_login"));
    if (rating < 1) return alert(t("ratings_select_rating"));
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(t("ratings_success_message"));
        setTimeout(() => setSuccessMsg(""), 2500);
        fetchRatings();
        fetchComments();
      } else alert(data.message || "Unknown error");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Comments =================
  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews/comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submitComment = async () => {
    if (!token) return alert(t("ratings_must_login"));
    if (!commentText.trim()) return alert("Comment cannot be empty");

    try {
      const url = "http://localhost:5000/api/reviews/comments";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { commentId: editingId, text: commentText } : { text: commentText };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setCommentText("");
        setEditingId(null);
        fetchComments();
      } else alert(data.message || "Error saving comment");
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setCommentText(text);
  };

  const deleteComment = async (commentId) => {
    if (!token) return alert("Login required");
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchComments();
      else alert(data.message || "Error deleting comment");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Replies =================
  const handleReplyChange = (commentId, text) => {
    setReplyTexts(prev => ({ ...prev, [commentId]: text }));
  };

  const submitReply = async (commentId, commentUserId) => {
    if (!token) return alert("Login required");
    if (currentUserId === commentUserId) return alert("You cannot reply to your own comment");

    const text = replyTexts[commentId];
    if (!text || !text.trim()) return alert("Reply cannot be empty");

    try {
      const res = await fetch(`http://localhost:5000/api/reviews/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
        fetchComments();
      } else alert(data.message || "Error submitting reply");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= Styles =================
  const containerStyle = { padding: "40px 20px", maxWidth: "900px", margin: "0 auto", borderRadius: "12px", backgroundColor: "var(--card)", color: "var(--text)", direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" };
  const buttonStyle = { marginTop: 10, padding: "8px 15px", borderRadius: 8, fontWeight: "bold", border: "none", cursor: "pointer", backgroundColor: "var(--primary)", color: "var(--text)" };
  const numberStyle = { width: 35, fontSize: 16, fontWeight: "bold", textAlign: "right" };

  // ================= Render =================
  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", color: "var(--primary)" }}>{t("ratings_title")}</h1>
      <p style={{ textAlign: "center", marginTop: 8, color: "var(--text-secondary)" }}>{t("ratings_description")}</p>

      {successMsg && <div style={{ background: "var(--success-bg)", padding: "10px 15px", borderRadius: 8, marginBottom: 15, color: "var(--success-text)", fontWeight: "bold" }}>{successMsg}</div>}

      {/* Rating stars */}
      <div style={{ marginBottom: 15 }}><strong>{t("ratings_average")}: {average} / 5 — {totalRaters === 1 ? t("ratings_rated_by_one") : t("ratings_rated_by_other", { count: totalRaters })}</strong></div>
      <div style={{ fontSize: 32, marginBottom: 10, display: "flex", justifyContent: isRTL ? "flex-end" : "flex-start" }}>
        {[1,2,3,4,5].map(n => <span key={n} style={{ cursor: "pointer", color: n <= rating ? "gold" : "#bbb", margin: "0 2px" }} onClick={() => setRating(n)}>★</span>)}
      </div>
      <button onClick={submitRating} style={buttonStyle}>{t("submit_rate")}</button>

      {/* Histogram */}
      <div style={{ marginTop: 20 }}>
        {percentages.slice().reverse().map((p, idx) => {
          const star = 5 - idx;
          return (
            <div key={star} style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 8 }}>
              <span style={{ width: 25, fontSize: 14 }}>{t("ratings_star", { star })}</span>
              <div style={{ flex: 1, height: 16, backgroundColor: "var(--bg-secondary)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ width: `${p}%`, height: "100%", backgroundColor: "gold", borderRadius: 8, transition: "width 0.3s ease" }} />
              </div>
              <span style={numberStyle}>{p}%</span>
            </div>
          );
        })}
      </div>

      {/* Comments */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ textAlign: "center" }}>{t("comments") || "Comments"}</h2>
        <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={t("write_a_comment") || "Write a comment..."} style={{ width: "100%", minHeight: 60, marginTop: 10, padding: 8, borderRadius: 6 }} />
        <button onClick={submitComment} style={buttonStyle}>{editingId ? t("edit") || "Edit" : t("submit") || "Submit"}</button>

        <div style={{ marginTop: 20 }}>
          {comments.map(c => {
            const isOwner = currentUserId === c.userId;
            const canReply = currentUserId && !isOwner || currentUserRole === "admin";

            return (
              <div key={c._id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0", display: "flex", flexDirection: isRTL ? "row-reverse" : "row", gap: 10, justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <strong>{c.name}</strong> {currentUserRole === "admin" || isOwner ? `(${c.emailMasked})` : ""}
                  <p style={{ margin: "4px 0" }}>{c.text}</p>

                  {isOwner && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4, cursor: "pointer" }}>
                      <span onClick={() => startEdit(c._id, c.text)}>✏️</span>
                      <span onClick={() => deleteComment(c._id)}>🗑️</span>
                    </div>
                  )}

                  {c.replies && c.replies.length > 0 && (
                    <div style={{ marginTop: 6, paddingLeft: isRTL ? 0 : 16, paddingRight: isRTL ? 16 : 0 }}>
                      {c.replies.map(r => (
                        <div key={r._id} style={{ borderLeft: "2px solid var(--primary)", paddingLeft: 8, marginBottom: 4 }}>
                          <strong>{r.adminName || r.userName}</strong>: {r.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {canReply && (
                    <div style={{ marginTop: 6 }}>
                      <textarea
                        value={replyTexts[c._id] || ""}
                        onChange={(e) => handleReplyChange(c._id, e.target.value)}
                        placeholder={t("write_a_reply") || "Write a reply..."}
                        style={{ width: "100%", minHeight: 40, padding: 6, borderRadius: 4 }}
                      />
                      <button onClick={() => submitReply(c._id, c.userId)} style={{ ...buttonStyle, marginTop: 4 }}>{t("reply") || "Reply"}</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
