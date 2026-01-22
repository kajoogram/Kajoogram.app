
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Mail, User, ShieldAlert } from 'lucide-react';
import { useReportContext } from '../../context/ReportContext';

const AdminReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReport, updateReportStatus } = useReportContext();

  const report = id ? getReport(id) : undefined;

  if (!report) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
         <h2 className="text-xl font-bold text-slate-800">Report Not Found</h2>
         <button onClick={() => navigate('/admin/reports')} className="mt-4 text-sky-500 font-bold">Back to List</button>
      </div>
    );
  }

  const handleAction = (status: 'reviewed' | 'resolved') => {
    updateReportStatus(report.id, status);
    navigate('/admin/reports');
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-white pb-32">
       {/* Header */}
       <div className="bg-white px-6 py-4 flex items-center space-x-4 border-b border-slate-100 sticky top-0 z-50">
         <button 
           onClick={() => navigate('/admin/reports')} 
           className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-90"
         >
           <ArrowLeft size={24} strokeWidth={1.5} />
         </button>
         <h1 className="text-lg font-serif font-bold text-slate-800 tracking-tight flex-1">Report Details</h1>
         <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
            {report.status}
         </div>
       </div>

       <div className="p-6 space-y-6">
          {/* User Info Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-4">
             <img src={report.userAvatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" alt="User" />
             <div className="flex-1">
                <h2 className="text-base font-bold text-slate-800">{report.username}</h2>
                <div className="flex items-center space-x-1 text-xs text-slate-500 mt-1">
                   <User size={12} />
                   <span>ID: {report.userId}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                   <Clock size={12} />
                   <span>{formatDate(report.timestamp)}</span>
                </div>
             </div>
             <a href={`mailto:user@example.com`} className="p-2 bg-white rounded-full text-slate-400 hover:text-sky-500 shadow-sm">
                <Mail size={20} />
             </a>
          </div>

          {/* Report Content */}
          <div className="space-y-4">
             <div className="flex items-center space-x-2 text-slate-400 uppercase tracking-widest text-xs font-bold">
                <ShieldAlert size={14} />
                <span>Subject</span>
             </div>
             <p className="text-lg font-bold text-slate-800 leading-tight">{report.subject}</p>
             
             <div className="h-px bg-slate-100 w-full"></div>

             <div className="flex items-center space-x-2 text-slate-400 uppercase tracking-widest text-xs font-bold pt-2">
                <span>Description</span>
             </div>
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {report.description}
             </div>
          </div>

          {/* Images */}
          {report.images && report.images.length > 0 && (
            <div className="space-y-4 pt-2">
               <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Attached Evidence</span>
               <div className="grid grid-cols-2 gap-3">
                  {report.images.map((img, idx) => (
                    <div key={idx} className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-zoom-in group relative">
                       <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Evidence ${idx+1}`} />
                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  ))}
               </div>
            </div>
          )}
       </div>

       {/* Actions Footer */}
       <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 p-6 z-40">
          <div className="flex space-x-4">
             {report.status !== 'reviewed' && report.status !== 'resolved' && (
                <button 
                  onClick={() => handleAction('reviewed')}
                  className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform"
                >
                  Mark Reviewed
                </button>
             )}
             {report.status !== 'resolved' && (
                <button 
                  onClick={() => handleAction('resolved')}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Resolve Case</span>
                </button>
             )}
             {report.status === 'resolved' && (
                <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-bold uppercase tracking-widest text-xs text-center border border-green-100">
                   Case Closed
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default AdminReportDetail;
