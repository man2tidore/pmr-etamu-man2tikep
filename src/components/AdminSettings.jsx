import React, { useState, useEffect, useRef } from 'react'
import { Save, CheckCircle, Settings as SettingsIcon, School, Target, Upload, Image as ImageIcon, Lock, Eye, EyeOff } from 'lucide-react'
import { getAppSettings, updateAppSettings } from '../utils/storage'
import { motion, AnimatePresence } from 'framer-motion'

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        visi: '',
        misi: '',
        schoolName: '',
        unitName: '',
        logo: ''
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const fileInputRef = useRef(null)


    useEffect(() => {
        const fetchSettings = async () => {
            const currentSettings = await getAppSettings()
            setSettings({
                visi: currentSettings.visi || '',
                misi: currentSettings.misi || '',
                schoolName: currentSettings.schoolName || '',
                unitName: currentSettings.unitName || '',
                logo: currentSettings.logo || '',
            })
        }
        fetchSettings()
    }, [])

    const handleLogoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Hanya file gambar yang diperbolehkan!')
                return
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file maksimal 2MB!')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setSettings({ ...settings, logo: reader.result })
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setPasswordError('')

        const currentSettings = await getAppSettings()

        // Validate current password
        if (passwordData.currentPassword !== currentSettings.adminPassword) {
            setPasswordError('Password saat ini salah!')
            return
        }

        // Validate new password
        if (passwordData.newPassword.length < 4) {
            setPasswordError('Password baru minimal 4 karakter!')
            return
        }

        // Validate confirmation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Password baru dan konfirmasi tidak cocok!')
            return
        }

        // Update password
        await updateAppSettings({ adminPassword: passwordData.newPassword })
        setPasswordSuccess(true)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setPasswordSuccess(false), 3000)
    }

    const handleSave = (e) => {
        e.preventDefault()
        setLoading(true)

        // Use async operations immediately, no need for artificial timeout unless desired for UX
        const save = async () => {
            await updateAppSettings(settings)
            setLoading(false)
            setSaved(true)
            // window.dispatchEvent(new Event('settingsUpdated')) // Deprecated
            setTimeout(() => setSaved(false), 3000)
        }
        save()
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 mb-3">Pengaturan Aplikasi</h2>
                    <p className="text-lg text-slate-500 font-medium">Kelola informasi institusi dan konten aplikasi</p>
                </div>
                <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center">
                    <SettingsIcon size={40} />
                </div>
            </div>

            {/* Success Notification */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-4 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl"
                    >
                        <CheckCircle className="text-emerald-600" size={28} />
                        <div>
                            <div className="text-lg font-black text-emerald-900">Berhasil Disimpan!</div>
                            <div className="text-sm text-emerald-700 font-medium">Perubahan telah tersimpan ke sistem</div>
                        </div>
                    </motion.div>
                )}
                {passwordSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-4 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl"
                    >
                        <CheckCircle className="text-emerald-600" size={28} />
                        <div>
                            <div className="text-lg font-black text-emerald-900">Password Berhasil Diubah!</div>
                            <div className="text-sm text-emerald-700 font-medium">Gunakan password baru untuk login selanjutnya</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings Form */}
            <form onSubmit={handleSave} className="space-y-8">
                {/* Logo Upload */}
                <div className="card-premium p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <ImageIcon className="text-emerald-600" size={28} />
                        <h3 className="text-3xl font-black text-slate-900">Logo Institusi</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Logo Preview */}
                        <div className="flex-shrink-0">
                            <div className="w-48 h-48 bg-slate-50 rounded-3xl border-4 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                                {settings.logo ? (
                                    <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="text-center p-6">
                                        <ImageIcon size={48} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400 font-medium">Belum ada logo</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1 space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-secondary px-8 py-4 text-lg flex items-center gap-3 border-2"
                            >
                                <Upload size={24} />
                                Pilih Logo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Institution Info */}
                <div className="card-premium p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <School className="text-emerald-600" size={28} />
                        <h3 className="text-3xl font-black text-slate-900">Informasi Institusi</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="label-premium">Nama Sekolah/Madrasah</label>
                            <input
                                type="text"
                                className="input-premium"
                                value={settings.schoolName}
                                onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                                placeholder="Contoh: MAN 2 Kota Tidore Kepulauan"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="label-premium">Nama Unit</label>
                            <input
                                type="text"
                                className="input-premium"
                                value={settings.unitName}
                                onChange={(e) => setSettings({ ...settings, unitName: e.target.value })}
                                placeholder="Contoh: PMR (Palang Merah Remaja)"
                            />
                        </div>
                    </div>
                </div>

                {/* Vision & Mission */}
                <div className="card-premium p-10">
                    <div className="flex items-center gap-3 mb-8">
                        <Target className="text-emerald-600" size={28} />
                        <h3 className="text-3xl font-black text-slate-900">Visi & Misi Organisasi</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="label-premium">Visi</label>
                            <textarea
                                className="input-premium min-h-[150px] font-medium leading-relaxed"
                                value={settings.visi}
                                onChange={(e) => setSettings({ ...settings, visi: e.target.value })}
                                placeholder="Tuliskan visi organisasi PMR Anda di sini..."
                            />
                            <p className="text-sm text-slate-400 font-medium">Visi adalah pandangan jauh ke depan tentang tujuan organisasi</p>
                        </div>

                        <div className="space-y-3">
                            <label className="label-premium">Misi</label>
                            <textarea
                                className="input-premium min-h-[200px] font-medium leading-relaxed"
                                value={settings.misi}
                                onChange={(e) => setSettings({ ...settings, misi: e.target.value })}
                                placeholder="Tuliskan misi organisasi PMR Anda di sini (pisahkan dengan enter untuk multiple lines)..."
                            />
                            <p className="text-sm text-slate-400 font-medium">Misi adalah langkah-langkah konkret untuk mencapai visi</p>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-premium px-12 py-5 text-xl shadow-emerald-500/30 flex items-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save size={24} />
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Password Change Section */}
            <div className="card-premium p-10 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-8">
                    <Lock className="text-emerald-600" size={28} />
                    <h3 className="text-3xl font-black text-slate-900">Keamanan</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-2xl">
                    {passwordError && (
                        <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-xl text-rose-700 font-bold">
                            {passwordError}
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="label-premium">Password Saat Ini</label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                className="input-premium pr-14"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Masukkan password lama"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="label-premium">Password Baru</label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                className="input-premium pr-14"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Minimal 4 karakter"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="label-premium">Konfirmasi Password Baru</label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                className="input-premium pr-14"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Ketik ulang password baru"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-premium px-10 py-4 text-lg bg-slate-900 hover:bg-black flex items-center gap-3"
                    >
                        <Lock size={20} />
                        Ubah Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AdminSettings
