import React from "react";

const Services = () => {
  const services = [
    {
      title: "Business Process Automation",
      description: "Automate repetitive tasks and streamline workflows to increase efficiency and reduce manual errors.",
      image: "https://images.unsplash.com/photo-1717386255785-59c670564341?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF1dG9tYXRpb258ZW58MHx8fGJsdWV8MTc1MTE3Nzg3Mnww&ixlib=rb-4.1.0&q=85",
      features: ["Workflow Builder", "Task Automation", "Approval Processes", "Integration APIs"]
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Configure comprehensive dashboards with real-time data visualization and insights.",
      image: "https://images.unsplash.com/photo-1660144425546-b07680e711d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fGJsdWV8MTc1MTE3Nzg3OHww&ixlib=rb-4.1.0&q=85",
      features: ["Custom Dashboards", "Real-time Metrics", "Data Visualization", "Report Generation"]
    },
    {
      title: "Document Management System",
      description: "Comprehensive document processing, storage, and collaboration platform.",
      image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg",
      features: ["File Upload/Storage", "Version Control", "Collaboration Tools", "Automated Processing"]
    },
    {
      title: "Digital Marketplace",
      description: "Complete e-commerce solution with catalog management, payments, and order processing.",
      image: "https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGF1dG9tYXRpb258ZW58MHx8fGJsdWV8MTc1MTE3Nzg3Mnww&ixlib=rb-4.1.0&q=85",
      features: ["Product Catalog", "Shopping Cart", "Payment Processing", "Order Management"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What we do
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Help the management of dynamic businesses to unlock full potential, by:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8">
            Working with users to overcome their biggest obstacles and unlock digital transformation potential.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;