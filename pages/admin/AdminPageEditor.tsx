
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, Video, Type } from 'lucide-react';
import { useContentContext, PageKey } from '../../context/ContentContext';

const AdminPageEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: PageKey }>();
  const navigate = useNavigate();
  const { getPage, updatePage } = useContentContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  // Load existing content
  useEffect(() => {
    if (pageId) {
      const pageData = getPage(pageId);
      if (pageData) {
        setContent(pageData.content);
        setPageTitle(pageData.title);
        if (editorRef.current) {
          editorRef.current.innerHTML = pageData.content;
        }
      }
    }
  }, [pageId]);

  // Command Execution Wrapper
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (file.type.startsWith('image/')) {
          const imgHtml = `<img src="${result}" style="max-width: 100%; border-radius: 12px; margin: 10px 0;" />`;
          execCmd('insertHTML', imgHtml);
        } else if (file.type.startsWith('video/')) {
          const vidHtml = `<video src="${result}" controls style="max-width: 100%; border-radius: 12px; margin: 10px 0;"></video><br/>`;
          execCmd('insertHTML', vidHtml);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (pageId && editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      updatePage(pageId, newContent);
      alert('Page saved successfully!');
    }
  };

  if (!pageId) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
           <button onClick={() => navigate('/admin/menu-pages')} className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors">
             <ArrowLeft size={24} className="text-slate-800" />
           </button>
           <h1 className="font-serif font-bold text-lg text-slate-800 line-clamp-1">Edit {pageTitle}</h1>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide active:scale-95 transition-transform"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap gap-2 sticky top-[72px] z-40">
         <div className="flex items-center space-x-1 border-r border-slate-100 pr-2">
            <button onClick={() => execCmd('bold')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Bold"><Bold size={18} /></button>
            <button onClick={() => execCmd('italic')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Italic"><Italic size={18} /></button>
            <button onClick={() => execCmd('underline')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Underline"><Underline size={18} /></button>
         </div>

         <div className="flex items-center space-x-1 border-r border-slate-100 pr-2">
            <button onClick={() => execCmd('formatBlock', 'H1')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs" title="Heading 1">H1</button>
            <button onClick={() => execCmd('formatBlock', 'H3')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs" title="Heading 2">H2</button>
            <button onClick={() => execCmd('foreColor', '#3b82f6')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="Blue Text"><Type size={18} /></button>
         </div>

         <div className="flex items-center space-x-1 border-r border-slate-100 pr-2">
            <button onClick={() => execCmd('justifyLeft')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Align Left"><AlignLeft size={18} /></button>
            <button onClick={() => execCmd('justifyCenter')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Align Center"><AlignCenter size={18} /></button>
            <button onClick={() => execCmd('justifyRight')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Align Right"><AlignRight size={18} /></button>
         </div>

         <div className="flex items-center space-x-1 border-r border-slate-100 pr-2">
            <button onClick={() => execCmd('insertUnorderedList')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Bullet List"><List size={18} /></button>
            <button onClick={() => execCmd('insertOrderedList')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Number List"><ListOrdered size={18} /></button>
         </div>

         <div className="flex items-center space-x-1">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg flex items-center space-x-1" title="Insert Media">
               <ImageIcon size={18} />
               <span className="text-[10px] font-bold">/</span>
               <Video size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleMediaUpload}
            />
         </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div 
          ref={editorRef}
          className="w-full h-full min-h-[500px] outline-none text-slate-800 prose prose-slate max-w-none"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          style={{ whiteSpace: 'pre-wrap' }}
        ></div>
        <div className="h-20"></div> {/* Spacer */}
      </div>
    </div>
  );
};

export default AdminPageEditor;
