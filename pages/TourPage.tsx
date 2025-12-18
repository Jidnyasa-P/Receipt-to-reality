
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SIMPLE_STEPS = [
  {
    id: 'dashboard',
    title: 'Your Money, All in One Place',
    icon: 'fa-house-chimney-window',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    description: 'Stop checking five different apps. R2R gives you a beautiful, single view of your spending, saving, and budget progress.',
    why: 'Know exactly where you stand in 5 seconds or less.',
    benefit: 'Confidence and peace of mind.',
    oldWay: 'Logging into 3 banks and 2 credit cards.',
    r2rWay: 'Everything on one simple dashboard.'
  },
  {
    id: 'upload',
    title: 'Snap a Photo, We Do the Rest',
    icon: 'fa-camera-retro',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Toss those paper receipts! Just take a quick photo. Our AI reads everything—store name, items, tax, and totals—automatically.',
    why: 'Save hours every month by letting AI do the typing.',
    benefit: 'No more manual data entry.',
    oldWay: 'Saving a box of crumpled paper.',
    r2rWay: 'Digital, searchable, organized records.'
  },
  {
    id: 'ai',
    title: 'Talk to Your Money',
    icon: 'fa-comment-dots',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Have a question? Just ask! Our AI Assistant knows your spending. Ask "Can I afford that vacation?" or "How much did I spend at Starbucks?"',
    why: 'Get expert financial answers without being a math wiz.',
    benefit: 'Instant answers, anytime.',
    oldWay: 'Crunching numbers on a calculator.',
    r2rWay: 'A conversation with a smart money pal.'
  },
  {
    id: 'analytics',
    title: 'Find Hidden Savings',
    icon: 'fa-magnifying-glass-dollar',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Our AI is like a detective. It finds subscriptions you don’t use and spending habits that are costing you too much.',
    why: 'Find an extra $50 to $200 every month effortlessly.',
    benefit: 'More money in your pocket.',
    oldWay: 'Wondering "Where did my money go?".',
    r2rWay: 'Proactive alerts on how to save.'
  },
  {
    id: 'tax',
    title: 'Tax Season Without the Tears',
    icon: 'fa-file-invoice-dollar',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Do you work for yourself? Tag business costs with one tap. When it’s time for taxes, export a perfect list for your accountant.',
    why: 'Never miss a deduction again and save big on taxes.',
    benefit: 'Stress-free compliance.',
    oldWay: 'Searching through emails in April.',
    r2rWay: 'A ready-to-export tax report.'
  },
  {
    id: 'household',
    title: 'Share with Your Partner',
    icon: 'fa-users',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    description: 'Managing money with a partner or roommate? Sync your budgets and receipts effortlessly so you’re always on the same page.',
    why: 'End the "Who paid for what?" arguments forever.',
    benefit: 'Better relationships, shared goals.',
    oldWay: 'Venmo-ing back and forth constantly.',
    r2rWay: 'One shared, transparent home for money.'
  }
];

const TourPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const step = SIMPLE_STEPS[activeStep];
  const progress = ((activeStep + 1) / SIMPLE_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="p-8 max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-indigo-600 flex items-center gap-2">
          <i className="fas fa-receipt"></i>
          <span>R2R</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interactive Tour</span>
          </div>
          <button 
            onClick={() => navigate('/signup')}
            className="text-slate-400 font-bold hover:text-indigo-600 transition-colors text-sm"
          >
            Skip to Signup
          </button>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 sticky top-0 z-50">
        <div 
          className="h-full bg-indigo-600 transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Illustration Side */}
          <div className="relative">
             <div className={`w-full aspect-square ${step.bgColor} rounded-[4rem] flex items-center justify-center relative overflow-hidden shadow-2xl shadow-slate-100 transition-all duration-700`}>
                <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                
                {/* Main Icon with Animation */}
                <div className="relative z-10 p-12 bg-white rounded-[3rem] shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                   <i className={`fas ${step.icon} text-8xl ${step.color}`}></i>
                </div>

                {/* Floating "AI" Badges */}
                <div className="absolute top-12 left-12 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-indigo-50 flex items-center gap-2 animate-bounce [animation-duration:5s]">
                   <i className="fas fa-sparkles text-yellow-500"></i>
                   <span className="text-xs font-black text-indigo-900 uppercase">AI Powered</span>
                </div>
                
                <div className="absolute bottom-12 right-12 bg-indigo-600 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
                   <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Sync</span>
                   <i className="fas fa-rotate text-indigo-200"></i>
                </div>
             </div>
          </div>

          {/* Text Content Side */}
          <div className="space-y-10">
            <div>
              <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${step.bgColor} ${step.color} border border-current opacity-70`}>
                Module 0{activeStep + 1}
              </span>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                {step.title}
              </h1>
              <p className="text-2xl text-slate-500 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">The Old Way</p>
                  <p className="text-sm text-slate-500 line-through font-bold opacity-60 leading-relaxed">{step.oldWay}</p>
               </div>
               <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 group hover:-translate-y-1 transition-all">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">The R2R Way</p>
                  <p className="text-sm text-white font-black leading-relaxed">{step.r2rWay}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-10 border-t border-slate-50">
              {activeStep < SIMPLE_STEPS.length - 1 ? (
                <button 
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
                >
                  Tell Me More
                  <i className="fas fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 animate-pulse"
                >
                  Let's Get Started
                  <i className="fas fa-bolt"></i>
                </button>
              )}
              
              {activeStep > 0 && (
                <button 
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="text-slate-400 font-bold hover:text-slate-900 transition-all text-sm uppercase tracking-widest"
                >
                  Back to Previous
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TourPage;
