
import React, { useState, useEffect } from 'react';
import { StudentRecord } from '../types';

interface Props {
  data: StudentRecord[];
  onLogout: () => void;
}

type Menu = 'data' | 'berkas' | 'pengaturan';

interface SystemSettings {
  logoMts: string;
  logoMa: string;
  logoApp: string;
  tahunPelajaran: string;
  gelombangStatus: string;
}

export const AdminDashboard: React.FC<Props> = ({ data, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState<Menu>('data');
  const [selectedFile, setSelectedFile] = useState<{ name: string; data: string } | null>(null);
  const [settings, setSettings] = useState<SystemSettings>({
    logoMts: '',
    logoMa: '',
    logoApp: '',
    tahunPelajaran: '2024/2025',
    gelombangStatus: 'Buka',
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('darul_huda_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, key: keyof SystemSettings) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({ ...prev, [key]: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('darul_huda_settings', JSON.stringify(settings));
    alert('Pengaturan berhasil disimpan!');
    window.location.reload(); 
  };

  const downloadFile = (base64Data: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const FileItem: React.FC<{ label: string; fileData?: string; fileName: string }> = ({ label, fileData, fileName }) => {
    if (!fileData) return (
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 opacity-60">
        <div className="flex items-center gap-3">
          <i className="fas fa-file-excel text-slate-300"></i>
          <span className="text-xs font-semibold text-slate-400">{label} (Belum Ada)</span>
        </div>
      </div>
    );

    const isPdf = fileData.includes('application/pdf');

    return (
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPdf ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
            <i className={`fas ${isPdf ? 'fa-file-pdf' : 'fa-file-image'}`}></i>
          </div>
          <span className="text-xs font-bold text-slate-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedFile({ name: label, data: fileData })}
            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Lihat Berkas"
          >
            <i className="fas fa-eye text-xs"></i>
          </button>
          <button 
            onClick={() => downloadFile(fileData, fileName)}
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Unduh Berkas"
          >
            <i className="fas fa-download text-xs"></i>
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'data':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Data Siswa Baru</h2>
              <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
                Total: {data.length} Pendaftar
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Lembaga</th>
                      <th className="px-6 py-4">Nama Lengkap</th>
                      <th className="px-6 py-4">Tingkat</th>
                      <th className="px-6 py-4">Tanggal Daftar</th>
                      <th className="px-6 py-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data pendaftar.</td>
                      </tr>
                    ) : (
                      data.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-emerald-600">{item.id}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.institution === 'MTs' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              {item.institution}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">{item.fullName}</td>
                          <td className="px-6 py-4">{item.tingkatRombel}</td>
                          <td className="px-6 py-4">{new Date(item.registrationDate).toLocaleDateString('id-ID')}</td>
                          <td className="px-6 py-4">
                            <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'berkas':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-800 mb-8">Arsip Digital Berkas Siswa</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {data.map((item) => (
                <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  {/* Student Folder Info Sidebar */}
                  <div className="w-full md:w-64 bg-slate-50/50 p-8 border-r border-slate-100 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border-4 border-white mb-6 overflow-hidden relative group">
                      {item.fileFoto ? (
                        <img src={item.fileFoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <i className="fas fa-user-graduate text-3xl"></i>
                        </div>
                      )}
                    </div>
                    <div className="mb-6">
                      <h3 className="font-black text-slate-800 leading-tight mb-1">{item.fullName}</h3>
                      <p className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">{item.institution} - {item.id}</p>
                    </div>
                    <div className="w-full space-y-2 mt-auto">
                      <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">STATUS</span>
                        <span className="text-[10px] font-black text-emerald-600">VERIFIKASI</span>
                      </div>
                    </div>
                  </div>

                  {/* Files Grid (The "Folder" Content) */}
                  <div className="flex-grow p-8 bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-folder-open text-emerald-500"></i> Dokumen Terlampir
                      </span>
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500">
                        { [item.fileAkta, item.fileKK, item.fileIjazah, item.fileFoto, item.fileKtpOrtu, item.fileKipPip].filter(Boolean).length } / 6 Berkas
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <FileItem label="Pas Foto 3x4" fileData={item.fileFoto} fileName={`Foto_${item.fullName}.jpg`} />
                      <FileItem label="Akta Kelahiran" fileData={item.fileAkta} fileName={`Akta_${item.fullName}`} />
                      <FileItem label="Kartu Keluarga" fileData={item.fileKK} fileName={`KK_${item.fullName}`} />
                      <FileItem label="Ijazah / SKL" fileData={item.fileIjazah} fileName={`Ijazah_${item.fullName}`} />
                      <FileItem label="KTP Orang Tua" fileData={item.fileKtpOrtu} fileName={`KTP_Ortu_${item.fullName}`} />
                      {item.statusKipPip === 'Ada' && (
                        <FileItem label="Kartu KIP/PIP" fileData={item.fileKipPip} fileName={`KIP_PIP_${item.fullName}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <div className="col-span-full py-32 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-3xl mb-4">
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Belum ada berkas pendaftar</h3>
                  <p className="text-slate-300 max-w-xs mt-2">Data pendaftar akan muncul di sini setelah ada santri yang mengisi formulir.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'pengaturan':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-800 mb-8">Pengaturan Sistem</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Logo Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <i className="fas fa-image text-emerald-600"></i> Manajemen Logo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo Aplikasi */}
                    <div className="flex flex-col items-center text-center space-y-4">
                      <label className="text-sm font-bold text-slate-600">Logo Aplikasi</label>
                      <div className="relative group cursor-pointer w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all">
                        {settings.logoApp ? (
                          <img src={settings.logoApp} className="w-full h-full object-contain" />
                        ) : (
                          <i className="fas fa-plus text-slate-300 text-xl"></i>
                        )}
                        <input type="file" onChange={(e) => handleLogoUpload(e, 'logoApp')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Format PNG/SVG disarankan</p>
                    </div>

                    {/* Logo MTs */}
                    <div className="flex flex-col items-center text-center space-y-4">
                      <label className="text-sm font-bold text-slate-600">Logo MTs</label>
                      <div className="relative group cursor-pointer w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all">
                        {settings.logoMts ? (
                          <img src={settings.logoMts} className="w-full h-full object-contain" />
                        ) : (
                          <i className="fas fa-plus text-slate-300 text-xl"></i>
                        )}
                        <input type="file" onChange={(e) => handleLogoUpload(e, 'logoMts')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Tampil pada Kop Surat MTs</p>
                    </div>

                    {/* Logo MA */}
                    <div className="flex flex-col items-center text-center space-y-4">
                      <label className="text-sm font-bold text-slate-600">Logo MA</label>
                      <div className="relative group cursor-pointer w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-all">
                        {settings.logoMa ? (
                          <img src={settings.logoMa} className="w-full h-full object-contain" />
                        ) : (
                          <i className="fas fa-plus text-slate-300 text-xl"></i>
                        )}
                        <input type="file" onChange={(e) => handleLogoUpload(e, 'logoMa')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      </div>
                      <p className="text-[10px] text-slate-400 italic">Tampil pada Kop Surat MA</p>
                    </div>
                  </div>
                </div>

                {/* Form Settings Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <i className="fas fa-file-signature text-emerald-600"></i> Informasi Pendaftaran
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tahun Pelajaran</label>
                      <input 
                        type="text" 
                        value={settings.tahunPelajaran} 
                        onChange={(e) => setSettings(prev => ({...prev, tahunPelajaran: e.target.value}))}
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Status Gelombang</label>
                      <select 
                        value={settings.gelombangStatus}
                        onChange={(e) => setSettings(prev => ({...prev, gelombangStatus: e.target.value}))}
                        className="w-full px-5 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                      >
                        <option value="Buka">Buka</option>
                        <option value="Tutup">Tutup</option>
                        <option value="Segera">Akan Datang</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Sidebar Settings */}
              <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Keamanan</h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                      <span className="text-sm font-bold text-slate-600">Ubah Password Admin</span>
                      <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500"></i>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                      <span className="text-sm font-bold text-slate-600">Pengaturan Notifikasi</span>
                      <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500"></i>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={saveSettings}
                  className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <i className="fas fa-save"></i>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800">Pratinjau: {selectedFile.name}</h3>
              <button onClick={() => setSelectedFile(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-grow overflow-auto p-4 bg-slate-50 flex items-center justify-center">
              {selectedFile.data.includes('application/pdf') ? (
                <iframe src={selectedFile.data} className="w-full h-full min-h-[60vh] rounded-xl shadow-lg" title="PDF Viewer"></iframe>
              ) : (
                <img src={selectedFile.data} className="max-w-full max-h-full object-contain rounded-xl shadow-lg" alt="Preview" />
              )}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => downloadFile(selectedFile.data, `${selectedFile.name.replace(/\s+/g, '_')}_Document`)}
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-700 transition-all"
              >
                <i className="fas fa-download"></i> Unduh File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 fixed h-full z-10 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              {settings.logoApp ? (
                <img src={settings.logoApp} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-cog text-white text-lg"></i>
              )}
            </div>
            <span className="font-black text-slate-800 tracking-tight">ADMIN PANEL</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'data', icon: 'fa-users', label: 'Data Siswa Baru' },
              { id: 'berkas', icon: 'fa-folder-open', label: 'Berkas Siswa Baru' },
              { id: 'pengaturan', icon: 'fa-sliders', label: 'Pengaturan' },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id as Menu)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold text-sm ${
                  activeMenu === menu.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-emerald-600'
                }`}
              >
                <i className={`fas ${menu.icon} w-5`}></i>
                {menu.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 p-4 md:p-12">
        <header className="flex justify-between items-center mb-12">
           <div>
             <h1 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">Dashboard</h1>
             <p className="text-slate-400 text-sm font-medium">Selamat datang, Administrator Darul Huda</p>
           </div>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all cursor-pointer">
               <i className="fas fa-bell"></i>
             </div>
             <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-100">
               <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {settings.logoApp ? <img src={settings.logoApp} className="w-full h-full object-cover" /> : 'A'}
               </div>
               <span className="text-xs font-bold text-slate-700">Admin Utama</span>
             </div>
           </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};
