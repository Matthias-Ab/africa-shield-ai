import {
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Globe2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

const iconMap = {
  high: AlertTriangle,
  medium: AlertCircle,
  low: ShieldCheck,
  default: Globe2,
};

const colorMap = {
  high: {
    icon: "bg-red-50 text-red-600",
    badge: "bg-red-50 text-red-600",
  },
  medium: {
    icon: "bg-orange-50 text-orange-600",
    badge: "bg-orange-50 text-orange-600",
  },
  low: {
    icon: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
  },
  default: {
    icon: "bg-teal-50 text-teal-600",
    badge: "bg-teal-50 text-teal-600",
  },
};

function StatCard({
  title,
  value,
  description,
  variant = "default",
  trend,
  trendDirection = "stable",
  active = false,
}) {
  const Icon = iconMap[variant] || Globe2;
  const colors = colorMap[variant] || colorMap.default;

  const TrendIcon =
    trendDirection === "up"
      ? ArrowUpRight
      : trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <article
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        ${
          active
            ? "border-teal-300 bg-teal-50/30 shadow-md shadow-teal-100"
            : "border-slate-200"
        }
        hover:-translate-y-1
        hover:border-teal-200
        hover:shadow-lg
      `}
    >

      {/* Active indicator */}
      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-1
          bg-teal-500
          transition-opacity
          duration-300
          ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      />

      {/* Top row */}
      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.icon} transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={20} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${colors.badge}`}
          >
            <TrendIcon size={12} />
            {trend}
          </div>
        )}

      </div>

      {/* Content */}
      <div className="mt-5">

        <p className="text-xs font-semibold text-slate-500">
          {title}
        </p>

        <div className="mt-1 flex items-baseline gap-2">

          <h3 className="text-3xl font-extrabold tracking-tight text-slate-800">
            {value}
          </h3>

        </div>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        )}

      </div>

      {/* Click hint */}
      <div
        className={`
          mt-4
          text-[10px]
          font-bold
          transition-all
          duration-300
          ${
            active
              ? "text-teal-600"
              : "text-transparent group-hover:text-teal-600"
          }
        `}
      >
        {active ? "Filter active" : "Click to filter →"}
      </div>

    </article>
  );
}

export default StatCard;