
import React, { useState, useEffect } from 'react';
import { Institution, StudentRecord, FormData } from './types';
import { AdmissionForm } from './components/AdmissionForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

// PDF Template component
const PDFTemplate: React.FC<{ data: StudentRecord | null, settings: any }> = ({ data, settings }) => {
  if (!data) return null;

  const isMTs = data.institution === 'MTs';
  const madrasahName = isMTs ? 'MADRASAH TSANAWIYAH DARUL HUDA' : 'MADRASAH ALIYAH DARUL HUDA';
  const nsm = isMTs ? '121235060001' : '131235060001';
  const npsn = isMTs ? '20580001' : '20580002';
  const logoSrc = isMTs ? settings?.logoMts : settings?.logoMa;

  const checkFile = (file: string | undefined) => file ? '☑' : '☐';

  return (
    <div id="pdf-content" style={{ width: '210mm', padding: '15mm', background: 'white', color: 'black', fontFamily: 'Times New Roman', fontSize: '11pt', lineHeight: '1.4', position: 'relative' }}>
      {/* KOP SURAT */}
      <div className="pdf-header" style={{ display: 'flex', alignItems: 'center', borderBottom: '3px double black', paddingBottom: '10px', marginBottom: '15px' }}>
        {logoSrc && (
          <img src={logoSrc} style={{ height: '75px', marginRight: '20px' }} />
        )}
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          <h2 style={{ margin: '0', fontSize: '16pt', fontWeight: 'bold' }}>YAYASAN PONDOK PESANTREN DARUL HUDA</h2>
          <h1 style={{ margin: '2px 0', fontSize: '20pt', fontWeight: 'bold' }}>{madrasahName}</h1>
          <p style={{ margin: '0', fontSize: '10pt' }}>Jl. Darul Huda No. 123, Kabupaten Kediri, Jawa Timur</p>
          <p style={{ margin: '0', fontSize: '10pt', fontWeight: 'bold' }}>NSM: {nsm} | NPSN: {npsn}</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h3 style={{ textDecoration: 'underline', margin: '0', fontSize: '14pt', fontWeight: 'bold' }}>FORMULIR PENDAFTARAN PESERTA DIDIK BARU</h3>
        <p style={{ margin: '2px 0', fontSize: '11pt' }}>Tahun Pelajaran {settings?.tahunPelajaran || '2024/2025'}</p>
      </div>

      {/* POSISI FOTO DI LAPISAN PALING ATAS KONTEN (TOP-RIGHT) */}
      <div style={{ 
        position: 'absolute', 
        top: '125mm', // Menyesuaikan agar berada di pojok kanan bawah Kop/Judul
        right: '15mm', 
        width: '3cm', 
        height: '4cm', 
        border: '1px solid black', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        zIndex: 50,
        backgroundColor: '#fff'
      }}>
        {data.fileFoto ? (
          <img src={data.fileFoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '8pt', textAlign: 'center' }}>PAS FOTO<br/>3 x 4</span>
        )}
      </div>

      {/* I. DATA CALON PESERTA DIDIK - DINAIKKAN DAN DIRAPATKAN */}
      <div style={{ marginBottom: '8px' }}>
        <h4 style={{ background: '#f0f0f0', padding: '4px 8px', margin: '0 0 5px 0', fontSize: '11pt', border: '1px solid #000', fontWeight: 'bold' }}>I. DATA CALON PESERTA DIDIK</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '5px' }}>
          <tbody>
            <tr><td style={{ width: '180px', padding: '2px 0' }}>Nomor Pendaftaran</td><td>: <strong>{data.id.toUpperCase()}</strong></td></tr>
            <tr><td style={{ padding: '2px 0' }}>Nama Lengkap</td><td>: {data.fullName.toUpperCase()}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Jenis Kelamin</td><td>: {data.jenisKelamin}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Tempat, Tanggal Lahir</td><td>: {data.tempatLahir}, {data.tanggalLahir}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Tingkat / Rombel</td><td>: {data.tingkatRombel}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Alamat Domisili</td><td style={{ lineHeight: '1.1' }}>: {data.alamat}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Nomor HP / WA</td><td>: {data.noTelepon}</td></tr>
          </tbody>
        </table>
      </div>

      {/* II. DATA ORANG TUA / WALI */}
      <div style={{ marginBottom: '8px' }}>
        <h4 style={{ background: '#f0f0f0', padding: '4px 8px', margin: '0 0 5px 0', fontSize: '11pt', border: '1px solid #000', fontWeight: 'bold' }}>II. DATA ORANG TUA / WALI</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginLeft: '5px' }}>
          <tbody>
            <tr><td style={{ width: '180px', padding: '2px 0' }}>Nama Ayah Kandung</td><td>: {data.namaAyah}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Pekerjaan Ayah</td><td>: {data.pekerjaanAyah}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Nama Ibu Kandung</td><td>: {data.namaIbu}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Pekerjaan Ibu</td><td>: {data.pekerjaanIbu}</td></tr>
            <tr><td style={{ padding: '2px 0' }}>Nomor HP Ortu</td><td>: {data.noHpAyah || data.noHpIbu}</td></tr>
            {data.namaWali && (
              <>
                <tr><td style={{ padding: '2px 0' }}>Nama Wali</td><td>: {data.namaWali}</td></tr>
                <tr><td style={{ padding: '2px 0' }}>Pekerjaan Wali</td><td>: {data.pekerjaanWali}</td></tr>
              </>
            )}
            <tr><td style={{ padding: '2px 0' }}>Status KIP/PIP</td><td>: {data.statusKipPip === 'Ada' ? `ADA (${data.nomorKipPip})` : 'TIDAK ADA'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* III. KETERANGAN KELENGKAPAN BERKAS */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ background: '#f0f0f0', padding: '4px 8px', margin: '0 0 5px 0', fontSize: '11pt', border: '1px solid #000', fontWeight: 'bold' }}>III. KETERANGAN KELENGKAPAN BERKAS</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', fontSize: '10pt', padding: '2px 8px' }}>
          <div>{checkFile(data.fileAkta)} Fotocopy Akta Kelahiran</div>
          <div>{checkFile(data.fileFoto)} Pas Foto 3x4 (Backgroud Merah)</div>
          <div>{checkFile(data.fileKK)} Fotocopy Kartu Keluarga</div>
          <div>{checkFile(data.fileKtpOrtu)} Fotocopy KTP Orang Tua / Wali</div>
          <div>{checkFile(data.fileIjazah)} Fotocopy Ijazah/SKL (Legalisir)</div>
          <div>{checkFile(data.fileKipPip)} Fotocopy KIP/PIP/PKH {data.statusKipPip !== 'Ada' ? '(N/A)' : ''}</div>
        </div>
      </div>

      {/* TANDA TANGAN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0' }}>Mengetahui,</p>
            <p style={{ margin: '0 0 65px 0' }}>Orang Tua / Wali Murid</p>
            <p style={{ fontWeight: 'bold' }}>( ............................................ )</p>
        </div>
        <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0' }}>Kediri, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style={{ margin: '0 0 65px 0' }}>Calon Peserta Didik</p>
            <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>( {data.fullName.toUpperCase()} )</p>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '15mm', width: 'calc(100% - 30mm)', fontSize: '9pt', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '5px', textAlign: 'center' }}>
        * Dokumen ini dicetak otomatis melalui Sistem PPDB Online Darul Huda pada {new Date().toLocaleString('id-ID')}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'form' | 'success' | 'adminLogin' | 'adminDashboard'>('landing');
  const [institution, setInstitution] = useState<Institution>('MTs');
  const [currentRegistration, setCurrentRegistration] = useState<StudentRecord | null>(null);
  const [allRegistrations, setAllRegistrations] = useState<StudentRecord[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [systemSettings, setSystemSettings] = useState<any>(null);

  // Load data & settings from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('darul_huda_ppdb_data');
    if (saved) {
      setAllRegistrations(JSON.parse(saved));
    }
    const savedSettings = localStorage.getItem('darul_huda_settings');
    if (savedSettings) {
      setSystemSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleStartRegistration = (inst: Institution) => {
    setInstitution(inst);
    setView('form');
  };

  const handleSubmit = (data: FormData) => {
    const newRecord: StudentRecord = {
      ...data,
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      registrationDate: new Date().toISOString(),
      umur: Number(data.umur)
    };
    
    const updated = [...allRegistrations, newRecord];
    setAllRegistrations(updated);
    localStorage.setItem('darul_huda_ppdb_data', JSON.stringify(updated));
    
    setCurrentRegistration(newRecord);
    setView('success');
  };

  const handleDownloadPdf = () => {
    if (!currentRegistration) return;
    setIsGeneratingPdf(true);
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0,
      filename: `PPDB_${currentRegistration.institution}_${currentRegistration.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (element) {
        element.style.display = 'block';
        // @ts-ignore
        html2pdf().set(opt).from(element).save().then(() => {
            element.style.display = 'none';
            setIsGeneratingPdf(false);
        });
    }
  };

  const renderHeader = () => {
    if (view === 'adminDashboard') return null;
    return (
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 transform rotate-3 overflow-hidden">
              {systemSettings?.logoApp ? (
                <img src={systemSettings.logoApp} className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-mosque text-white text-2xl"></i>
              )}
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-800 leading-tight uppercase tracking-tight">PPDB Darul Huda</h1>
              <p className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">{systemSettings?.tahunPelajaran || 'PORTAL RESMI'}</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={() => setView('landing')} className={`hover:text-emerald-600 transition-colors ${view === 'landing' ? 'text-emerald-600' : ''}`}>Beranda</button>
            <button onClick={() => setView('adminLogin')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 flex items-center gap-2">
              <i className="fas fa-user-shield text-xs"></i>
              Login Admin
            </button>
          </nav>
        </div>
      </header>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
         <PDFTemplate data={currentRegistration} settings={systemSettings} />
      </div>

      {renderHeader()}

      <main className="flex-grow">
        {view === 'landing' && (
          <div className="max-w-6xl mx-auto py-16 px-4 animate-in fade-in duration-500">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                Membangun Generasi Rabbani di <span className="text-emerald-600">Darul Huda</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto italic">Sistem pendaftaran santri baru terintegrasi Jenjang MTs & MA.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => handleStartRegistration('MTs')}>
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 text-2xl group-hover:scale-110 transition-transform overflow-hidden">
                  {systemSettings?.logoMts ? <img src={systemSettings.logoMts} className="w-full h-full object-contain" /> : <i className="fas fa-book-open"></i>}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">MTs Darul Huda</h3>
                <p className="text-slate-500 mb-8">Tingkat Madrasah Tsanawiyah dengan kurikulum pesantren unggulan.</p>
                <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-50">Daftar MTs</button>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group" onClick={() => handleStartRegistration('MA')}>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 text-2xl group-hover:scale-110 transition-transform overflow-hidden">
                   {systemSettings?.logoMa ? <img src={systemSettings.logoMa} className="w-full h-full object-contain" /> : <i className="fas fa-graduation-cap"></i>}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">MA Darul Huda</h3>
                <p className="text-slate-500 mb-8">Tingkat Madrasah Aliyah mempersiapkan lulusan berkualitas akademik.</p>
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-50">Daftar MA</button>
              </div>
            </div>
          </div>
        )}

        {view === 'form' && (
          <div className="py-12">
            <AdmissionForm institution={institution} onSubmit={handleSubmit} onCancel={() => setView('landing')} />
          </div>
        )}

        {view === 'success' && (
          <div className="flex items-center justify-center py-20 px-4">
            <div className="max-w-xl w-full bg-white p-12 rounded-[2.5rem] text-center shadow-2xl animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl"><i className="fas fa-check"></i></div>
              <h2 className="text-3xl font-black text-slate-800 mb-4">Pendaftaran Berhasil!</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">Terima kasih <strong>{currentRegistration?.fullName}</strong>. Data Anda sudah tersimpan di sistem kami.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-3">
                  {isGeneratingPdf ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
                  Unduh Bukti Pendaftaran (PDF)
                </button>
                <button onClick={() => setView('landing')} className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Kembali</button>
              </div>
            </div>
          </div>
        )}

        {view === 'adminLogin' && (
          <AdminLogin onLogin={() => setView('adminDashboard')} onBack={() => setView('landing')} />
        )}

        {view === 'adminDashboard' && (
          <AdminDashboard data={allRegistrations} onLogout={() => setView('landing')} />
        )}
      </main>

      {view !== 'adminDashboard' && (
        <footer className="bg-slate-900 text-slate-400 py-12 px-4">
          <div className="max-w-7xl mx-auto text-center text-xs tracking-widest uppercase font-bold">
            &copy; 2024 DARUL HUDA KEDIRI. ALL RIGHTS RESERVED.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
