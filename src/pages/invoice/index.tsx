import React, { useRef } from "react"
import Invoice from "../components/Invoice/Invoice"
import { Box, Button, Grid } from "@mui/material"
import ReactToPdf from 'react-to-pdf'
import { Print } from "@mui/icons-material"

const InvoiceMain = () => {
  const PreviewRef = useRef(null);

  return (
    <>
       <Box gap={2}>
        <Box ref={PreviewRef}>
         <Invoice/>
        </Box>
         <ReactToPdf scale={0.66} targetRef={PreviewRef} filename={`invoice.pdf`}>
        {({ toPdf }: { toPdf: () => void }) => {
          return (
            <Button variant='contained' sx={{mt: 4}} color='success' onClick={toPdf}>
              Print <Print/>
            </Button>
          )
        }}
      </ReactToPdf>
       </Box>
    </>
  )
}

export default InvoiceMain