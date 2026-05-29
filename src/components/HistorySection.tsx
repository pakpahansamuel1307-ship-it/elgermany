"use client"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

type Attempt = {

  id:number

  module_type:string

  tryout_title:string

  level:string

  score:number

  created_at:string
}

export default function
HistorySection(){

  const [
    results,
    setResults
  ] =
  useState<
    Attempt[]
  >([])

  useEffect(()=>{

    async function
    loadHistory(){

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

      const {
        data,
        error
      } =
      await supabase

      .from(
        "tryout_attempts"
      )

      .select("*")

      .eq(
        "user_id",
        user.id
      )

    

      .order(
        "created_at",
        {
          ascending:false
        }
      )

      if(error){

        console.log(
          error
        )

        return
      }

      setResults(
        data || []
      )
    }

    loadHistory()

  },[])

  return (

    <div>

      <h1 className="text-4xl font-bold mb-3">

        History

      </h1>

      <p className="text-gray-400 mb-8">

        Riwayat tryout
        yang sudah kamu kerjakan

      </p>

      <div className="space-y-4">

        {results.length
        === 0 && (

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400">

            Belum ada history tryout

          </div>

        )}

        {results.map(
          item=>(

            <div
              key={
                item.id
              }

              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between"
            >

              <div>

                <div className="flex items-center gap-3">

  <h2 className="text-xl font-bold">

    {
      item
      .tryout_title
    }

  </h2>

  <span
    className={`

    text-xs
    px-3
    py-1
    rounded-full
    font-bold

    ${
      item
      .module_type
      === "full"

      ?

      "bg-green-500/20 text-green-400"

      :

      "bg-yellow-500/20 text-yellow-400"
    }

    `}
  >

    {
      item
      .module_type
      === "full"

      ?

      "FULL"

      :

      "MODULE"
    }

  </span>

</div>

                <p className="text-gray-400 text-sm mt-1">

                  Level
                  {" "}
                  {
                    item
                    .level
                    ?.toUpperCase()
                  }

                  {" • "}

                  {
                    new Date(
                      item.created_at
                    )

                    .toLocaleDateString(
                      "id-ID"
                    )
                  }

                </p>

              </div>

              <div className="text-right">

  <p className="text-gray-400 text-sm">

    Score

  </p>

  <h2 className="text-2xl font-bold text-yellow-400 mb-4">

    {item.score}

  </h2>

</div>

            </div>

          )
        )}

      </div>

    </div>
  )
}