
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = api.getCurrentUser();

  const features = [
    {
      icon: 'fa-camera-retro',
      title: 'Magic Scanner',
      description: 'Take a photo of any receipt. Our AI reads every detail so you never have to type manually.'
    },
    {
      icon: 'fa-brain',
      title: 'Smart Savings',
      description: 'Our AI finds "money leaks" and subscriptions you forgot about, helping you keep more of your cash.'
    },
    {
      icon: 'fa-piggy-bank',
      title: 'Simple Budgeting',
      description: 'Set goals and watch your progress with clear, easy-to-read charts that anyone can understand.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Header / Navigation */}
      <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-indigo-600">
          <i className="fas fa-receipt"></i>
          <span>Receipt to Reality</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link to="/login" className="font-bold text-slate-600 hover:text-indigo-600">Login</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section - The "Home" view */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-10">
            <i className="fas fa-sparkles"></i>
            <span>Experience Financial Clarity</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
            Money tracking <br/> for <span className="text-indigo-600">real life.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Messy paper receipts? SMS bank alerts? We turn your data into a clear plan for your future. Simple, fast, and powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              className="bg-indigo-600 text-white px-12 py-6 rounded-3xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95"
            >
              Start My Journey
            </button>
            <button 
              onClick={() => navigate('/tour')}
              className="bg-white text-slate-900 border-2 border-slate-100 px-12 py-6 rounded-3xl font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <i className="fas fa-play-circle text-indigo-600"></i>
              See How It Works
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 -mt-80"></div>
      </section>

      {/* Simple Feature Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8">
                <i className={`fas ${f.icon}`}></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
           <i className="fas fa-quote-left text-5xl text-indigo-500 mb-8 block opacity-30"></i>
           <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8">
             "I finally stopped worrying about my bank account and started building my savings. The AI scanner is a game changer."
           </h2>
           <p className="text-indigo-400 font-bold uppercase tracking-widest">— Sarah J., R2R User</p>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-32 px-6">
         <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
               <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to turn receipts <br/> into reality?</h2>
               <button 
                onClick={() => navigate('/signup')}
                className="bg-white text-indigo-600 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-indigo-50 transition-all shadow-xl"
               >
                 Get Started for Free
               </button>
               <p className="mt-8 text-indigo-200 font-medium">Join 12,000+ people taking control of their money today.</p>
            </div>
            {/* Background blur circles */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full blur-3xl"></div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <Link to="/" className="text-xl font-black text-indigo-600 flex items-center gap-2">
            <i className="fas fa-receipt"></i>
            <span>R2R</span>
          </Link>
          <div className="flex gap-10 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link to="/terms" className="hover:text-indigo-600">Terms</Link>
            <Link to="/faq" className="hover:text-indigo-600">FAQ</Link>
          </div>
          <p className="text-slate-400 text-xs font-medium">© 2025 Receipt to Reality. Built with Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
