import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(
  req: Request
){

  try{

    const formData =
    await req.formData()

    const level =
    String(
      formData.get("level")
      || "a1"
    )

    const teil =
    String(
      formData.get("teil")
      || "1"
    )

    const theme =
    String(
      formData.get("theme")
      || ""
    )

    const history =
    JSON.parse(

      String(
        formData.get(
          "history"
        ) || "[]"
      )
    )

    const audioFile =
    formData.get(
      "audio"
    ) as File | null

    let userTranscript = ""

    // ==================
    // WHISPER
    // ==================

    if(audioFile){

      const transcription =
      await openai.audio
      .transcriptions
      .create({

        file: audioFile,

        model:
        "whisper-1",

        language:
        "de"
      })

      userTranscript =
      transcription.text
    }

    const levelRules = {

      a1: `
Kamu partner ujian Goethe A1.

ATURAN:
- Bahasa A1.
- Pendek.
- Maksimal 1–2 kalimat.
- Pelan dan jelas.
- Jangan mengajar.
- Jangan mengoreksi user.

Teil 2:
Jawab singkat
lalu tanya balik.

Teil 3:
Sederhana dan natural.
      `,

    a2: `
Kamu partner ujian Goethe A2.

ATURAN:
- Bahasa level A2.
- Natural.
- Maksimal 1–2 kalimat.
- Jangan mengajar.
- Jangan koreksi saat exam.

Teil 1:
Tanya jawab personal.
User bertanya.
Jawab singkat lalu tanya balik.
Lakukan natural.

Teil 2:
Jangan bicara.
User hanya monolog.

Teil 3:
Membuat termin bersama.

Kamu punya jadwal sendiri.
Jangan langsung setuju.

Contoh:
"Am Montag kann ich leider nicht."

Negosiasi sampai menemukan waktu cocok.
`,

     b1: `
Kamu adalah partner ujian Goethe B1.

ATURAN:
- Bahasa level B1.
- Natural.
- Maksimal 1–2 kalimat.
- Jangan mengajar.
- Jangan mengoreksi user.

Teil 1:
Gemeinsam etwas planen.

Bahas semua poin tugas.
Ikut berdiskusi natural.
Kadang setuju.
Kadang beri ide lain.
Target bicara sekitar 50%.

Contoh:
"Das klingt gut."
"Vielleicht können wir..."
"Was meinst du dazu?"

Teil 2:
Diam.
User presentasi.

Teil 3:
Berikan 1 pertanyaan
HANYA berdasarkan THEMA.
BUKAN isi presentasi user.
`,

     b2: `
Kamu adalah partner ujian Goethe B2 asli.

ATURAN:
- Bahasa level B2.
- Realistis seperti ujian Goethe.
- Argumentatif.
- 2–4 kalimat.
- Sedikit kritis.
- Jangan mengajar.
- Jangan mengoreksi user saat exam.
- Target bicara sekitar 50%.

Teil 1:
Setelah presentasi,
beri SATU pertanyaan
berdasarkan THEMA saja.

Bukan isi presentasi user.

Contoh:
"Können Sie das näher erklären?"
"Was halten Sie davon?"

Teil 2:
Diskusi serius.

Kadang setuju:
"Da stimme ich teilweise zu."

Kadang tidak setuju:
"Allerdings sehe ich das etwas anders."

Dorong elaborasi:
"Können Sie das genauer erklären?"
"Haben Sie ein Beispiel?"
`
    }

    const systemPrompt = `
Kamu partner ujian Goethe ${level.toUpperCase()}.

${levelRules[
      level as keyof typeof levelRules
    ]}

THEMA:
${theme}

TEIL:
${teil}

Peserta terakhir berkata:

"${userTranscript}"

Jawab natural
dalam bahasa Jerman.
`

    // ==================
    // GPT RESPONSE
    // ==================

    const completion =
    await openai.chat
    .completions
    .create({

      model:"gpt-4.1",

      temperature:0.7,

      messages:[

        {
          role:"system",
          content:
          systemPrompt
        },

        ...history
      ]
    })

    const aiReply =

      completion
      .choices?.[0]
      ?.message
      ?.content
      || "Entschuldigung?"

    // ==================
    // TTS AUDIO
    // ==================

    const speech =
    await openai.audio
    .speech
    .create({

      model:
      "gpt-4o-mini-tts",

      voice:"nova",

      input:aiReply
    })

    const audioBuffer =
    Buffer.from(
      await speech.arrayBuffer()
    )

    const base64Audio =
    audioBuffer.toString(
      "base64"
    )

    return NextResponse.json({

      success:true,

      transcript:
      userTranscript,

      aiReply,

      audio:
      `data:audio/mp3;base64,${base64Audio}`
    })

  }catch(error:any){

    console.error(
      "SPEAKING AI ERROR:",
      error
    )

    return NextResponse.json({

      success:false,

      message:
      error.message ||
      "AI Error"

    },{
      status:500
    })
  }
}