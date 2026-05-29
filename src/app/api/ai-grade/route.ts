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

    const question = questions[0] || "";
    const answer = answers[0] || "";

    // Validasi kosong
    if (!answer.trim()) {
      return NextResponse.json({
        score: 0,
        feedback: "Jawaban masih kosong.",
      });
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

SOAL GOETHE:
${question}

JAWABAN PESERTA:
${answer}

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

================================
ATURAN PENTING
================================

- Nilai HARUS realistis seperti Goethe.
- Jangan menilai A1 seperti B2.
- Jangan terlalu murah nilai B2.
- Jika grammar buruk tetapi isi jelas pada A1/A2, tetap adil.
- Jika jawaban terlalu pendek, turunkan nilai.
- Jika jawaban tidak menjawab soal, turunkan nilai.

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
    } catch {
      return NextResponse.json({
        score: 70,
        feedback:
          "AI merespons tetapi format tidak valid.",
      });
    }

    return NextResponse.json({
      score: parsed.score ?? 70,
      feedback:
        parsed.feedback ??
        "Feedback belum tersedia.",
    });

  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json({
      score: 70,
      feedback:
        "Terjadi kesalahan saat memproses penilaian.",
    });
  }
}