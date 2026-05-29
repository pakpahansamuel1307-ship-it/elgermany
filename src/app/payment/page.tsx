"use client"


import { useEffect,useState } from "react"
import {useAuthGuard} from "../../hooks/useAuthGuard"
import {supabase} from "../../lib/supabase"





const plans = [

  {
    name:"1 Token Tryout",
    price:"Rp25.000",
    tokens:1
  },

  {
    name:"5 Token Tryout",
    price:"Rp100.000",
    tokens:5
  },

  {
    name:"10 Token Tryout",
    price:"Rp180.000",
    tokens:10
  }

]

export default function PaymentPage(){

  useAuthGuard()

  const [selected,
  setSelected] =
    useState<number | null>(
      null
    )

  const [proof,
  setProof] =
    useState<File | null>(
      null
    )

    const [
  selectedPackage,
  setSelectedPackage
] =
useState<number | null>(
  null
)

const handleSubmit =
async ()=>{

  if(
    selected === null
  ){

    alert(
      "Pilih paket."
    )

    return
  }

  const {
    data:userData
  } =
  await supabase.auth
  .getUser()

  if(
    !userData.user
  ){

    alert(
      "Login dulu."
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
      "Gagal upload bukti transfer."
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
    userData.user.id,

    product_type:
    "token",

    product_id:
    "tryout-token",

    quantity:
    plans[selected]
    .tokens,

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
    "Payment berhasil dikirim."
  )
}



  return (

    <main className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">

          Pembelian Token

        </h1>

        {/* BANK */}

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-10">

          <h2 className="text-2xl font-bold mb-5">

            Transfer ke:

          </h2>

          <p className="text-gray-300">

            BCA: 123456789

          </p>

          <p className="text-gray-300">

            a.n. Samuel

          </p>

        </div>

        {/* PLANS */}

        <div
 

 className="cursor-pointer ..."
>

          {plans.map(
            (plan,index)=>(

            <button
              key={index}
              onClick={()=>
                setSelected(index)
              }
              className={`

              p-8
              rounded-[30px]
              border
              text-left
              transition-all

              ${
                selected===index
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-white/10 bg-white/5"
              }

              `}
            >

              <h2 className="text-2xl font-bold mb-2">

                {plan.name}

              </h2>

              <p className="text-yellow-400 text-xl font-semibold">

                {plan.price}

              </p>

            </button>

          ))}

        </div>

        {/* UPLOAD */}

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">

          <p className="mb-5">

            Upload bukti transfer

          </p>

          <input
  type="file"
  accept="image/*"
  className="mt-4 block w-full text-sm"
  onChange={(e)=>{

    const file =
      e.target.files?.[0]

    if(file){

      console.log(file)

      setProof(file)
    }
  }}
/>

{proof && (

  <p className="text-green-400 mt-3">

    File dipilih:
    {" "}
    {proof.name}

  </p>

)}

         <button
  type="button"
  onClick={()=>
    handleSubmit()
  }
  className="mt-8 bg-gradient-to-r from-yellow-400 to-red-500 text-black px-8 py-4 rounded-2xl font-bold"
>

  Kirim Bukti Transfer

</button>

        </div>

      </div>

    </main>
  )
}