import { Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Invoice from 'src/pages/components/Invoice/Invoice'

/* Types */
type Mode = 'view' | 'edit' | 'create'

/* States */
const now = new Date()

const tomorrowDate = now.setDate(now.getDate() + 7)

const index = () => {
  const router = useRouter()
  const [issueDate, setIssueDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>(new Date(tomorrowDate))
  const [selected, setSelected] = useState<string>('Test')
  const [mode, setMode] = useState<Mode>('create')
  const [items, setItems] = useState([{ productId: 0, quantity: 0, cost: 0, discount: 0 }]) // State for items
  const [tax, setTax] = useState(21) // Tax percentage as a fixed state for now
  const [note, setNote] = useState('')
  const invoiceNumber = 100

  return (
    <>
      <Box gap={2}>
        <Box>
          <Invoice
            issueDate={issueDate}
            setIssueDate={setIssueDate}
            dueDate={dueDate}
            setDueDate={setDueDate}
            selected={selected}
            setSelected={setSelected}
            mode={mode}
            setMode={setMode}
            items={items}
            setItems={setItems}
            tax={tax}
            setTax={setTax}
            note={note}
            setNote={setNote}
            invoiceNumber={invoiceNumber}
          />
        </Box>
        <Box marginTop={6}>
          <Button variant='contained' onClick={() => router.push(`/invoice/view/${invoiceNumber}`)}>
            Preview
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default index
