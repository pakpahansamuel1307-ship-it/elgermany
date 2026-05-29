"use client"

import {
  useEffect,
  useState
} from "react"

import {
  User,
  Coins,
  Trophy,
  LogOut
} from "lucide-react"

import { supabase }
from "../lib/supabase"

export default function
ProfileSection(){

    const [
  avatarUrl,
  setAvatarUrl
] =
useState("")                                                                                                                                                                                                                                                                                                                                                                                                                                            

  const [
    loading,
    setLoading
  ] =
  useState(true)

  const [
    username,
    setUsername
  ] =
  useState("")

  const [
    email,
    setEmail
  ] =
  useState("")

  const [
    token,
    setToken
  ] =
  useState(0)

  const [
    totalTryout,
    setTotalTryout
  ] =
  useState(0)

  const [
    highestScore,
    setHighestScore
  ] =
  useState(0)

  useEffect(()=>{

    async function
    loadProfile(){

      const {
        data:userData
      } =
      await supabase
      .auth
      .getUser()

      const user =
      userData.user

      if(!user) return

      const {
        data:profile
      } =
      await supabase

      .from(
        "profiles"
      )

      .select("*")

      .eq(
        "id",
        user.id
      )

      .single()

      const {
        data:results
      } =
      await supabase

      .from(
        "results"
      )

      .select("score")

      .eq(
        "user_id",
        user.id
      )

      const total =
      results?.length
      || 0

      const highest =
      results?.length
      ? Math.max(
          ...results.map(
            item=>
            item.score
          )
        )
      : 0

      setUsername(
        profile
        ?.username
        || ""
      )

      setEmail(
        profile
        ?.email
        || ""
      )

      setAvatarUrl(
  profile
  ?.avatar_url
  || ""
)

      setToken(
        profile
        ?.remaining_tryouts
        || 0
      )

      setTotalTryout(
        total
      )

      setHighestScore(
        highest
      )

      setLoading(false)
    }

    loadProfile()

  },[])

  async function
uploadAvatar(
  event:any
){

  const file =
  event.target
  .files?.[0]

  if(!file)
  return

  const {
    data:userData
  } =
  await supabase
  .auth
  .getUser()

  const user =
  userData.user

  if(!user)
  return

  const fileExt =
  file.name
  .split(".")
  .pop()

  const fileName =
  `${user.id}.${fileExt}`

  const {
    error:
    uploadError
  } =
  await supabase

  .storage

  .from(
    "avatars"
  )

  .upload(

    fileName,

    file,

    {
      upsert:true
    }

  )

  if(uploadError){

    alert(
      uploadError
      .message
    )

    return
  }

  const {
    data
  } =
  supabase

  .storage

  .from(
    "avatars"
  )

  .getPublicUrl(
    fileName
  )

  const publicUrl =
  data.publicUrl

  setAvatarUrl(
    publicUrl
  )

  await supabase

  .from(
    "profiles"
  )

  .update({

    avatar_url:
    publicUrl

  })

  .eq(
    "id",
    user.id
  )

  alert(
    "Foto profile berhasil diupload"
  )
}

  async function
  saveProfile(){

    const {
      data:userData
    } =
    await supabase
    .auth
    .getUser()

    const user =
    userData.user

    if(!user) return

    const {
      error
    } =
    await supabase

    .from(
      "profiles"
    )

    .update({

      username

    })

    .eq(
      "id",
      user.id
    )

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(
      "Profile berhasil disimpan"
    )
  }

  if(loading){

    return (

      <div>

        Loading...

      </div>

    )
  }

  return (

    <div>

      <h1 className="text-4xl font-bold mb-3">

        Profile

      </h1>

      <button
  onClick={async()=>{

    await supabase
    .auth
    .signOut()

    window.location.href =
    "/"

  }}

  className="flex flex-col items-center justify-center py-4 text-red-400"
>

  <LogOut
    size={22}
  />

  <span className="text-xs mt-1">

    Logout

  </span>

</button>

      <p className="text-gray-400 mb-10">

        Kelola informasi akunmu

      </p>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* PROFILE CARD */}

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">

          <div className="flex flex-col items-center">

            <div className="mb-5">

  {avatarUrl ? (

    <img
      src={
        avatarUrl
      }
      alt="avatar"
      className="w-28 h-28 rounded-full object-cover border-4 border-yellow-400"
    />

  ) : (

    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center">

      <User
        size={50}
        className="text-black"
      />

    </div>

  )}

</div>

<label className="cursor-pointer bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-2xl text-sm inline-block">

  Upload Foto

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={
      uploadAvatar
    }
  />

</label>

            <h2 className="text-2xl font-bold">

              {username}

            </h2>

            <p className="text-gray-400 mt-1">

              {email}

            </p>

          </div>

        </div>

        {/* EDIT */}

        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-8">

          <h2 className="text-2xl font-bold mb-8">

            Edit Profile

          </h2>

          <div className="space-y-6">

            <div>

              <label className="block mb-2 text-gray-400">

                Username

              </label>

              <input
                value={username}
                onChange={(e)=>
                  setUsername(
                    e.target.value
                  )
                }
                className="w-full bg-white/10 rounded-2xl px-5 py-4 outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 text-gray-400">

                Email

              </label>

              <input
                disabled
                value={email}
                className="w-full bg-white/5 rounded-2xl px-5 py-4 text-gray-500"
              />

            </div>

            {/* STATS */}

            <div className="grid md:grid-cols-3 gap-4">

              <div className="bg-white/5 rounded-3xl p-5 border border-white/10">

                <div className="flex items-center gap-2 text-yellow-400 mb-2">

                  <Coins size={18} />

                  Token

                </div>

                <h2 className="text-3xl font-bold">

                  {token}

                </h2>

              </div>

              <div className="bg-white/5 rounded-3xl p-5 border border-white/10">

                <div className="flex items-center gap-2 text-yellow-400 mb-2">

                  <Trophy size={18} />

                  Tryout

                </div>

                <h2 className="text-3xl font-bold">

                  {totalTryout}

                </h2>

              </div>

              <div className="bg-white/5 rounded-3xl p-5 border border-white/10">

                <div className="flex items-center gap-2 text-yellow-400 mb-2">

                  <Trophy size={18} />

                  Best Score

                </div>

                <h2 className="text-3xl font-bold">

                  {highestScore}

                </h2>

              </div>

            </div>

            <button
              onClick={
                saveProfile
              }
              className="bg-gradient-to-r from-yellow-400 to-red-500 text-black font-bold px-8 py-4 rounded-2xl"
            >

              Simpan Perubahan

            </button>

          </div>

        </div>

      </div>

    </div>
  )
}