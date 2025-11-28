import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AdminReviews() {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const [comments, setComments] = useState([]);
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const isRTL = i18n.language === "ar";

  // Replace this with your real admin check
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchComments();
    // check token payload for admin role
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") setIsAdmin(true);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews/comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReply = async () => {
    if (!replyText.trim()) return alert("Reply cannot be empty");
    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/comments/${replyingToId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: replyText }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        setReplyingToId(null);
        fetchComments();
      } else alert(data.message || "Error submitting reply");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        borderRadius: "12px",
        backgroundColor: "var(--card)",
        color: "var(--text)",
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
      }}
    >
      <h2 style={{ textAlign: "center" }}>{t("comments") || "Comments"}</h2>

      <div style={{ marginTop: 20 }}>
        {comments.map((c) => (
          <div
            key={c._id}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
              display: "flex",
              flexDirection: isRTL ? "row-reverse" : "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ flex: 1 }}>
              <strong>{c.name}</strong> ({c.emailMasked})
              <p style={{ marginTop: 4, marginBottom: 4 }}>{c.text}</p>

              {/* Admin reply section */}
              {isAdmin && (
                <div style={{ marginTop: 6 }}>
                  <span
                    style={{ cursor: "pointer", color: "var(--primary)" }}
                    onClick={() =>
                      setReplyingToId(replyingToId === c._id ? null : c._id)
                    }
                  >
                    💬 {t("reply") || "Reply"}
                  </span>

                  {replyingToId === c._id && (
                    <div style={{ marginTop: 6 }}>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t("write_a_reply") || "Write a reply..."}
                        style={{
                          width: "100%",
                          minHeight: 50,
                          padding: 8,
                          borderRadius: 6,
                        }}
                      />
                      <button
                        onClick={submitReply}
                        style={{
                          marginTop: 6,
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontWeight: "bold",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "var(--primary)",
                          color: "var(--text)",
                        }}
                      >
                        {t("submit_reply") || "Submit Reply"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Display replies */}
              {c.replies && c.replies.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    paddingLeft: isRTL ? 0 : 16,
                    paddingRight: isRTL ? 16 : 0,
                  }}
                >
                  {c.replies.map((r) => (
                    <div
                      key={r._id}
                      style={{
                        borderLeft: "2px solid var(--primary)",
                        paddingLeft: 8,
                        marginBottom: 4,
                      }}
                    >
                      <strong>{r.adminName || r.userName}</strong>: {r.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
