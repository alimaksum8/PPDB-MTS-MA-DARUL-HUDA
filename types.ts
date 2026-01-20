
export type Institution = 'MTs' | 'MA';

export enum Gender {
  LakiLaki = 'Laki-laki',
  Perempuan = 'Perempuan'
}

export interface StudentRecord {
  id: string;
  institution: Institution;
  fullName: string;
  tempatLahir: string;
  tanggalLahir: string;
  tingkatRombel: string;
  umur: number;
  status: string;
  jenisKelamin: Gender;
  alamat: string;
  noTelepon: string;
  kebutuhanKhusus: string;
  disabilitas: string;
  statusKipPip: 'Ada' | 'Tidak Ada';
  nomorKipPip: string;
  namaAyah: string;
  pendidikanAyah: string;
  pekerjaanAyah: string;
  alamatAyah: string;
  noHpAyah: string;
  namaIbu: string;
  pendidikanIbu: string;
  pekerjaanIbu: string;
  alamatIbu: string;
  noHpIbu: string;
  namaWali: string;
  pendidikanWali: string;
  pekerjaanWali: string;
  alamatWali: string;
  noHpWali: string;
  registrationDate: string;
  // File fields (storing as base64 or filenames for demo)
  fileAkta?: string;
  fileKK?: string;
  fileIjazah?: string;
  fileFoto?: string;
  fileKtpOrtu?: string;
  fileKipPip?: string;
}

export type FormData = Omit<StudentRecord, 'id' | 'registrationDate' | 'umur'> & {
    umur: string | number;
};
