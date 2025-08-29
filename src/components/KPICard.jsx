export default function KPICard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 text-center">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}



