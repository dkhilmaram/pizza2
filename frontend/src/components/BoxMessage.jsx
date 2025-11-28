import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function BoxMessages() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/boxmessages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsSeen = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/boxmessages/seen/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(prev =>
        prev.map(msg => (msg._id === id ? { ...msg, seen: true } : msg))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div style={{ direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}>
      <div className="container-page" style={{ paddingTop: 40 }}>
        <h2 style={{ fontWeight: 800, marginBottom: 20 }}>{t("box_messages")}</h2>

        {messages.length === 0 ? (
          <p>{t("no_messages_yet")}</p>
        ) : (
          <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("name")}</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("email")}</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("subject")}</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("message")}</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("seen")}</th>
                <th style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr
                  key={msg._id}
                  style={{
                    backgroundColor: msg.seen ? "#16a34a33" : "#b91c1c33", // green/red with opacity
                    transition: "background-color 0.3s",
                  }}
                >
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{msg.name}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{msg.email}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{msg.subject || "-"}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{msg.message}</td>
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd", fontWeight: 600, color: msg.seen ? "#16a34a" : "#b91c1c" }}>
                    {msg.seen ? t("yes") : t("no")}
                  </td>
                  <td style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
                    {!msg.seen && (
                      <button
                        className="btn btn-primary"
                        onClick={() => markAsSeen(msg._id)}
                        style={{ padding: "4px 12px", borderRadius: 6 }}
                      >
                        {t("mark as seen")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
