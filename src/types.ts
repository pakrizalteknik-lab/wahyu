export interface RpmInput {
  schoolName: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  educationLevel: string;
  gradeClass: string;
  subject: string;
  learningAchievement: string;
  learningObjective: string;
  learningMaterial: string;
  meetingsCount: number;
  duration: string;
  pedagogicalPractice: string[];
  gradDimensions: string[];
  signaturePlace: string;
  signatureDate: string;
}

export interface RpmOutput {
  siswa: string;
  lintasDisiplinIlmu: string;
  topikPembelajaran: string;
  metodePembelajaran: string;
  kemitraanPembelajaran: string;
  lingkunganPembelajaran: string;
  pemanfaatanDigital: string;
  pengalamanBelajar: {
    memahami: {
      kategori: string;
      deskripsi: string;
    };
    mengaplikasi: {
      kategori: string;
      deskripsi: string;
    };
    refleksi: {
      kategori: string;
      deskripsi: string;
    };
  };
  asesmen: {
    awal: string;
    proses: string;
    akhir: string;
  };
}
