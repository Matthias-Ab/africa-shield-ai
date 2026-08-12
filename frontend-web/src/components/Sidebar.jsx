import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Bell,
  MapPinned,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const navigation = [
    {
      label: "OVERVIEW",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/",
        },
        {
          name: "Live Flood Map",
          icon: Map,
          path: "/map",
        },
        {
          name: "Alerts",
          icon: Bell,
          path: "/alerts",
          badge: 4,
        },
      ],
    },
    {
      label: "MONITORING",
      items: [
        {
          name: "Regions",
          icon: MapPinned,
          path: "/regions",
        },
        {
          name: "Analytics",
          icon: BarChart3,
          path: "/analytics",
        },
        {
          name: "Reports",
          icon: FileText,
          path: "/reports",
        },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white px-4 py-5">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h1 className="text-[18px] font-extrabold tracking-tight text-slate-800">
            AfriShield
          </h1>

          <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[1.5px] text-slate-400">
            Flood Intelligence
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7">
        {navigation.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[1.4px] text-slate-400">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? "bg-teal-50 text-teal-700 shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={19}
                          strokeWidth={isActive ? 2.4 : 2}
                          className={
                            isActive
                              ? "text-teal-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }
                        />

                        <span className="flex-1 text-[13px] font-semibold">
                          {item.name}
                        </span>

                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[10px] font-bold text-red-600">
                            {item.badge}
                          </span>
                        )}

                        {isActive && (
                          <ChevronRight
                            size={15}
                            className="text-teal-500"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 border-t border-slate-100 pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`
          }
        >
          <Settings
            size={19}
            className="text-slate-400 group-hover:text-slate-600"
          />

          <span className="text-[13px] font-semibold">Settings</span>
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            `group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              isActive
                ? "bg-teal-50 text-teal-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`
          }
        >
          <HelpCircle
            size={19}
            className="text-slate-400 group-hover:text-slate-600"
          />

          <span className="text-[13px] font-semibold">
            Help & Support
          </span>
        </NavLink>

        {/* System status */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />

            <span className="text-[11px] font-semibold text-slate-700">
              System operational
            </span>
          </div>

          <p className="mt-1.5 pl-4 text-[9px] text-slate-400">
            Last updated just now
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;