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
          active: true,
        },
        {
          name: "Live Flood Map",
          icon: Map,
        },
        {
          name: "Alerts",
          icon: Bell,
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
        },
        {
          name: "Analytics",
          icon: BarChart3,
        },
        {
          name: "Reports",
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white px-4 py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
          <ShieldCheck size={24} strokeWidth={2.2} />
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
                  <button
                    key={item.name}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                      item.active
                        ? "bg-teal-50 text-teal-700 shadow-sm"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={item.active ? 2.4 : 2}
                      className={
                        item.active
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

                    {item.active && (
                      <ChevronRight
                        size={15}
                        className="text-teal-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-1 border-t border-slate-100 pt-4">
        <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
          <Settings
            size={19}
            className="text-slate-400 group-hover:text-slate-600"
          />

          <span className="text-[13px] font-semibold">
            Settings
          </span>
        </button>

        <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
          <HelpCircle
            size={19}
            className="text-slate-400 group-hover:text-slate-600"
          />

          <span className="text-[13px] font-semibold">
            Help & Support
          </span>
        </button>

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