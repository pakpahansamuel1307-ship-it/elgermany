"use client"

import {
  useEffect,
  useState
} from "react"

import { supabase }
from "../lib/supabase"

type UserRank = {
  id:string
  username:string
  score:number
}

export default function
LeaderboardSection(){

  const [
    leaderboard,
    setLeaderboard
  ] =
  useState<UserRank[]>(
    []
  )

  const [
    myRank,
    setMyRank
  ] =
  useState(0)

  useEffect(()=>{

    async function
    loadLeaderboard(){

      const {
        data:userData
      } =
      await supabase
      .auth
      .getUser()

      const currentUser =
      userData.user

      /* ambil semua result */

      const {
        data:results,
        error
      } =
      await supabase

      .from(
        "results"
      )

      .select(
        "user_id,score"
      )

      if(
        error ||
        !results
      ){

        console.log(
          error
        )

        return
      }

      console.log ( "RESULTS ", results )

      /* ambil username */

      const {
        data:profiles
      } =
      await supabase

      .from(
        "profiles"
      )

      .select(
        "id,username"
      )

      console.log ( "PROFILES ", profiles )

      const profileMap =
      Object.fromEntries(

        profiles?.map(
          item=>[
            item.id,
            item.username
          ]
        ) || []

      )

      /* ambil nilai tertinggi tiap user */

      const userBest:
      Record<
        string,
        number
      > = {}

      results.forEach(
        item=>{

          if(

            !userBest[
              item.user_id
            ] ||

            item.score >
            userBest[
              item.user_id
            ]

          ){

            userBest[
              item.user_id
            ] =
            item.score
          }
        }
      )

      /* ranking global */

      const sorted =

      Object.entries(
        userBest
      )

      .map(
        ([
          id,
          score
        ])=>({

          id,

          username:
          profileMap[
            id
          ] || "User",

          score

        })
      )

      .sort(
        (
          a,
          b
        )=>

        b.score -
        a.score
      )

      /* TOP 20 */

console.log( "SORTED", sorted )

      setLeaderboard(

        sorted.slice(
          0,
          20
        )
      )



      /* ranking user sekarang */

      if(currentUser){

        const rank =
        sorted.findIndex(
          item=>

          item.id ===
          currentUser.id
        )

        setMyRank(
          rank + 1
        )
      }
    }

    loadLeaderboard()

  },[])

  return (

    <section>

      <h1 className="text-4xl font-bold mb-3">

        Leaderboard

      </h1>

      <p className="text-gray-400 mb-10">

        Top 20 Nilai
        Full Tryout Goethe

      </p>

      <div className="space-y-4">

        {leaderboard.map(
          (
            user,
            index
          )=>(

            <div
              key={
                user.id
              }
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between"
            >

              <div className="flex items-center gap-5">

                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center text-black font-bold">

                  #{index+1}

                </div>

                <div>

                  <h2 className="text-xl font-bold">

                    {
                      user
                      .username
                    }

                  </h2>

                </div>

              </div>

              <div className="text-2xl font-bold text-yellow-400">

                {
                  user.score
                }

              </div>

            </div>

          )
        )}

      </div>

      <div className="mt-8 bg-yellow-400/10 border border-yellow-400/20 rounded-3xl p-5">

        <h2 className="font-bold text-yellow-400 text-xl">

          Ranking Kamu:
          {" "}
          #{myRank || "-"}

        </h2>

      </div>

    </section>
  )
}