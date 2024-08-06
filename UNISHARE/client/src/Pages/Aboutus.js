import React from 'react';
import Layout from '../Components/Layout';


export default function AboutUs() {
  return (
    <Layout title="About Us">
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-screen-xl  bg-slate-200 rounded-3xl mx-auto px-10 md:flex items-center justify-between" style={{ width: '1500px', height: '900px' }}>
          <div className="md:w-full h-94 mb-12 md:mb-0">
            <h2 className="text-4xl font-bold mb-48 text-center">About Our Community</h2>
            <p className="text-lg mb-48">
              We are dedicated to fostering a community of sharing and collaboration among college students. Our goal is to provide a platform where students can freely exchange resources, knowledge, and ideas to support each other in their academic journey.
            </p>
            <a href="#" className="text-gray-900 bg-blue-300 rounded-full inline-block mb-24">
              Read More
            </a>
            <div className="grid grid-cols-2   md:grid-cols-4 gap-8">
              <div className=" bg-blue-950 text-white rounded-lg p-8 text-center">
                <h3 className="text-4xl font-bold mb-4">120</h3>
                <p className="text-lg">Resources Shared</p>
              </div>
              <div className="bg-blue-950 rounded-lg p-8 text-white text-center">
                <h3 className="text-4xl font-bold mb-4">90</h3>
                <p className="text-lg">Active Members</p>
              </div>
              <div className="bg-blue-950 text-white rounded-lg p-8 text-center">
                <h3 className="text-4xl font-bold mb-4">50</h3>
                <p className="text-lg">Discussions</p>
              </div>
              <div className="bg-blue-950 text-white rounded-lg p-8 text-center">
                <h3 className="text-4xl font-bold mb-4">100</h3>
                <p className="text-lg">Downloads</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 ">
            <img src='/images/pexels-canva-studio-3277808.jpg' alt="About Us" className=" object-cover p-11  mx-auto" style={{ width: '600px', height: '900px' }} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
