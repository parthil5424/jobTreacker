import { TrendingUp } from "lucide-react";
function StatCard({ icon: Icon, title, total, active, color, trend }) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        {/* {trend && (
          <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            {trend}%
          </div>
        )} */}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>

        <p
          className={`text-4xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}
        >
          {total.toLocaleString()}
        </p>

        {active !== null && active !== undefined && (
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {active?.toLocaleString()}
                </span>{" "}
                Active
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
