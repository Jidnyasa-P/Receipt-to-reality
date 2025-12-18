
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { SourceType } from '../types';

const UploadPage: React.FC = () => {
  const [sourceType, setSourceType] = useState<SourceType>('receipt_image');
  const [pastedText, setPastedText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = api.getCurrentUser();
    if (!user) return;

    setProcessing(true);
    setSuccess(false);

    try {
      await api.ingest(user.id, sourceType, pastedText, files);
      setSuccess(true);
      setPastedText('');
      setFiles([]);
      // Small delay to show success state
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      alert('Processing failed. Please check your API key or connection.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Ingest Data</h2>
        <p className="text-slate-500 text-lg">Upload receipts, paste SMS logs, or manually enter spending data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Source Type</label>
                <div className="flex flex-wrap gap-3">
                  {(['receipt_image', 'email', 'sms', 'manual'] as SourceType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSourceType(type)}
                      className={`px-5 py-2.5 text-sm font-bold rounded-full border transition-all duration-200 ${
                        sourceType === type
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {type.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {sourceType === 'receipt_image' ? (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">Visual Upload</label>
                  <div className="relative group">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center group-hover:border-indigo-400 transition-all bg-slate-50/50 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <i className="fas fa-file-invoice-dollar text-3xl"></i>
                      </div>
                      <p className="text-slate-900 font-bold text-lg mb-1">
                        {files.length > 0 ? `${files.length} Files Ready` : 'Drop Receipts Here'}
                      </p>
                      <p className="text-slate-500 text-sm">Upload PNG, JPG, or PDF (Max 10MB)</p>
                      {files.length > 0 && (
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                           {files.map((f, i) => (
                             <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium">{f.name}</span>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">Paste Text Content</label>
                  <textarea
                    rows={8}
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50 text-slate-900 placeholder-slate-400 text-lg transition-all"
                    placeholder="Paste the raw text from your SMS, Email, or manual notes..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={processing || (files.length === 0 && !pastedText.trim())}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Extracting Data...
                  </>
                ) : success ? (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Processing Complete!
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt"></i>
                    Process with Gemini AI
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-900 text-emerald-50 p-8 rounded-3xl shadow-xl">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-shield-halved"></i>
              AI Intelligence
            </h4>
            <p className="text-emerald-100/80 leading-relaxed mb-6">
              Our system uses <strong>Gemini 3 Flash</strong> to interpret messy data. Even if your receipt is crumpled or the SMS is cryptic, our engine extracts the core financial truth.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-emerald-400"></i>
                Handwritten total recognition
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-emerald-400"></i>
                Automatic categorization
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-emerald-400"></i>
                Multi-currency detection
              </li>
            </ul>
          </div>
          
          <div className="bg-slate-900 text-slate-100 p-8 rounded-3xl shadow-xl">
             <h4 className="text-xl font-bold mb-4">Privacy Note</h4>
             <p className="text-slate-400 text-sm leading-relaxed">
               All data is processed securely. Images are analyzed for financial metrics only. Your personal identifiers stay with you.
             </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
