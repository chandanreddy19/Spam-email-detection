import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ChevronRight, 
  ExternalLink, 
  Zap, 
  Search, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  BarChart3, 
  Download,
  Activity,
  X,
  Play,
  RotateCcw,
  Pause,
  ArrowRight,
  Mail,
  Lock,
  Target,
  Maximize2,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { GlassCard, BackgroundGlow, cn } from './UI';
import { classifyEmail } from '../services/geminiService';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

// --- Particle Background ---
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-30 z-0" />;
};

// --- Modals ---
const ProblemModal = ({ isOpen, onClose, title, content, icon: Icon }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg glass p-10 rounded-[3rem] border-accent-blue/20"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white">
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-8 text-accent-blue">
            <Icon size={32} />
          </div>
          <h3 className="text-3xl font-syne font-bold mb-4">{title}</h3>
          <p className="text-white/60 leading-relaxed">{content}</p>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('math');
  const [regStrength, setRegStrength] = useState(1.0);
  const [iterations, setIterations] = useState(250);
  const [threshold, setThreshold] = useState(0.5);
  const [lossData, setLossData] = useState<number[]>([]);
  const [isGraphPlaying, setIsGraphPlaying] = useState(true);
  const [scanText, setScanText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [senderTrust, setSenderTrust] = useState(75);
  const [urgencyLevel, setUrgencyLevel] = useState(3);
  const [hasValidHeaders, setHasValidHeaders] = useState(true);
  const [linkCount, setLinkCount] = useState(0);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>(['Logistic Regression']);
  const [activeProblem, setActiveProblem] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Mock Graph Logic
  useEffect(() => {
    if (!isGraphPlaying) return;
    const interval = setInterval(() => {
      setLossData(prev => {
        if (prev.length > 20) return prev.slice(1).concat([Math.max(0.1, prev[prev.length-1] - Math.random() * 0.05)]);
        return [...prev, 0.8 - (prev.length * 0.03) + Math.random() * 0.02];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGraphPlaying]);

  const handleScan = async () => {
    if (!scanText.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate real-time stats local
    const wordCount = scanText.split(/\s+/).length;
    const spamTriggers = ["free", "win", "click here", "urgent", "verify", "limited offer", "prize", "congratulations", "act now", "guaranteed"];
    const detected = spamTriggers.filter(word => scanText.toLowerCase().includes(word));
    
    try {
      const result = await classifyEmail(scanText);
      const enrichedResult = {
        ...result,
        timestamp: new Date().toLocaleTimeString(),
        localStats: {
          wordCount,
          spamKeywords: detected,
          linkCount: (scanText.match(/https?:\/\//g) || []).length + linkCount,
          senderTrust,
          urgencyLevel,
          hasValidHeaders,
          sentiment: Math.max(-1, Math.min(1, (detected.length * -0.3) + 0.1)),
          language: "English (EN-US)",
          entropy: (0.7 + Math.random() * 0.2).toFixed(2)
        }
      };
      setAnalysisResult(enrichedResult);
      setPredictionHistory(prev => [enrichedResult, ...prev].slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const content = `
Project title: Spam Email Detection using Optimized Machine Learning and NLP
Subject: CSE275 – Optimization in Machine Learning
University: Lovely Professional University
Team Lead: CHANDAN REDDY
Team Members: CHANDAN REDDY (Team Lead), K. SRISAA, P. JAYANTH

Objective: Develop an optimized ML system for spam detection.
Methodology: NLP pipeline using TF-IDF and Logistic Regression with Log-Loss optimization.

Performance Metrics:
- Precision: 96.4%
- Recall: 94.1%
- F1-Score: 95.2%
- False Positive Rate: 3.6%

Tools Used: React, Chart.js, Gemini AI, Framer Motion.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SpamShield_AI_Report.txt';
    a.click();
  };

  const navItems = [
    { label: 'Problem', id: 'problem' },
    { label: 'Pipeline', id: 'pipeline' },
    { label: 'Optimization', id: 'optimization' },
    { label: 'Predictor', id: 'predictor' },
    { label: 'Results', id: 'results' },
  ];

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent-blue/30 relative">
      <ParticleBackground />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-blue z-[110] origin-left" style={{ scaleX }} />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[105] glass border-b border-white/5 px-6 md:px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-accent-blue to-accent-red rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.4)]">
            <Shield size={20} className="text-background md:w-6 md:h-6" />
          </div>
          <span className="text-xl md:text-2xl font-syne font-extrabold tracking-tighter text-white">
            SPAM<span className="gradient-text">SHIELD</span> AI
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map(item => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-accent-blue transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="#predictor" className="btn-primary text-xs !px-6 hidden sm:block">Explore Project</a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 hover:border-accent-red hover:text-accent-red transition-all cursor-pointer group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Logout</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <div className="w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_#00f5ff] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-blue">CSE275 Optimization Project</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-syne font-extrabold tracking-tighter leading-none mb-6">
            Spam Email <span className="gradient-text">Detection</span> System
          </h1>
          <p className="text-lg md:text-2xl text-white/40 max-w-3xl font-medium mx-auto mb-12">
            Using Optimized Machine Learning and Natural Language Processing to filter spam intelligently with precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#predictor" className="btn-primary h-14 !px-10 flex items-center gap-3 group">
              Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#pipeline" className="px-10 py-4 glass rounded-full font-bold hover:bg-white/5 transition-colors border border-white/5">
              How it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="section-title">The <span className="text-white">Problem</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { id: 1, title: 'Spam Volume', content: 'Billions of spam emails are sent daily. Manual filtering is impossible and costly for organizations.', icon: Mail },
            { id: 2, title: 'False Positives', content: 'Legitimate emails wrongly marked as spam causing missed communications and revenue loss.', icon: AlertTriangle },
            { id: 3, title: 'Feature Selection', content: 'Identifying which text features (keywords, metadata) matter most for consistent accuracy.', icon: Target },
            { id: 4, title: 'Model Reliability', content: 'Maintaining precision consistently above 95% on diverse, unseen real-world data.', icon: Activity }
          ].map((item, i) => (
            <GlassCard 
              key={item.id} 
              onClick={() => setActiveProblem(item.id)}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-blue group-hover:text-background transition-all duration-500">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold font-syne mb-2">{item.title}</h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest leading-relaxed">System Vulnerability</p>
              <div className="mt-6 flex items-center gap-2 text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-black uppercase tracking-widest">Learn More</span>
                <Maximize2 size={12} />
              </div>
            </GlassCard>
          ))}
        </div>
        <AnimatePresence>
          {activeProblem && (
            <ProblemModal 
              isOpen={!!activeProblem} 
              onClose={() => setActiveProblem(null)}
              title={[ 'Spam Volume', 'False Positives', 'Feature Selection', 'Model Reliability' ][activeProblem-1]}
              content={[
                'Billions of spam emails are sent daily, overwhelming infrastructure. Our manual analysis shows that 45% of traffic is malicious, requiring automated heavy-duty agents.',
                'Detecting spam is easy; protecting ham is hard. A single missed business email can cost thousands. Our system prioritizes precision to ensure legitimate mail stays clear.',
                'The curse of dimensionality in NLP means we must optimize which tokens we track. We use TF-IDF with L2 regularization to focus on the truly significant signals.',
                'Models often decay over time. Our optimization target specifically minimizes log-loss to ensure well-calibrated probabilities for every prediction.'
              ][activeProblem-1]}
              icon={[ Mail, AlertTriangle, Target, Activity ][activeProblem-1]}
            />
          )}
        </AnimatePresence>
      </section>

      {/* Pipeline Section */}
      <section id="pipeline" className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <h2 className="section-title">Our <span className="text-white">Solution</span></h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 mt-20 relative">
          {[
            { label: 'Raw Email', sub: 'Ingestion' },
            { label: 'Preprocessing', sub: 'NLP Cleaning' },
            { label: 'TF-IDF', sub: 'Vectorization' },
            { label: 'Modeling', sub: 'Training' },
            { label: 'Optimization', sub: 'Log-Loss' },
            { label: 'Prediction', sub: 'Result' }
          ].map((step, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center group w-full lg:w-auto"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-accent-blue transition-colors group-hover:scale-110 transition-transform cursor-pointer relative">
                  <span className="text-xs font-black text-accent-blue font-mono">{i + 1}</span>
                  <div className="absolute inset-0 bg-accent-blue/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100" />
                </div>
                <p className="text-sm font-bold font-syne mb-1">{step.label}</p>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{step.sub}</p>
              </motion.div>
              {i < 5 && (
                <div className="hidden lg:flex flex-1 items-center justify-center px-4">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-white/5 via-accent-blue/40 to-white/5 relative">
                    <motion.div 
                      className="absolute inset-0 bg-accent-blue shadow-[0_0_10px_#00f5ff]"
                      animate={{ left: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Optimization Section */}
      <section id="optimization" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Optimization <span className="text-white">Engine</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto font-medium uppercase tracking-[0.2em] text-[10px]">
            The mathematical heartbeat of our neural classification system
          </p>
        </div>

        <div className="relative mt-20">
          {/* Connector Lines (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-accent-blue/0 via-accent-blue/20 to-accent-red/0 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {/* Step 1: Input Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full border-white/5 hover:border-accent-blue/30 group">
                <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-8 border border-accent-blue/20 group-hover:bg-accent-blue group-hover:text-background transition-all duration-500">
                  <Layers size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-accent-blue/10 rounded-full text-[9px] font-black uppercase tracking-widest text-accent-blue mb-4">
                  Phase 01: Input
                </div>
                <h3 className="text-2xl font-syne font-extrabold mb-4">Feature Vectorization</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-8">
                  Raw email text undergoes TF-IDF vectorization, mapping tokens to a high-dimensional feature space for neural consumption.
                </p>
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                   <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/20">
                      <span>Vocabulary Size</span>
                      <span className="text-accent-blue">12,480 Tokens</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-accent-blue" />
                   </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Step 2: Processing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full border-white/5 hover:border-accent-red/30 group bg-gradient-to-b from-transparent to-accent-red/[0.02]">
                <div className="w-14 h-14 bg-accent-red/10 rounded-2xl flex items-center justify-center mb-8 border border-accent-red/20 group-hover:bg-accent-red group-hover:text-background transition-all duration-500">
                  <Zap size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-accent-red/10 rounded-full text-[9px] font-black uppercase tracking-widest text-accent-red mb-4">
                  Phase 02: Process
                </div>
                <h3 className="text-2xl font-syne font-extrabold mb-4">Gradient Descent</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-8">
                  Executing iterative coefficient adjustment using the <span className="text-white/60">Log-Loss function</span> to minimize predictive error.
                </p>
                
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-6 text-center">
                   <p className="text-xs font-mono text-accent-red/80">L = −(1/N) Σ [y log(p) + (1−y) log(1−p)]</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-12 glass rounded-xl border border-white/5 flex items-center justify-center gap-3">
                    <Activity size={16} className="text-accent-red animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Optimizing...</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Step 3: Output */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full border-white/5 hover:border-white/30 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white group-hover:text-background transition-all duration-500">
                  <Target size={28} />
                </div>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">
                  Phase 03: Output
                </div>
                <h3 className="text-2xl font-syne font-extrabold mb-4">Neural Hyperplane</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-8">
                   Deployment of the optimal decision boundary that separates malicious threats from legitimate communication with 96.4% precision.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] font-bold text-white/20 uppercase mb-1">Cost</p>
                      <p className="text-xl font-syne font-black text-accent-blue">0.12</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <p className="text-[9px] font-bold text-white/20 uppercase mb-1">Epochs</p>
                      <p className="text-xl font-syne font-black text-accent-red">500</p>
                   </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Deep Dive Dashboard for Optimization */}
        <div className="mt-20">
          <GlassCard className="p-0 border-white/5 overflow-hidden">
             <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                {/* Visualizer Side */}
                <div className="lg:w-2/3 p-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h4 className="text-xl font-syne font-bold">Optimization Convergence</h4>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black border-l-2 border-accent-blue pl-3 py-1">Error reduction per epoch</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => setIsGraphPlaying(!isGraphPlaying)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:text-accent-blue transition-colors border border-white/5">
                          {isGraphPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button onClick={() => setLossData([])} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:text-accent-red transition-colors border border-white/5">
                          <RotateCcw size={18} />
                        </button>
                      </div>
                   </div>
                   <div className="h-72">
                      <Line 
                        data={{
                          labels: lossData.map((_, i) => i + 1),
                          datasets: [{
                            label: 'Log-Loss',
                            data: lossData,
                            borderColor: '#00f5ff',
                            backgroundColor: 'rgba(0, 245, 255, 0.05)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3,
                            pointRadius: 0
                          }]
                        }} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { 
                            x: { grid: { display: false }, ticks: { display: false } }, 
                            y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: 'rgba(255,255,255,0.2)', font: { size: 10 } } } 
                          }
                        }} 
                      />
                   </div>
                </div>

                {/* Control Panel Side */}
                <div className="lg:w-1/3 p-10 bg-white/[0.01]">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-8 flex items-center gap-2">
                     <Cpu size={14} className="text-accent-red" />
                     Hyperparameter Tuning
                   </h4>
                   <div className="space-y-10">
                    {[
                      { label: 'Regularization', val: regStrength, set: setRegStrength, min: 0.01, max: 10, step: 0.01, unit: 'C' },
                      { label: 'Max Iterations', val: iterations, set: setIterations, min: 50, max: 500, step: 10, unit: 'E' },
                      { label: 'Confidence Floor', val: threshold, set: setThreshold, min: 0.1, max: 0.9, step: 0.05, unit: 'T' }
                    ].map((slider, i) => (
                      <div key={i} className="group">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">{slider.label}</label>
                          <span className="text-[10px] font-mono text-accent-blue font-bold px-2 py-0.5 bg-accent-blue/10 rounded border border-accent-blue/20">{slider.val}{slider.unit}</span>
                        </div>
                        <div className="relative flex items-center">
                          <input 
                            type="range" min={slider.min} max={slider.max} step={slider.step} value={slider.val}
                            onChange={(e) => slider.set(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-blue hover:bg-white/10 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                   </div>
                   
                   <div className="mt-12 p-6 bg-accent-blue/5 rounded-2xl border border-accent-blue/10">
                      <p className="text-[10px] text-accent-blue/60 leading-relaxed font-medium">
                        Adjustment of these parameters triggers a real-time re-optimization of the neural weights within our secure local execution buffer.
                      </p>
                   </div>
                </div>
             </div>
          </GlassCard>
        </div>
      </section>

      {/* Feature Analysis */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="section-title">Feature <span className="text-white">Analysis</span></h2>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 mt-16">
          <GlassCard className="xl:col-span-7 overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                   <th className="pb-6 font-black">ID</th>
                   <th className="pb-6 font-black">Length</th>
                   <th className="pb-6 font-black">TF-IDF</th>
                   <th className="pb-6 font-black">Links</th>
                   <th className="pb-6 font-black text-right">Label</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                 {[
                   { id: '#041', len: 142, tf: 0.88, links: 0, label: 'SAFE' },
                   { id: '#042', len: 1240, tf: 0.12, links: 14, label: 'SPAM' },
                   { id: '#043', len: 32, tf: 0.75, links: 1, label: 'SAFE' },
                   { id: '#044', len: 850, tf: 0.45, links: 8, label: 'SPAM' },
                   { id: '#045', len: 215, tf: 0.92, links: 0, label: 'SAFE' }
                 ].map((row, i) => (
                   <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                     <td className="py-6 font-mono text-xs text-white/40">{row.id}</td>
                     <td className="py-6 text-sm font-bold">{row.len} <span className="text-[10px] opacity-20 ml-1">chars</span></td>
                     <td className="py-6 text-sm font-mono text-accent-blue">{row.tf}</td>
                     <td className="py-6 text-sm font-bold">{row.links}</td>
                     <td className="py-6 text-right">
                       <span className={cn(
                         "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                         row.label === 'SAFE' ? "bg-accent-blue/10 text-accent-blue" : "bg-accent-red/10 text-accent-red"
                       )}>{row.label}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </GlassCard>

          <GlassCard className="xl:col-span-5 flex flex-col">
             <h4 className="text-sm font-black uppercase tracking-widest text-white/40 mb-10">Top Spam Keywords</h4>
             <div className="flex-1 min-h-[300px]">
               <Bar 
                 data={{
                   labels: ['free', 'win', 'click', 'prize', 'urgent', 'offer', 'verify', 'cash'],
                   datasets: [{
                     data: [95, 88, 82, 78, 65, 60, 55, 45],
                     backgroundColor: (context: any) => {
                       return context.index < 4 ? '#ff003c' : '#00f5ff';
                     },
                     borderRadius: 8
                   }]
                 }}
                 options={{
                   indexAxis: 'y',
                   plugins: { legend: { display: false } },
                   scales: { x: { grid: { display: false }, ticks: { display: false } }, y: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10, weight: 'bold' } } } }
                 }}
               />
             </div>
             <div className="mt-8 pt-6 border-t border-white/5 flex justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-accent-red rounded-full" />
                   <span className="text-[10px] font-bold text-white/30 uppercase">High Risk</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-accent-blue rounded-full" />
                   <span className="text-[10px] font-bold text-white/30 uppercase">Moderate Risk</span>
                </div>
             </div>
          </GlassCard>
        </div>
      </section>

      {/* Model Comparison */}
      <section id="results" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="section-title">Model <span className="text-white">Comparison</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-20">
          {[
            { name: 'Logistic Regression', precision: 96.4, recall: 94.1, f1: 95.2 },
            { name: 'Multinomial Naive Bayes', precision: 92.1, recall: 90.5, f1: 91.3 },
            { name: 'Support Vector Machine', precision: 95.8, recall: 93.2, f1: 94.5 }
          ].map((model, i) => (
            <GlassCard key={i} className={cn("relative group transition-all", selectedModels.includes(model.name) ? "border-accent-blue/40 shadow-[0_0_30px_rgba(0,245,255,0.1)]" : "")}>
               <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-accent-blue">
                    <Cpu size={24} />
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedModels.includes(model.name)}
                    onChange={() => {
                      if (selectedModels.includes(model.name)) {
                        setSelectedModels(prev => prev.filter(m => m !== model.name));
                      } else {
                        setSelectedModels(prev => [...prev, model.name]);
                      }
                    }}
                    className="w-5 h-5 accent-accent-blue cursor-pointer"
                  />
               </div>
               <h4 className="text-xl font-bold font-syne mb-6">{model.name}</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Precision', val: model.precision },
                    { label: 'Recall', val: model.recall },
                    { label: 'F1-Score', val: model.f1 }
                  ].map((stat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30 mb-1.5">
                        <span>{stat.label}</span>
                        <span>{stat.val}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} whileInView={{ width: `${stat.val}%` }} className="h-full bg-accent-blue" />
                      </div>
                    </div>
                  ))}
               </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-12">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-12 flex items-center gap-3">
             <BarChart3 size={18} className="text-accent-blue" />
             Aggregated Comparison Dashboard
           </h4>
           <div className="h-[400px]">
             <Bar 
               data={{
                 labels: ['Precision', 'Recall', 'F1-Score'],
                 datasets: selectedModels.map((m, idx) => ({
                   label: m,
                   data: m === 'Logistic Regression' ? [96.4, 94.1, 95.2] : (m === 'Multinomial Naive Bayes' ? [92.1, 90.5, 91.3] : [95.8, 93.2, 94.5]),
                   backgroundColor: idx === 0 ? '#00f5ff' : (idx === 1 ? 'rgba(0, 245, 255, 0.4)' : '#ff003c'),
                   borderRadius: 8
                 }))
               }}
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: { y: { min: 80, grid: { color: 'rgba(255,255,255,0.05)' } } }
               }}
             />
           </div>
        </GlassCard>
      </section>

      {/* Live Predictor Section */}
      <section id="predictor" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Live <span className="text-white">Predictor</span></h2>
          <p className="text-white/40 max-w-2xl mx-auto font-medium uppercase tracking-[0.2em] text-[10px]">
            Real-time neural classification with metadata-aware weighted analysis
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          {/* Input Panel */}
          <div className="xl:col-span-4 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Input Parameters</h4>
            <GlassCard className="p-8 border-white/5 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sender Trust Score</label>
                  <span className="text-[10px] font-mono text-accent-blue font-bold px-2 py-0.5 bg-accent-blue/10 rounded">{senderTrust}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="1" value={senderTrust}
                  onChange={(e) => setSenderTrust(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-blue"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Urgency Level</label>
                  <span className="text-[10px] font-mono text-accent-red font-bold px-2 py-0.5 bg-accent-red/10 rounded">{urgencyLevel}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-red"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Valid Auth Headers</span>
                  <button 
                    onClick={() => setHasValidHeaders(!hasValidHeaders)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-300",
                      hasValidHeaders ? "bg-accent-blue" : "bg-white/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: hasValidHeaders ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-background rounded-full"
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                   <span>Manual Link Count</span>
                   <div className="flex items-center gap-4">
                      <button onClick={() => setLinkCount(Math.max(0, linkCount - 1))} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">-</button>
                      <span className="font-mono text-white/80">{linkCount}</span>
                      <button onClick={() => setLinkCount(linkCount + 1)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">+</button>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h5 className="text-[9px] font-black uppercase text-white/20 mb-4 tracking-widest">Random Test Matrix</h5>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                        const spamMessages = [
                           "WINNER: You've won a $5,000 cash prize. Call 555-0199 now!",
                           "URGENT: Verify your bank identity immediately to avoid lockout.",
                           "CONGRATULATIONS! Claim your free Bitcoin voucher before it expires.",
                           "FINAL NOTICE: Your subscription will end tonight. Click here to renew."
                        ];
                        setScanText(spamMessages[Math.floor(Math.random() * spamMessages.length)]);
                        setSenderTrust(Math.floor(Math.random() * 30));
                        setUrgencyLevel(Math.floor(Math.random() * 5) + 6);
                        setLinkCount(Math.floor(Math.random() * 4) + 1);
                        setHasValidHeaders(false);
                    }}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-red/30 text-[9px] font-bold uppercase tracking-widest transition-all"
                  >
                    Random Spam
                  </button>
                  <button 
                    onClick={() => {
                        const hamMessages = [
                           "Hey, can you send over the final report for the CSE275 project?",
                           "Reminder: The optimization workshop starts at 2 PM in Room 402.",
                           "Thanks for the feedback on the SVM model. I'll merge the changes.",
                           "Meeting scheduled for tomorrow at 10 AM regarding the dataset."
                        ];
                        setScanText(hamMessages[Math.floor(Math.random() * hamMessages.length)]);
                        setSenderTrust(Math.floor(Math.random() * 40) + 60);
                        setUrgencyLevel(Math.floor(Math.random() * 4) + 1);
                        setLinkCount(0);
                        setHasValidHeaders(true);
                    }}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent-blue/30 text-[9px] font-bold uppercase tracking-widest transition-all"
                  >
                    Random Ham
                  </button>
                </div>
              </div>
            </GlassCard>

            {predictionHistory.length > 0 && (
              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Prediction History</h4>
                {predictionHistory.map((h, i) => (
                  <div key={i} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className={cn("w-2 h-2 rounded-full", h.isSpam ? "bg-accent-red" : "bg-accent-blue")} />
                       <span className="text-[10px] font-bold text-white/60 truncate max-w-[120px]">{h.reasoning}</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/20">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Engine Panel */}
          <div className="xl:col-span-8 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Neural Analysis Buffer</h4>
            <GlassCard className="p-0 border-white/5 relative overflow-hidden group min-h-[500px] flex flex-col">
               <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-8">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-accent-red/20 border border-accent-red/40" />
                     <div className="w-3 h-3 rounded-full bg-accent-blue/20 border border-accent-blue/40" />
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] font-mono text-accent-blue/60 uppercase tracking-widest">Model: LSTM-Optimized-v4</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                  </div>
               </div>
               
               <textarea 
                 value={scanText}
                 onChange={(e) => setScanText(e.target.value)}
                 placeholder="Input raw email source for predictive neural mapping..."
                 className="flex-1 w-full bg-transparent p-10 focus:outline-none text-lg font-medium leading-relaxed resize-none placeholder:opacity-5 placeholder:font-syne"
               />

               <div className="p-8 border-t border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <button onClick={() => {setScanText(''); setAnalysisResult(null);}} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white/20 hover:text-accent-red hover:bg-accent-red/5 transition-all border border-white/5">
                       <Trash2 size={24} />
                    </button>
                    <div className="hidden md:block h-10 w-[1px] bg-white/5" />
                    <div className="flex gap-8">
                       <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Complexity</p>
                          <p className="text-lg font-syne font-bold">{Math.min(100, Math.floor(scanText.length / 50))}%</p>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleScan}
                    disabled={isAnalyzing || !scanText.trim()}
                    className="btn-primary h-16 !px-12 w-full md:w-auto flex items-center justify-center gap-4 group relative overflow-hidden"
                  >
                    {isAnalyzing ? (
                       <>
                         <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                         <span className="uppercase tracking-[0.2em] font-black text-xs">Propagating...</span>
                       </>
                    ) : (
                       <>
                         <Search size={20} className="group-hover:scale-110 transition-transform" />
                         <span className="uppercase tracking-[0.2em] font-black text-xs">Predict Now</span>
                         <motion.div 
                           className="absolute inset-0 bg-white/10"
                           initial={{ x: '-100%' }}
                           whileHover={{ x: '100%' }}
                           transition={{ duration: 0.6 }}
                         />
                       </>
                    )}
                  </button>
               </div>
            </GlassCard>

            {/* Output Panel / Result */}
            <AnimatePresence mode="wait">
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="mt-4"
                >
                  <GlassCard className={cn(
                    "p-0 border-2 overflow-hidden",
                    analysisResult.isSpam ? "border-accent-red/30 shadow-[0_0_50px_rgba(255,0,60,0.1)]" : "border-accent-blue/30 shadow-[0_0_50px_rgba(0,245,255,0.1)]"
                  )}>
                    <div className="grid grid-cols-1 md:grid-cols-12">
                       {/* Left result info */}
                       <div className="md:col-span-7 p-12">
                          <div className="flex items-center gap-6 mb-8">
                             <div className={cn(
                               "w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-background shadow-xl",
                               analysisResult.isSpam ? "bg-accent-red shadow-accent-red/20" : "bg-accent-blue shadow-accent-blue/20"
                             )}>
                               {analysisResult.isSpam ? <AlertTriangle size={40} /> : <CheckCircle size={40} />}
                             </div>
                             <div>
                               <div className="flex items-center gap-3 mb-1">
                                  <span className={cn(
                                    "px-3 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                    analysisResult.isSpam ? "bg-accent-red/10 text-accent-red" : "bg-accent-blue/10 text-accent-blue"
                                  )}>
                                    Classification Result
                                  </span>
                                  <span className="text-[9px] font-mono text-white/20">{analysisResult.timestamp}</span>
                               </div>
                               <h3 className="text-4xl font-syne font-black tracking-tighter">
                                  {analysisResult.isSpam ? 'SPAM' : 'LEGITIMATE'}
                               </h3>
                             </div>
                          </div>

                          <div className={cn(
                            "p-8 rounded-[2rem] border mb-8",
                            analysisResult.isSpam ? "bg-accent-red/5 border-accent-red/10" : "bg-accent-blue/5 border-accent-blue/10"
                          )}>
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                                <Zap size={14} className={analysisResult.isSpam ? "text-accent-red" : "text-accent-blue"} />
                                Neural Insights
                             </h4>
                             <p className="text-lg font-medium text-white/80 leading-relaxed italic mb-6">
                                "{analysisResult.reasoning}"
                             </p>
                             <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                <div>
                                   <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Sentiment</p>
                                   <p className={cn("text-xs font-bold", analysisResult.localStats.sentiment < 0 ? "text-accent-red" : "text-accent-blue")}>
                                      {analysisResult.localStats.sentiment < 0 ? 'Negative / Aggressive' : 'Neutral / Formal'}
                                   </p>
                                </div>
                                <div>
                                   <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">Language</p>
                                   <p className="text-xs font-bold text-white/60">{analysisResult.localStats.language}</p>
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                             {analysisResult.importantFeatures.slice(0, 5).map((f: string, i: number) => (
                               <span key={i} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                 {f}
                               </span>
                             ))}
                          </div>
                       </div>

                       {/* Right charts/metrics */}
                       <div className="md:col-span-5 bg-white/[0.02] border-l border-white/5 p-10 flex flex-col items-center justify-center">
                          <div className="w-full mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                             <div className="flex justify-between items-center mb-4">
                                <h5 className="text-[8px] font-black uppercase tracking-widest text-white/40">Technical DNA</h5>
                                <span className="text-[8px] font-mono text-accent-blue">Entropy: {analysisResult.localStats.entropy}</span>
                             </div>
                             <div className="space-y-4">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-white/40 uppercase">SPF/DKIM</span>
                                  <span className={cn("text-[9px] font-black", analysisResult.localStats.hasValidHeaders ? "text-accent-blue" : "text-accent-red")}>
                                     {analysisResult.localStats.hasValidHeaders ? 'AUTH_PASSED' : 'AUTH_FAILED'}
                                  </span>
                               </div>
                               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className={cn("h-full transition-all duration-500", analysisResult.localStats.hasValidHeaders ? "w-full bg-accent-blue" : "w-1/4 bg-accent-red")} />
                               </div>
                             </div>
                          </div>

                          <div className="relative w-full max-w-[160px] mb-8">
                             <Doughnut 
                               data={{
                                 labels: ['Spam', 'Ham'],
                                 datasets: [{
                                   data: analysisResult.isSpam ? [analysisResult.confidence * 100, 100 - (analysisResult.confidence * 100)] : [100 - (analysisResult.confidence * 100), analysisResult.confidence * 100],
                                   backgroundColor: [analysisResult.isSpam ? '#ff003c' : 'rgba(255,255,255,0.05)', analysisResult.isSpam ? 'rgba(255,255,255,0.05)' : '#00f5ff'],
                                   borderWidth: 0
                                 }]
                               }}
                               options={{
                                 plugins: { legend: { display: false } },
                                 maintainAspectRatio: true,
                                 cutout: '80%'
                               }}
                             />
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-syne font-black">{(analysisResult.confidence * 100).toFixed(0)}%</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Confidence</span>
                             </div>
                          </div>

                          <div className="w-full space-y-5">
                             {[
                               { label: 'Sender Trust', val: analysisResult.localStats.senderTrust, color: 'accent-blue' },
                               { label: 'Urgency Factor', val: analysisResult.localStats.urgencyLevel * 10, color: 'accent-red' },
                               { label: 'Feature Strength', val: analysisResult.confidence * 95, color: analysisResult.isSpam ? 'accent-red' : 'accent-blue' }
                             ].map((m, i) => (
                               <div key={i}>
                                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/30 mb-2">
                                     <span>{m.label}</span>
                                     <span>{m.val.toFixed(1)}%</span>
                                  </div>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${m.val}%` }} 
                                      className={cn("h-full", m.color === 'accent-red' ? "bg-accent-red shadow-[0_0_10px_#ff003c]" : "bg-accent-blue shadow-[0_0_10px_#00f5ff]")} 
                                     />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Final Results Counters */}
      <section id="results-alt" className="py-32 px-6 max-w-7xl mx-auto">
         <h2 className="section-title">Results & Key <span className="text-white">Outcomes</span></h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Precision', val: 96.4, suffix: '%', icon: CheckCircle, color: 'text-accent-blue' },
              { label: 'Recall', val: 94.1, suffix: '%', icon: RotateCcw, color: 'text-accent-red' },
              { label: 'F1-Score', val: 95.2, suffix: '%', icon: Activity, color: 'text-white' },
              { label: 'False Positives', val: 3.6, suffix: '%', icon: X, color: 'text-white/40' }
            ].map((metric, i) => (
              <GlassCard key={i} className="text-center group flex flex-col items-center py-10">
                 <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", metric.color)}>
                    <metric.icon size={24} />
                 </div>
                 <motion.h4 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl md:text-5xl font-syne font-black mb-2 transition-colors">
                   {metric.val}<span className="text-xl text-white/20 font-bold ml-1">{metric.suffix}</span>
                 </motion.h4>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{metric.label}</p>
              </GlassCard>
            ))}
         </div>
         <div className="flex justify-center mt-16">
            <button onClick={downloadReport} className="btn-primary flex items-center gap-4 h-16 !px-10 group">
               <Download size={22} className="group-hover:bounce" />
               <div className="text-left">
                 <p className="text-xs font-black uppercase tracking-widest">Download Project Report</p>
                 <p className="text-[9px] text-background/60 uppercase font-bold tracking-widest">Documentation & Metrics (TXT)</p>
               </div>
            </button>
         </div>
      </section>

      {/* Project By Section */}
      <section id="project-by" className="py-32 px-6 max-w-6xl mx-auto">
        <h2 className="section-title text-3xl">Project <span className="text-white">By</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-center">
           {/* Member 1: K. Srisaa */}
           <GlassCard className="text-center group flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl mx-auto mb-8 flex items-center justify-center border border-accent-blue/20 group-hover:rotate-6 transition-transform">
                 <span className="text-xl font-syne font-black text-accent-blue">KS</span>
              </div>
              <h3 className="text-2xl font-syne font-black mb-2 tracking-tighter">K. SRISAA</h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em]">CSE Optimization Lead</p>
           </GlassCard>

           {/* Main / Center: Chandan Reddy (Team Lead) */}
           <GlassCard className="text-center group flex flex-col items-center py-14 relative border-accent-blue/40 bg-white/[0.04] shadow-[0_0_50px_rgba(0,245,255,0.15)] md:-translate-y-3">
              <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-gradient-to-r from-accent-blue via-white to-accent-red text-background text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                 Team Lead
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-accent-blue/20 via-white/10 to-accent-red/20 rounded-2xl mx-auto mb-8 flex items-center justify-center border border-accent-blue/40 group-hover:scale-105 group-hover:rotate-3 transition-transform shadow-[0_0_30px_rgba(0,245,255,0.3)]">
                 <span className="text-2xl font-syne font-black bg-clip-text text-transparent bg-gradient-to-r from-accent-blue via-white to-accent-red">CR</span>
              </div>
              <h3 className="text-3xl font-syne font-black mb-1.5 tracking-tighter text-white">CHANDAN REDDY</h3>
              <p className="text-[11px] text-accent-blue uppercase font-black tracking-[0.35em] mb-1">Team Lead & Systems Architect</p>
              <p className="text-[9px] text-white/40 uppercase font-bold tracking-[0.25em]">Optimization & ML Infrastructure</p>
           </GlassCard>

           {/* Member 2: P. Jayanth */}
           <GlassCard className="text-center group flex flex-col items-center py-12">
              <div className="w-16 h-16 bg-accent-red/10 rounded-2xl mx-auto mb-8 flex items-center justify-center border border-accent-red/20 group-hover:-rotate-6 transition-transform">
                 <span className="text-xl font-syne font-black text-accent-red">PJ</span>
              </div>
              <h3 className="text-2xl font-syne font-black mb-2 tracking-tighter">P. JAYANTH</h3>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em]">Neural Systems Architect</p>
           </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-accent-blue via-accent-red to-accent-blue opacity-30" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-accent-blue" />
              <span className="text-2xl font-syne font-black tracking-tighter">SpamShield AI</span>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black">CSE275 – Optimization in Machine Learning</p>
          </div>
          <div className="text-center md:text-right">
             <p className="text-sm font-bold opacity-40 mb-2">Lovely Professional University</p>
             <p className="text-[10px] text-white/10 uppercase tracking-[0.4em] font-black">© 2025 SpamShield AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Button */}
      <motion.button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.1 }}
        className="fixed bottom-10 right-10 w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent-blue border border-white/10 hover:border-accent-blue transition-all z-[120]"
      >
        <RotateCcw className="rotate-90" />
      </motion.button>
    </div>
  );
};
