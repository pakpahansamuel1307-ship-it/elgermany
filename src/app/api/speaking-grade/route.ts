import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(
  req: Request
){

  try{

    const body =
    await req.json()

    const {
      level,
      transcript,
      speakingData
    } = body

    const prompt = `
Kamu adalah kombinasi:

1. Penguji resmi Goethe Institut
2. Guru privat bahasa Jerman profesional

TUGAS:
Nilai kemampuan SPRECHEN peserta sesuai level Goethe.

LEVEL:
${level}

DATA SPEAKING:
${JSON.stringify(
  speakingData
)}

TRANSKRIP PESERTA:
${transcript}

ATURAN PENILAIAN:

A1:
- toleransi grammar tinggi
- fokus komunikasi berhasil
- jangan terlalu keras

A2:
- grammar mulai diperhatikan
- relevansi jawaban penting

B1:
- struktur lebih baik
- interaksi penting
- connector mulai dinilai

B2:
- perlakukan ketat
- argumentasi penting
- spontaneity penting
- grammar harus stabil
- jangan terlalu murah nilai tinggi

NILAI BERDASARKAN:

1. Grammatik
2. Wortschatz
3. Flüssigkeit
4. Interaktion
5. Aufgabenbewältigung
6. Aussprache
7. Kohärenz

PENTING:
Nilai seperti Goethe asli.

FEEDBACK:
Seperti guru privat:
- ramah
- membangun
- jelas
- beri contoh perbaikan

FORMAT JSON WAJIB:

{
  "score": 0,
  "grade": "",
  "feedback": "",
  "grammarMistakes": [],
  "strengths": [],
  "improvements": []
}
`

    const completion =
    await openai.chat.completions.create({

      model:"gpt-4.1",

      temperature:0.4,

      messages:[

        {
          role:"system",
          content:prompt
        }
      ]
    })

    const text =

      completion
      .choices?.[0]
      ?.message
      ?.content
      || ""

    const cleanedText =
    text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim()

    let parsed

    try{

      parsed =
      JSON.parse(
        cleanedText
      )

    }catch{

      return NextResponse.json({

        score:70,

        feedback:
        "AI gagal membaca hasil speaking.",

        grammarMistakes:[],

        strengths:[],

        improvements:[]
      })
    }

    return NextResponse.json({

      score:
      parsed.score ?? 70,

      grade:
      parsed.grade
      ?? "Ausreichend",

      feedback:
      parsed.feedback
      ?? "",

      grammarMistakes:
      parsed.grammarMistakes
      ?? [],

      strengths:
      parsed.strengths
      ?? [],

      improvements:
      parsed.improvements
      ?? []

    })

  }catch(error:any){

    console.error(
      "SPEAKING GRADE ERROR:",
      error
    )

    return NextResponse.json({

      score:70,

      feedback:
      "Terjadi kesalahan saat menilai speaking.",

      grammarMistakes:[],

      strengths:[],

      improvements:[]
    })
  }
}