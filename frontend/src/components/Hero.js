import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Digital Transformation
              <span className="block text-blue-600">Reimagined</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              We apply an interdisciplinary perspective and person-centred design to technology evaluation, 
              digital transformation, business process automation, and comprehensive platform development.
            </p>
            <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started
              </button>
              <button className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/16053029/pexels-photo-16053029.jpeg"
                alt="Digital Transformation Technology"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Live Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;