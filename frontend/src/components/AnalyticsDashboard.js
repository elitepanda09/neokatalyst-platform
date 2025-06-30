import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchMetrics();
    fetchWidgets();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/analytics/dashboard`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API}/analytics/metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchWidgets = async () => {
    try {
      const response = await axios.get(`${API}/analytics/widgets`);
      setWidgets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching widgets:', error);
      setLoading(false);
    }
  };

  const createSampleMetric = async () => {
    try {
      const sampleMetric = {
        name: "User Engagement",
        value: Math.floor(Math.random() * 100),
        unit: "%",
        category: "performance",
        metadata: { source: "dashboard" }
      };
      await axios.post(`${API}/analytics/metrics`, sampleMetric);
      fetchMetrics();
    } catch (error) {
      console.error('Error creating metric:', error);
    }
  };

  const createSampleWidget = async () => {
    try {
      const sampleWidget = {
        title: "Performance Chart",
        type: "line_chart",
        config: {
          data: [10, 20, 30, 40, 50],
          labels: ["Jan", "Feb", "Mar", "Apr", "May"]
        },
        position: { x: 0, y: 0, width: 6, height: 4 }
      };
      await axios.post(`${API}/analytics/widgets`, sampleWidget);
      fetchWidgets();
    } catch (error) {
      console.error('Error creating widget:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time insights and data visualization</p>
        </div>

        {/* Overview Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Workflows</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.overview.total_workflows}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.overview.total_tasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.overview.completion_rate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Documents</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.overview.total_documents}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts and Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-gray-600">Interactive charts coming soon</p>
                <p className="text-sm text-gray-500">Real-time data visualization</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {analytics?.recent_activity?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.action}</p>
                    <p className="text-gray-500 text-sm">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics and Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Custom Metrics</h2>
              <button
                onClick={createSampleMetric}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Add Metric
              </button>
            </div>
            <div className="space-y-3">
              {metrics.slice(0, 5).map((metric) => (
                <div key={metric.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{metric.name}</p>
                    <p className="text-sm text-gray-600">{metric.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{metric.value}{metric.unit}</p>
                    <p className="text-xs text-gray-500">{new Date(metric.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {metrics.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No metrics created yet. Click "Add Metric" to start tracking custom data.
                </div>
              )}
            </div>
          </div>

          {/* Dashboard Widgets */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Dashboard Widgets</h2>
              <button
                onClick={createSampleWidget}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                Add Widget
              </button>
            </div>
            <div className="space-y-3">
              {widgets.map((widget) => (
                <div key={widget.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{widget.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {widget.type}
                    </span>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-gray-50 to-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <p className="text-sm text-gray-600">Widget Preview</p>
                    </div>
                  </div>
                </div>
              ))}
              {widgets.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No widgets created yet. Click "Add Widget" to customize your dashboard.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;