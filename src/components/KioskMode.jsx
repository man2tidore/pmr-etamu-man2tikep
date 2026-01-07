import React, { useState, useEffect } from 'react'
import { QrCode, ArrowLeft, Smartphone, Monitor, Sparkles, ChevronRight, Shield, Clock } from 'lucide-react'
import QRCode from 'react-qr-code'
import { subscribeToSettings } from '../utils/storage'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const KioskMode = () => {
    const [settings, setSettings] = useState({})
    const [activeSlides, setActiveSlides] = useState([])
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

    useEffect(() => {
        const unsubscribe = subscribeToSettings(setSettings)
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        // Filter valid slides
        const validSlides = (settings.slides || []).filter(s => s && s.length > 0)
        setActiveSlides(validSlides)

        if (validSlides.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlideIndex(prev => (prev + 1) % validSlides.length)
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [settings.slides])

    useEffect(() => {
        setCurrentUrl(window.location.origin + '/guest-form')
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-screen bg-emerald-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-['Plus_Jakarta_Sans']">
            {/* Background Slideshow or Default Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {activeSlides.length > 0 ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlideIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${activeSlides[currentSlideIndex]})` }}
                        >
                            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"></div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <>
                        <div className="absolute top-[-15%] right-[-5%] w-[900px] h-[900px] bg-emerald-600/20 rounded-full blur-[180px] animate-pulse"></div>
                        <div className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] bg-teal-600/15 rounded-full blur-[160px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
                    </>
                )}
            </div>

            {/* Floating Status Bar */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-10 md:left-20 flex items-center gap-5 py-4 px-8 glass-dark rounded-3xl border border-emerald-500/20 backdrop-blur-3xl"
            >
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                    <Shield size={28} className="text-white" />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-1">Security Protocol Active</div>
                    <div className="text-lg font-black tabular-nums">{time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                </div>
            </motion.div>

            <div className="z-10 container mx-auto flex flex-col items-center max-w-7xl">
                {/* Grand Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-20"
                >
                    {/* Header / Logo Area */}
                    <div className="text-center mb-16">
                        <div className={`w-32 h-32 mx-auto ${settings.logo ? 'bg-transparent' : 'bg-white rounded-full shadow-xl shadow-emerald-900/10'} flex items-center justify-center mb-6 overflow-hidden`}>
                            {settings.logo ? (
                                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-lg" />
                            ) : (
                                <School size={64} className="text-emerald-600" />
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                            {settings.unitName}
                        </h1>
                        <p className="text-xl text-emerald-200 font-bold tracking-widest uppercase drop-shadow-md">
                            {settings.schoolName}
                        </p>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
                        Welcome <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Visitor</span>
                    </h1>
                    <p className="text-2xl md:text-3xl text-emerald-200/60 font-bold max-w-3xl mx-auto leading-relaxed">
                        {settings.unitName} &bull; {settings.schoolName}
                    </p>
                </motion.div>

                {/* Dual Option Panel - Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mb-20">
                    {/* Option 1: Direct Tablet Entry */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
                        <div className="relative glass-dark p-14 rounded-[3rem] border border-emerald-500/20 h-full flex flex-col backdrop-blur-3xl">
                            <div className="flex items-start justify-between mb-10">
                                <div className="w-20 h-20 bg-emerald-600/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-xl">
                                    <Monitor size={40} className="text-emerald-400" />
                                </div>
                                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-emerald-500/20">Option A</span>
                            </div>

                            <h2 className="text-4xl font-black mb-5 leading-tight">Isi Formulir <br />di Tablet Ini</h2>
                            <p className="text-emerald-200/60 mb-12 text-lg font-medium flex-1 leading-relaxed">
                                Gunakan perangkat tablet ini untuk mengisi data kunjungan Anda secara langsung. Proses cepat dan mudah.
                            </p>

                            <Link to="/guest-form" className="btn-premium py-7 px-10 rounded-[2rem] text-2xl font-black shadow-emerald-500/30 group/btn bg-gradient-to-br from-emerald-700 to-emerald-600">
                                Start Registration <ChevronRight size={32} className="group-hover/btn:translate-x-3 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Option 2: QR Code Mobile Scan */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
                        <div className="relative glass-dark p-14 rounded-[3rem] border border-emerald-500/20 h-full flex flex-col items-center backdrop-blur-3xl">
                            <div className="w-full flex justify-between items-start mb-10">
                                <div className="w-20 h-20 bg-emerald-600/20 border border-emerald-500/30 rounded-3xl flex items-center justify-center backdrop-blur-xl">
                                    <Smartphone size={40} className="text-emerald-400" />
                                </div>
                                <div className="text-right">
                                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-emerald-500/20">Option B</span>
                                    <h2 className="text-4xl font-black mt-4 leading-tight text-right">Scan QR<br />dengan HP Anda</h2>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl mb-10 group-hover:scale-105 transition-transform duration-700 border-4 border-emerald-50">
                                {currentUrl && (
                                    <QRCode
                                        value={currentUrl}
                                        size={240}
                                        level="H"
                                        fgColor="#064e3b"
                                    />
                                )}
                            </div>

                            <p className="text-emerald-200/60 text-center font-bold text-lg leading-relaxed">
                                Scan kode QR di atas dengan smartphone Anda<br /> untuk membuka formulir secara private
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Controls */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap items-center justify-center gap-10 text-emerald-500/60"
                >
                    <Link to="/" className="flex items-center gap-3 hover:text-emerald-400 transition-colors font-black text-sm uppercase tracking-[0.3em]">
                        <ArrowLeft size={18} /> Exit Kiosk
                    </Link>
                    <div className="w-2 h-2 bg-emerald-800 rounded-full"></div>
                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em]">
                        <QrCode size={18} /> Terminal ID: MAN2-TIKEP
                    </div>
                    <div className="w-2 h-2 bg-emerald-800 rounded-full"></div>
                    <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.3em]">
                        <Clock size={18} /> {new Date().toLocaleDateString('id-ID', { year: 'numeric' })}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default KioskMode
