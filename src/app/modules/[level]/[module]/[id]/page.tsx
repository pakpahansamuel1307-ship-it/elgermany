"use client"

import Link from "next/link"
import {
  use,
  useEffect,
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  supabase
} from "../../../../../lib/supabase"

type Props = {
  params:Promise<{
    level:string
    module:string
    id:string
  }>
}

export default function
ModulePage({
  params
}:Props){

  const {
    level,
    module,
    id
  } = use(params)

  const router =
  useRouter()

  const [
    unlocked,
    setUnlocked
  ] =
  useState(false)

  const [
    showPayment,
    setShowPayment
  ] =
  useState(false)

  const [
    proof,
    setProof
  ] =
  useState<
    File | null
  >(null)

  const productId =

`${level}-${module}-${id}`

  const prices:{
    [key:string]:
    string
  } = {

    horen:
    "Rp10.000",

    lesen:
    "Rp10.000",

    schreiben:
    "Rp12.000",

    sprechen:
    "Rp13.000"
  }

  const handleBuy =
  async ()=>{

    const {
      data:userData
    } =

    await supabase
    .auth
    .getUser()

    const user =
    userData.user

    if(!user){

      router.push(
        "/login"
      )

      return
    }

    setShowPayment(
      true
    )
  }

  const handleSubmitPayment =
  async ()=>{

    const {
      data:userData
    } =

    await supabase
    .auth
    .getUser()

    const user =
    userData.user

    if(!user){

      router.push(
        "/login"
      )

      return
    }

    if(
      !proof
    ){

      alert(
"Upload bukti transfer dulu."
      )

      return
    }

    const fileName =

`${Date.now()}-${
  proof.name
}`

    const {
      error:
      uploadError
    } =

    await supabase

    .storage

    .from(
      "payment-proofs"
    )

    .upload(

      fileName,

      proof
    )

    if(
      uploadError
    ){

      alert(
"Gagal upload bukti transfer"
      )

      return
    }

    const {
      data:
      imageData
    } =

    supabase

    .storage

    .from(
      "payment-proofs"
    )

    .getPublicUrl(
      fileName
    )

    const proofUrl =

      imageData
      .publicUrl

    const {
      error
    } =

    await supabase

    .from(
      "purchases"
    )

    .insert({

      user_id:
      user.id,

      product_type:
      "module",

      product_id:
      productId,

      quantity:
      1,

      proof_url:
      proofUrl,

      status:
      "pending"
    })

    if(error){

      alert(
        error.message
      )

      return
    }

    alert(

"Pembelian modul berhasil dikirim. Menunggu approval admin."

    )

    setProof(
      null
    )

    setShowPayment(
      false
    )
  }

  useEffect(()=>{

    async function
    checkPurchase(){

      const {
        data:userData
      } =

      await supabase
      .auth
      .getUser()

      const user =
      userData.user

      if(!user){

        return
      }

      const {
        data,
        error
      } =

      await supabase

      .from(
        "purchases"
      )

      .select("*")

      .eq(
        "user_id",
        user.id
      )

      .eq(
        "product_type",
        "module"
      )

      .eq(
        "product_id",
        productId
      )

      .eq(
        "status",
        "approved"
      )

      .maybeSingle()

      if(error){

        console.log(
          error
        )

        return
      }

      setUnlocked(
        !!data
      )
    }

    checkPurchase()

  },[
    productId
  ])

  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10">

          <h1 className="text-4xl font-bold mb-4">

            Goethe{" "}

            {
              level
              .toUpperCase()
            }

            {" "}

            {module}

            {" "}

            #{id}

          </h1>

          {unlocked ? (

            <div>

              <p className="text-green-400 text-xl mb-8">

                ✅ Modul unlocked

              </p>

              <div className="flex gap-4 flex-wrap">

                <Link
href={`/exam/module/${module}/${level}/${id}`}
                >

                  <button
className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold"
                  >

                    Mulai Modul

                  </button>

                </Link>

                <Link
href={`/modules/video/${productId}`}
                >

                  <button
className="bg-white/10 px-8 py-4 rounded-2xl"
                  >

                    Video Pembahasan

                  </button>

                </Link>

              </div>

            </div>

          ) : (

            <div>

              <p className="text-red-400 text-xl mb-6">

                🔒 Modul terkunci

              </p>

              <p className="text-3xl font-bold mb-8">

                {
                  prices[
                    module
                  ]
                }

              </p>

              <button
                onClick={
                  handleBuy
                }

className="bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold"
              >

                Beli Modul

              </button>

              {showPayment && (

                <div className="mt-8 bg-white/5 border border-white/10 rounded-[30px] p-8">

                  <h3 className="text-2xl font-bold mb-5">

                    Upload Bukti Transfer

                  </h3>

                  <p className="text-gray-300">

                    Transfer ke:
                  </p>

                  <p className="text-gray-300">

                    BCA:
                    123456789
                  </p>

                  <p className="text-gray-300 mb-6">

                    a.n. Samuel
                  </p>

                  <input
                    type="file"
                    accept="image/*"

                    className="block w-full"

                    onChange={(
                      e
                    )=>{

                      const file =

e.target.files?.[0]

                      if(file){

                        setProof(
                          file
                        )
                      }
                    }}
                  />

                  {proof && (

                    <p className="text-green-400 mt-3">

                      File dipilih:
                      {" "}

                      {
                        proof
                        .name
                      }

                    </p>

                  )}

                  <button
                    onClick={
handleSubmitPayment
                    }

className="mt-6 bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold"
                  >

                    Kirim Bukti Transfer

                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </main>
  )
}