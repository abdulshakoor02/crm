import React from "react"
import Invoice from "../components/Invoice/Invoice"
import { Grid } from "@mui/material"

const InvoiceMain = () => {
  return (
    <>
       <Grid container spacing={6}>
         <Invoice/>
       </Grid>
    </>
  )
}

export default InvoiceMain