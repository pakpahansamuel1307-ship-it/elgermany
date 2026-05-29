"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function DashboardMain() {

  const [email,setEmail] = useState("")
  const [remaining,setRemaining] = useState(0)

  useEffect(()=>{

    async function getProfile(){

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if(!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if(data){
        setEmail(data.email)
        setRemaining(data.remaining_tryouts)
      }
    }

    getProfile()

  },[])

  return (
    <main className="dashboard-main">

      <h1 className="dashboard-title">
        Willkommen 👋
      </h1>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Email</h3>
          <p style={{fontSize:"18px"}}>
            {email}
          </p>
        </div>

        <div className="stat-card">
          <h3>Sisa Try Out</h3>
          <p>
            {remaining}
          </p>
        </div>

        <div className="stat-card">
          <h3>Status</h3>
          <p>
            Active
          </p>
        </div>

      </div>

    </main>
  )
} 