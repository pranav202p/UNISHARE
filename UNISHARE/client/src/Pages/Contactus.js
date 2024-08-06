import React from 'react';
import Layout from '../Components/Layout';

export default function Contactus() {
  return (
    <Layout title={"Contact Us"}>
      <div className='bg-white '>
      <div class="relative rounded-3xl p-24">
 
  <div class="absolute inset-0 rounded-3xl z-0">
    <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d124407.42439195781!2d77.48506024386143!3d12.988984772497083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3bae15b277a93807%3A0x88518f37b39dabd0!2sChrist%20University%2C%20DHARMARAM%20COLLEGE%2C%20Hosur%20Main%20Road%2C%20Post%2C%20Bengaluru%2C%20Karnataka%20560029!3m2!1d12.9362362!2d77.6061888!5e0!3m2!1sen!2sin!4v1713074376426!5m2!1sen!2sin" class="w-full h-full" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>
  <div class=" py-10 relative z-10">
    <div class="max-w-screen-lg bg-slate-400 rounded-3xl mx-auto px-4">
      <h2 class="text-black text-3xl text-center font-bold mb-8">CONTACT US</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div class="bg-brown-800 p-6 rounded-3xl">
          <h3 class="text-black text-xl font-bold mb-4">Contact Form</h3>
          <div class="mb-4">
            <input type="text" placeholder="Your Name" class="w-full bg-brown-900 text-black placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-orange-400" />
          </div>
          <div class="mb-4">
            <input type="email" placeholder="Your E-mail Address" class="w-full bg-brown-900 text-black placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-orange-400" />
          </div>
          <div class="mb-4">
            <textarea placeholder="Your Message" rows="4" class="w-full bg-brown-900 text-black placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-orange-400"></textarea>
          </div>
          <button class="bg-orange-500 text-black px-4 py-2 rounded-lg hover:bg-orange-400 focus:outline-none focus:ring focus:ring-orange-400">Send Message</button>
        </div>

        <div class="flex flex-col items-center justify-center space-y-4">
          <h3 class="text-black text-xl font-bold mb-4">You Can Also Follow Us On</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-white hover:text-orange-300 p-2 transition duration-300">
              <img src="/images/instagram.png" alt="Facebook" class="w-8  h-8" />
            </a>
            <a href="#" class="text-white hover:text-orange-300 p-2 transition duration-300">
              <img src="/images/logos.png" alt="Twitter" class="w-8 h-8" />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </Layout>
  );
}
