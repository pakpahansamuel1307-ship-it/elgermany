// app/api/ai-grade/route.ts

import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      questions = [],
      answers = [],
      level = "A1",
      module = "schreiben",
    } = body;

    

   const examData =

questions.map(
  (
    question:string,
    index:number
  ) =>

`
================================

TEIL ${index + 1}

SOAL:
${question}

JAWABAN PESERTA:
${answers[index] || ""}

`
).join("\n")

    // Validasi kosong
   const hasAnswer =

answers.some(
  (a:string)=>

  a &&
  a.trim().length > 0
)

if(!hasAnswer){

  return NextResponse.json({

    score:0,

    feedback:
    "Jawaban masih kosong."
  })
}

    // Model berdasarkan level
    const model =
      level.toLowerCase() === "b1" ||
      level.toLowerCase() === "b2"
        ? "gpt-4.1"
        : "gpt-4.1-mini";

   const prompt = `
Kamu adalah kombinasi dari:

1. PENGUJI RESMI GOETHE INSTITUT
2. GURU PRIVAT BAHASA JERMAN PROFESIONAL

================================
PERANMU
================================

PERTAMA:
Nilai tulisan peserta seperti penguji Goethe asli.

KEDUA:
Berikan feedback seperti guru privat yang membantu murid berkembang.

================================
DATA PESERTA
================================

LEVEL:
${level}

MODUL:
${module}

DATA UJIAN:

${examData}

================================
STANDAR PENILAIAN BERDASARKAN LEVEL
================================

A1:
- Fokus apakah pesan dapat dipahami.
- Grammar tidak perlu sempurna.
- Kesalahan artikel/konjungasi kecil masih wajar.
- Jangan terlalu keras.
- Jika maksud masih jelas, tetap beri nilai layak.

A2:
- Struktur mulai harus jelas.
- Perfekt sederhana mulai diperhatikan.
- Relevansi isi penting.
- Grammar lebih diperhatikan dibanding A1.

B1:
- Grammar harus cukup stabil.
- Konektor seperti weil, deshalb, obwohl penting.
- Isi harus cukup lengkap.
- Organisasi ide mulai dinilai.
- Penilaian lebih realistis seperti ujian Goethe.

B2:
- Grammar harus relatif akurat.
- Struktur kompleks diharapkan.
- Argumentasi, opini, dan kohesi sangat penting.
- Kesalahan dasar grammar harus mengurangi nilai.
- Jangan terlalu murah memberi score tinggi.

================================
KRITERIA PENILAIAN
================================

Nilai berdasarkan:

1. TASK ACHIEVEMENT
Apakah peserta benar-benar menjawab tugas?

2. GRAMMATIK
- Konjugasi
- Artikel
- Wortstellung
- Satzbau
- Kasus

3. WORTSCHATZ
- Variasi kosakata
- Ketepatan pemakaian kata
- Kesesuaian level

4. STRUKTUR & KOHÄRENZ
- Alur logis
- Keterhubungan ide
- Organisasi tulisan

PENTING:

Setiap TEIL harus dinilai.

Periksa:

- Apakah setiap Teil dijawab.
- Apakah jawaban sesuai tugas pada Teil tersebut.
- Apakah ada Teil yang kosong.
- Apakah ada Teil yang hanya dijawab sebagian.

Jika satu Teil kosong,
kurangi nilai secara signifikan.

Jika beberapa Teil kosong,
nilai harus turun drastis.

================================
ATURAN PENTING
================================

- Nilai HARUS realistis seperti Goethe.
- Jangan menilai A1 seperti B2.
- Jangan terlalu murah nilai B2.
- Jika grammar buruk tetapi isi jelas pada A1/A2, tetap adil.
- Jika jawaban terlalu pendek, turunkan nilai.
- Jika jawaban tidak menjawab soal, turunkan nilai.
- Jika terdapat beberapa soal Schreiben:
  -Nilai semua soal sekaligus.
  -perhatikan kelengkapan setiap Teil
  -Jika ada Teil yang tidak di jawab,
  kurangi nilai secara signifikan.
  -Jika semua Teil kosog,
   score harus 0

================================
GAYA FEEDBACK
================================

Feedback WAJIB:

- Bahasa Indonesia
- Ramah
- Seperti guru privat
- Jelas
- Membangun
- Menjelaskan kesalahan utama
- Memberi saran konkret

Gunakan format seperti ini:

1. Hal yang sudah bagus
2. Kesalahan penting
3. Cara memperbaiki
4. Motivasi singkat

Jika ada grammar salah, beri contoh:

❌ kalimat salah
✅ versi lebih baik

================================
SKALA SCORE
================================

90–100 = Sangat kuat untuk level tersebut
80–89 = Baik
70–79 = Cukup
60–69 = Masih perlu perbaikan
0–59 = Belum memenuhi ekspektasi level

================================
OUTPUT
================================

Balas HANYA JSON VALID.

JANGAN gunakan markdown.
JANGAN gunakan \`\`\`.

Format wajib:

{
  "score": 0,
  "feedback": ""
}
`;

    const completion =
      await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
        temperature: 0.4,
      });

    const text =
      completion.choices[0].message.content || "";

    console.log("OPENAI:", text);

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleanedText);
    }catch {

  console.log(
    "INVALID JSON:",
    cleanedText
  )

  return NextResponse.json({

    score: 0,

    feedback:
    "AI gagal menghasilkan format penilaian yang valid."

  })
}

   return NextResponse.json({

  score:

  typeof parsed.score
  === "number"

  ?

  parsed.score

  :

  0,

  feedback:

  parsed.feedback
  ??

  "Feedback belum tersedia."

})
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json({

  score: 0,

  feedback:
  "Terjadi kesalahan saat memproses penilaian."

});
  }
}