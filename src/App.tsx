import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  FileText, 
  Users, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Download, 
  FileCheck, 
  AlertCircle, 
  Clock, 
  CheckSquare, 
  MapPin, 
  Calendar,
  Layers,
  Award,
  ChevronRight,
  ClipboardCheck,
  RefreshCw
} from "lucide-react";
import { RpmInput, RpmOutput } from "./types";

const EDUCATION_LEVELS = [
  "SMK", "SMA", "MA", "SMP", "MTs", "SD", "MI", "TK / PAUD"
];

const LEVEL_CLASSES: Record<string, string[]> = {
  "TK / PAUD": ["Kelompok A (Usia 4-5 Tahun)", "Kelompok B (Usia 5-6 Tahun)"],
  "SD": ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
  "MI": ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6"],
  "SMP": ["Kelas 7", "Kelas 8", "Kelas 9"],
  "MTs": ["Kelas 7", "Kelas 8", "Kelas 9"],
  "SMA": ["Kelas 10", "Kelas 11", "Kelas 12"],
  "MA": ["Kelas 10", "Kelas 11", "Kelas 12"],
  "SMK": ["Kelas 10", "Kelas 11", "Kelas 12"]
};

const PEDAGOGICAL_OPTIONS = [
  "Inkuiri-Discovery",
  "PjBL",
  "PBL",
  "Game Based Learning",
  "Station Learning"
];

const GRAD_DIMENSION_OPTIONS = [
  "Keimanan & Ketakwaan",
  "Kewargaan",
  "Penalaran Kritis",
  "Kreativitas",
  "Kolaborasi",
  "Kemandirian",
  "Kesehatan",
  "Komunikasi"
];

const LOADING_PHRASES = [
  "Menganalisis Kurikulum Merdeka dan Capaian Pembelajaran...",
  "Merumuskan karakteristik siswa berdasarkan kelas dan jenjang...",
  "Mengintegrasikan korelasi Lintas Disiplin Ilmu secara kontekstual...",
  "Merancang Topik Pembelajaran berbasis Pembelajaran Mendalam (RPM)...",
  "Menyinkronkan sintaks kegiatan sesuai praktik pedagogis pilihan...",
  "Merancang Kemitraan Pembelajaran dan Lingkungan Pembelajaran yang aman...",
  "Mengkurasi referensi Pemanfaatan Digital online yang interaktif...",
  "Menyusun tahapan Pengalaman Belajar: Memahami, Mengaplikasi, & Refleksi...",
  "Merumuskan instrumen Asesmen Awal, Proses, dan Akhir..."
];

export default function App() {
  // Input states
  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherNip, setTeacherNip] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalNip, setPrincipalNip] = useState("");
  const [educationLevel, setEducationLevel] = useState("SMK");
  const [gradeClass, setGradeClass] = useState("");
  const [subject, setSubject] = useState("");
  const [learningAchievement, setLearningAchievement] = useState("");
  const [learningObjective, setLearningObjective] = useState("");
  const [learningMaterial, setLearningMaterial] = useState("");
  const [meetingsCount, setMeetingsCount] = useState(2);
  const [duration, setDuration] = useState("2 × 45 menit");
  const [pedagogicalPractice, setPedagogicalPractice] = useState<string[]>(["PBL", "PjBL"]);
  const [gradDimensions, setGradDimensions] = useState<string[]>(["Penalaran Kritis", "Kreativitas"]);
  const [signaturePlace, setSignaturePlace] = useState("Sidoarjo");
  const [signatureDate, setSignatureDate] = useState("12 Juli 2026");

  // App UI states
  const [loading, setLoading] = useState(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedRpm, setGeneratedRpm] = useState<RpmOutput | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update classes when education level changes
  useEffect(() => {
    const classes = LEVEL_CLASSES[educationLevel] || [];
    if (classes.length > 0 && !classes.includes(gradeClass)) {
      setGradeClass(classes[0]);
    }
  }, [educationLevel]);

  // Handle meetings count change
  useEffect(() => {
    // Resize pedagogicalPractice array to match meetingsCount
    setPedagogicalPractice(prev => {
      const updated = [...prev];
      if (updated.length < meetingsCount) {
        for (let i = updated.length; i < meetingsCount; i++) {
          updated.push("Inkuiri-Discovery");
        }
      } else if (updated.length > meetingsCount) {
        return updated.slice(0, meetingsCount);
      }
      return updated;
    });
  }, [meetingsCount]);

  // Loading phrases cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex(prev => (prev + 1) % LOADING_PHRASES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadExampleData = () => {
    setSchoolName("SMK Antartika 2 Sidoarjo");
    setTeacherName("Budi Santoso, S.T.");
    setTeacherNip("198503112010121004");
    setPrincipalName("Drs. H. Ahmad Yani, M.T.");
    setPrincipalNip("197204151998031002");
    setEducationLevel("SMK");
    setGradeClass("Kelas 10");
    setSubject("Dasar-Dasar Teknik Komputer dan Jaringan");
    setLearningAchievement("Pada akhir fase E, peserta didik mampu memahami dasar-dasar teknik jaringan komputer dan telekomunikasi, termasuk pengalamatan IP, subnetting, cabling, serta konfigurasi router dan switch sederhana secara mandiri dan bertanggung jawab.");
    setLearningObjective("Peserta didik dapat menganalisis dan mempraktikkan pengalamatan IP Address serta merancang skema jaringan Local Area Network (LAN) sederhana.");
    setLearningMaterial("Pengalamatan IP (IP Addressing) dan Desain LAN Sederhana");
    setMeetingsCount(2);
    setDuration("2 × 45 menit");
    setPedagogicalPractice(["PBL", "PjBL"]);
    setGradDimensions(["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Kemandirian"]);
    setSignaturePlace("Sidoarjo");
    setSignatureDate("12 Juli 2026");
    setValidationErrors([]);
    setError(null);
  };

  const toggleDimension = (dim: string) => {
    setGradDimensions(prev => 
      prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
    );
  };

  const handlePedagogyChange = (index: number, val: string) => {
    setPedagogicalPractice(prev => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  // Basic Validation
  const validateForm = () => {
    const errors: string[] = [];
    if (!schoolName.trim()) errors.push("Nama Satuan Pendidikan wajib diisi");
    if (!teacherName.trim()) errors.push("Nama Guru wajib diisi");
    if (!teacherNip.trim()) errors.push("NIP Guru wajib diisi");
    if (!principalName.trim()) errors.push("Nama Kepala Sekolah wajib diisi");
    if (!principalNip.trim()) errors.push("NIP Kepala Sekolah wajib diisi");
    if (!subject.trim()) errors.push("Mata Pelajaran wajib diisi");
    if (!learningAchievement.trim()) errors.push("Capaian Pembelajaran (CP) wajib diisi");
    if (!learningObjective.trim()) errors.push("Tujuan Pembelajaran wajib diisi");
    if (!learningMaterial.trim()) errors.push("Materi Pelajaran wajib diisi");
    if (!duration.trim()) errors.push("Durasi Pertemuan wajib diisi");
    if (gradDimensions.length === 0) errors.push("Pilih minimal 1 Dimensi Lulusan");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to validation error area
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    setError(null);
    setCopyStatus("idle");
    setLoadingPhraseIndex(0);

    try {
      const response = await fetch("/api/generate-rpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName,
          teacherName,
          teacherNip,
          principalName,
          principalNip,
          educationLevel,
          gradeClass,
          subject,
          learningAchievement,
          learningObjective,
          learningMaterial,
          meetingsCount,
          duration,
          pedagogicalPractice,
          gradDimensions,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Gagal menghubungi server generator");
      }

      const data: RpmOutput = await response.json();
      setGeneratedRpm(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi atau sistem saat memproses.");
    } finally {
      setLoading(false);
    }
  };

  // Function to build HTML string of the table for clipboard copy
  const getOutputHtmlString = () => {
    if (!generatedRpm) return "";

    const pedagogyStr = pedagogicalPractice.map((p, idx) => `Pertemuan ${idx + 1}: ${p}`).join(", ");
    const dimensionsStr = gradDimensions.join(", ");

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 5px; font-size: 16pt;">PERENCANAAN PEMBELAJARAN MENDALAM (RPM)</h2>
        <h3 style="text-align: center; margin-top: 0; margin-bottom: 30px; font-size: 13pt; font-weight: normal; letter-spacing: 1px;">KURIKULUM MERDEKA</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 2px solid #000000; font-size: 11pt;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff;">
              <th style="border: 1px solid #000000; padding: 10px; text-align: left; width: 30%; font-weight: bold;">BAGIAN / ASPEK</th>
              <th style="border: 1px solid #000000; padding: 10px; text-align: left; width: 70%; font-weight: bold;">DESKRIPSI DAN RINCIAN OPERASIONAL</th>
            </tr>
          </thead>
          <tbody>
            <!-- 1. IDENTITAS -->
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="border: 1px solid #000000; padding: 10px; font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">1. Identitas</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Nama Satuan Pendidikan</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${schoolName}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Mata Pelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${subject}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Kelas / Semester</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${gradeClass} / Ganjil</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Durasi Pertemuan</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${duration}</td>
            </tr>

            <!-- 2. IDENTIFIKASI -->
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="border: 1px solid #000000; padding: 10px; font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">2. Identifikasi</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Siswa (Karakteristik & Profil)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.siswa}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Materi Pelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${learningMaterial}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Capaian Dimensi Lulusan</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${dimensionsStr}</td>
            </tr>

            <!-- 3. DESAIN PEMBELAJARAN -->
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="border: 1px solid #000000; padding: 10px; font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">3. Desain Pembelajaran</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Capaian Pembelajaran (CP)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${learningAchievement}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Lintas Disiplin Ilmu</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.lintasDisiplinIlmu}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Tujuan Pembelajaran (TP)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${learningObjective}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Topik Pembelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.topikPembelajaran}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Praktik Pedagogis per Pertemuan</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${pedagogyStr}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Metode Pembelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.metodePembelajaran}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Kemitraan Pembelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.kemitraanPembelajaran}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Lingkungan Pembelajaran</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.lingkunganPembelajaran}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Pemanfaatan Digital</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.pemanfaatanDigital}</td>
            </tr>

            <!-- 4. PENGALAMAN BELAJAR -->
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="border: 1px solid #000000; padding: 10px; font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">4. Pengalaman Belajar</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">
                Memahami (Kegiatan Awal)<br>
                <em style="font-size: 9pt; font-weight: normal; color: #475569; display: block; margin-top: 4px;">Kategori: ${generatedRpm.pengalamanBelajar.memahami.kategori}</em>
              </td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.pengalamanBelajar.memahami.deskripsi}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">
                Mengaplikasi (Kegiatan Inti)<br>
                <em style="font-size: 9pt; font-weight: normal; color: #475569; display: block; margin-top: 4px;">Kategori: ${generatedRpm.pengalamanBelajar.mengaplikasi.kategori}</em>
              </td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.pengalamanBelajar.mengaplikasi.deskripsi}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">
                Refleksi (Kegiatan Penutup)<br>
                <em style="font-size: 9pt; font-weight: normal; color: #475569; display: block; margin-top: 4px;">Kategori: ${generatedRpm.pengalamanBelajar.refleksi.kategori}</em>
              </td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.pengalamanBelajar.refleksi.deskripsi}</td>
            </tr>

            <!-- 5. ASESMEN PEMBELAJARAN -->
            <tr style="background-color: #f1f5f9;">
              <td colspan="2" style="border: 1px solid #000000; padding: 10px; font-weight: bold; font-size: 11pt; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">5. Asesmen Pembelajaran</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Asesmen Awal (Diagnostik)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.asesmen.awal}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Asesmen Proses (Formatif)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.asesmen.proses}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000000; padding: 10px; font-weight: bold; background-color: #fafafa; vertical-align: top;">Asesmen Akhir (Sumatif)</td>
              <td style="border: 1px solid #000000; padding: 10px; text-align: justify; vertical-align: top;">${generatedRpm.asesmen.akhir}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- SIGNATURES -->
        <table style="width: 100%; margin-top: 60px; border: none; font-size: 11pt;">
          <tr style="border: none;">
            <td style="width: 50%; border: none; padding: 5px; text-align: left; vertical-align: top; line-height: 1.5;">
              Mengetahui,<br>
              Kepala Sekolah ${schoolName}<br><br><br><br><br>
              <strong>${principalName}</strong><br>
              NIP. ${principalNip}
            </td>
            <td style="width: 50%; border: none; padding: 5px; text-align: right; vertical-align: top; line-height: 1.5;">
              ${signaturePlace}, ${signatureDate}<br>
              Guru Mata Pelajaran<br><br><br><br><br>
              <strong>${teacherName}</strong><br>
              NIP. ${teacherNip}
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  const getPlainTextString = () => {
    if (!generatedRpm) return "";
    const pedagogyStr = pedagogicalPractice.map((p, idx) => `Pertemuan ${idx + 1}: ${p}`).join(", ");
    return `
PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
KURIKULUM MERDEKA

1. IDENTITAS
Nama Satuan Pendidikan: ${schoolName}
Mata Pelajaran: ${subject}
Kelas / Semester: ${gradeClass} / Ganjil
Durasi Pertemuan: ${duration}

2. IDENTIFIKASI
Siswa (Karakteristik & Profil): ${generatedRpm.siswa}
Materi Pelajaran: ${learningMaterial}
Capaian Dimensi Lulusan: ${gradDimensions.join(", ")}

3. DESAIN PEMBELAJARAN
Capaian Pembelajaran (CP): ${learningAchievement}
Lintas Disiplin Ilmu: ${generatedRpm.lintasDisiplinIlmu}
Tujuan Pembelajaran (TP): ${learningObjective}
Topik Pembelajaran: ${generatedRpm.topikPembelajaran}
Praktik Pedagogis per Pertemuan: ${pedagogyStr}
Metode Pembelajaran: ${generatedRpm.metodePembelajaran}
Kemitraan Pembelajaran: ${generatedRpm.kemitraanPembelajaran}
Lingkungan Pembelajaran: ${generatedRpm.lingkunganPembelajaran}
Pemanfaatan Digital: ${generatedRpm.pemanfaatanDigital}

4. PENGALAMAN BELAJAR
Memahami (Kegiatan Awal): Kategori [${generatedRpm.pengalamanBelajar.memahami.kategori}] - ${generatedRpm.pengalamanBelajar.memahami.deskripsi}
Mengaplikasi (Kegiatan Inti): Kategori [${generatedRpm.pengalamanBelajar.mengaplikasi.kategori}] - ${generatedRpm.pengalamanBelajar.mengaplikasi.deskripsi}
Refleksi (Kegiatan Penutup): Kategori [${generatedRpm.pengalamanBelajar.refleksi.kategori}] - ${generatedRpm.pengalamanBelajar.refleksi.deskripsi}

5. ASESMEN PEMBELAJARAN
Asesmen Awal (Diagnostik): ${generatedRpm.asesmen.awal}
Asesmen Proses (Formatif): ${generatedRpm.asesmen.proses}
Asesmen Akhir (Sumatif): ${generatedRpm.asesmen.akhir}

Mengetahui,
Kepala Sekolah ${schoolName}
${principalName} (NIP. ${principalNip})

${signaturePlace}, ${signatureDate}
Guru Mata Pelajaran
${teacherName} (NIP. ${teacherNip})
    `;
  };

  // Modern clipboard write method to support structured paste in Word / Docs
  const handleCopyAndOpenDocs = async () => {
    const htmlString = getOutputHtmlString();
    const plainText = getPlainTextString();

    try {
      // Use Blob + ClipboardItem to copy styled HTML
      const blobHtml = new Blob([htmlString], { type: "text/html" });
      const blobText = new Blob([plainText], { type: "text/plain" });
      
      const data = [
        new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        })
      ];

      await navigator.clipboard.write(data);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 3000);

      // Open blank Google Docs in a new tab
      window.open("https://docs.google.com/document/u/0/create", "_blank");
    } catch (err) {
      console.error("Modern copy failed, trying fallback...", err);
      // Fallback to simple text copy
      try {
        await navigator.clipboard.writeText(plainText);
        setCopyStatus("copied");
        setTimeout(() => setCopyStatus("idle"), 3000);
        window.open("https://docs.google.com/document/u/0/create", "_blank");
      } catch (fallbackErr) {
        alert("Gagal menyalin otomatis ke clipboard. Silakan salin konten tabel secara manual.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner & Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-slate-800 to-indigo-900 text-white p-2.5 rounded-xl shadow-md">
              <Layers className="h-6 w-6" id="header-icon" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight" id="app-title">
                Generator RPM
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Perencanaan Pembelajaran Mendalam • Kurikulum Merdeka
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={loadExampleData}
              type="button"
              className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg border border-indigo-100 transition-all flex items-center gap-2 cursor-pointer"
              id="btn-example-data"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Gunakan Contoh Data
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg p-1 text-[11px] font-mono text-slate-500">
              <span className="px-2 py-0.5 bg-white rounded shadow-sm text-slate-700 font-bold">Fase E-F</span>
              <span>All Subjects</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INPUT FORM */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky lg:top-24 max-h-[82vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Formulir Rencana Pembelajaran</h2>
            </div>
            {validationErrors.length > 0 && (
              <span className="text-[11px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium border border-red-100 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.length} Error
              </span>
            )}
          </div>

          <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Validation Alert Box */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-red-800">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Mohon lengkapi kolom isian berikut:
                </p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Section A: Identitas Lembaga & Guru */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Users className="w-3.5 h-3.5" />
                A. Instansi & Tenaga Pendidik
              </h3>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Nama Satuan Pendidikan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  placeholder="Contoh: SMK Antartika 2 Sidoarjo"
                  className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  id="school-name-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Nama Guru <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={e => setTeacherName(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    id="teacher-name-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">NIP Guru <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={teacherNip}
                    onChange={e => setTeacherNip(e.target.value)}
                    placeholder="NIP Guru"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    id="teacher-nip-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Nama Kepala Sekolah <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={e => setPrincipalName(e.target.value)}
                    placeholder="Nama Lengkap & Gelar"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    id="principal-name-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">NIP Kepala Sekolah <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={principalNip}
                    onChange={e => setPrincipalNip(e.target.value)}
                    placeholder="NIP Kepala Sekolah"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    id="principal-nip-input"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Kurikulum, Kelas & Capaian */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                B. Detail Kurikulum & Mata Pelajaran
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Jenjang Pendidikan <span className="text-red-500">*</span></label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    id="education-level-select"
                  >
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Kelas <span className="text-red-500">*</span></label>
                  <select
                    value={gradeClass}
                    onChange={e => setGradeClass(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    id="grade-class-select"
                  >
                    {(LEVEL_CLASSES[educationLevel] || []).map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Mata Pelajaran (Mapel) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Contoh: Matematika, Dasar Teknik Elektro"
                  className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  id="subject-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Materi Pelajaran <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={learningMaterial}
                  onChange={e => setLearningMaterial(e.target.value)}
                  placeholder="Contoh: Aljabar Linier, Pengkabelan UTP"
                  className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  id="material-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Jumlah Pertemuan <span className="text-red-500">*</span></label>
                  <select
                    value={meetingsCount}
                    onChange={e => setMeetingsCount(parseInt(e.target.value) || 1)}
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    id="meetings-count-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Pertemuan</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Durasi Per Pertemuan <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder="Contoh: 2 × 45 menit, 3 × 35 menit"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    id="duration-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Capaian Pembelajaran (CP) <span className="text-red-500">*</span></label>
                <textarea
                  value={learningAchievement}
                  onChange={e => setLearningAchievement(e.target.value)}
                  placeholder="Tuliskan rumusan Capaian Pembelajaran secara utuh..."
                  rows={3}
                  className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-y"
                  id="learning-achievement-textarea"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Tujuan Pembelajaran (TP) <span className="text-red-500">*</span></label>
                <textarea
                  value={learningObjective}
                  onChange={e => setLearningObjective(e.target.value)}
                  placeholder="Rumuskan tujuan pembelajaran operasional..."
                  rows={2}
                  className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-y"
                  id="learning-objective-textarea"
                />
              </div>
            </div>

            {/* Section C: Praktik Pedagogis per Pertemuan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                C. Praktik Pedagogis per Pertemuan
              </h3>
              
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-3.5 border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">Tentukan pendekatan pembelajaran mendalam yang digunakan untuk setiap sesi pertemuan:</p>
                {Array.from({ length: meetingsCount }).map((_, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Pertemuan {idx + 1}
                    </span>
                    <select
                      value={pedagogicalPractice[idx] || "Inkuiri-Discovery"}
                      onChange={e => handlePedagogyChange(idx, e.target.value)}
                      className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                      {PEDAGOGICAL_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: Dimensi Lulusan (Multi-select) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <Award className="w-3.5 h-3.5" />
                D. Dimensi Lulusan (Profil Pancasila) <span className="text-red-500">*</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium -mt-2">Pilih karakter target kelulusan yang ingin dikembangkan (Multi-pilih):</p>

              <div className="grid grid-cols-2 gap-2">
                {GRAD_DIMENSION_OPTIONS.map(dim => {
                  const isChecked = gradDimensions.includes(dim);
                  return (
                    <button
                      key={dim}
                      type="button"
                      onClick={() => toggleDimension(dim)}
                      className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{dim}</span>
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded border border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section E: Tempat & Tanggal Penandatanganan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                E. Tanggal & Lokasi TTD Dokumen
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Kota Lokasi TTD</label>
                  <input
                    type="text"
                    value={signaturePlace}
                    onChange={e => setSignaturePlace(e.target.value)}
                    placeholder="Contoh: Sidoarjo, Sidoarjo"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Tanggal TTD Dokumen</label>
                  <input
                    type="text"
                    value={signatureDate}
                    onChange={e => setSignatureDate(e.target.value)}
                    placeholder="Contoh: 12 Juli 2026"
                    className="w-full text-sm px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  loading 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-950 hover:shadow-lg active:scale-[0.99]"
                }`}
                id="submit-btn"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Memproses Perencanaan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Buat Perencanaan (RPM)
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: PREVIEW & INTERACTIVE WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Workspace Frame */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[82vh]">
            
            {/* Control Bar inside Document Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-800">
                  Pratinjau Lembar Kerja RPM
                </h2>
              </div>
              
              {generatedRpm && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyAndOpenDocs}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold text-white shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      copyStatus === "copied" 
                        ? "bg-emerald-600 hover:bg-emerald-700" 
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                    }`}
                    id="copy-docs-btn"
                  >
                    {copyStatus === "copied" ? (
                      <>
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Tersalin & Membuka Docs...
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Salin & Buka di Google Dokumen
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Inner Content Area */}
            <div className="flex-1 p-6 sm:p-8 bg-slate-100 flex flex-col items-center justify-start overflow-y-auto max-h-[73vh]">
              {/* Empty state */}
              {!generatedRpm && !loading && (
                <div className="my-auto max-w-sm text-center space-y-4 py-12 px-4">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-slate-400">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Hasil Kosong</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Silakan isi formulir di sebelah kiri secara lengkap, atau klik <span className="font-bold text-indigo-600 hover:underline cursor-pointer" onClick={loadExampleData}>Gunakan Contoh Data</span> untuk mencoba secara langsung.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full py-1 px-3 text-[10px] text-slate-500 font-medium">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    AI-Powered Generator
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="my-auto max-w-md text-center space-y-6 py-12 px-4">
                  {/* Majestic spinner */}
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200/60"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Sedang Merumuskan RPM</h4>
                    {/* Cyclical dynamic phrases */}
                    <p className="text-xs text-slate-500 font-medium animate-fade-in min-h-[32px] max-w-xs mx-auto leading-relaxed">
                      {LOADING_PHRASES[loadingPhraseIndex]}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-xl p-3.5 max-w-xs mx-auto">
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Menggunakan model kecerdasan buatan kelas premium untuk menghasilkan detail kurikulum mendalam yang andal, rapi, dan adaptif.
                    </p>
                  </div>
                </div>
              )}

              {/* Generated Result Paper View */}
              {generatedRpm && !loading && (
                <div 
                  className="bg-white w-full max-w-3xl rounded-md shadow-lg border border-slate-300 p-8 sm:p-12 text-slate-900 font-serif leading-relaxed text-justify text-sm relative"
                  style={{ minHeight: "297mm" }} // Standard A4 ratio feel
                  id="rpm-paper-workspace"
                >
                  {/* Clipboard alert */}
                  {copyStatus === "copied" && (
                    <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm animate-bounce z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      HTML disalin! Buka Google Docs untuk mem-paste
                    </div>
                  )}

                  {/* Document Header */}
                  <div className="text-center mb-8 border-b-2 border-slate-900 pb-5">
                    <h2 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-slate-900">
                      PERENCANAAN PEMBELAJARAN MENDALAM (RPM)
                    </h2>
                    <h3 className="text-sm font-sans tracking-widest text-slate-600 font-medium mt-1">
                      KURIKULUM MERDEKA
                    </h3>
                  </div>

                  {/* Spreadsheet style output table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-slate-900 font-sans text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold text-center">
                          <th className="border border-slate-900 p-2.5 text-left w-1/3">BAGIAN / ASPEK</th>
                          <th className="border border-slate-900 p-2.5 text-left w-2/3">DESKRIPSI DAN RINCIAN OPERASIONAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {/* Section 1: Identitas */}
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-900">
                          <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wide">
                            1. Identitas
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Nama Satuan Pendidikan</td>
                          <td className="border border-slate-900 p-2.5">{schoolName}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Mata Pelajaran</td>
                          <td className="border border-slate-900 p-2.5">{subject}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Kelas / Semester</td>
                          <td className="border border-slate-900 p-2.5">{gradeClass} / Ganjil</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Durasi Pertemuan</td>
                          <td className="border border-slate-900 p-2.5">{duration}</td>
                        </tr>

                        {/* Section 2: Identifikasi */}
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-900">
                          <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wide">
                            2. Identifikasi
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Siswa (Karakteristik & Profil)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.siswa}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Materi Pelajaran</td>
                          <td className="border border-slate-900 p-2.5">{learningMaterial}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Capaian Dimensi Lulusan</td>
                          <td className="border border-slate-900 p-2.5">{gradDimensions.join(", ")}</td>
                        </tr>

                        {/* Section 3: Desain Pembelajaran */}
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-900">
                          <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wide">
                            3. Desain Pembelajaran
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Capaian Pembelajaran (CP)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{learningAchievement}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Lintas Disiplin Ilmu</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.lintasDisiplinIlmu}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Tujuan Pembelajaran (TP)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{learningObjective}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Topik Pembelajaran</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.topikPembelajaran}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Praktik Pedagogis per Pertemuan</td>
                          <td className="border border-slate-900 p-2.5 font-mono text-xs">
                            {pedagogicalPractice.map((p, idx) => (
                              <div key={idx} className="mb-0.5">Pertemuan {idx + 1}: {p}</div>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Metode Pembelajaran</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.metodePembelajaran}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Kemitraan Pembelajaran</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.kemitraanPembelajaran}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Lingkungan Pembelajaran</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.lingkunganPembelajaran}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Pemanfaatan Digital</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify font-sans">{generatedRpm.pemanfaatanDigital}</td>
                        </tr>

                        {/* Section 4: Pengalaman Belajar */}
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-900">
                          <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wide">
                            4. Pengalaman Belajar
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">
                            Memahami (Kegiatan Awal)
                            <div className="text-[10px] text-slate-500 font-semibold mt-1">
                              Kategori: {generatedRpm.pengalamanBelajar.memahami.kategori}
                            </div>
                          </td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.pengalamanBelajar.memahami.deskripsi}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">
                            Mengaplikasi (Kegiatan Inti)
                            <div className="text-[10px] text-slate-500 font-semibold mt-1">
                              Kategori: {generatedRpm.pengalamanBelajar.mengaplikasi.kategori}
                            </div>
                          </td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.pengalamanBelajar.mengaplikasi.deskripsi}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">
                            Refleksi (Kegiatan Penutup)
                            <div className="text-[10px] text-slate-500 font-semibold mt-1">
                              Kategori: {generatedRpm.pengalamanBelajar.refleksi.kategori}
                            </div>
                          </td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.pengalamanBelajar.refleksi.deskripsi}</td>
                        </tr>

                        {/* Section 5: Asesmen Pembelajaran */}
                        <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-900">
                          <td colSpan={2} className="border border-slate-900 p-2.5 uppercase tracking-wide">
                            5. Asesmen Pembelajaran
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Asesmen Awal (Diagnostik / Apersepsi)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.asesmen.awal}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Asesmen Proses (Formatif)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.asesmen.proses}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-900 p-2.5 font-bold bg-slate-50/50">Asesmen Akhir (Sumatif)</td>
                          <td className="border border-slate-900 p-2.5 leading-normal text-justify">{generatedRpm.asesmen.akhir}</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                  {/* Signatures Row */}
                  <div className="mt-16 grid grid-cols-2 gap-8 font-sans text-xs sm:text-sm leading-normal">
                    <div className="text-left space-y-12">
                      <div>
                        Mengetahui,<br />
                        Kepala Sekolah <span className="font-semibold">{schoolName}</span>
                      </div>
                      <div className="pt-2">
                        <strong className="underline text-slate-900 font-bold">{principalName}</strong><br />
                        NIP. {principalNip}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-12">
                      <div>
                        {signaturePlace}, {signatureDate}<br />
                        Guru Mata Pelajaran
                      </div>
                      <div className="pt-2">
                        <strong className="underline text-slate-900 font-bold">{teacherName}</strong><br />
                        NIP. {teacherNip}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Sticky info help banner inside Results pane */}
            {generatedRpm && (
              <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 font-medium flex items-center justify-between px-6 shrink-0">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                  Rencana Pembelajaran Mendalam siap disalin dan digunakan.
                </span>
                <span className="text-indigo-600 font-semibold hover:underline cursor-pointer" onClick={handleCopyAndOpenDocs}>
                  Klik untuk Memulai Editing di Google Docs &rarr;
                </span>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">Generator RPM &copy; 2026</p>
          <p className="max-w-md mx-auto text-[11px] text-slate-500 leading-normal">
            Platform pembuatan Perencanaan Pembelajaran Mendalam (RPM) otomatis berlandaskan Kurikulum Merdeka dan kaidah Ejaan Bahasa Indonesia yang baik dan benar.
          </p>
        </div>
      </footer>
    </div>
  );
}
