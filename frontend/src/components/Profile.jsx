import { useState, useEffect } from "react";
import { getMe, updateMe } from "../services/auth";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    address: "",
    city: "",
    dob: "",
    gender: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Auto-hide messages
  useEffect(() => {
    if (msg || error) {
      const timer = setTimeout(() => {
        setMsg("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, error]);

  // Load profile (first from localStorage, then API)
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const data = JSON.parse(localUser);
      setForm({
        name: data.name || "",
        email: data.email || "",
        bio: data.bio || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
        gender: data.gender || "",
      });
      setPreview(data.image || "");
    }

    // Fetch latest from API
    const loadProfile = async () => {
      try {
        const { data } = await getMe();
        setForm({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
          gender: data.gender || "",
        });
        setPreview(data.image || "");
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setError(t("error_loading_profile"));
      }
    };
    loadProfile();
  }, [t]);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    let imageBase64 = preview;

    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      await new Promise((resolve) => {
        reader.onloadend = () => {
          imageBase64 = reader.result;
          resolve();
        };
      });
    }

    try {
      const payload = { ...form, image: imageBase64 };
      delete payload.email; // don't allow email update

      const { data } = await updateMe(payload);

      // Persist updated profile
      localStorage.setItem("user", JSON.stringify(data));

      setMsg(t("profile_updated"));
      setPreview(data.image || preview);
      setForm({
        ...form,
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("error_updating_profile"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div
      className="container-page"
      style={{ paddingTop: 40, direction: isRTL ? "rtl" : "ltr", textAlign: isRTL ? "right" : "left" }}
    >
      <h2 style={{ color: "#b91c1c", marginBottom: 20 }}>{t("my_profile")}</h2>

      {msg && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 12px", borderRadius: 12, marginBottom: 12 }}>{msg}</div>}
      {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: 12, marginBottom: 12 }}>{error}</div>}

      <div className="card" style={{ padding: 24, borderRadius: 12, maxWidth: 600, margin: "auto" }}>
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #b91c1c" }}
            />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#b91c1c", display: "inline-block", lineHeight: "120px", color: "#fff", fontSize: 40 }}>
              {form.name ? form.name.charAt(0).toUpperCase() : ""}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} style={{ display: "grid", gap: 14 }}>
          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("name")}</label>
          <input className="input" placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("email")}</label>
          <input className="input" placeholder={t("email")} value={form.email} disabled style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("bio")}</label>
          <textarea className="input" placeholder={t("bio")} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} style={{ minHeight: 80, direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("phone")}</label>
          <input className="input" placeholder={t("phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("address")}</label>
          <input className="input" placeholder={t("address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("city")}</label>
          <input className="input" placeholder={t("city")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("dob")}</label>
          <input type="date" className="input" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("gender")}</label>
          <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ direction: isRTL ? "rtl" : "ltr" }}>
            <option value="">{t("select")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
          </select>

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>{t("profile_photo")}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit" style={{ background: "#b91c1c", color: "#fff", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10 }}>{t("update_profile")}</button>

          <button type="button" onClick={handleLogout} style={{ background: "#000", color: "#fff", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer" }}>{t("logout")}</button>
        </form>
      </div>
    </div>
  );
}
