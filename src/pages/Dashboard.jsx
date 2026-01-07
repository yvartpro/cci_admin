import { useEffect, useState } from "react";
import { getArticles } from "../services/articles.api";
import { getVolunteers } from "../services/volunteers.api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const loadArticles = async () => {
      const articles = await getArticles();
      setArticles(articles);
    };
    const loadVolunteers = async () => {
      const volunteers = await getVolunteers();
      setVolunteers(volunteers);
    };
    loadArticles();
    loadVolunteers();
  }, []);

  // --- Helper: format month name ---
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // --- Prepare monthly data for current year ---
  const currentYear = new Date().getFullYear();

  const articlesData = monthNames.map((month, i) => {
    const count = articles.filter(a => {
      const d = new Date(a.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === i;
    }).length;
    return { month, count };
  });

  const viewsData = monthNames.map((month, i) => {
    const totalViews = articles
      .filter(a => {
        const d = new Date(a.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === i;
      })
      .reduce((sum, a) => sum + (a.views_count || 0), 0);
    return { month, views: totalViews };
  });

  // --- Stats ---
  const weekArticles = articles.filter(a => new Date(a.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const weekVolunteers = volunteers.filter(v => new Date(v.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const stats = [
    { label: 'Total Articles', value: articles.length, color: 'bg-blue-500' },
    { label: 'Total Volunteers', value: volunteers.length, color: 'bg-purple-500' },
    { label: 'New Articles this week', value: weekArticles.length, color: 'bg-green-500' },
    { label: 'New Volunteers this week', value: weekVolunteers.length, color: 'bg-pink-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map(s => (
          <div key={s.label} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
            <div className={`h-1 w-12 mt-4 ${s.color} rounded`}></div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Articles over months */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Articles Over Time (Monthly)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={articlesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views growth over months */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Views Growth Over Time (Monthly)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
