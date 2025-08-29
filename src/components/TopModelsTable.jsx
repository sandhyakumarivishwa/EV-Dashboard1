export default function TopModelsTable({ data }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">Top Models</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="text-center">
              <td className="p-2 border">{row.model}</td>
              <td className="p-2 border">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
