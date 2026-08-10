import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
} from "lucide-react";

import { useState } from "react";
import { regions } from "../data/mockData";
import RegionDetails from "./RegionDetails";

function RegionTable() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const getRiskClass = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return "bg-red-50 text-red-600 border-red-100";

      case "Medium":
        return "bg-orange-50 text-orange-600 border-orange-100";

      case "Low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Rising":
        return "bg-red-50 text-red-600";

      case "Falling":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-slate-100 text-slate-500";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Rising") {
      return <ArrowUpRight size={15} />;
    }

    if (status === "Falling") {
      return <ArrowDownRight size={15} />;
    }

    return <Minus size={15} />;
  };

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-teal-600">
              REGIONAL MONITORING
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800">
              Monitored Regions
            </h3>
          </div>

          <span className="rounded-full bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
            {regions.length} regions
          </span>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">

                <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Region
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Hazard
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Risk Score
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Risk Level
                </th>

                <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {regions.map((region) => (

                <tr
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="
                    group
                    cursor-pointer
                    border-b
                    border-slate-100
                    last:border-0
                    transition-all
                    duration-200
                    hover:bg-teal-50/60
                    hover:shadow-[inset_4px_0_0_#0d9488]
                  "
                >

                  {/* Region */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-3">

                      <div className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-500
                        transition-all
                        duration-200
                        group-hover:scale-105
                        group-hover:bg-teal-100
                        group-hover:text-teal-700
                      ">
                        <MapPin size={16} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-slate-700 transition-colors group-hover:text-teal-700">
                          {region.flag} {region.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {region.country}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Hazard */}
                  <td className="px-6 py-5">

                    <span className="text-sm font-medium text-slate-600">
                      {region.hazard}
                    </span>

                  </td>

                  {/* Risk Score */}
                  <td className="px-6 py-5">

                    <div className="flex items-center gap-2">

                      <strong className="text-base font-extrabold text-slate-700">
                        {region.riskScore}
                      </strong>

                      <span className="text-xs text-slate-400">
                        /100
                      </span>

                    </div>

                  </td>

                  {/* Risk Level */}
                  <td className="px-6 py-5">

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase ${getRiskClass(
                        region.riskLevel
                      )}`}
                    >
                      {region.riskLevel}
                    </span>

                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusClass(
                        region.status
                      )}`}
                    >

                      {getStatusIcon(region.status)}

                      <span>
                        {region.status}
                      </span>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* Region Details */}
      <RegionDetails
        region={selectedRegion}
        onClose={() => setSelectedRegion(null)}
      />
    </>
  );
}

export default RegionTable;