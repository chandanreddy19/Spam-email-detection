import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, X, Send, CheckCircle } from 'lucide-react';
import { GlassCard, BackgroundGlow, cn } from './UI';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot Password States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Check if already logged in or remembered
  useEffect(() => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    if (isAuth) {
      navigate('/');
    }

    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate Network Latency
    setTimeout(() => {
      // Dummy Credentials
      const DUMMY_EMAIL = "admin@gmail.com";
      const DUMMY_PASS = "123456";

      const normalizedEmail = email.toLowerCase().trim();
      const normalizedPass = password.trim();

      if (normalizedEmail === DUMMY_EMAIL && normalizedPass === DUMMY_PASS) {
        console.log("Authentication successful, authorizing session...");
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', normalizedEmail);
        if (rememberMe) {
          localStorage.setItem('rememberedUser', normalizedEmail);
        }
        navigate('/');
      } else {
        console.warn("Authentication failed: Invalid credentials provided.");
        setError('Verification Failed: Invalid credentials. Required: admin@gmail.com / 123456');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    
    if (!forgotEmail) {
      setForgotError('Recovery email is required');
      return;
    }

    if (!forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address');
      return;
    }
    
    setIsForgotSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsForgotSubmitting(false);
      setForgotSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <BackgroundGlow />
      
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-red/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-red rounded-2xl items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,245,255,0.3)]">
            <Shield size={32} className="text-background" />
          </div>
          <h1 className="text-4xl font-syne font-black tracking-tighter mb-2">
            WELCOME <span className="gradient-text">BACK</span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em]">SpamShield Security Console</p>
        </div>

        <GlassCard className="p-10 border-white/5">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl flex items-center gap-3 text-accent-red text-sm font-medium"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email or Username</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-blue transition-colors" />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-blue transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-white/10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only" 
                  />
                  <div className={cn(
                    "w-5 h-5 border rounded-md transition-all flex items-center justify-center",
                    rememberMe ? "bg-accent-blue border-accent-blue" : "border-white/10 bg-white/5"
                  )}>
                    {rememberMe && <div className="w-2 h-2 bg-background rounded-sm" />}
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Remember Me</span>
              </label>
              <button 
                type="button" 
                onClick={() => {
                  setIsForgotModalOpen(true);
                  setForgotSuccess(false);
                  setForgotEmail('');
                  setForgotError('');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline"
              >
                Forgot Access?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-95 group",
                isLoading ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-gradient-to-r from-accent-blue to-accent-blue/80 text-background hover:shadow-[0_0_25px_rgba(0,245,255,0.4)]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login
                  <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Shield size={18} />
                  </motion.div>
                </>
              )}
            </button>
          </form>
        </GlassCard>

        <p className="text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
          SECURE ENCRYPTED ACCESS PORTAL
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md"
            >
              <GlassCard className="p-10 border-accent-blue/20">
                <button 
                  onClick={() => setIsForgotModalOpen(false)} 
                  className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {!forgotSuccess ? (
                  <>
                    <h3 className="text-2xl font-syne font-black mb-2 tracking-tighter">RESET <span className="gradient-text">ACCESS</span></h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-8">Enter your email to receive a recovery key</p>
                    
                    <form onSubmit={handleForgotSubmit} className="space-y-6">
                      {forgotError && (
                        <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-xl flex items-center gap-2 text-accent-red text-[10px] font-bold uppercase tracking-wider">
                          <AlertCircle size={14} />
                          {forgotError}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Recovery Email</label>
                        <div className="relative group">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent-blue transition-colors" />
                          <input 
                            type="email" 
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-white/10"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={isForgotSubmitting}
                        className={cn(
                          "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95",
                          isForgotSubmitting ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-accent-blue text-background hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                        )}
                      >
                        {isForgotSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Recovery Key
                            <Send size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent-blue animate-pulse">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-syne font-black mb-2 tracking-tighter">CHECK <span className="gradient-text">INBOX</span></h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                      Recovery link sent to <span className="text-white">{forgotEmail}</span>. Please check your spam folder too.
                    </p>
                    <button 
                      onClick={() => setIsForgotModalOpen(false)}
                      className="mt-8 text-[10px] font-black uppercase tracking-widest text-accent-blue hover:underline"
                    >
                      Back to Secure Login
                    </button>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
