"use client"

import {
  Clock,
  Star
} from "lucide-react"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

type Product = {

  id:number

  title:string

  type:string

  level:string

  duration:string

  premium:boolean
}

export default function
TryoutList(){

  const [
    products,
    setProducts
  ] =
  useState<Product[]>(
    []
  )

  useEffect(()=>{

    async function
    loadProducts(){

      const {
        data,
        error
      } =
      await supabase

      .from(
        "products"
      )

      .select("*")

      .order(
        "created_at",
        {
          ascending:false
        }
      )

      .limit(6)

     if(error){

  console.log(
    "PRODUCT ERROR:",
    error
  )

  alert(
    error.message
  )

  return
}

      setProducts(
        data || []
      )
    }

    loadProducts()

  },[])

  return (

    <section className="mt-12">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-3xl font-bold">

          Terbaru

        </h2>

        <a
          href="/start"
          className="text-yellow-400 hover:underline"
        >
          Lihat Semua
        </a>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {products.map(
        (item)=>(

          <div
            key={item.id}
            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition-all duration-300"
          >

            <div className="flex items-center justify-between mb-6">

              <span className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm">

                {item.level}

              </span>

              {item.premium && (

                <Star
                  className="text-yellow-400"
                  size={20}
                />

              )}

            </div>

            <h3 className="text-2xl font-bold mb-3">

              {item.title}

            </h3>

            <p className="text-sm text-gray-400 mb-5 capitalize">

              {item.type}

            </p>

            <div className="flex items-center gap-3 text-gray-400 mb-8">

              <Clock size={18} />

              {item.duration}

            </div>

            <button
              onClick={()=>{
                window.location.href =
                "/start"
              }}
              className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:opacity-90 transition text-black font-bold py-4 rounded-2xl"
            >

              Lihat Detail

            </button>

          </div>

        ))}

      </div>

    </section>
  )
}