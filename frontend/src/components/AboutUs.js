import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      description: "Digital transformation strategist with 15+ years in enterprise solutions.",
      image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      description: "Technical leader specializing in automation and AI integration.",
      image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg"
    },
    {
      name: "Michael Torres",
      role: "Head of Solutions",
      description: "Business process expert focused on customer experience transformation.",
      image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We constantly explore new technologies and methodologies to deliver cutting-edge solutions.",
      icon: "🚀"
    },
    {
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code quality to customer service.",
      icon: "⭐"
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients as partners in their digital transformation journey.",
      icon: "🤝"
    },
    {
      title: "Impact",
      description: "We measure our success by the positive impact we create for our clients' businesses.",
      icon: "📈"
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
              About neokatalyst
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              We are a team of passionate technologists and business strategists dedicated to 
              transforming how businesses operate in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At neokatalyst, we believe that every business deserves access to powerful digital transformation 
                tools that were once only available to large enterprises. Our mission is to democratize digital 
                transformation by providing comprehensive, user-friendly solutions that scale with your business.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We apply an interdisciplinary perspective and person-centred design to technology evaluation, 
                ensuring that our solutions not only meet technical requirements but also enhance human experiences 
                and business outcomes.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-gray-600">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGF1dG9tYXRpb258ZW58MHx8fGJsdWV8MTc1MTE3Nzg3Mnww&ixlib=rb-4.1.0&q=85"
                  alt="Digital Innovation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Values
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Experienced professionals dedicated to your success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
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
            Ready to Work Together?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of businesses who trust neokatalyst for their digital transformation needs.
          </p>
          <button 
            onClick={() => navigate('/contact-us')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Us Today
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;