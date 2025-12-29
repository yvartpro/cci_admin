const Dashboard = () => {
  const stats = [
    { label: 'Total Articles', value: '24', color: 'bg-blue-500' },
    { label: 'Categories', value: '6', color: 'bg-purple-500' },
    { label: 'New this week', value: '3', color: 'bg-green-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map(s => (
          <div key={s.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
            <div className={`h-1 w-12 mt-4 ${s.color} rounded`}></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="h-64 bg-white rounded-xl shadow-sm border p-6 flex items-center justify-center text-gray-400 italic">Chart Placeholder: Articles over time</div>
        <div className="h-64 bg-white rounded-xl shadow-sm border p-6 flex items-center justify-center text-gray-400 italic">Chart Placeholder: Category Distribution</div>
      </div>
    </div>
  );
};
export default Dashboard;
