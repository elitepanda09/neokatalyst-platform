import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'automation', name: 'Automation', icon: '🤖' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'documents', name: 'Documents', icon: '📁' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒' },
    { id: 'collaboration', name: 'Collaboration', icon: '👥' }
  ];

  const stats = [
    { title: 'Active Processes', value: '24', change: '+12%', color: 'blue' },
    { title: 'Documents Processed', value: '1,247', change: '+8%', color: 'green' },
    { title: 'Revenue Generated', value: '$87,432', change: '+23%', color: 'purple' },
    { title: 'Team Members', value: '156', change: '+5%', color: 'orange' }
  ];

  const recentActivities = [
    { action: 'New automation workflow created', time: '2 hours ago', type: 'automation' },
    { action: 'Document "Q4 Report" uploaded', time: '4 hours ago', type: 'document' },
    { action: 'Analytics dashboard updated', time: '6 hours ago', type: 'analytics' },
    { action: 'New team member added', time: '1 day ago', type: 'team' },
    { action: 'Order #12345 processed', time: '2 days ago', type: 'marketplace' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`text-${stat.color}-600 text-sm font-semibold`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.action}</p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'automation':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Process Automation</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🤖</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Automation Hub</h4>
              <p className="text-gray-600 mb-8">Create and manage automated workflows to streamline your business processes.</p>
              <button 
                onClick={() => alert('Automation workflow builder coming in Phase 3!')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Workflow
              </button>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📈</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Data Insights</h4>
              <p className="text-gray-600 mb-8">View comprehensive analytics and insights about your business performance.</p>
              <button 
                onClick={() => alert('Advanced analytics coming in Phase 4!')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Analytics
              </button>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Document Management</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📁</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Document Hub</h4>
              <p className="text-gray-600 mb-8">Upload, organize, and collaborate on documents with advanced management features.</p>
              <button 
                onClick={() => alert('Document management system coming in Phase 3!')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Documents
              </button>
            </div>
          </div>
        );
      case 'marketplace':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Digital Marketplace</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">E-commerce Platform</h4>
              <p className="text-gray-600 mb-8">Manage your products, orders, and customer interactions in one place.</p>
              <button 
                onClick={() => alert('Digital marketplace coming in Phase 6!')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Manage Store
              </button>
            </div>
          </div>
        );
      case 'collaboration':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Collaboration</h3>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">👥</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Collaboration Hub</h4>
              <p className="text-gray-600 mb-8">Connect with your team through integrated communication and collaboration tools.</p>
              <button 
                onClick={() => alert('Team collaboration tools coming in Phase 5!')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Open Chat
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your digital transformation control center</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;