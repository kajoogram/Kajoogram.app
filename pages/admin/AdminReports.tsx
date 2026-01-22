
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import { useReportContext } from '../../context/ReportContext';

const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const { reports } = useReportContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  // Sort reports: Newest first
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredReports = sortedReports.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'resolved') return r.status === 'resolved' || r.status === 'reviewed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'reviewed': return 'bg-blue-100 text-blue-600';
      case 'resolved': return 'bg-green-100 text-green-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
           <button onClick={() => navigate('/admin')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800">User Reports</h1>
        </div>
        <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full">{reports.length}</span>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-1 rounded-xl border border-slate-100">
           {['all', 'pending', 'resolved'].map((tab) => (
             <button
               key={tab}
               onClick={() => setFilter(tab as any)}
               className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${filter === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Report List */}
        <div className="space-y-4">
           {filteredReports.map((report) => (
             <div 
               key={report.id}
               onClick={() => navigate(`/admin/reports/${report.id}`)}
               className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all hover:shadow-md"
             >
                <div className="flex items-center space-x-4">
                   <div className="relative">
                      <img src={report.userAvatar} className="w-12 h-12 rounded-full object-cover border border-slate-100" alt="User" />
                      {report.status === 'pending' && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                   </div>
                   
                   <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-slate-800">{report.username}</h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[150px]">{report.subject}</p>
                      <div className="flex items-center space-x-2 mt-1">
                         <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(report.status)} uppercase`}>{report.status}</span>
                         <span className="text-[10px] text-slate-400 flex items-center"><Clock size={10} className="mr-1"/> {formatDate(report.timestamp)}</span>
                      </div>
                   </div>
                </div>
                <ChevronRight size={20} className="text-slate-300" />
             </div>
           ))}

           {filteredReports.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
               <CheckCircle size={40} className="text-slate-200" />
               <p className="text-sm font-medium">No {filter !== 'all' ? filter : ''} reports found.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
