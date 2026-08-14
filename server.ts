import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// POST endpoint to generate RPM
app.post("/api/generate-rpm", async (req, res) => {
  try {
    const {
      schoolName,
      teacherName,
      teacherNip,
      principalName,
      principalNip,
      educationLevel,
      gradeClass,
      subject,
      learningAchievement, // CP
      learningObjective, // TP
      learningMaterial, // Materi
      meetingsCount, // Jumlah pertemuan
      duration, // Durasi
      pedagogicalPractice, // Array of pedagogical practices per meeting
      gradDimensions, // Selected dimensions array
    } = req.body;

    // Validate fields
    if (!schoolName || !teacherName || !educationLevel || !gradeClass || !subject || !learningAchievement || !learningObjective || !learningMaterial || !meetingsCount || !duration) {
      return res.status(400).json({ error: "Mohon isi semua field input yang wajib." });
    }

    const pedagogyListStr = Array.isArray(pedagogicalPractice) 
      ? pedagogicalPractice.map((p: any, idx: number) => `Pertemuan ${idx + 1}: ${p}`).join(", ") 
      : pedagogicalPractice;
      
    const dimensionsStr = Array.isArray(gradDimensions) ? gradDimensions.join(", ") : gradDimensions;

    const prompt = `
Anda adalah seorang ahli kurikulum pendidikan Indonesia (Kurikulum Merdeka) dan spesialis Perencanaan Pembelajaran Mendalam (RPM / Deep Learning).
Buatlah perencanaan pembelajaran mendalam yang terstruktur, rinci, dan berpusat pada siswa sesuai dengan data masukan berikut:

1. Nama Satuan Pendidikan: ${schoolName}
2. Jenjang Pendidikan: ${educationLevel}
3. Kelas/Semester: Kelas ${gradeClass}
4. Mata Pelajaran: ${subject}
5. Capaian Pembelajaran (CP): ${learningAchievement}
6. Tujuan Pembelajaran (TP): ${learningObjective}
7. Materi Pelajaran: ${learningMaterial}
8. Jumlah Pertemuan: ${meetingsCount} pertemuan
9. Durasi Setiap Pertemuan: ${duration}
10. Praktik Pedagogis per Pertemuan: ${pedagogyListStr}
11. Dimensi Lulusan (Profil Pelajar Pancasila): ${dimensionsStr}

Tugas Anda adalah menghasilkan/mengisi secara otomatis (generated otomatis) bagian-bagian berikut dengan kualitas terbaik, profesional, dan dalam bahasa Indonesia yang baik dan benar (sesuai EBI):

1. Siswa (Karakteristik Siswa): Analisis profil, kesiapan belajar, minat, atau kebutuhan khusus siswa yang relevan dengan jenjang ${educationLevel} Kelas ${gradeClass} untuk materi ${learningMaterial}.
2. Lintas Disiplin Ilmu: Penjelasan konkret bagaimana materi ini terintegrasi atau berhubungan dengan disiplin ilmu/mata pelajaran lain secara bermakna.
3. Topik Pembelajaran: Rumuskan topik pembelajaran spesifik dan menarik yang disesuaikan dari materi "${learningMaterial}".
4. Kemitraan Pembelajaran: Usulan kemitraan pembelajaran yang realistis dan kontekstual (misalnya dengan orang tua, ahli, industri, komunitas, atau pihak luar sekolah) yang dapat memperkuat materi ini.
5. Lingkungan Pembelajaran: Desain atau penataan lingkungan belajar fisik/non-fisik yang paling mendukung praktik pedagogis (${pedagogyListStr}).
6. Pemanfaatan Digital: Daftar alat/platform digital online yang spesifik dan relevan (contoh: Padlet, Canva, PhET Simulation, Quizizz, Google Earth, dll.) beserta deskripsi singkat pemanfaatannya dalam pembelajaran ini.
7. Metode Pembelajaran: Rincian variasi metode pembelajaran spesifik (misalnya: Diskusi Kelompok, Tanya Jawab Interaktif, Penugasan Proyek, Demonstrasi, Simulasi Praktis, Pemecahan Masalah, Studi Kasus, atau Praktikum) yang disesuaikan secara otomatis dengan praktik pedagogis (${pedagogyListStr}) dan materi (${learningMaterial}).
9. Pengalaman Belajar:
   - Memahami (Kegiatan Awal / Pendahuluan): Kegiatan berkesadaran/bermakna/menggembirakan untuk membangun pemahaman awal siswa. Buatlah langkah-langkah konkret yang detail. Tentukan juga kategori yang paling sesuai dari opsi: Berkesadaran, Bermakna, atau Menggembirakan (bisa lebih dari satu).
   - Mengaplikasi (Kegiatan Inti): Langkah-langkah kegiatan inti yang mendalam dan menantang, yang secara ketat mengikuti sintaks dari praktik pedagogis yang dipilih (${pedagogyListStr}) untuk setiap pertemuan. Buat langkahnya secara berurutan dan terperinci. Tentukan juga kategori yang paling sesuai dari opsi: Berkesadaran, Bermakna, atau Menggembirakan (bisa lebih dari satu).
   - Refleksi (Kegiatan Penutup): Kegiatan penutup dan refleksi bersama siswa untuk menarik kesimpulan dan mengevaluasi pembelajaran mereka. Tentukan juga kategori yang paling sesuai dari opsi: Berkesadaran, Bermakna, atau Menggembirakan (bisa lebih dari satu).
10. Asesmen Pembelajaran:
   - Asesmen Awal (Diagnostik/Apersepsi): Jelaskan metode/pertanyaan pemantik konkret untuk mengukur kesiapan awal siswa sebelum belajar.
   - Asesmen Proses (Formatif): Deskripsikan teknik asesmen selama pembelajaran berlangsung (contoh: lembar observasi sikap, rubrik diskusi kelompok, penilaian diri/antar teman) beserta panduan indikatornya.
   - Asesmen Akhir (Sumatif): Sebutkan bentuk asesmen akhir yang menuntut unjuk kerja/aplikasi nyata (contoh: pembuatan produk, penyelesaian tugas proyek, presentasi, atau portofolio) lengkap dengan kriteria penilaiannya.

Output harus dalam format JSON sesuai dengan schema yang ditentukan. Berikan penjelasan yang mendalam, terperinci, realistis, dan siap pakai oleh guru di kelas.
    `;

    const generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          siswa: { 
            type: Type.STRING, 
            description: "Analisis karakteristik/profil siswa secara mendalam (minimal 2-3 kalimat)." 
          },
          lintasDisiplinIlmu: { 
            type: Type.STRING, 
            description: "Integrasi materi dengan disiplin ilmu/mata pelajaran lain secara konkret." 
          },
          topikPembelajaran: { 
            type: Type.STRING, 
            description: "Topik pembelajaran spesifik yang disesuaikan dari materi pelajaran." 
          },
          metodePembelajaran: { 
            type: Type.STRING, 
            description: "Rincian variasi metode pembelajaran otomatis (seperti Diskusi Kelompok, Tanya Jawab, Penugasan Proyek, Demonstrasi, dll)." 
          },
          kemitraanPembelajaran: { 
            type: Type.STRING, 
            description: "Rencana kemitraan pembelajaran konkret (misal dengan orang tua, ahli, atau industri)." 
          },
          lingkunganPembelajaran: { 
            type: Type.STRING, 
            description: "Penataan lingkungan belajar fisik maupun non-fisik yang menunjang." 
          },
          pemanfaatanDigital: { 
            type: Type.STRING, 
            description: "Alat/platform digital online (seperti Padlet, Canva, dll) beserta kegunaannya." 
          },
          pengalamanBelajar: {
            type: Type.OBJECT,
            properties: {
              memahami: {
                type: Type.OBJECT,
                properties: {
                  kategori: { type: Type.STRING, description: "Kategori terpilih, contoh: 'Bermakna & Menggembirakan' atau 'Berkesadaran'" },
                  deskripsi: { type: Type.STRING, description: "Langkah-langkah detail kegiatan awal pembelajaran (Memahami)." }
                },
                required: ["kategori", "deskripsi"]
              },
              mengaplikasi: {
                type: Type.OBJECT,
                properties: {
                  kategori: { type: Type.STRING, description: "Kategori terpilih, contoh: 'Bermakna & Berkesadaran'" },
                  deskripsi: { type: Type.STRING, description: "Langkah-langkah detail kegiatan inti (Mengaplikasi) yang disesuaikan dengan sintaks praktik pedagogis." }
                },
                required: ["kategori", "deskripsi"]
              },
              refleksi: {
                type: Type.OBJECT,
                properties: {
                  kategori: { type: Type.STRING, description: "Kategori terpilih, contoh: 'Berkesadaran & Bermakna'" },
                  deskripsi: { type: Type.STRING, description: "Langkah-langkah detail kegiatan penutup/refleksi (Refleksi)." }
                },
                required: ["kategori", "deskripsi"]
              }
            },
            required: ["memahami", "mengaplikasi", "refleksi"]
          },
          asesmen: {
            type: Type.OBJECT,
            properties: {
              awal: { type: Type.STRING, description: "Metode, instrumen, atau contoh pertanyaan asesmen awal/diagnostik." },
              proses: { type: Type.STRING, description: "Teknik, indikator, atau rubrik asesmen proses (formatif) selama belajar." },
              akhir: { type: Type.STRING, description: "Bentuk dan kriteria rubrik penilaian asesmen akhir (sumatif)." }
            },
            required: ["awal", "proses", "akhir"]
          }
        },
        required: [
          "siswa",
          "lintasDisiplinIlmu",
          "topikPembelajaran",
          "metodePembelajaran",
          "kemitraanPembelajaran",
          "lingkunganPembelajaran",
          "pemanfaatanDigital",
          "pengalamanBelajar",
          "asesmen"
        ]
      }
    };

    let resultText: string | undefined;
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: generationConfig,
          });
          if (response.text) {
            resultText = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Attempt with model ${modelName} failed:`, err?.message || err);
        }
      }
    }

    if (resultText) {
      try {
        const data = JSON.parse(resultText);
        return res.json(data);
      } catch (e) {
        console.warn("Failed to parse AI response JSON, falling back to smart generator:", e);
      }
    }

    // Smart fallback generator if Gemini API key is missing, invalid, quota exceeded, or parse failed
    console.log("Generating RPM using smart fallback template engine...");
    const fallbackData = generateSmartFallbackRpm(req.body);
    res.json(fallbackData);
  } catch (error: any) {
    console.error("Error generating RPM:", error);
    try {
      const fallbackData = generateSmartFallbackRpm(req.body);
      res.json(fallbackData);
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Gagal membuat Perencanaan Pembelajaran Mendalam." });
    }
  }
});

function generateSmartFallbackRpm(body: any): any {
  const {
    schoolName,
    educationLevel,
    gradeClass,
    subject,
    learningAchievement,
    learningObjective,
    learningMaterial,
    meetingsCount,
    pedagogicalPractice,
    gradDimensions
  } = body;

  const pedagogyStr = Array.isArray(pedagogicalPractice) ? pedagogicalPractice.join(", ") : (pedagogicalPractice || "Problem Based Learning");
  const dimensionsStr = Array.isArray(gradDimensions) ? gradDimensions.join(", ") : (gradDimensions || "Penalaran Kritis");

  return {
    siswa: `Peserta didik ${educationLevel} ${gradeClass} pada mata pelajaran ${subject} memiliki karakteristik yang beragam dalam kesiapan belajar, gaya belajar, dan tingkat kemandirian. Dalam mempelajari materi ${learningMaterial}, sebagian besar siswa membutuhkan pendekatan yang kontekstual dan berbasis aktivitas nyata. Siswa menunjukkan antusiasme tinggi terhadap pembelajaran berbasis proyek, diskusi kelompok interaktif, dan pemanfaatan teknologi digital.`,
    lintasDisiplinIlmu: `Materi ${learningMaterial} diintegrasikan secara bermakna dengan beberapa disiplin ilmu lain: (1) Bahasa Indonesia dalam keterampilan menyusun laporan dan berkomunikasi, (2) Matematika/Logika dalam berpikir analitis dan pemecahan masalah, serta (3) Pendidikan Pancasila dalam penguatan sikap gotong royong, etika, dan tanggung jawab sosial.`,
    topikPembelajaran: `Topik Pembelajaran: Eksplorasi dan Penerapan ${learningMaterial} secara Kontekstual dan Kolaboratif.`,
    metodePembelajaran: `Kombinasi Metode Interaktif: Diskusi Kelompok Kolaboratif, Tanya Jawab Pemantik, Penugasan Berbasis Proyek/Masalah (${pedagogyStr}), Demonstrasi Konseptual, Simulasi Praktis, serta Presentasi & Debat Sebaya.`,
    kemitraanPembelajaran: `Kemitraan pembelajaran dibangun melalui kerja sama dengan: (1) Orang tua/wali siswa sebagai pendamping aktivitas belajar di rumah, (2) Praktisi/ahli atau komunitas lokal yang relevan dengan bidang ${subject} untuk sesi berbagi pengalaman, dan (3) Antar peserta didik melalui pembelajaran sebaya (peer learning).`,
    lingkunganPembelajaran: `Lingkungan belajar dirancang fleksibel, aman, inklusif, dan menyenangkan. Meja dan kursi diatur dalam bentuk kelompok (cluster) untuk memfasilitasi kolaborasi. Suasana kelas diciptakan kondusif agar siswa bebas mengekspresikan gagasan, bertanya, dan mencoba tanpa takut melakukan kesalahan, didukung oleh sudut baca digital dan papan kerja fisik.`,
    pemanfaatanDigital: `Mengintegrasikan berbagai platform digital interaktif: (1) Padlet/Jamboard untuk papan curah pendapat dan pengumpulan ide secara real-time, (2) Canva untuk penyusunan media presentasi dan infografis hasil karya siswa, serta (3) Quizizz/Google Forms untuk asesmen diagnostik dan refleksi pembelajaran secara interaktif.`,
    pengalamanBelajar: {
      memahami: {
        kategori: "Berkesadaran & Bermakna",
        deskripsi: `1. Orientasi dan Apersepsi: Guru menyapa peserta didik di ${schoolName || "sekolah"}, berdoa bersama, dan mengecek kesiapan belajar.\n2. Pertanyaan Pemantik: Guru memberikan pemantik kontekstual terkait ${learningMaterial} untuk memicu rasa ingin tahu siswa.\n3. Penjelasan Tujuan: Guru menyampaikan Capaian Pembelajaran dan Tujuan Pembelajaran (${learningObjective}) serta relevansinya dengan kehidupan sehari-hari.\n4. Eksplorasi Konsep Awal: Siswa mengamati tayangan visual/studi kasus sederhana dan mencatat hal-hal penting yang mereka pahami.`
      },
      mengaplikasi: {
        kategori: "Bermakna & Menggembirakan",
        deskripsi: `Sintaks Pembelajaran (${pedagogyStr}) untuk ${meetingsCount} Pertemuan:\n1. Identifikasi Masalah/Proyek: Siswa dalam kelompok kecil mengidentifikasi tantangan utama terkait ${learningMaterial}.\n2. Perencanaan Langkah Kerja: Siswa menyusun pembagian tugas, menentukan alur kerja, dan memilih sumber belajar yang relevan.\n3. Pengumpulan Informasi & Praktik: Siswa mengeksplorasi data, melakukan percobaan/diskusi mendalam, dan mengaplikasikan pengetahuan untuk memecahkan masalah.\n4. Penyusunan Produk/Karya: Setiap kelompok menyusun hasil kerja (laporan/infografis/presentasi) dengan pendampingan fasilitatif dari guru.\n5. Presentasi & Umpan Balik: Kelompok mempresentasikan karya di depan kelas, dilanjutkan dengan sesi tanya jawab dan umpan balik antar teman serta penguatan dari guru.`
      },
      refleksi: {
        kategori: "Berkesadaran & Bermakna",
        deskripsi: `1. Rangkuman Bersama: Guru dan siswa bersama-sama menyimpulkan poin-poin utama materi ${learningMaterial}.\n2. Refleksi Diri (Teknik 3-2-1): Siswa menuliskan 3 hal baru yang dipelajari, 2 hal yang paling menarik, dan 1 pertanyaan yang masih belum dipahami.\n3. Evaluasi Dimensi Lulusan: Siswa mengevaluasi perkembangan sikap (${dimensionsStr}) selama proses belajar.\n4. Penutup: Guru memberikan apresiasi atas keterlibatan aktif siswa dan memberikan petunjuk awal untuk pertemuan selanjutnya.`
      }
    },
    asesmen: {
      awal: `Asesmen Diagnostik Non-Kognitif & Kognitif: Tanya jawab lisan dan kuis singkat 3-5 pertanyaan di awal pertemuan untuk memetakan pemahaman awal siswa tentang ${learningMaterial}.`,
      proses: `Asesmen Formatif: Lembar observasi keterlibatan diskusi kelompok, penilaian antar teman (peer assessment), rubrik penilaian proses pemecahan masalah, serta catatan anekdot sikap (${dimensionsStr}).`,
      akhir: `Asesmen Sumatif: Penilaian unjuk kerja/produk akhir (laporan proyek/presentasi kelompok) menggunakan rubrik analitik berbasis Capaian Pembelajaran (${learningAchievement}).`
    }
  };
}

// Vite server configuration in server.ts
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
