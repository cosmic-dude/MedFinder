import { useCallback, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import SearchBar from "../components/SearchBar";
import MedicineCard from "../components/MedicineCard";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async (value) => {
    setQuery(value);

    if (!value) {
      setResults([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(`/search?q=${encodeURIComponent(value)}`);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to search medicines");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_top,_#cffafe,_#f8fafc_38%,_#fff_100%)] px-4 pb-12 pt-10 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 shadow">
            Real-time local pharmacy lookup
          </p>
          <h1 className="mx-auto mb-3 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Find Available Medicines Near You
          </h1>
          <p className="mx-auto max-w-2xl text-slate-600">
            Search any medicine and instantly see nearby pharmacies with current stock, price, and contact details.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-3xl">
          <SearchBar value={query} onDebouncedChange={handleSearch} />
        </div>

        {loading && <p className="text-center text-slate-600">Searching medicines...</p>}
        {error && <p className="text-center text-rose-600">{error}</p>}

        {!loading && query && results.length === 0 && !error && (
          <p className="text-center text-slate-500">No pharmacies currently have this medicine in stock.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <MedicineCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
