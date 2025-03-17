import React from "react";
import Link from "next/link";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import Header from "@/app/components/Header";
import PoweredBy from "@/app/components/common/style/PoweredBy";

const EmbedHome = () => {
  return (
    <PageWrapper>
      <Header currentPath="/embed" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Widget Embed System</h1>
          <p className="text-xl text-gray-600 mb-8">
            Easily embed our widgets on any website with a script tag or iframe
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
            <p className="text-gray-600 mb-6">
              Learn how to embed our widgets on your website with detailed instructions and examples.
            </p>
            <Link 
              href="/embed/docs" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              View Documentation
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>
            <p className="text-gray-600 mb-6">
              See our widgets in action and get code snippets you can copy and paste into your website.
            </p>
            <Link 
              href="/embed/demo" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              View Demo
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Available Widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Player Widget</h3>
              <p className="text-gray-600">Display player statistics and information.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Team Widget</h3>
              <p className="text-gray-600">Show team roster and performance data.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">League Widget</h3>
              <p className="text-gray-600">Display league standings and statistics.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Scoring Leaders</h3>
              <p className="text-gray-600">Showcase top scorers from a league.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Goalie Leaders</h3>
              <p className="text-gray-600">Display top goalies from a league.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Alumni Widget</h3>
              <p className="text-gray-600">Showcase alumni from your organization.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Tournament Alumni</h3>
              <p className="text-gray-600">Display players who participated in tournaments.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need a Custom Widget?</h2>
          <p className="text-gray-600 mb-6">
            Have a specific requirement? We can help create custom widgets for your needs.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#0B9D52] text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedHome; 