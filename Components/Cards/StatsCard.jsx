function StatCard({ icon, title, total, active, color }) {
  return (
    <div
      className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-xl border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 shadow-lg`}
      >
        <span className="text-2xl">{icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>

      <div className="space-y-1">
        <p
          className={`text-3xl font-bold ${color.split(" ")[0]} bg-clip-text `}
        >
          {total}
        </p>

        {active !== null && (
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            ✅ {active} Active
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;
