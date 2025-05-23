"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PageWrapper from "@/app/components/common/style/PageWrapper";
import Header from "@/app/components/Header";
import PoweredBy from "@/app/components/common/style/PoweredBy";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Send data to our API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Success
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }    
  };

  return (
    <PageWrapper>
      <Header currentPath="/contact" />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            
            <div className="mb-8">
              <p className="mb-4">
                Have questions about our widgets or need help with embedding? Our team is here to help!
              </p>
              <p className="mb-4">
                Fill out the form and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
            
            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent!</h3>
                <p className="text-green-600">
                  Thank you for reaching out. We&apos;ve received your message and will respond shortly.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-4 px-4 py-2 bg-[#0B9D52] text-white font-bold rounded-md hover:bg-green-700 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="Widget Support">Widget Support</option>
                    <option value="Widget Support">Suggest a new Widget</option>
                    <option value="Embedding Help">Embedding Help</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {submitError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    isSubmitting ? 'bg-[#0B9D52] cursor-not-allowed' : 'bg-[#0B9D52] hover:bg-green-700'
                  } transition-all`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
            <div className="mt-8">
              <Link href="/embed/docs" className="text-blue-600 hover:underline">
                ← Back to Documentation
              </Link>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full h-[300px] md:h-[400px] mb-8">
              <img 
                src="/images/what-huh.gif" 
                alt="Confused person gif" 
                width={400}
                height={400}
                style={{ objectFit: 'contain' }}
              />
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 w-full">
              <h2 className="text-xl font-semibold mb-4">Quick Support Options</h2>
              
              <div className="space-y-4">              
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">FAQ</h3>
                    <p className="text-gray-600">Check our <Link href="/faq" className="text-blue-600 hover:underline">frequently asked questions</Link> for quick answers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default ContactPage; 