import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import {
    LogIn,
    Users,
    CheckCircle,
    ArrowRight,
    QrCode,
    Smartphone,
    ShieldCheck,
    Unlock,
    AlertCircle,
    Menu,
    X,
    Heart,
    Calendar,
    Sparkles,
    Award,
    BookOpen,
    PieChart,
    Shield,
    Zap,
    School
} from 'lucide-react'
import { saveGuestEntry, subscribeToSettings } from './utils/storage'
import { motion, AnimatePresence } from 'framer-motion'

// Import Components
import AdminDashboard from './components/AdminDashboard'
import KioskMode from './components/KioskMode'

// Navigation Component
const Navbar = ({ settings }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass h-20 shadow-xl' : 'bg-transparent h-24'}`}>
            <div className="admin-container h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-colors overflow-hidden ${settings.logo
                        ? 'bg-transparent'
                        : 'bg-emerald-800 text-white group-hover:bg-emerald-600'
                        }`}>
                        {settings.logo ? (
                            <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <Heart size={28} fill="currentColor" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 leading-none">e-Tamu PMR</h1>
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-[0.3em] mt-1">{settings.schoolName}</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-12">
                    {['Visi & Misi', 'Layanan', 'Statistik'].map(item => (
                        <a
                            key={item}
                            href={isHome ? `#${item.toLowerCase().replace(' ', '-')}` : `/#${item.toLowerCase().replace(' ', '-')}`}
                            className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-700 transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                    <div className="h-6 w-px bg-slate-200"></div>
                    <Link to="/guest-form" className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800 hover:opacity-70 transition-opacity">Buku Tamu</Link>
                    <Link to="/login" className="btn-premium px-8 py-3.5 text-xs uppercase tracking-[0.2em] rounded-xl">
                        Admin Access
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 bg-emerald-50 text-emerald-800 rounded-xl">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden fixed inset-0 top-0 bg-white z-[90] p-10 flex flex-col justify-center"
                    >
                        <div className="space-y-10 text-center">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block text-4xl font-black hover:text-emerald-600 transition-colors">Home</Link>
                            <Link to="/guest-form" onClick={() => setIsOpen(false)} className="block text-4xl font-black hover:text-emerald-600 transition-colors">Register Visit</Link>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-4xl font-black hover:text-emerald-600 transition-colors">Admin Login</Link>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 font-bold uppercase tracking-widest text-sm">Close Menu</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

// Vision & Mission Section Component
const VisionMissionSection = () => {
    const [settings, setSettings] = useState({})

    useEffect(() => {
        const unsubscribe = subscribeToSettings(setSettings)
        return () => unsubscribe()
    }, [])

    const hasContent = settings.visi || settings.misi

    if (!hasContent) {
        return null // Don't show section if no content set by admin
    }

    return (
        <section id="visi-misi" className="py-32 bg-gradient-to-br from-emerald-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-100/20 rounded-full blur-[80px]" />
            </div>

            <div className="admin-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Logo Section - Centered */}
                    <div className="flex justify-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative group"
                        >
                            {/* Logo Glow Effect */}
                            {!settings.logo && (
                                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[60px] opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            )}

                            {/* Logo Container */}
                            <div className={`relative w-40 h-40 md:w-56 md:h-56 mx-auto ${settings.logo ? 'bg-transparent' : 'bg-white rounded-full shadow-2xl'} flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-500`}>
                                {settings.logo ? (
                                    <img src={settings.logo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-2xl" />
                                ) : (
                                    <>
                                        <div className="relative z-10">
                                            <Heart size={80} className="text-emerald-600 drop-shadow-lg" fill="currentColor" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent opacity-50"></div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-100 border-2 border-emerald-200 text-emerald-800 text-sm font-black tracking-[0.3em] uppercase mb-8">
                            <Heart size={20} />
                            Identitas Kami
                        </div>
                        <h3 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight">
                            Visi & <span className="text-gradient">Misi</span>
                        </h3>
                        <p className="text-2xl text-slate-500 font-bold max-w-3xl mx-auto">
                            Komitmen kami dalam memberikan pelayanan terbaik
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Visi Card */}
                        {settings.visi && (
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="card-premium p-12 bg-white/80 backdrop-blur-sm border-emerald-100 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                        <Award size={32} />
                                    </div>
                                    <h4 className="text-4xl font-black text-slate-900">Visi</h4>
                                </div>
                                <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                                    {settings.visi}
                                </p>
                            </motion.div>
                        )}

                        {/* Misi Card */}
                        {settings.misi && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="card-premium p-12 bg-white/80 backdrop-blur-sm border-emerald-100 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                        <BookOpen size={32} />
                                    </div>
                                    <h4 className="text-4xl font-black text-slate-900">Misi</h4>
                                </div>
                                <p className="text-xl text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                                    {settings.misi}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section >
    )
}

// Full-scale Landing Page Components
const Home = () => {
    const [settings, setSettings] = useState({})

    useEffect(() => {
        const unsubscribe = subscribeToSettings(setSettings)
        return () => unsubscribe()
    }, [])

    return (
        <div className="flex-1 flex flex-col">
            {/* 1. Cinematic Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[150px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50/20 rounded-full blur-[120px] -z-10"></div>

                <div className="admin-container">
                    <div className="text-center max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 border-2 border-emerald-100 text-emerald-800 text-sm font-black tracking-[0.3em] uppercase mb-12"
                        >
                            <Sparkles size={20} /> Transformasi Digital 2026
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-9xl lg:text-[10rem] font-black mb-12 tracking-tighter leading-[0.9]"
                        >
                            Elegant <br />
                            <span className="text-gradient">Guestbook</span> <br />
                            System.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-3xl md:text-4xl text-slate-500 mb-16 max-w-4xl mx-auto font-bold leading-relaxed"
                        >
                            Modernisasi administrasi kunjungan PMR MAN 2 Kota Tidore Kepulauan dengan platform digital terintegrasi yang aman dan efisien.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-8"
                        >
                            <Link to="/guest-form" className="btn-premium py-8 px-16 text-3xl group shadow-emerald-900/10 rounded-[2.5rem]">
                                Mulai Registrasi <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link to="/kiosk" className="btn-secondary py-8 px-16 text-3xl rounded-[2.5rem] border-2">
                                <Smartphone size={32} /> Kiosk Mode
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.5 }}
                            className="mt-24 relative max-w-5xl mx-auto"
                        >
                            <div className="absolute -inset-10 bg-emerald-600/5 blur-[120px] rounded-full animate-luxury"></div>
                            <div className="card-premium p-4 bg-gradient-to-br from-white to-slate-50 border-white relative overflow-hidden group shadow-emerald-900/5">
                                <div className="w-full h-[500px] bg-gradient-to-br from-emerald-50 to-slate-100 rounded-[2rem] flex items-center justify-center">
                                    <div className="text-emerald-900/5 rotate-12 transform scale-150">
                                        <School size={200} />
                                    </div>
                                </div>
                                <div className="absolute inset-x-8 bottom-8 glass p-10 rounded-3xl flex items-center justify-between border-white/50">
                                    <div>
                                        <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">Live Status</div>
                                        <div className="text-2xl font-black text-slate-900">System Secure & Online</div>
                                    </div>
                                    <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center text-white shadow-xl">
                                        <Shield size={28} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 1.5. Vision & Mission Section */}
            <VisionMissionSection />

            {/* 2. Impact Section (Stats) */}
            <section id="statistik" className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="admin-container relative z-10 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                        {[
                            { val: "100%", label: "Digital Workflow", sub: "Paperless and Eco-friendly" },
                            { val: "< 1m", label: "Fast Access", sub: "Speedy registration process" },
                            { val: "24/7", label: "System Uptime", sub: "Monitoring and safe logging" }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="text-7xl font-black text-emerald-400 mb-4">{item.val}</div>
                                <div className="text-xl font-black uppercase tracking-[0.2em] mb-2">{item.label}</div>
                                <div className="text-slate-500 font-bold">{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Modern Features Section */}
            <section id="layanan" className="py-40 bg-white">
                <div className="admin-container">
                    <div className="max-w-4xl mx-auto mb-24 text-center">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-16 h-px bg-emerald-600"></div>
                            <div className="text-sm font-black text-emerald-700 uppercase tracking-[0.4em]">Our Core Capabilities</div>
                            <div className="w-16 h-px bg-emerald-600"></div>
                        </div>
                        <h3 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight tracking-tight">Layanan Administrasi <br /> Kelas Dunia.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { icon: <QrCode size={40} />, title: "QR Scan Access", desc: "Akses form instan tanpa perlu menyentuh layar publik via smartphone Anda sendiri." },
                            { icon: <Zap size={40} />, title: "Real-time Logging", desc: "Semua kunjungan masuk ke database secara detik itu juga untuk keamanan tingkat tinggi." },
                            { icon: <PieChart size={40} />, title: "Data Analytics", desc: "Insight detail mengenai kunjungan, statistik harian, dan tren bulanan melalui dashboard." },
                            { icon: <BookOpen size={40} />, title: "Official Reporting", desc: "Generate laporan Excel dan PDF dengan satu klik untuk kebutuhan akreditasi." },
                            { icon: <ShieldCheck size={40} />, title: "Secure Admin Gate", desc: "Akses administrator yang dilindungi oleh enkripsi session dan password kontrol." },
                            { icon: <Users size={40} />, title: "Unit Focused", desc: "Dirancang eksklusif sesuai dengan kebutuhan operasional PMR dan Unit UKS." }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="card-premium h-full border-slate-50 p-14 bg-slate-50/30 group hover:bg-emerald-800 transition-all duration-500"
                            >
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {f.icon}
                                </div>
                                <h4 className="text-3xl font-black text-slate-900 mb-5 group-hover:text-white transition-colors">{f.title}</h4>
                                <p className="text-lg text-slate-500 group-hover:text-emerald-100 transition-colors leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Academy Pride (Identity) */}
            <section className="py-32 bg-emerald-50/50">
                <div className="admin-container">
                    <div className="glass p-16 lg:p-24 rounded-[3rem] border-emerald-100 text-center max-w-6xl mx-auto">
                        <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl p-10 mx-auto mb-12 overflow-hidden">
                            {settings.logo ? (
                                <img src={settings.logo} alt="School Logo" className="w-full h-full object-contain" />
                            ) : (
                                <School size={80} className="text-emerald-700" />
                            )}
                        </div>
                        <h4 className="text-5xl md:text-6xl font-black text-emerald-950 mb-8 uppercase tracking-tight">{settings.schoolName || 'PMR MAN 2 Kota Tidore Kepulauan'}</h4>
                        <p className="text-2xl md:text-3xl text-emerald-900/60 font-bold leading-relaxed max-w-4xl mx-auto italic">
                            "Komitmen kami dalam memajukan budaya digital madrasah dimulai dari hal terkecil. Administrasi tamu yang rapi adalah representasi dari kedisiplinan dan profesionalisme organisasi."
                        </p>
                    </div>
                </div>
            </section>

            {/* 5. CTA Footer */}
            <section className="py-40 bg-white text-center">
                <div className="admin-container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto"
                    >
                        <h3 className="text-7xl md:text-9xl font-black text-slate-900 mb-16 leading-none">Siap untuk <br /> Berbagi <span className="text-emerald-600">Langkah?</span></h3>
                        <Link to="/guest-form" className="btn-premium px-20 py-10 text-4xl shadow-emerald-900/40 rounded-[3rem]">
                            Register Your Visit Now
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

const GuestForm = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        institution: '',
        position: '',
        phone: '',
        purpose: 'Koordinasi Program',
        notes: '',
        remarks: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await saveGuestEntry(formData)
            setLoading(false)
            navigate('/success')
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <div className="admin-container py-32 flex-1 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-20 items-stretch">
                <div className="lg:col-span-2 py-10 flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="title-xl text-6xl mb-8 leading-none">Register <br /><span className="text-emerald-600">Your Identity.</span></h2>
                        <p className="text-slate-500 mb-12 text-xl font-medium leading-relaxed">Kehadiran Anda sangat berharga bagi kami. Lengkapi formulir di samping untuk keperluan dokumentasi madrasah.</p>

                        <div className="space-y-10">
                            {[
                                { icon: <Award className="text-emerald-600" />, title: "Secured Records", desc: "Data Anda disimpan secara rahasia dalam sistem." },
                                { icon: <Heart className="text-emerald-600" />, title: "Modern Service", desc: "Representasi dari pelayanan terbaik madrasah." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6">
                                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center shrink-0 border border-slate-50">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-slate-900">{item.title}</div>
                                        <div className="text-slate-400 font-bold">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 card-premium shadow-[0_50px_150px_-30px_rgba(6,95,70,0.15)] relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-400"></div>

                    <form onSubmit={handleSubmit} className="space-y-10 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="label-premium">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="Masukkan Nama Anda"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="label-premium">Nomor WhatsApp</label>
                                <input
                                    type="tel"
                                    className="input-premium"
                                    placeholder="0812XXXXXXXX"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="label-premium">Instansi / Unit Asal</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="cth: Kemenag / Sekolah / Dinas"
                                    required
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="label-premium">Jabatan</label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="cth: Staff / Kepala / Guru"
                                    required
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                            <div className="space-y-3">
                                <label className="label-premium">Tujuan Kunjungan</label>
                                <select
                                    className="input-premium appearance-none cursor-pointer"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                >
                                    <option>Koordinasi Program</option>
                                    <option>Pemeriksaan Kesehatan</option>
                                    <option>Konsultasi Pembina</option>
                                    <option>Studi Banding</option>
                                    <option>Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="label-premium">Pesan / Kesan</label>
                            <textarea
                                className="input-premium min-h-[120px] rounded-none border-b-2"
                                placeholder="Tuliskan pesan atau kesan Anda..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="label-premium">Keterangan</label>
                            <input
                                type="text"
                                className="input-premium"
                                placeholder="Keterangan tambahan (opsional)"
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium w-full py-6 text-2xl shadow-emerald-500/30 font-black"
                        >
                            {loading ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    PLEASE WAIT...
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    SEND RECORD <CheckCircle size={32} />
                                </div>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

const SuccessPage = () => {
    return (
        <div className="admin-container py-40 flex-1 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium max-w-2xl w-full text-center p-20 shadow-emerald-900/10"
            >
                <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner">
                    <CheckCircle size={80} strokeWidth={2.5} />
                </div>
                <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Registration <br /><span className="text-emerald-600">Successful.</span></h2>
                <p className="text-xl text-slate-500 mb-14 font-medium leading-relaxed">
                    Kunjungan Anda telah dicatat dalam sistem keamanan madrasah. Terima kasih atas kerja samanya.
                </p>
                <Link to="/" className="btn-premium w-full py-6 text-2xl">
                    Return to Hub
                </Link>
            </motion.div>
        </div>
    )
}

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [settings, setSettings] = useState({})

    useEffect(() => {
        const unsubscribe = subscribeToSettings(setSettings)
        return () => unsubscribe()
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === settings.adminPassword) {
            onLogin()
        } else {
            setError('Access Denied: Unrecognized Authority Key')
            setTimeout(() => setError(''), 3000)
        }
    }

    return (
        <div className="admin-container py-40 flex-1 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium max-w-xl w-full p-16 shadow-[0_100px_200px_-50px_rgba(15,23,42,0.3)] bg-slate-950 text-white border-none"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_20px_40px_rgba(5,150,105,0.3)]">
                        <ShieldCheck size={48} />
                    </div>
                    <h2 className="text-4xl font-black mb-4">Gate Authority</h2>
                    <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full mb-4"></div>
                    <p className="text-emerald-500/60 font-black uppercase tracking-[0.4em] text-[10px]">Administrative Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-12">
                    <div className="space-y-4">
                        <input
                            type="password"
                            className="w-full bg-white/5 border-b-2 border-white/10 p-6 text-center text-6xl font-black tracking-[0.8em] placeholder:tracking-normal placeholder:font-bold placeholder:text-xl focus:border-emerald-500 focus:outline-none transition-all"
                            placeholder="PASS KEY"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex items-center gap-3 p-6 bg-rose-500/10 text-rose-500 rounded-2xl text-sm font-black border border-rose-500/20"
                            >
                                <AlertCircle size={24} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="btn-premium w-full py-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-2xl">
                        Authorize Entry
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <Link to="/" className="text-xs font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">Abort Access</Link>
                </div>
            </motion.div>
        </div>
    )
}

// Layout Wrapper Component
const Layout = ({ children }) => {
    const [settings, setSettings] = useState({})
    const location = useLocation()
    const isKiosk = location.pathname === '/kiosk'

    useEffect(() => {
        const unsubscribe = subscribeToSettings(setSettings)
        return () => unsubscribe()
    }, [])

    if (isKiosk) return <>{children}</>

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar settings={settings} />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <footer className="bg-emerald-950 text-white py-16">
                <div className="admin-container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
                        <div>
                            <h5 className="text-xl font-black mb-4">e-Tamu PMR</h5>
                            <p className="text-emerald-200/60 font-medium text-sm">Sistem Buku Tamu Digital untuk PMR MAN 2 Kota Tidore Kepulauan</p>
                        </div>
                        <div>
                            <h6 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Quick Access</h6>
                            <div className="space-y-2">
                                <Link to="/guest-form" className="block text-sm font-bold text-emerald-200/80 hover:text-white transition-colors">Isi Buku Tamu</Link>
                                <Link to="/kiosk" className="block text-sm font-bold text-emerald-200/80 hover:text-white transition-colors">Mode Kiosk</Link>
                                <Link to="/login" className="block text-sm font-bold text-emerald-200/80 hover:text-white transition-colors">Admin Login</Link>
                            </div>
                        </div>
                        <div>
                            <h6 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Institution</h6>
                            <p className="text-sm font-bold text-emerald-200/80">{settings.schoolName}</p>
                            <p className="text-xs text-emerald-200/60 mt-2">Palang Merah Remaja</p>
                        </div>
                    </div>
                    <div className="border-t border-emerald-900 pt-8">
                        <p className="text-center text-sm font-medium text-emerald-200/40">
                            &copy; 2026 {settings.unitName} &bull; All Rights Reserved
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function App() {
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const auth = sessionStorage.getItem('etamu_auth')
        if (auth === 'true') setIsAdmin(true)
    }, [])

    const handleLogin = () => {
        setIsAdmin(true)
        sessionStorage.setItem('etamu_auth', 'true')
    }

    const handleLogout = () => {
        setIsAdmin(false)
        sessionStorage.removeItem('etamu_auth')
    }

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/guest-form" element={<GuestForm />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/login" element={
                        isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />
                    } />
                    <Route path="/admin" element={
                        isAdmin ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />
                    } />
                    <Route path="/kiosk" element={<KioskMode />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
