"use client"

import { useState } from "react"
import { useAuthGuard } from "../../hooks/useAuthGuard"
import { supabase } from "../../lib/supabase"
import { Ticket, Crown, CheckCircle2 } from "lucide-react"

const tokenPlans = [
  {
    name:"1 Token Tryout",
    price:"€ 3",
    tokens:1
  },
  {
    name:"5 Token Tryout",
    price:"€ 13",
    tokens:5
  },
  {
    name:"10 Token Tryout",
    price:"€ 27",
    tokens:10
  }
]

const subscriptionPlans = [
  {
    name:"1 Bulan",
    price:"€ 5",
    months:1,
    perks:["Semua level A1-B2", "Video baru setiap minggu"]
  },
  {
    name:"3 Bulan",
    price:"€ 12",
    months:3,
    perks:["Semua level A1-B2", "Video baru setiap minggu", "Hemat dibanding per bulan"]
  },
  {
    name:"6 Bulan",
    price:"€ 20",
    months:6,
    perks:["Semua level A1-B2", "Video baru setiap minggu", "Paling hemat"]
  }
]

export default function PaymentPage(){

  useAuthGuard()

  const [tab, setTab] = useState<"token" | "subscription">("token")

  const [selected, setSelected] = useState<number | null>(null)
  const [proof, setProof] = useState<File | null>(null)

  const handleSubmit = async ()=>{

    if(selected === null){
      alert("Please select a package.")
      return
    }

    const { data:userData } = await supabase.auth.getUser()

    if(!userData.user){
      alert("Login dulu.")
      return
    }

    if(!proof){
      alert("Please upload a payment proof.")
      return
    }

    const fileName = `${Date.now()}-${proof.name}`

    const { error:uploadError } = await supabase
      .storage
      .from("payment-proofs")
      .upload(fileName, proof)

    if(uploadError){
      alert("Failed to upload proof of transfer")
      return
    }

    const { data:imageData } = supabase
      .storage
      .from("payment-proofs")
      .getPublicUrl(fileName)

    const proofUrl = imageData.publicUrl

    const isSubscription = tab === "subscription"

    const productType = isSubscription ? "subscription" : "token"

    const productId = isSubscription
      ? `sub-${subscriptionPlans[selected].months}`
      : "tryout-token"

    const quantity = isSubscription
      ? subscriptionPlans[selected].months
      : tokenPlans[selected].tokens

    const { error } = await supabase
      .from("purchases")
      .insert({
        user_id: userData.user.id,
        product_type: productType,
        product_id: productId,
        quantity: quantity,
        proof_url: proofUrl,
        status: "pending"
      })

    if(error){
      alert(error.message)
      return
    }

    alert("Payment successfully submitted.")

    setSelected(null)
    setProof(null)
  }

  const activePlans = tab === "token" ? tokenPlans : subscriptionPlans

  return (

    <main className="min-h-screen bg-paper text-ink p-6 md:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          Payment
        </h1>

        {/* TAB */}

        <div className="inline-flex bg-surface border border-border rounded-2xl p-1.5 mb-10 shadow-sm">

          <button
            onClick={()=>{ setTab("token"); setSelected(null) }}
            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors duration-200 ${
              tab === "token" ? "bg-gradient-to-r from-gold to-crimson text-ink" : "text-mist"
            }`}
          >
            <Ticket size={16} />
            Token Tryout
          </button>

          <button
            onClick={()=>{ setTab("subscription"); setSelected(null) }}
            className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors duration-200 ${
              tab === "subscription" ? "bg-gradient-to-r from-gold to-crimson text-ink" : "text-mist"
            }`}
          >
            <Crown size={16} />
            Langganan Video
          </button>

        </div>

        {/* BANK */}

        <div className="bg-surface border border-border rounded-[40px] p-8 mb-10 shadow-sm">

          <h2 className="text-2xl font-bold mb-5">
            Transfer to:
          </h2>

          <p className="text-mist">
            BNI: 1847255472 / chat admin first
          </p>

          <p className="text-mist">
            a.n. Samuel Ephraim Pakpahan
          </p>

        </div>

        {/* PLANS */}

        <div className="grid sm:grid-cols-3 gap-5 mb-10">

          {activePlans.map((plan, index)=>(

            <button
              key={index}
              onClick={()=>setSelected(index)}
              className={`p-8 rounded-[30px] border text-left transition-all duration-200 ${
                selected === index
                  ? "border-gold bg-gold/10"
                  : "border-border bg-surface hover:shadow-md"
              }`}
            >

              <h2 className="text-2xl font-bold mb-2">
                {plan.name}
              </h2>

              <p className="text-crimson text-xl font-semibold mb-4">
                {plan.price}
              </p>

              {"perks" in plan && (
                <ul className="space-y-1.5">
                  {plan.perks.map((perk:string)=>(
                    <li key={perk} className="flex items-start gap-1.5 text-xs text-mist">
                      <CheckCircle2 size={13} className="text-green-600 shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>
              )}

            </button>

          ))}

        </div>

        {/* UPLOAD */}

        <div className="bg-surface border border-border rounded-[40px] p-8 shadow-sm">

          <p className="mb-5 font-semibold">
            Upload Payment Proof
          </p>

          <input
            type="file"
            accept="image/*"
            className="mt-4 block w-full text-sm text-mist"
            onChange={(e)=>{
              const file = e.target.files?.[0]
              if(file){
                setProof(file)
              }
            }}
          />

          {proof && (
            <p className="text-green-700 mt-3 text-sm">
              File selected: {proof.name}
            </p>
          )}

          <button
            type="button"
            onClick={()=>handleSubmit()}
            className="mt-8 bg-gradient-to-r from-gold to-crimson text-ink px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity duration-200"
          >
            Upload Proof of Payment
          </button>

        </div>

      </div>

    </main>
  )
}
