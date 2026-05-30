"use client"

import { useState }
from "react"

import { supabase }
from "../../lib/supabase"

export default function LoginPage(){

  const [email,
  setEmail] =
    useState("")

  const [password,
  setPassword] =
    useState("")

 const handleLogin =
async ()=>{

  const {
    data,
    error
  } =
  await supabase.auth
  .signInWithPassword({

    email,
    password
  })

  if(error){

    alert(
      error.message
    )

    return
  }

  const user =
  data.user

  if(user){

    const {
      data:
      existingProfile
    } =
    await supabase
    .from(
      "profiles"
    )
    .select("id")
    .eq(
      "id",
      user.id
    )
    .maybeSingle()

    if(!existingProfile){

      const {
        error:
        profileError
      } =
      await supabase
      .from(
        "profiles"
      )
      .insert({

        id:
        user.id,

        email:
        user.email,

        username:
        user.email
        ?.split("@")[0],

        remaining_tryouts:
        0

      })

      if(profileError){

        console.log(
          profileError
        )

        alert(
          profileError.message
        )

        return
      }
    }
  }

  window.location.href =
  "/dashboard"
}

  const handleGoogleLogin =
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

`${window.location.origin}/dashboard`

    }
  })

  if(error){

    alert(
      error.message
    )
  }
}

const handleForgotPassword =
async ()=>{

  if(!email){

    alert(
      "Masukkan email dulu"
    )

    return
  }

  const {
    error
  } =

  await supabase
  .auth
  .resetPasswordForEmail(

    email,

    {

      redirectTo:

`${window.location.origin}/reset-password`

    }
  )

  if(error){

    alert(
      error.message
    )

    return
  }

  alert(

"Email reset password berhasil dikirim"

  )
}

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8 text-center">

          Login

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
            handleLogin
          }
          className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black py-4 rounded-2xl font-bold"
        >

          Login

        </button>

        <button

  onClick={
    handleForgotPassword
  }

  className="text-sm text-yellow-400 mt-4 hover:underline"

>

  Lupa Password?

</button>

        <button

  onClick={
    handleGoogleLogin
  }

  className="w-full mt-4 bg-white text-black py-4 rounded-2xl font-bold"

>

  Login dengan Google

</button>

        <p className="text-center mt-6 text-gray-400">
  Belum punya akun?{" "}
  <a
    href="/register"
    className="text-yellow-400 hover:underline"
  >
    Daftar sekarang
  </a>
</p>

      </div>

    </main>
  )
}