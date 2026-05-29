"use client"

import {
  useEffect
} from "react"

import {
  supabase
} from "../lib/supabase"

export function
useAdminGuard(){

  useEffect(()=>{

    async function
    checkAdmin(){

      const {
        data
      } =

      await supabase
      .auth
      .getUser()

      const user =
      data.user

      // belum login
      if(!user){

        window.location.href =
        "/login"

        return
      }

      const adminEmails = [

        "pakpahansamuel1307@gmail.com"

      ]

      const isAdmin =

      adminEmails
      .includes(

        user.email
        || ""

      )

      // bukan admin
      if(
        !isAdmin
      ){

        window.location.href =
        "/dashboard"
      }
    }

    checkAdmin()

  },[])
}