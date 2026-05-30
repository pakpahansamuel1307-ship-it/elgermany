"use client"

import { useState }
from "react"

import { supabase }
from "../../lib/supabase"

export default function RegisterPage(){

  const [email,
  setEmail] =
    useState("")

  const [password,
  setPassword] =
    useState("")

const handleRegister =
async () => {

  try {

    const {
      data,
      error
    } =
    await supabase.auth
    .signUp({

      email,
      password

    })

    if (error) {

      console.log(error)

      alert(
        error.message
      )

      return
    }


    

    alert(
      "Register berhasil, silakan login"
    )

    window.location.href =
    "/login"

  } catch(err){

    console.log(err)

    alert(
      "Terjadi kesalahan"
    )
  }
}

const handleGoogleRegister =
async ()=>{

  const {
    error
  } =

  await supabase
  .auth
  .signInWithOAuth({

    provider:
    "google",

    options:{

      redirectTo:

`${window.location.origin}/auth/callback`

    }
  })

  if(error){

    alert(
      error.message
    )
  }
}

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center">

          Register

        </h1>

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }

          className="w-full bg-white/10 rounded-2xl px-5 py-4 mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"

          value={password}

          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }

          className="w-full bg-white/10 rounded-2xl px-5 py-4 mb-6 outline-none"
        />

        <button
          onClick={
            handleRegister
          }
          className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black py-4 rounded-2xl font-bold"
        >

          Register

        </button>

        <button

  onClick={
    handleGoogleRegister
  }

  className="w-full mt-4 bg-white text-black py-4 rounded-2xl font-bold"

>

  Register dengan Google

</button>

        <p className="text-center mt-6 text-gray-400">
  Sudah punya akun?{" "}
  <a
    href="/login"
    className="text-yellow-400 hover:underline"
  >
    Login
  </a>
</p>

      </div>

    </main>
  )
}