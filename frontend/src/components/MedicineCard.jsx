const MedicineCard = ({ item }) => {
  const pharmacy = item.pharmacyId;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{item.medicineName}</h3>
          <p className="text-sm text-slate-500">{item.brand || "Generic"}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Stock: {item.inStock}
        </span>
      </div>

      <p className="mb-4 text-2xl font-bold text-slate-900">Rs. {Number(item.price).toFixed(2)}</p>

      <div className="space-y-1 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{pharmacy?.shopName}</p>
        <p>{pharmacy?.address}</p>
        <p>{pharmacy?.city}</p>
        <p>{pharmacy?.phone}</p>
      </div>

      <a
        href={`tel:${pharmacy?.phone || ""}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
      >
        Call Now
      </a>
    </article>
  );
};

export default MedicineCard;
