
import React, { useState, useEffect } from 'react';
import { Input } from './Input';
import { Institution, Gender, FormData } from '../types';

interface Props {
  institution: Institution;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const initialForm: FormData = {
  institution: 'MTs',
  fullName: '',
  tempatLahir: '',
  tanggalLahir: '',
  tingkatRombel: '',
  umur: '',
  status: 'Pendaftar Baru',
  jenisKelamin: Gender.LakiLaki,
  alamat: '',
  noTelepon: '',
  kebutuhanKhusus: 'Tidak Ada',
  disabilitas: 'Tidak Ada',
  statusKipPip: 'Tidak Ada',
  nomorKipPip: '',
  namaAyah: '',
  pendidikanAyah: '',
  pekerjaanAyah: '',
  alamatAyah: '',
  noHpAyah: '',
  namaIbu: '',
  pendidikanIbu: '',
  pekerjaanIbu: '',
  alamatIbu: '',
  noHpIbu: '',
  namaWali: '',
  pendidikanWali: '',
  pekerjaanWali: '',
  alamatWali: '',
  noHpWali: '',
  fileAkta: '',
  fileKK: '',
  fileIjazah: '',
  fileFoto: '',
  fileKtpOrtu: '',
  fileKipPip: '',
};

const PENDIDIKAN_OPTIONS = [
  "Tidak Sekolah", "SD / Sederajat", "SMP / Sederajat", "SMA / Sederajat", 
  "D1", "D2", "D3", "D4 / S1", "S2", "S3"
];

const PEKERJAAN_OPTIONS = [
  "Tidak Bekerja", "Ibu Rumah Tangga", "PNS", "TNI/Polri", "Karyawan Swasta", 
  "Wiraswasta", "Petani", "Buruh", "Pedagang", "Lainnya"
];

export const AdmissionForm: React.FC<Props> = ({ institution, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({ ...initialForm, institution });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.tanggalLahir) {
      const birthDate = new Date(formData.tanggalLahir);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, umur: age >= 0 ? age : 0 }));
    }
  }, [formData.tanggalLahir]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        
        // Convert to base64 for PDF preview/generation
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({ ...prev, [name]: event.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-xl border border-emerald-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Formulir Pendaftaran {institution}</h2>
          <p className="text-slate-500">Silakan lengkapi data dan unggah berkas calon peserta didik.</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-sm ${institution === 'MTs' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
          {institution} DARUL HUDA
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Identitas Pribadi */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <span className="bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">Identitas Pribadi</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Lengkap" name="fullName" value={formData.fullName} onChange={handleChange} required icon="fas fa-user" placeholder="Nama Sesuai Akta Kelahiran" />
            <Input label="Jenis Kelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} as="select" icon="fas fa-venus-mars">
              <option value={Gender.LakiLaki}>{Gender.LakiLaki}</option>
              <option value={Gender.Perempuan}>{Gender.Perempuan}</option>
            </Input>
            <Input label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required icon="fas fa-map-marker-alt" placeholder="Kota/Kabupaten" />
            <Input label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleChange} required icon="fas fa-calendar" />
            <Input label="Umur" name="umur" value={formData.umur} readOnly icon="fas fa-clock" className="bg-slate-50/50" />
            <Input label="Tingkat - Rombel" name="tingkatRombel" value={formData.tingkatRombel} onChange={handleChange} required icon="fas fa-users" placeholder="Contoh: VII-A atau X-IPA-1" />
            <Input label="Status" name="status" value={formData.status} onChange={handleChange} as="select" icon="fas fa-info-circle">
              <option value="Pendaftar Baru">Pendaftar Baru</option>
              <option value="Pindahan">Pindahan</option>
            </Input>
            <Input label="No Telepon / WhatsApp" name="noTelepon" value={formData.noTelepon} onChange={handleChange} required icon="fas fa-phone" placeholder="08xxxxxxxxxx" />
          </div>
          <div className="mt-4">
             <Input label="Alamat Lengkap Siswa" name="alamat" value={formData.alamat} onChange={handleChange} required as="textarea" icon="fas fa-home" placeholder="Dusun, RT/RW, Desa, Kecamatan, Kabupaten" rows={2} />
          </div>
        </section>

        {/* Section 2: Data Orang Tua / Wali */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <span className="bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">Data Orang Tua / Wali</h3>
          </div>
          
          <div className="space-y-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-male text-emerald-600"></i> Data Ayah Kandung
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Nama Ayah" name="namaAyah" value={formData.namaAyah} onChange={handleChange} required placeholder="Nama Lengkap" />
                <Input label="No HP Ayah" name="noHpAyah" value={formData.noHpAyah} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Pendidikan" name="pendidikanAyah" value={formData.pendidikanAyah} onChange={handleChange} as="select" required>
                  <option value="">Pilih Pendidikan</option>
                  {PENDIDIKAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
                <Input label="Pekerjaan" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleChange} as="select" required>
                  <option value="">Pilih Pekerjaan</option>
                  {PEKERJAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
              </div>
              <Input label="Alamat Lengkap Ayah" name="alamatAyah" value={formData.alamatAyah} onChange={handleChange} required as="textarea" placeholder="Alamat lengkap ayah" rows={2} />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-female text-emerald-600"></i> Data Ibu Kandung
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Nama Ibu" name="namaIbu" value={formData.namaIbu} onChange={handleChange} required placeholder="Nama Lengkap" />
                <Input label="No HP Ibu" name="noHpIbu" value={formData.noHpIbu} onChange={handleChange} required placeholder="08xxxxxxxxxx" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Pendidikan" name="pendidikanIbu" value={formData.pendidikanIbu} onChange={handleChange} as="select" required>
                  <option value="">Pilih Pendidikan</option>
                  {PENDIDIKAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
                <Input label="Pekerjaan" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleChange} as="select" required>
                  <option value="">Pilih Pekerjaan</option>
                  {PEKERJAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
              </div>
              <Input label="Alamat Lengkap Ibu" name="alamatIbu" value={formData.alamatIbu} onChange={handleChange} required as="textarea" placeholder="Alamat lengkap ibu" rows={2} />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-user-shield text-emerald-600"></i> Data Wali (Opsional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Nama Wali" name="namaWali" value={formData.namaWali} onChange={handleChange} placeholder="Nama Lengkap" />
                <Input label="No HP Wali" name="noHpWali" value={formData.noHpWali} onChange={handleChange} placeholder="08xxxxxxxxxx" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input label="Pendidikan" name="pendidikanWali" value={formData.pendidikanWali} onChange={handleChange} as="select">
                  <option value="">Pilih Pendidikan</option>
                  {PENDIDIKAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
                <Input label="Pekerjaan" name="pekerjaanWali" value={formData.pekerjaanWali} onChange={handleChange} as="select">
                  <option value="">Pilih Pekerjaan</option>
                  {PEKERJAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </Input>
              </div>
              <Input label="Alamat Lengkap Wali" name="alamatWali" value={formData.alamatWali} onChange={handleChange} as="textarea" placeholder="Alamat lengkap wali" rows={2} />
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-id-card text-emerald-600"></i> Informasi KIP / PIP
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <Input label="Punya Kartu KIP/PIP?" name="statusKipPip" value={formData.statusKipPip} onChange={handleChange} as="select" icon="fas fa-question-circle" required>
                  <option value="Tidak Ada">Tidak Ada</option>
                  <option value="Ada">Ada</option>
                </Input>
                
                {formData.statusKipPip === 'Ada' && (
                  <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <Input label="Nomor KIP/PIP" name="nomorKipPip" value={formData.nomorKipPip} onChange={handleChange} required icon="fas fa-hashtag" placeholder="Masukkan 10 digit nomor kartu" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Unggah Berkas */}
        <section>
          <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
            <span className="bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm">Unggah Berkas Pendukung</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="Fotocopy Akta Kelahiran" name="fileAkta" type="file" onChange={handleChange} required icon="fas fa-file-invoice" accept=".pdf,.jpg,.jpeg,.png" />
              <Input label="Fotocopy Kartu Keluarga" name="fileKK" type="file" onChange={handleChange} required icon="fas fa-users" accept=".pdf,.jpg,.jpeg,.png" />
              <Input label="Fotocopy Ijazah/SKL dilegalisir" name="fileIjazah" type="file" onChange={handleChange} required icon="fas fa-graduation-cap" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div className="space-y-4">
              <Input label="Pas Foto 3x4 Background Merah" name="fileFoto" type="file" onChange={handleChange} required icon="fas fa-image" accept=".jpg,.jpeg,.png" />
              <Input label="Fotocopy KTP Orang Tua / Wali" name="fileKtpOrtu" type="file" onChange={handleChange} required icon="fas fa-id-card" accept=".pdf,.jpg,.jpeg,.png" />
              {formData.statusKipPip === 'Ada' && (
                <Input label="Fotocopy KIP/PIP/PKH" name="fileKipPip" type="file" onChange={handleChange} required icon="fas fa-hand-holding-heart" accept=".pdf,.jpg,.jpeg,.png" />
              )}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 italic">Format file yang didukung: PDF, JPG, JPEG, PNG. Maksimal ukuran per file: 2MB.</p>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
            Kirim Pendaftaran
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
