import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

// ==================================================================================
// 🔑 GITHUB PAGES CONFIGURATION (EDIT THIS AREA)
// ==================================================================================

// Paste your Google Gemini API Key inside the quotes below:
const GITHUB_PAGES_API_KEY = "AIzaSyCuevq1tKjbPOp84ZH8joHhF3bvZHEODq8"; 

// ==================================================================================

// Setup process.env for GitHub Pages
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}
if (!process.env.API_KEY && GITHUB_PAGES_API_KEY) {
  process.env.API_KEY = GITHUB_PAGES_API_KEY;
}

// --- Icons (SVG Components) ---
const Icons = {
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
  ),
  WhatsApp: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 2c5.523 0 10 4.477 10 10 0 5.15-3.872 9.42-8.91 9.947l-1.09.053c-5.523 0-10-4.477-10-10 0-5.523 4.477-10 10-10zm0 3.25c-3.73 0-6.75 3.02-6.75 6.75s3.02 6.75 6.75 6.75 6.75-3.02 6.75-6.75-3.02-6.75-6.75-6.75zm.938 10.957c-.126 0-.214-.047-.29-.142l-.248-.363c-.046-.07-.069-.153-.069-.25 0-.177.108-.344.32-.511l.37-.25c.093-.062.14-.093.14-.093s.062.03.187.094c.125.062.281.187.468.374.187.187.312.374.375.468s.03.094.03.156c0 .125-.062.25-.187.375s-.344.187-.625.187zm-1.03-3.265c-.062 0-.125-.015-.187-.047s-.109-.078-.156-.156c-.047-.078-.063-.172-.063-.28s.016-.203.047-.281l.313-.625c.03-.062.078-.125.156-.187.078-.063.172-.094.281-.094s.203.031.281.094c.078.062.141.14.188.234.047.094.062.203.062.328s-.031.25-.094.344l-.281.625c-.062.125-.156.234-.281.328s-.266.141-.437.141zM7.5 12c0 2.47 2.03 4.5 4.5 4.5s4.5-2.03 4.5-4.5-2.03-4.5-4.5-4.5 2.03-4.5 4.5z"/></svg>
  ),
  Email: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
  ),
  Bot: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6"/></svg>
  ),
  Star: () => (
    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
  ),
  Spinner: () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
  ),
  Brain: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M3.343 15.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  ),
  Heart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
  ),
  Family: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  Key: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16 10.5 17.5 7.5 14.5 6 16l-3.5 3.5M16 5a6 6 0 00-6 6v0.5a.5.5 0 01-.5.5 3 3 0 01-2.5-1.5M16 5a2 2 0 00-2 2v1" /></svg>
  )
};

const MindWellnessLogo = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 90C74.8 90 92 72 92 50C92 28 74.8 10 50 10C25.2 10 8 28 8 50C8 63 15 75 25 82" stroke="#0d9488" strokeWidth="3" strokeLinecap="round"/>
    <path d="M80 40C85 45 85 55 80 60C78 62 75 63 72 63C68 63 68 68 68 72C68 76 75 80 60 88" stroke="#0d9488" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M50 80V60" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 60C50 60 38 48 35 45" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 60C50 60 62 48 65 45" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="4" fill="#f97316"/>
    <circle cx="35" cy="40" r="4" fill="#84cc16"/>
    <circle cx="65" cy="40" r="4" fill="#84cc16"/>
    <circle cx="50" cy="35" r="5" fill="#84cc16"/>
    <circle cx="42" cy="30" r="3" fill="#84cc16"/>
    <circle cx="58" cy="30" r="3" fill="#84cc16"/>
  </svg>
);

// --- Types ---
interface Source {
  title: string;
  uri: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
}

// --- Components ---

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MindWellnessLogo />
          <div className="flex flex-col">
            <h1 className="text-2xl font-serif font-bold text-gray-900 leading-none">
              MindWellness
            </h1>
            <span className="text-xs text-teal-600 font-medium tracking-widest uppercase mt-1">Healing of Mind</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-teal-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
          <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
          <a href="#appointment" className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Book Appointment
          </a>
        </nav>
      </div>
    </header>
  );
};

const Stats = () => (
  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center -mt-16 relative z-20 max-w-5xl mx-auto mx-4 md:mx-auto">
    <div className="p-4">
      <div className="text-4xl font-serif font-bold text-teal-600 mb-2">3+</div>
      <div className="text-gray-600 text-sm uppercase tracking-wide font-medium">Years Experience</div>
    </div>
    <div className="p-4 md:border-l md:border-r border-gray-100">
      <div className="text-4xl font-serif font-bold text-teal-600 mb-2">1000+</div>
      <div className="text-gray-600 text-sm uppercase tracking-wide font-medium">Happy Patients</div>
    </div>
    <div className="p-4">
      <div className="text-4xl font-serif font-bold text-teal-600 mb-2">2</div>
      <div className="text-gray-600 text-sm uppercase tracking-wide font-medium">Top Hospitals</div>
    </div>
  </div>
);

const Hero = () => (
  <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50">
    {/* Abstract Background Shapes */}
    <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Available for Consultation
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Restoring Balance to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Mind & Life</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
            Expert psychiatric care by <strong>Dr. Vijender Saini</strong> (MBBS, MD). 
            Compassionate treatment for anxiety, depression, and mental well-being using evidence-based medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="#appointment" className="bg-teal-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-500/30">
              Start Your Journey
            </a>
            <a href="#about" className="bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition-all">
              Learn More
            </a>
          </div>
        </div>

        {/* Image Card */}
        <div className="flex-1 relative fade-in-up delay-200">
          <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
            <div className="absolute inset-0 bg-teal-600 rounded-full opacity-10 blur-2xl transform translate-y-4"></div>
            <div className="absolute inset-0 border-2 border-dashed border-teal-200 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute inset-2 bg-white p-2 rounded-full shadow-2xl overflow-hidden">
               <img 
                src="https://i.ibb.co/1GYfG4s8/Whats-App-Image-2025-12-04-at-3-06-33-PM.jpg" 
                alt="Dr. Vijender Saini" 
                className="w-full h-full object-cover object-top rounded-full transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute bottom-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
               <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                  <Icons.Star />
               </div>
               <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Top Rated</p>
                  <p className="text-gray-900 font-bold">Psychiatrist</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="py-24 bg-white relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <div className="relative order-2 md:order-1">
          <div className="absolute -inset-4 bg-teal-50 rounded-3xl transform -rotate-3"></div>
          <img 
            src="https://i.ibb.co/1GYfG4s8/Whats-App-Image-2025-12-04-at-3-06-33-PM.jpg" 
            alt="Dr. Vijender Saini Profile" 
            className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover object-top"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-teal-600">
            <h3 className="text-xl font-bold text-gray-900">Dr. Vijender Saini</h3>
            <p className="text-teal-600 font-medium">MBBS, MD (Psychiatry)</p>
            <p className="text-gray-500 text-sm mt-1">SMS Hospital, Jaipur</p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <span className="text-teal-600 font-bold tracking-wider uppercase text-sm">About The Doctor</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">Compassionate Care Meets Medical Excellence</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Dr. Vijender Saini is a distinguished Psychiatrist known for his empathetic approach to mental health care. With a deep understanding of the human mind, he creates personalized treatment plans that foster resilience and recovery.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Senior Resident Experience</h4>
                <p className="text-gray-600 text-sm mt-1">
                  <strong>3 Years</strong> at SMS Hospital, Jaipur <br/>
                  <strong>1 Year</strong> at Sardar Patel Medical College, Bikaner
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700">
                   <Icons.Brain />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Evidence-Based Treatment</h4>
                <p className="text-gray-600 text-sm mt-1">
                   Specializing in Anxiety, Depression, OCD, and Psychosomatic disorders using modern pharmacotherapy.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

const ServicesSection = () => {
  const services = [
    {
      title: "Psychotherapy",
      icon: <Icons.Brain />,
      desc: "Talk therapy to help navigate life's challenges.",
      items: ["Stress Management", "Anger Management"]
    },
    {
      title: "Depression & Anxiety",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      desc: "Clinical care for mood disorders and fears.",
      items: ["Fear & Phobia", "Obsessive Compulsion (OCD)"]
    },
    {
      title: "Mood & Thought Disorders",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      desc: "Stabilizing severe mood swings and thoughts.",
      items: ["Suicidal Thoughts", "Overthinking", "Psychosomatic"]
    },
    {
      title: "Sleep & Emotions",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
      desc: "Restoring healthy sleep patterns.",
      items: ["Insomnia Treatment", "Emotional Wellbeing"]
    },
    {
      title: "Counselling",
      icon: <Icons.Heart />,
      desc: "Guidance for personal growth.",
      items: ["Adolescence Counselling", "Parenting Support"]
    },
    {
      title: "Family & Relationships",
      icon: <Icons.Family />,
      desc: "Healing relationships together.",
      items: ["Couple Counselling", "Marriage Counselling"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-bold tracking-wider uppercase text-sm">Our Expertise</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-4">Comprehensive Care Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Tailored mental health solutions designed to meet your unique emotional and psychological needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-in-out opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 mb-6 text-sm h-10">{service.desc}</p>
                
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  {service.items.map((item, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: "Do I need a referral to book an appointment?", a: "No, you can book an appointment directly with Dr. Saini without a referral." },
    { q: "Are the consultation sessions confidential?", a: "Absolutely. Patient confidentiality is our top priority and all records are kept strictly private." },
    { q: "What should I expect during my first visit?", a: "The first visit involves a detailed assessment of your history and symptoms to create a personalized care plan." },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Common Questions</h3>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
            <button 
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex justify-between items-center text-left py-2 focus:outline-none"
            >
              <span className="font-semibold text-gray-800">{faq.q}</span>
              <span className={`transform transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-teal-600' : 'text-gray-400'}`}>
                <Icons.ChevronDown />
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === idx ? 'max-h-40 mt-2' : 'max-h-0'}`}>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => (
  <section className="py-24 bg-white">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">Patient Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { q: "Dr. Saini's approach is incredibly patient. He helped me navigate a very difficult period.", a: "Rina K." },
            { q: "The professionalism shown by Dr. Saini at SMS Hospital is exceptional. I felt heard.", a: "Ankit S." },
            { q: "Highly recommend for anyone struggling with anxiety. The treatment plan was effective.", a: "Priya M." }
          ].map((t, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl relative">
               <div className="text-teal-200 absolute top-4 left-4 text-6xl font-serif opacity-50">"</div>
               <div className="relative z-10">
                 <div className="flex text-yellow-400 mb-4 gap-1">
                   {[1,2,3,4,5].map(s => <Icons.Star key={s} />)}
                 </div>
                 <p className="text-gray-700 italic mb-6">"{t.q}"</p>
                 <div className="font-bold text-gray-900">- {t.a}</div>
               </div>
            </div>
          ))}
        </div>
     </div>
  </section>
);

const ChatWidget = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello! I am Dr. Saini's Virtual Assistant. How are you feeling today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<any>(null);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    // Check if API key is present in process.env
    if (!process.env.API_KEY) {
        console.warn("API Key is missing.");
        setError(true);
        return;
    }

    try {
      if (!aiRef.current) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatSessionRef.current = aiRef.current.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a friendly Psychiatric Assistant Bot for Dr. Vijender Saini. Start answers with 'I am an AI, not a doctor.' Use Google Search grounding.",
            tools: [{ googleSearch: {} }],
          }
        });
        setError(false); // Clear error if initialization works
      }
    } catch (e) {
      console.error("AI Initialization Failed", e);
      setError(true);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Check if API key was loaded
    if (!chatSessionRef.current) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: input }]);
      setError(true);
      setInput("");
      return;
    }

    const userText = input.trim();
    setInput("");
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userText });
      const sources: Source[] = [];
      result.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      });

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: result.text,
        sources: sources.filter((v,i,a)=>a.findIndex(v2=>(v2.uri===v.uri))===i)
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm having trouble connecting right now. Please try WhatsApp." }]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[600px]">
      <div className="bg-slate-900 p-6 flex items-center gap-4">
        <div className="bg-teal-500/20 p-2 rounded-full border border-teal-500/30 text-teal-300">
          <Icons.Bot />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">MindWellness AI</h3>
          <p className="text-gray-400 text-xs flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span> 
            {error ? 'Offline' : 'Online Now'}
          </p>
        </div>
      </div>
      
      <div className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
            }`}>
              {msg.text}
              {msg.sources && (
                <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                  <p className="text-xs font-bold mb-1 opacity-70">References:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" className="text-xs text-teal-600 hover:underline truncate max-w-[150px] block bg-teal-50 px-2 py-1 rounded">{s.title}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Fallback Error Card */}
        {error && (
           <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
              <p className="text-red-800 font-bold mb-2">Chat Service Unavailable</p>
              <p className="text-red-600 text-xs mb-4">Chat is currently offline (API Key missing). Please contact Dr. Saini directly via WhatsApp.</p>
              <a href="https://wa.me/919785712712" target="_blank" className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition">
                 <Icons.WhatsApp /> Chat on WhatsApp
              </a>
           </div>
        )}

        {isLoading && <div className="text-gray-400 text-xs ml-4">Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          value={input} onChange={(e) => setInput(e.target.value)} 
          placeholder={error ? "Chat disabled" : "Ask a question..."}
          disabled={error}
          className="flex-grow px-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
        />
        <button type="submit" disabled={isLoading || error} className="bg-teal-600 text-white p-3 rounded-xl hover:bg-teal-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"><Icons.Send /></button>
      </form>
    </div>
  );
};

const ContactPanel = () => (
  <div className="space-y-8">
     <div className="bg-gradient-to-br from-teal-900 to-slate-900 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">Book Consultation</h3>
        <p className="text-teal-100 mb-8 relative z-10">Dr. Saini offers personalized sessions at SMS Hospital and private clinics.</p>
        <div className="space-y-4 relative z-10">
          <a href="https://wa.me/919785712712" target="_blank" className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:translate-y-px">
            <Icons.WhatsApp /> WhatsApp Now
          </a>
          <a href="mailto:kanheya7@gmail.com" className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-6 rounded-xl transition-all">
            <Icons.Email /> Email Us
          </a>
        </div>
     </div>
     <FAQ />
  </div>
);

const FloatingWhatsApp = () => (
  <a 
    href="https://wa.me/919785712712" 
    target="_blank"
    className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 flex items-center gap-2"
  >
    <Icons.WhatsApp />
    <span className="font-bold hidden md:inline">Chat on WhatsApp</span>
  </a>
);

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-serif font-bold mb-1">MindWellness</h2>
        <p className="text-slate-400 text-sm">Healing of Mind • Dr. Vijender Saini</p>
      </div>
      <div className="flex gap-6 text-sm text-slate-400">
        <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
      </div>
      <p className="text-slate-600 text-xs">© {new Date().getFullYear()} MindWellness.</p>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen font-sans text-gray-900 bg-slate-50/50 selection:bg-teal-200 selection:text-teal-900">
      <Header />
      <main className="w-full mx-auto space-y-0">
        <Hero />
        <Stats />
        <AboutSection />
        <ServicesSection />
        <Testimonials />
        <section id="appointment" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ContactPanel />
          <ChatWidget />
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
