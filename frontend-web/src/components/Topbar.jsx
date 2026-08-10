import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Menu,
} from "lucide-react";

function Topbar() {
  return (
<header className="sticky top-0 z-40 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-teal-600">
            AFRISHIELD COMMAND CENTER
          </p>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-slate-800">
            Flood Risk Overview
          </h2>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600">
          <Search size={17} />

          <span className="hidden text-[11px] font-medium md:block">
            Search regions...
          </span>

          <span className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[8px] text-slate-400 lg:block">
            /
          </span>
        </button>

        {/* Date */}
        <button className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 md:flex">
          <CalendarDays size={16} className="text-teal-600" />

          <span className="text-[10px] font-semibold">
            Today
          </span>

          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-[11px] font-extrabold text-teal-700">
            HA
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-[11px] font-bold text-slate-700">
              Habiba
            </p>

            <p className="text-[9px] text-slate-400">
              Frontend Developer
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Topbar;