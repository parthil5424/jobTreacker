export default function QuickAction({ icon: Icon, label, count, onClick }) {
  return (
    <button
      //   onClick={onClick}
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{count} pending</p>
      </div>
    </button>
  );
}
