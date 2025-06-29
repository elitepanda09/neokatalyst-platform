import React from "react";
import { useNavigate } from "react-router-dom";

const Testimonials = () => {
  const navigate = useNavigate();
  const testimonials = [
    {
      name: "Thomas Marx",
      position: "COO of Lift Fit",
      content: "Wonderful business to deal with. The people are professional and insightful with plenty of knowledge. They helped the business get set up and operational within budget and timeframe given. Brilliant training and follow through of implementation. I highly recommend them.",
      rating: 5
    },
    {
      name: "Wimpie Nortje",
      position: "CTO of Strauss & Co",
      content: "neokatalyst employs a systematic engineering process and makes great effort to understand your business and specific difficulties before proposing a solution. The team members are experts in digital transformation which ensures that implementations are done on time and within budget.",
      rating: 5
    },
    {
      name: "Sam Weldon",
      position: "NMG",
      content: "Working with the neokatalyst team was a refreshing experience. As a business we were really excited to develop and implement the digital transformation solution and our excitement was met by expertise and eagerness to meet our business requirements.",
      rating: 5
    },
    {
      name: "Diani Smit",
      position: "Founder & CEO of Hatch Communication",
      content: "From the initial information sessions through onboarding and ongoing support, the team has consistently demonstrated exceptional responsiveness and helpfulness.",
      rating: 5
    },
    {
      name: "Michael Billson",
      position: "Founder of Silverline Brands",
      content: "The system they developed for my business is nothing short of remarkable. It seamlessly integrates various software and tools, allowing for smooth communication and process flow.",
      rating: 5
    },
    {
      name: "DT Scheepers",
      position: "COO of LSD Open",
      content: "LSD Open decided to replace all our individual software subscriptions with the neokatalyst comprehensive digital transformation platform. The results have been outstanding.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Client Testimonials
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our clients say about their digital transformation journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/contact-us')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Your Transformation Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;