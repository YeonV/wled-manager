import * as React from 'react';
import {
  Card,
  Box,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Button,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import useStore from '../store/store';

export default function AddSegment({ devices, handleSegments }) {
  const [open, setOpen] = React.useState(false);
  const [device, setDevice] = React.useState('');
  const [segment, setSegment] = React.useState('');

  const handleChange = (event) => {
    setDevice(event.target.value);
  };
  const handleSegmentChange = (event) => {
    setSegment(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    handleSegments(JSON.parse(segment));
    setSegment('');
    setDevice('');
    setOpen(false);
  };

  //   React.useEffect(() => {
  //       if (devices && devices.length && devices[0] && devices[0].name) {
  //           setDevice(devices[0].name)
  //       }
  //   }, [devices])
  return (
    <div>
      <Card
        onClick={handleClickOpen}
        key={'addVirtual'}
        style={{
          cursor: 'pointer',
          margin: '0.5rem',
          padding: '0.5rem 0.25rem 0.5rem 0.5rem',
          background: 'transparent',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography style={{ color: '#fff', fontSize: '1rem' }}>
            Add
          </Typography>
          <Button
            disabled
            variant='outlined'
            size='small'
            style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
            +
          </Button>
        </div>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Segment to virtual</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Merge several segments of different devices into one virtual strip
          </DialogContentText>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id='select-device-label'>Select a Device</InputLabel>
              <Select
                labelId='select-device-label'
                id='selectDevice'
                value={device}
                label='Device'
                onChange={handleChange}
                color={'secondary'}>
                <MenuItem key={'empty'} value={''}>
                  {''}
                </MenuItem>
                {devices.map((d, i) => (
                  <MenuItem key={i} value={d.name}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {device && device !== '' && (
              <FormControl fullWidth>
                <InputLabel id='select-device-label'>
                  Select a Segment
                </InputLabel>
                <Select
                  labelId='select-device-label'
                  id='selectDevice'
                  value={segment}
                  label='Segment'
                  onChange={handleSegmentChange}
                  color={'secondary'}>
                  {devices
                    .filter((dev) => dev.name === device)
                    .map((d) => (
                      <MenuItem
                        key={'full'}
                        value={`{"device": "${device}","seg": [0,${d.pixel_count}],"name":"Full"}`}>
                        Full [0,{d.pixel_count - 1}]
                      </MenuItem>
                    ))}
                  {devices
                    .find(
                      (dev) =>
                        dev.name === device &&
                        dev.seg &&
                        dev.seg.length &&
                        dev.seg
                    )
                    .seg.map((s, i) => (
                      <MenuItem
                        key={i}
                        value={`{"device": "${device}","seg": [${s.start},${
                          s.stop
                        }],"name":"${s.n || 'Segment ' + (i + 1)}"}`}>
                        {s.n || `Segment ${i + 1} `} [{s.start},{s.stop}]
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            disabled={!device || device === '' || !segment || segment === ''}
            onClick={handleAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
