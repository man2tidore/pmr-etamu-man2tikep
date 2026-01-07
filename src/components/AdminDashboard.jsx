import React, { useState, useEffect } from 'react'
import {
    Users,
    UserCheck,
    Download,
    Trash2,
    Search,
    BarChart3,
    LogOut,
    FileText,
    FileSpreadsheet,
    Filter as FilterIcon,
    ShieldAlert,
    Calendar,
    Clock,
    ArrowRight,
    Settings,
    CheckCircle
} from 'lucide-react'
import { subscribeToGuests, deleteGuestEntry } from '../utils/storage'
import { motion, AnimatePresence } from 'framer-motion'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import AdminSettings from './AdminSettings'

const AdminDashboard = ({ onLogout }) => {
    const [entries, setEntries] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterPurpose, setFilterPurpose] = useState('Semua')
    const [activeTab, setActiveTab] = useState('dashboard')

    useEffect(() => {
        const unsubscribe = subscribeToGuests((data) => {
            setEntries(data)
        })
        return () => unsubscribe()
    }, [])

    const handleDelete = async (id) => {
        if (window.confirm('Hapus data kunjungan ini secara permanen?')) {
            await deleteGuestEntry(id)
        }
    }

    const filteredEntries = entries.filter(entry => {
        const matchesSearch =
            entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.institution.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterPurpose === 'Semua' || entry.purpose === filterPurpose
        return matchesSearch && matchesFilter
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredEntries.map(e => ({
            'Tanggal': new Date(e.timestamp).toLocaleDateString('id-ID'),
            'Waktu': new Date(e.timestamp).toLocaleTimeString('id-ID'),
            'Nama': e.name,
            'Instansi': e.institution,
            'No HP': e.phone,
            'Tujuan': e.purpose,
            'Keperluan': e.notes
        })))
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Rekap Tamu")
        XLSX.writeFile(wb, `E-Tamu_Data_${Date.now()}.xlsx`)
    }

    const exportToPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4')
        doc.setFontSize(18)
        doc.text('REKAPITULASI BUKU TAMU DIGITAL', 14, 15)
        doc.setFontSize(10)
        doc.text(`PMR MAN 2 KOTA TIDORE KEPULAUAN - Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 22)

        doc.autoTable({
            head: [['Tanggal', 'Waktu', 'Nama Tamu', 'Instansi', 'Tujuan', 'Kontak']],
            body: filteredEntries.map(e => [
                new Date(e.timestamp).toLocaleDateString('id-ID'),
                new Date(e.timestamp).toLocaleTimeString('id-ID'),
                e.name,
                e.institution,
                e.purpose,
                e.phone
            ]),
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [5, 150, 105], fontStyle: 'bold' },
            styles: { fontSize: 9 }
        })
        doc.save(`Laporan_Buku_Tamu.pdf`)
    }

    return (
        <div className="admin-container pt-32 pb-10 animate-fade-in">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-10">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all ${activeTab === 'dashboard'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-white text-slate-400 hover:text-slate-600 border-2 border-slate-100'
                        }`}
                >
                    <BarChart3 size={24} />
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all ${activeTab === 'settings'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-white text-slate-400 hover:text-slate-600 border-2 border-slate-100'
                        }`}
                >
                    <Settings size={24} />
                    Pengaturan
                </button>
            </div>

            {/* Conditional Content Rendering */}
            {activeTab === 'settings' ? (
                <AdminSettings />
            ) : (
                <>
                    {/* Header Section - Expanded */}
                    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-12">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 mb-4"
                            >
                                <span className="px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-[0.3em] rounded-full">
                                    System Administrator
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <Clock size={14} /> Live Sync Active
                                </div>
                            </motion.div>
                            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">Control Panel</h2>
                            <p className="text-xl text-slate-500 font-medium">Monitoring visitors and secure institutional records</p>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                                <button onClick={exportToPDF} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all">
                                    <FileText size={20} className="text-emerald-600" /> <span className="hidden sm:inline">Export PDF</span>
                                </button>
                                <div className="w-px h-8 bg-slate-100 mx-1 align-self-center my-auto"></div>
                                <button onClick={exportToExcel} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all">
                                    <FileSpreadsheet size={20} className="text-emerald-600" /> <span className="hidden sm:inline">Export Excel</span>
                                </button>
                            </div>
                            <button onClick={onLogout} className="btn-premium px-8 py-4 bg-slate-950 hover:bg-black transition-all">
                                <LogOut size={20} /> <span className="font-bold uppercase tracking-[0.1em]">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Hero Stats - Much Larger */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            { label: 'Total Visits', val: entries.length, icon: <Users size={40} />, color: 'bg-emerald-600 text-white' },
                            { label: 'Today Entries', val: entries.filter(e => e.timestamp.startsWith(new Date().toISOString().split('T')[0])).length, icon: <UserCheck size={40} />, color: 'bg-emerald-800 text-white' },
                            { label: 'Avg / Weekly', val: '12', icon: <Calendar size={40} />, color: 'bg-emerald-100 text-emerald-800' },
                            { label: 'Top Objective', val: filteredEntries[0]?.purpose || '-', icon: <BarChart3 size={40} />, color: 'bg-white text-emerald-600' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`card-premium relative group flex flex-col justify-between overflow-hidden p-10 min-h-[220px] ${stat.color === 'bg-white text-emerald-600' ? 'border-2 border-emerald-50' : ''}`}
                            >
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${stat.color.includes('bg-white') ? 'text-slate-400' : stat.color.includes('100') ? 'text-emerald-900/50' : 'text-white/60'}`}>{stat.label}</p>
                                    <h3 className={`text-5xl font-black ${stat.color.includes('bg-white') ? 'text-slate-900' : stat.color.includes('100') ? 'text-emerald-950' : 'text-white'}`}>{stat.val}</h3>
                                </div>
                                {/* Background Accent */}
                                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-[40px]"></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Table Area - Expanded Width & Sizes */}
                    <div className="card-premium p-0 border-none shadow-[0_40px_100px_-20px_rgba(6,95,70,0.1)] overflow-hidden">
                        <div className="p-10 lg:p-14 flex flex-col xl:flex-row gap-10 justify-between items-center bg-white border-b border-slate-50">
                            <div className="flex items-center gap-6">
                                <div className="w-2.5 h-12 bg-emerald-600 rounded-full"></div>
                                <div>
                                    <h4 className="text-3xl font-black text-slate-900">Activity Archives</h4>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Found {filteredEntries.length} verified records</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-5 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-[400px] group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={24} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, institution, or keyword..."
                                        className="input-premium pl-16 py-6 border-slate-100 bg-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="relative xl:w-[250px]">
                                    <FilterIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                                    <select
                                        className="input-premium pl-16 py-6 border-slate-100 bg-white appearance-none cursor-pointer"
                                        value={filterPurpose}
                                        onChange={(e) => setFilterPurpose(e.target.value)}
                                    >
                                        <option value="Semua">Display All Access</option>
                                        <option>Koordinasi Program</option>
                                        <option>Pemeriksaan Kesehatan</option>
                                        <option>Konsultasi Pembina</option>
                                        <option>Studi Banding</option>
                                        <option>Lainnya</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] border-y border-slate-100">
                                        <th className="px-6 py-6">Tanggal</th>
                                        <th className="px-6 py-6">Waktu</th>
                                        <th className="px-6 py-6">Nama Pengunjung</th>
                                        <th className="px-6 py-6">Jabatan</th>
                                        <th className="px-6 py-6">Instansi</th>
                                        <th className="px-6 py-6">Tujuan</th>
                                        <th className="px-6 py-6 min-w-[200px]">Pesan/Kesan</th>
                                        <th className="px-6 py-6 text-center">Paraf</th>
                                        <th className="px-6 py-6">Keterangan</th>
                                        <th className="px-6 py-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filteredEntries.map((entry) => (
                                            <motion.tr
                                                key={entry.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="hover:bg-emerald-50/20 transition-all duration-300 group"
                                            >
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="font-bold text-slate-600">
                                                        {new Date(entry.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg inline-block">
                                                        {new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="font-black text-slate-900 text-lg">{entry.name}</div>
                                                    <div className="text-xs text-slate-400 font-bold">{entry.phone}</div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="font-bold text-slate-600">{entry.position || '-'}</div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="font-bold text-slate-700 capitalize">{entry.institution}</div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${entry.purpose === 'Koordinasi Program' ? 'bg-blue-50 text-blue-600' :
                                                        entry.purpose === 'Pemeriksaan Kesehatan' ? 'bg-red-50 text-red-600' :
                                                            'bg-emerald-50 text-emerald-600'
                                                        }`}>
                                                        {entry.purpose}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="text-sm font-medium text-slate-500 max-w-[200px] line-clamp-2 italic">
                                                        "{entry.notes || '-'}"
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 align-middle text-center">
                                                    <div className="flex justify-center">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                                                            <CheckCircle size={20} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 align-middle">
                                                    <div className="text-sm font-bold text-slate-500">{entry.remarks || '-'}</div>
                                                </td>
                                                <td className="px-10 lg:px-14 py-10 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white hover:bg-rose-600 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                                                        >
                                                            <Trash2 size={20} />
                                                            <span className="hidden xxl:inline">Nullify</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                    {filteredEntries.length === 0 && (
                                        <tr className="animate-fade-in">
                                            <td colSpan="10" className="px-14 py-32 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                                                        <ShieldAlert size={48} className="text-slate-200" strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-black text-slate-900">Archive Empty</p>
                                                        <p className="text-slate-400 font-medium mt-2">No matching security records found in database.</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AdminDashboard
