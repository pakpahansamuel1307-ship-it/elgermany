"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

type Purchase = {

  id:string

  user_id:string

  product_type:string

  product_id:string

  quantity:number

  status:string

  created_at:string

  proof_url?:string
}

export default function AdminPaymentsPage() {

  const [
    payments,
    setPayments
  ] = useState<Purchase[]>([])

  const [
    loading,
    setLoading
  ] = useState(true)

  async function fetchPayments() {

    const {
      data,
      error
    } =
    await supabase
      .from("purchases")
      .select("*")
     
   if(error){

  alert(
    JSON.stringify(
      error
    )
  )

  setLoading(false)

  return
}

    setPayments(
      data || []
    )

    setLoading(false)
  }

 async function
approvePayment(
  id:string
){

  const payment =
  payments.find(
    p => p.id === id
  )

  if(!payment){

    alert(
      "Payment tidak ditemukan"
    )

    return
  }

  const {
    error
  } =
  await supabase

  .from(
    "purchases"
  )

  .update({

    status:
    "approved"

  })

  .eq(
    "id",
    id
  )

  if(error){

    alert(
      error.message
    )

    return
  }

  // TOKEN

  if(
    payment
    .product_type
    ===
    "token"
  ){

    const {
      data:
      profileData
    } =
    await supabase

    .from(
      "profiles"
    )

    .select(
      "remaining_tryouts"
    )

    .eq(
      "id",
      payment.user_id
    )

    .single()

    const oldTryouts =

      profileData
      ?.remaining_tryouts
      || 0

    const {
      error:
      tokenError
    } =

    await supabase

    .from(
      "profiles"
    )

    .update({

      remaining_tryouts:

      oldTryouts +

      payment
      .quantity

    })

    .eq(
      "id",
      payment.user_id
    )

    if(tokenError){

      alert(
        tokenError
        .message
      )

      return
    }
  }

  // MODULE

if(
  payment
  .product_type
  ===
  "module"
){

  const [
    level,
    module,
    examSet
  ] =

  payment
  .product_id
  .split("-")

  await supabase

  .from(
    "exam_attempt_sessions"
  )

  .delete()

  .eq(
    "user_id",
    payment.user_id
  )

  .eq(
    "module",
    module
  )

  .eq(
    "level",
    level
  )

  .eq(
    "exam_set",
    Number(
      examSet
    )
  )
}

  alert(
"Approved & unlock berhasil"
  )

  fetchPayments()
}

async function
rejectPayment(
  id:string
){

  const {
    error
  } =

  await supabase

  .from(
    "purchases"
  )

  .update({

    status:
    "rejected"

  })

  .eq(
    "id",
    id
  )

  if(error){

    alert(
      error.message
    )

    return
  }

  fetchPayments()
}

  useEffect(()=>{

    fetchPayments()

  },[])

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-8">

        Admin Payments

      </h1>

      {loading && (

        <p>
          Loading...
        </p>

      )}

      {!loading &&
      payments.length === 0 && (

        <p>
          Belum ada pembayaran
        </p>

      )}

      <div className="space-y-4">

        {payments.map(
          payment => (

          <div
            key={payment.id}
            className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800"
          >

            <p>

              <b>Produk:</b>{" "}
              {payment.product_id}

            </p>

            <p>

              <b>Tipe:</b>{" "}
              {payment.product_type}

            </p>

            <p>

              <b>Jumlah:</b>{" "}
              {payment.quantity}

            </p>

            <p>

              <b>Status:</b>{" "}
              {payment.status}

            </p>

{payment
.proof_url && (

  <div className="my-5">

    <img
      src={
        payment
        .proof_url
      }

      alt="proof"

      className="rounded-2xl border border-zinc-700 max-h-[300px]"
    />

  </div>

)}

            <p>

              <b>Tanggal:</b>{" "}
              {payment.created_at}

            </p>

            {payment.status
            ===
            "pending" && (

              <div className="flex gap-3 mt-4">

  <button
    onClick={()=>

      approvePayment(
        payment.id
      )
    }

    className="bg-green-600 px-6 py-3 rounded-xl"
  >

    Approve

  </button>

  <button
    onClick={()=>

      rejectPayment(
        payment.id
      )
    }

    className="bg-red-600 px-6 py-3 rounded-xl"
  >

    Reject

  </button>

</div>

            )}

          </div>

        ))}

      </div>

    </main>
  )
}