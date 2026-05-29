"use client"

import {
  useState
} from "react"

import {
  supabase
} from "../../lib/supabase"

import {
  useRouter
} from "next/navigation"

export default function
ResetPasswordPage(){

  const router =
  useRouter()

  const [
    password,
    setPassword
  ] =
  useState("")

  async function
  handleReset(){

    const {
      error
    } =

    await supabase
    .auth
    .updateUser({

      password
    })

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(
      "Password berhasil diubah"
    )

    router.push(
      "/login"
    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">

          Password Baru

        </h1>

        <input
          type="password"
          placeholder="Password baru"

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
            handleReset
          }

          className="w-full bg-gradient-to-r from-yellow-400 to-red-500 text-black py-4 rounded-2xl font-bold"

        >

          Simpan Password

        </button>

      </div>

    </main>
  )
}