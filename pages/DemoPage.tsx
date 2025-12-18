
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const generateDemoVideo = async () => {
    setLoading(true);
    setStatus("Connecting to Veo AI Engine...");
    
    try {
      // Check for API key and prompt if necessary for Veo (as per guidelines)
      if (!window.aistudio?.hasSelectedApiKey || !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus("Analyzing app visuals... (This can take 1-2 mins)");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A high-end cinematic 3D animation showing a smartphone scanning a messy restaurant receipt, which then dissolves into glowing data particles and forms a beautiful clean digital dashboard with bar charts and a "Savings Found" alert.',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      const loadingMessages = [
        "Synthesizing financial dashboard visuals...",
        "Rendering data particle simulations...",
        "Applying cinematic lighting...",
        "Finalizing demo sequence..."
      ];
      
      let messageIdx = 0;
      const interval = setInterval(() => {
        setStatus(loadingMessages[messageIdx % loadingMessages.length]);
        messageIdx++;
      }, 15000);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      clearInterval(interval);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
        setStatus("");
      } else {
        throw new Error("Failed to get video link");
      }
    } catch (err) {
      console.error(err);
      setStatus("Video generation failed. Please check your API key/billing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-indigo-600 flex items-center gap-2">
          <i className="fas fa-receipt"></i>
          <span>R2R</span>
        </Link>
        <button 
          onClick={() => navigate('/signup')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-all"
        >
          Try it Yourself
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-black text-slate-900 mb-6">Experience the AI Magic</h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
          We use Google's most advanced video model, Veo, to generate a custom demo of how R2R transforms your finances.
        </p>

        {/* Video Player / Generator */}
        <div className="aspect-video bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center border-8 border-slate-50">
           {videoUrl ? (
             <video 
               src={videoUrl} 
               controls 
               autoPlay 
               className="w-full h-full object-cover"
             />
           ) : (
             <>
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 grayscale group-hover:scale-105 transition-transform duration-700"></div>
               {loading ? (
                 <div className="relative z-10 text-white space-y-6">
                   <i className="fas fa-circle-notch fa-spin text-6xl text-indigo-400"></i>
                   <p className="text-xl font-black animate-pulse">{status}</p>
                 </div>
               ) : (
                 <button 
                  onClick={generateDemoVideo}
                  className="relative z-10 bg-white text-indigo-600 px-10 py-5 rounded-3xl flex items-center gap-4 text-2xl font-black shadow-2xl hover:scale-105 transition-transform"
                 >
                   <i className="fas fa-wand-magic-sparkles"></i>
                   Generate AI Demo Video
                 </button>
               )}
             </>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
          <div className="space-y-4">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-upload"></i>
             </div>
             <h3 className="font-black text-slate-900">1. Instant Upload</h3>
             <p className="text-sm text-slate-500">Drag receipts, text, or emails directly into the workspace.</p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-microchip"></i>
             </div>
             <h3 className="font-black text-slate-900">2. AI Processing</h3>
             <p className="text-sm text-slate-500">Our models extract amounts, items, and tax info instantly.</p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mx-auto">
                <i className="fas fa-lightbulb"></i>
             </div>
             <h3 className="font-black text-slate-900">3. Smart Strategy</h3>
             <p className="text-sm text-slate-500">Receive actionable plans to maximize your monthly savings.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
