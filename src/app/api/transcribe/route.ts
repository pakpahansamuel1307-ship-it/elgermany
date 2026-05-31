import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai =
new OpenAI({
  apiKey:
  process.env.OPENAI_API_KEY
})

export async function POST(
  req:Request
){

  try{

    const formData =
    await req.formData()

    const audio =
    formData.get(
      "audio"
    ) as File

    const transcript =
    await openai.audio
    .transcriptions
    .create({

      file:audio,

      model:
      "whisper-1",

      language:
      "de"
    })

    return NextResponse.json({

      transcript:
      transcript.text
    })

  }catch(error){

    return NextResponse.json({

      transcript:""
    })
  }
}