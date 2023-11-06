/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material'
import useStore from '../store/store'
import { useState } from 'react'

export default function AddVirtual() {
  const [open, setOpen] = useState(false)
  const [virtual, setVirtual] = useState('')
  const addVirtual = useStore((state) => state.addVirtual)
  const virtuals = useStore((state) => state.virtuals)
  const handleChange = (event) => {
    setVirtual(event.target.value)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleAdd = () => {
    addVirtual({
      name: virtual,
      type: 'span',
      pixel_count: 0
    })
    setOpen(false)
  }

  return (
    <div>
      <Card
        onClick={handleClickOpen}
        key={'addVirtual'}
        style={{
          cursor: 'pointer',
          margin: '0.5rem',
          padding: '0.5rem 0.25rem 0.5rem 0.5rem',
          background: 'transparent'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography style={{ color: '#fff', fontSize: '1rem' }}>Add</Typography>
          <Button
            disabled
            variant="outlined"
            size="small"
            style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}
          >
            +
          </Button>
        </div>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Virtual Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Merge several segments of different devices into one virtual strip
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Enter a Name"
            value={virtual}
            onChange={handleChange}
            type="text"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={virtuals.find((v) => v.name === virtual) ? true : false}
            onClick={handleAdd}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
