
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useContentContext, PageKey } from '../context/ContentContext';
import Footer from '../components/Footer';

const GenericPage: React.FC = () => {
  const { pageId } = useParams<{ pageId: PageKey }>();
  const navigate = useNavigate();
  const { getPage } = useContentContext();
  
  const pageData = pageId ? getPage(pageId) : null;

  if (!pageData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
         <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
         <button onClick={() => navigate('/home')} className="mt-4 text-sky-500 font-bold">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
       {/* Header */}
       <div className="bg-white/90 backdrop-blur-xl px-6 py-4 flex items-center space-x-4 border-b border-slate-50 sticky top-0 z-50">
         <button 
           onClick={() => navigate(-1)} 
           className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90"
         >
           <ArrowLeft size={24} strokeWidth={1.5} />
         </button>
         <h1 className="text-xl font-serif font-bold text-slate-800 tracking-tight">{pageData.title}</h1>
       </div>

       {/* Content */}
       <div className="p-6">
          <div 
            className="prose prose-slate prose-headings:font-serif prose-headings:font-bold prose-img:rounded-2xl prose-img:shadow-md max-w-none"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          ></div>
       </div>

       <Footer />
    </div>
  );
};

export default GenericPage;
