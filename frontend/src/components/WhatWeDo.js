import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const WhatWeDo = () => {
  const navigate = useNavigate();
  const services = [
    {
      title: "Business Process Automation",
      description: "Transform your business operations with intelligent automation solutions that reduce manual work and increase efficiency.",
      features: [
        "Workflow Builder & Designer",
        "Task Automation Engine",
        "Approval Process Management",
        "Integration with Existing Systems",
        "Real-time Process Monitoring",
        "Custom Rule Configuration"
      ],
      benefits: [
        "Reduce manual errors by 95%",
        "Increase productivity by 60%",
        "24/7 automated operations",
        "Scalable process management"
      ]
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Make data-driven decisions with comprehensive analytics and visualization tools that provide real-time insights.",
      features: [
        "Custom Dashboard Builder",
        "Real-time Data Visualization",
        "Advanced Reporting Tools",
        "KPI Tracking & Monitoring",
        "Predictive Analytics",
        "Multi-source Data Integration"
      ],
      benefits: [
        "Instant access to business metrics",
        "Improved decision making",
        "Identify trends and patterns",
        "Customizable reporting"
      ]
    },
    {
      title: "Document Management System",
      description: "Streamline document workflows with comprehensive management, processing, and collaboration capabilities.",
      features: [
        "Secure File Storage & Management",
        "Version Control System",
        "Automated Document Processing",
        "Collaboration Tools",
        "Search & Indexing",
        "Compliance Management"
      ],
      benefits: [
        "Reduce paper-based processes",
        "Improve document security",
        "Enable remote collaboration",
        "Ensure regulatory compliance"
      ]
    },
    {
      title: "Communication & Collaboration",
      description: "Foster seamless teamwork with integrated communication and collaboration tools designed for modern businesses.",
      features: [
        "Real-time Messaging System",
        "Team Collaboration Spaces",
        "Video Conferencing Integration",
        "File Sharing & Co-editing",
        "Task Management Integration",
        "Notification Management"
      ],
      benefits: [
        "Improve team productivity",
        "Reduce communication gaps",
        "Enable remote work",
        "Centralized communication hub"
      ]
    },
    {
      title: "Digital Marketplace Platform",
      description: "Build and manage comprehensive e-commerce solutions with full marketplace functionality.",
      features: [
        "Product Catalog Management",
        "Shopping Cart & Checkout",
        "Payment Processing Integration",
        "Order Management System",
        "Inventory Management",
        "Customer Portal"
      ],
      benefits: [
        "Expand market reach",
        "Automate sales processes",
        "Improve customer experience",
        "Increase revenue streams"
      ]
    },
    {
      title: "Customer Experience Transformation",
      description: "Revolutionize customer interactions with personalized experiences and automated customer journey management.",
      features: [
        "Customer Journey Mapping",
        "Personalization Engine",
        "Multi-channel Integration",
        "Automated Customer Support",
        "Feedback Management System",
        "Customer Analytics"
      ],
      benefits: [
        "Increase customer satisfaction",
        "Reduce support costs",
        "Improve retention rates",
        "Personalized experiences"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              What We Do
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              We help dynamic businesses unlock their full potential through comprehensive 
              digital transformation solutions that automate processes, enhance customer experiences, 
              and drive sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:items-center gap-12`}>
                <div className="lg:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {service.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Benefits</h3>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600">Transforming businesses through innovation</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how our comprehensive digital transformation solutions can help your business thrive.
          </p>
          <button 
            onClick={() => navigate('/contact-us')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhatWeDo;