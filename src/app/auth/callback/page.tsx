"use client"

import {
  useEffect
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  supabase
} from "../../../lib/supabase"

export default function
AuthCallbackPage(){

  const router =
  useRouter()

  useEffect(()=>{

    async function
    handleAuth(){

      const {
        data:{
          user
        }
      } =

      await supabase
      .auth
      .getUser()

      if(!user){

        router.push(
          "/login"
        )

        return
      }

      const {
        data:
        existingProfile
      } =

      await supabase

      .from(
        "profiles"
      )

      .select(
        "id"
      )

      .eq(
        "id",
        user.id
      )

      .maybeSingle()

      if(
        !existingProfile
      ){

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
          ?.split(
            "@"
          )[0],

          remaining_tryouts:
          0
        })
      }

      router.push(
        "/dashboard"
      )
    }

    handleAuth()

  },[
    router
  ])

  return (

    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

      <p className="text-xl">

        Memproses login...

      </p>

    </main>
  )
}