import { useEffect, useState } from "react";
import Papa from "papaparse";
import KPICard from "./components/KPICard";
import EVTypePieChart from "./components/EVTypePieChart";
import EVTrendChart from "./components/EVTrendChart";
import TopModelsTable from "./components/TopModelsTable";
import EVStateChart from "./components/EVStateChart";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse("/EV_Population.csv", {
      download: true,
      header: true,
      complete: (results) => setData(results.data),
    });
  }, []);

  if (data.length === 0) return <div className="p-10">Loading data...</div>;

  // 👉 KPI Calculations
  // 👉 KPI Calculations
  const totalEVs = data.length;

  const bevCount = data.filter(
    (d) => d["Electric Vehicle Type"] === "Battery Electric Vehicle (BEV)"
  ).length;
  const phevCount = data.filter(
    (d) =>
      d["Electric Vehicle Type"] === "Plug-in Hybrid Electric Vehicle (PHEV)"
  ).length;

  const avgRange = Math.round(
    data.reduce((sum, d) => sum + (parseInt(d["Electric Range"]) || 0), 0) /
      totalEVs
  );

  const avgMSRP = Math.round(
    data.reduce((sum, d) => sum + (parseInt(d["Base MSRP"]) || 0), 0) / totalEVs
  );

  const topMake = Object.entries(
    data.reduce((acc, d) => {
      acc[d.Make] = (acc[d.Make] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0][0];

  // const cafvYes = data.filter(
  //   (d) =>
  //     d["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] &&
  //     d["Clean Alternative Fuel Vehicle (CAFV) Eligibility"].toLowerCase().includes("elig")
  // ).length;
  // const cafvNo = totalEVs - cafvYes;

  const cafvYes = data.filter(
    (d) =>
      d["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] &&
      d["Clean Alternative Fuel Vehicle (CAFV) Eligibility"]
        .toLowerCase()
        .includes("elig")
  ).length;

  const cafvNo = totalEVs - cafvYes;

  const cafvData = [
    { type: "Eligible", value: cafvYes },
    { type: "Not Eligible", value: cafvNo },
  ];

  // 👉 Pie Chart Data
  const pieData = [
    { type: "BEV", value: bevCount },
    { type: "PHEV", value: phevCount },
  ];

  // 👉 Bar Chart Data (by Year)
  const yearData = Object.entries(
    data.reduce((acc, d) => {
      acc[d["Model Year"]] = (acc[d["Model Year"]] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  // 👉 Top Models
  const modelData = Object.entries(
    data.reduce((acc, d) => {
      acc[d.Model] = (acc[d.Model] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // state data
  const stateData = Object.entries(
    data.reduce((acc, d) => {
      acc[d.State] = (acc[d.State] || 0) + 1;
      return acc;
    }, {})
  ).map(([state, count]) => ({ state, count }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🚗 EV Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <KPICard title="Total EVs" value={totalEVs} />
        <KPICard title="BEVs" value={bevCount} />
        <KPICard title="PHEVs" value={phevCount} />
        <KPICard title="Avg Range" value={`${avgRange} mi`} />
        <KPICard title="Avg MSRP" value={`$${avgMSRP}`} />
        <KPICard
          title="CAFV Eligible %"
          value={`${Math.round((cafvYes / totalEVs) * 100)}%`}
        />
      </div>

      {/* Charts */}
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <EVTypePieChart data={pieData} />
        <EVTrendChart data={yearData} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <EVStateChart data={stateData} />
        <EVTypePieChart data={cafvData} />
        {/* <EVStateChart/> */}
      </div>

      {/* Table */}
      <TopModelsTable data={modelData} />
    </div>
  );
}

export default App;
