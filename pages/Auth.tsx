
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthTab } from '../types';
import { Mail, Lock, User as UserIcon, Phone, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthProps {
  onAuthSuccess: (user: Partial<User>) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AuthTab>('signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        // Create User in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update Firebase Profile with Username
        await updateProfile(userCredential.user, {
          displayName: formData.username
        });

        // Update local state (preserves mobile number which isn't stored in basic Firebase Auth)
        onAuthSuccess({ 
          username: formData.username, 
          email: formData.email, 
          mobile: formData.mobile 
        });
        
        navigate('/setup');
      } else {
        // Login User
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // App.tsx listener will handle state update
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let errorMessage = "Authentication failed. Please try again.";
      
      // Map Firebase error codes to user-friendly messages
      if (error.code === 'auth/email-already-in-use') errorMessage = "That email is already in use.";
      else if (error.code === 'auth/invalid-credential') errorMessage = "Invalid email or password.";
      else if (error.code === 'auth/user-not-found') errorMessage = "No account found with this email.";
      else if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
      else if (error.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = () => {
    if (!formData.email) {
      alert("Please enter your email to receive a login link.");
      return;
    }
    alert(`Magic login link feature is coming soon. Please use password to login.`);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-white overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>
      </div>

      <button 
        onClick={handleBack} 
        className="absolute top-6 left-6 z-20 p-2 bg-white/50 backdrop-blur-md rounded-full text-slate-700 active:scale-90 transition-all shadow-sm"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white space-y-8 animate-in zoom-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
           <span className="font-instagram text-5xl text-instagram">Kajoogram</span>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[4px]">Premium Social Commerce</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-white/50 relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${tab === 'signup' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
          ></div>
          <button 
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors ${tab === 'signup' ? 'text-slate-800' : 'text-slate-400'}`}
          >
            SIGNUP
          </button>
          <button 
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl relative z-10 transition-colors ${tab === 'login' ? 'text-slate-800' : 'text-slate-400'}`}
          >
            LOGIN
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {tab === 'signup' && (
            <>
              <div className="space-y-1">
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="User Name"
                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all placeholder:text-slate-300"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" size={18} />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number"
                    className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all placeholder:text-slate-300"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all placeholder:text-slate-300"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all placeholder:text-slate-300"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          
          {tab === 'signup' && (
            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Confirm Password"
                  className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-200 transition-all placeholder:text-slate-300"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>
          )}

          {tab === 'login' && (
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleMagicLink}
                className="text-[10px] font-bold text-sky-500 tracking-wide hover:underline transition-all uppercase"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-[3px] text-xs flex items-center justify-center space-x-2 shadow-xl shadow-slate-200 transition-all active:scale-95 hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{tab === 'signup' ? 'NEXT' : 'LOGIN'}</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
