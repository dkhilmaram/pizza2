// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { getMe, updateMe } from "../services/auth";

export default function Profile() {
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
  const [image, setImage] = useState(null); // File object
  const [preview, setPreview] = useState(""); // Base64 or URL
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Load user profile
  useEffect(() => {
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
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil");
      }
    };
    loadProfile();
  }, []);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    let imageBase64 = preview;

    if (image) {
      // Convert image file to Base64
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
      // Remove email from payload to prevent accidental update
      const payload = { ...form, image: imageBase64 };
      delete payload.email;

      const { data } = await updateMe(payload);

      setMsg("Profil mis à jour !");
      setPreview(data.image || preview);
      setForm({ ...form, ...data });
      localStorage.setItem("user", JSON.stringify(data)); // persist session data
      setImage(null); // reset file input
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="container-page" style={{ paddingTop: 40 }}>
      <h2 style={{ color: "#b91c1c", marginBottom: 20 }}>Mon Profil</h2>

      {msg && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 12px", borderRadius: 12 }}>
          {msg}
        </div>
      )}
      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 12px", borderRadius: 12 }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 24, borderRadius: 12, maxWidth: 600, margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "2px solid #b91c1c" }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#b91c1c",
                display: "inline-block",
                lineHeight: "120px",
                color: "#fff",
                fontSize: 40,
              }}
            >
              {form.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <form onSubmit={handleUpdate} style={{ display: "grid", gap: 14 }}>
          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Nom</label>
          <input className="input" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Email</label>
          <input className="input" placeholder="Email" value={form.email} disabled />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Bio / Caption</label>
          <textarea
            className="input"
            placeholder="Bio / Caption"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            style={{ minHeight: 80 }}
          />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Téléphone</label>
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Adresse</label>
          <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Ville</label>
          <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Date de naissance</label>
          <input type="date" className="input" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Genre</label>
          <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option value="">Sélectionner</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>

          <label style={{ color: "#b91c1c", fontWeight: 600 }}>Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit" style={{ background: "#b91c1c", color: "#fff", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 10 }}>
            Mettre à jour
          </button>

          <button type="button" onClick={handleLogout} style={{ background: "#000", color: "#fff", padding: "10px 16px", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  );
}
