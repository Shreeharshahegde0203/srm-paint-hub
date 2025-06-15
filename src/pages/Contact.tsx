import React from 'react';
import { MapPin, Phone, Mail, Clock, Package } from 'lucide-react';
import { useCompanyInfo } from "../contexts/CompanyInfoContext";

const Contact = () => {
  // Get company location fields
  const { companyInfo } = useCompanyInfo();
  // Split address into separate lines if it contains \n
  const multilineAddress =
    companyInfo.address?.replace(/\\n/g, "<br />") ||
    "123 Paint Street, Market Area<br />Mumbai, Maharashtra 400001";
  // Split business hours into separate lines if it contains \n
  const businessHours =
    companyInfo.businessHours?.split('\n') ||
    ["Monday - Saturday: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"];
  // Use location info
  const mapEmbedUrl = companyInfo.mapEmbedUrl?.trim();
  const mapDisplayText = companyInfo.mapDisplayText || "Google Maps Integration";
  const locationDescription = companyInfo.locationDescription || "123 Paint Street, Mumbai";
  const directions = companyInfo.directions || "";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Mail className="mr-3 h-8 w-8 text-blue-600" />
            Contact {companyInfo.name || "Shreeram Marketing"}
          </h1>
          <p className="text-gray-600 mt-1">
            {companyInfo.tagline || "Get in touch with us for all your paint needs"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{companyInfo.phone || "+91 98765 43210"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{companyInfo.email || "info@shreerammarketing.com"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: multilineAddress }} />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      {businessHours.map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Premium Paint Collection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Color Consultation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">Bulk Orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Expert Advice</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Contact Form */}
          <div className="space-y-6">
            {/* Google Maps or Location Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Us</h2>
              {mapEmbedUrl ? (
                <div className="mb-4">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="250"
                    allowFullScreen
                    loading="lazy"
                    className="border-0 rounded-md w-full"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={mapDisplayText}
                  ></iframe>
                </div>
              ) : (
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">{mapDisplayText}</p>
                    <p className="text-sm text-gray-500">{locationDescription}</p>
                  </div>
                </div>
              )}
              <div className="mt-1">
                <p className="text-gray-700 text-sm whitespace-pre-line">{locationDescription}</p>
                {directions && (
                  <div className="mt-1 text-gray-600 text-xs whitespace-pre-line">
                    <span className="font-semibold">How to reach:</span> {directions}
                  </div>
                )}
              </div>
            </div>
            {/* Quick Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Inquiry</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
