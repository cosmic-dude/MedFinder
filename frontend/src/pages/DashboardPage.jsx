import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const DashboardPage = () => {
  const [profile, setProfile] = useState({
    shopName: "",
    address: "",
    city: "",
    phone: "",
    latitude: "",
    longitude: "",
  });
  const [medForm, setMedForm] = useState({
    medicineName: "",
    brand: "",
    price: "",
    inStock: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/pharmacy/profile");
      const profileData = response.data;
      setProfile({
        shopName: profileData.shopName || "",
        address: profileData.address || "",
        city: profileData.city || "",
        phone: profileData.phone || "",
        latitude: profileData.location?.coordinates?.[1] || "",
        longitude: profileData.location?.coordinates?.[0] || "",
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Unable to load profile");
      }
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axiosInstance.get("/inventory");
      setMedicines(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError("Unable to load inventory");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchInventory();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...profile,
        latitude: profile.latitude === "" ? undefined : Number(profile.latitude),
        longitude: profile.longitude === "" ? undefined : Number(profile.longitude),
      };
      await axiosInstance.post("/pharmacy/profile", payload);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save profile");
    }
  };

  const saveMedicine = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        medicineName: medForm.medicineName,
        brand: medForm.brand,
        price: Number(medForm.price),
        inStock: Number(medForm.inStock || 0),
      };

      if (editingId) {
        await axiosInstance.put(`/inventory/${editingId}`, payload);
        setMessage("Medicine updated successfully.");
      } else {
        await axiosInstance.post("/inventory", payload);
        setMessage("Medicine added successfully.");
      }

      setMedForm({ medicineName: "", brand: "", price: "", inStock: "" });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save medicine");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setMedForm({
      medicineName: item.medicineName,
      brand: item.brand || "",
      price: String(item.price),
      inStock: String(item.inStock),
    });
  };

  const onDelete = async (id) => {
    setError("");
    setMessage("");

    try {
      await axiosInstance.delete(`/inventory/${id}`);
      setMessage("Medicine deleted successfully.");
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete medicine");
    }
  };

  return (
    <main className="bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Pharmacy Dashboard</h1>
          <p className="text-slate-600">Manage profile and real-time medicine inventory.</p>
        </header>

        {message && <p className="rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700">{message}</p>}
        {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-rose-700">{error}</p>}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Profile Settings</h2>
          <form onSubmit={saveProfile} className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Shop Name"
              value={profile.shopName}
              onChange={(e) => setProfile((p) => ({ ...p, shopName: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <input
              placeholder="Phone"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <input
              placeholder="Address"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5 sm:col-span-2"
              required
            />
            <input
              placeholder="City"
              value={profile.city}
              onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude (optional)"
              value={profile.latitude}
              onChange={(e) => setProfile((p) => ({ ...p, latitude: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (optional)"
              value={profile.longitude}
              onChange={(e) => setProfile((p) => ({ ...p, longitude: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 sm:col-span-2"
            >
              Save Profile
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            {editingId ? "Edit Medicine" : "Add Medicine"}
          </h2>
          <form onSubmit={saveMedicine} className="grid gap-3 sm:grid-cols-4">
            <input
              placeholder="Medicine Name"
              value={medForm.medicineName}
              onChange={(e) => setMedForm((p) => ({ ...p, medicineName: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <input
              placeholder="Brand"
              value={medForm.brand}
              onChange={(e) => setMedForm((p) => ({ ...p, brand: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={medForm.price}
              onChange={(e) => setMedForm((p) => ({ ...p, price: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={medForm.inStock}
              onChange={(e) => setMedForm((p) => ({ ...p, inStock: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2.5"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-700 px-4 py-2.5 font-semibold text-white hover:bg-cyan-600 sm:col-span-4"
            >
              {editingId ? "Update Medicine" : "Add Medicine"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Inventory Table</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2">Medicine</th>
                  <th className="px-3 py-2">Brand</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((item) => (
                  <tr key={item._id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-900">{item.medicineName}</td>
                    <td className="px-3 py-2">{item.brand || "-"}</td>
                    <td className="px-3 py-2">Rs. {Number(item.price).toFixed(2)}</td>
                    <td className="px-3 py-2">{item.inStock}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded bg-amber-100 px-2.5 py-1 text-amber-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item._id)}
                          className="rounded bg-rose-100 px-2.5 py-1 text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
