/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useLeftBarStyles, { cls } from './styles/Manager.styles'
import AudioDataContainer from './components/AudioContainer'
import useStore from './store/store'
import AddVirtual from './components/AddVirtual'
import AddSegment from './components/AddSegment'
import {
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  List,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import {
  ArrowDownward,
  ArrowUpward,
  Cast,
  ChevronLeft,
  ChevronRight,
  Close,
  Equalizer,
  Refresh,
  Settings,
  Stop
} from '@mui/icons-material'
import bonjour from 'bonjour'

function useQuery() {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const Manager = () => {
  if (typeof window === 'undefined') {
    return <>server-side-rendered</>
  }
  const theme = useTheme()
  const query = useQuery()
  const navigate = useNavigate()
  const leftBarOpen = useStore((state) => state.leftBarOpen)
  const setLeftBarOpen = useStore((state) => state.setLeftBarOpen)
  const bottomBarOpen = useStore((state) => state.bottomBarOpen)
  const setBottomBarOpen = useStore((state) => state.setBottomBarOpen)
  const iframe = useStore((state) => state.iframe)
  const setIframe = useStore((state) => state.setIframe)
  const devices = useStore((state) => state.devices)
  const setDevices = useStore((state) => state.setDevices)
  const device = useStore((state) => state.device)
  const setDevice = useStore((state) => state.setDevice)
  const virtuals = useStore((state) => state.virtuals)
  // const setVirtuals = useStore((state) => state.setVirtuals);
  const virtual = useStore((state) => state.virtual)
  const setVirtual = useStore((state) => state.setVirtual)
  const audioDevice = useStore((state) => state.audioDevice)
  const setDrawerBottomHeight = useStore((state) => state.setDrawerBottomHeight)
  const drawerWidth = useStore((state) => state.drawerWidth)
  const drawerBottomHeight = useStore((state) => state.drawerBottomHeight)
  const audioSettings = useStore((state) => state.audioSettings)
  // const fft = useStore(state => state.audioSettings.fft)
  // const bands = useStore(state => state.audioSettings.bands)
  const setAudioSettings = useStore((state) => state.setAudioSettings)
  const leftFb = useStore((state) => state.leftFb)
  const rightFb = useStore((state) => state.rightFb)
  const classes = useLeftBarStyles({
    drawerWidth,
    drawerBottomHeight,
    bottomBarOpen
  })
  const is2D = device.seg?.[0]?.startY === 0
  const [videoDevice, setVideoDevice] = useState<'none' | 'camera' | 'screen'>('none')
  const [zoom, setZoom] = useState(1)
  const [sizeW, setSizeW] = useState(64)
  const [sizeH, setSizeH] = useState(64)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const vcanvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef.current
  const ctx = canvas?.getContext('2d', { willReadFrequently: true })
  const vcanvas = vcanvasRef.current
  const vctx = vcanvas?.getContext('2d', { willReadFrequently: true })
  const video = videoRef.current
  const theStream = useRef<MediaStream | null>(null)
  const selectedPixels = useRef<[number, number][]>([])
  const color = useStore((state) => state.color)
  const bgColor = useStore((state) => state.bgColor)
  const selectPixel = (x: number, y: number) => {
    const pixel = [x, y] as [number, number]
    const pixelIndex = selectedPixels.current.findIndex((p) => p[0] === x && p[1] === y)
    if (pixelIndex === -1) {
      selectedPixels.current = [...selectedPixels.current, pixel]
    } else {
      selectedPixels.current = selectedPixels.current.filter((p) => p[0] !== x && p[1] !== y)
    }
  }
  const convertCanvas = async (ctx: CanvasRenderingContext2D, xres: number, yres: number) => {
    const ledDataPrefix = [2, 1]

    const imgData = ctx.getImageData(0, 0, xres, yres)
    const pixels = imgData.data

    // Create an array to store the LED data.
    const ledData = [] as any

    // Iterate over the pixel data and convert it into the desired format.
    for (let i = 0; i < pixels.length; i += 4) {
      const pixelData = [pixels[i], pixels[i + 1], pixels[i + 2]]
      ledData.push(pixelData)
    }

    // Flatten the LED data and add the prefix.
    const udpData = [{ ip: device.ip }, [...ledDataPrefix, ...ledData.flat()]]
    window.api.udp(udpData)
  }

  const videoCB = () => {
    // const startT = performance.now()
    if (video && vctx && ctx && canvas) {
      const w = (video.videoWidth / video.videoHeight) * canvas.height
      ctx.fillStyle = `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      vctx.drawImage(video, 0, 0)
      ctx.drawImage(video, (canvas.width - w) * 0.5, 0, w, canvas.height)

      // ctx.font = '6px serif'

      ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`
      selectedPixels.current.forEach((p) => {
        ctx.fillRect(p[0], p[1], 1, 1)
      })
      // ctx.fillText('Y', 0, 0)
      // ctx.strokeStyle = 'white'
      // ctx.strokeText('Pixel-Matrix', 0, 150, 300)

      convertCanvas(ctx, canvas.width, canvas.height)
      video.requestVideoFrameCallback(videoCB)
    }
    // const endT = performance.now()
    // console.log(`Total ctx vctx conv time: ${endT - startT} ms`);
  }

  const startCapture = () => {
    setTimeout(() => {
      if (vcanvas && video) {
        vcanvas.width = video.videoWidth
        vcanvas.height = video.videoHeight
        video.srcObject = theStream.current
        video.play()
        video.requestVideoFrameCallback(videoCB)
      }
    }, 350)
  }
  const stopCapture = () => {
    if (video) {
      video.pause()
      video.srcObject = null
      theStream.current?.getTracks().forEach((track: any) => track.stop())
    }
  }

  const [combNodes, setCombNodes] = useState<any>([])
  const [isZeroConf, setIsZeroConf] = useState(
    query.get('zeroconf') ||
      (typeof window !== 'undefined' && window.localStorage.getItem('wled-manager-zeroconf') === 'true') ||
      false
  )
  const [singleMode, setSingleMode] = useState(query.get('singlemode') || false)
  const [error, setError] = useState('')

  const virtualView = useStore((state) => state.virtualView)
  const setVirtualView = useStore((state) => state.setVirtualView)
  const removeVirtual = useStore((state) => state.removeVirtual)
  const addVirtual = useStore((state) => state.addVirtual)

  const openVirtual = (virtual) => {
    setVirtualView(virtual.name)
  }

  const handleRemoveVirtual = (v) => {
    if (v.name === virtualView) {
      setVirtualView(false)
    }
    removeVirtual(v)
  }
  const handleSegments = (segs) => {
    addVirtual({
      name: virtual.name,
      type: 'span',
      pixel_count: 0,
      seg: [...(virtual.seg || []), segs]
    })
  }
  const removeSeg = (i) => {
    const segs = [...virtual.seg]
    segs.splice(i, 1)

    addVirtual({
      name: virtual.name,
      type: 'span',
      pixel_count: 0,
      seg: [...segs]
    })
  }

  useEffect(() => {
    setVirtual(virtuals.find((v) => v.name === virtualView))
  }, [virtualView, virtuals])

  useEffect(() => {
    virtuals.map((v) => {
      if (v.seg && v.seg.length) {
        v.pixel_count = v.seg.map((s) => (s.seg && s.seg.length ? s.seg[1] - s.seg[0] : 0)).reduce((a, b) => a + b)
      }
      return v
    })
  }, [virtuals])

  useEffect(() => {
    window.api.resizeWindow([1024, 1080])
  }, [])

  useEffect(() => {
    const virt = virtuals.find((v) => v.name === virtualView)
    if (virt) {
      setVirtual(virt)
    }
  }, [virtuals, virtualView])

  useEffect(() => {
    if (query.get('zeroconf')) {
      setIsZeroConf(true)
    }
  }, [query])

  useEffect(() => {
    if (query.get('singlemode')) {
      setSingleMode(true)
    }
  }, [query])

  useEffect(() => {
    if (!isZeroConf && device) {
      console.log(device)
      if (!(combNodes.filter((n) => n.ip === device.ip).length > 0)) {
        setCombNodes((comb) => [
          ...comb,
          {
            name: device.name,
            type: device.type,
            ip: device.ip,
            vid: device.vid,
            pixel_count: device.pixel_count
          }
        ])
      }
      if (!devices.filter((n) => n.ip === device.ip).length) {
        setDevices([
          ...devices,
          {
            name: device.name,
            type: device.type,
            ip: device.ip,
            vid: device.vid,
            pixel_count: device.pixel_count
          }
        ])
      }
    }
  }, [devices, device])

  let bonjourInstance: null | bonjour.Bonjour = null

  useEffect(() => {
    if (isZeroConf) {
      bonjourInstance = require('bonjour')()
      if (bonjourInstance) {
        bonjourInstance.find({ type: 'wled' }, async (service) => {
          if (service.referer && service.referer.address) {
            if (
              !(combNodes.filter((n) => n.ip === service.referer.address).length > 0) ||
              !devices.filter((n) => n.ip === service.referer.address).length
            ) {
              console.log('wled found:', service.name)
              await window.api
                .fetch(`http://${service.referer.address}/json`)
                // .then((r) => r.json())
                .then((re) => {
                  if (!(combNodes.filter((n) => n.ip === service.referer.address).length > 0)) {
                    setCombNodes((comb) => [
                      ...comb,
                      {
                        name: service.name,
                        type: re.info.arch === 'esp8266' ? 82 : 32,
                        ip: service.referer.address,
                        vid: re.info.vid,
                        pixel_count: re.info.leds.count,
                        seg: re.state.seg
                      }
                    ])
                  }
                  if (!devices.filter((n) => n.ip === service.referer.address).length) {
                    setDevices([
                      ...devices,
                      {
                        name: service.name,
                        type: re.info.arch === 'esp8266' ? 82 : 32,
                        ip: service.referer.address,
                        vid: re.info.vid,
                        pixel_count: re.info.leds.count,
                        seg: re.state.seg
                      }
                    ])
                  }
                })
            }
          }
        })
      }
    } else {
      window.api
        .fetch(`http://${iframe}/json/nodes`)
        .then((r) => {
          if (r.status === 501) {
            console.log('No zeroconf for autodiscovery available. Also WLED version should be updated')
          }
          return r
        })
        .then((res) => {
          if (res.nodes) {
            res.nodes.forEach((node) => {
              if (
                !(combNodes.filter((n) => n.ip === node.ip).length > 0) ||
                !devices.filter((n) => n.ip === node.ip).length
              ) {
                console.log('wled found:', node)
                window.api
                  .fetch(`http://${node.ip}/json`)
                  // .then((r) => r.json())
                  .then((re) => {
                    if (!(combNodes.filter((n) => n.ip === node.ip).length > 0)) {
                      setCombNodes((comb) => [
                        ...comb,
                        {
                          name: node.name,
                          type: re.info.arch === 'esp8266' ? 82 : 32,
                          ip: node.ip,
                          vid: re.info.vid,
                          pixel_count: re.info.leds.count,
                          seg: re.state.seg
                        }
                      ])
                    }
                    if (!devices.filter((n) => n.ip === node.ip).length) {
                      setDevices([
                        ...devices,
                        {
                          name: node.name,
                          type: re.info.arch === 'esp8266' ? 82 : 32,
                          ip: node.ip,
                          vid: re.info.vid,
                          pixel_count: re.info.leds.count,
                          seg: re.state.seg
                        }
                      ])
                    }
                  })
              }
            })
          }
        })
        .catch((error) => {
          console.log('error: ', error)
        })
      const ip = query.get('ip')
      if (ip && ip === 'string') {
        setIframe(ip)
      }
    }

    return () => {
      if (isZeroConf && bonjourInstance) {
        bonjourInstance.destroy()
      }
    }
  }, [])

  return (
    <>
      <Drawer
        variant='persistent'
        anchor='left'
        open={leftBarOpen}
        sx={{
          'width': drawerWidth + 'px',
          'flexShrink': 0,
          'backgroundColor': '#111',
          '& .MuiDrawer-paper': {
            ...cls(theme).drawerPaper({
              drawerBottomHeight,
              bottomBarOpen,
              drawerWidth
            }),
            ...cls(theme).noselect,
            ...(!bottomBarOpen ? cls(theme).contentBottomShift : {})
          }
        }}
      >
        <Box sx={cls(theme).drawerHeader}>
          <div></div>
          {singleMode && (
            <Tooltip
              title={
                'No zeroconf (bonjour) is available, but if WLED is updated, discovery would be possible without zeroconf. You can go back and connect to a different WLED.'
              }
            >
              <Button
                onClick={() => navigate('/home')}
                variant='outlined'
                size='small'
                style={{
                  color: '#999',
                  position: 'absolute',
                  top: 80,
                  left: 15,
                  minWidth: 50,
                  padding: '0 21px',
                  flexGrow: 0,
                  fontSize: 'xx-small'
                }}
              >
                Single-Device-Mode
              </Button>
            </Tooltip>
          )}
        </Box>
        <Divider />
        <div
          style={{
            padding: '0.25rem 0.25rem 0.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6' color='textSecondary'>
            Devices
          </Typography>
          <IconButton onClick={() => navigate('/')} style={{ color: '#999', padding: '3px', marginRight: '16px' }}>
            <Refresh />
          </IconButton>
        </div>
        <Divider />
        <List style={{ flexGrow: 1 }}>
          {combNodes.length > 0 &&
            combNodes.map((_d: any, i: number) => (
              <Card
                key={i}
                onClick={() => {
                  setIframe(combNodes[i].ip)
                  setDevice(combNodes[i])
                  setVirtualView(false)
                }}
                style={{
                  cursor: 'pointer',
                  margin: '0.5rem',
                  padding: '0.5rem 0.25rem 0.5rem 0.5rem',
                  background: combNodes[i].ip === iframe && !virtualView ? '#404040' : '#202020'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    style={{
                      color: '#fff',
                      fontSize: '1rem',
                      maxWidth: 150,
                      overflowX: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {combNodes[i].name}
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      disabled
                      variant='outlined'
                      size='small'
                      style={{
                        minWidth: 50,
                        padding: '0',
                        flexGrow: 0,
                        fontSize: 'xx-small'
                      }}
                    >
                      {combNodes[i].type === 32 ? 'ESP32' : 'ESP8266'}
                    </Button>
                    <Button
                      disabled
                      variant='outlined'
                      size='small'
                      style={{
                        minWidth: 50,
                        padding: '0',
                        flexGrow: 0,
                        fontSize: 'xx-small'
                      }}
                    >
                      {combNodes[i].pixel_count} Leds
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          <Divider style={{ marginTop: '2rem' }} />
          <div style={{ padding: '0.25rem 0.25rem 0.25rem 1rem' }}>
            <Typography variant='h6' color='textSecondary'>
              Virtuals
            </Typography>
          </div>
          <Divider />
          {virtuals.length > 0 &&
            virtuals.map((v, i) => (
              <Card
                key={i}
                onContextMenu={() => handleRemoveVirtual(v)}
                onClick={() => {
                  openVirtual(v)
                }}
                style={{
                  cursor: 'pointer',
                  margin: '0.5rem',
                  padding: '0.5rem 0.25rem 0.5rem 0.5rem',
                  background: virtualView === v.name ? '#404040' : '#202020'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    style={{
                      color: '#fff',
                      fontSize: '1rem',
                      maxWidth: 150,
                      overflowX: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {virtuals[i].name}
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      disabled
                      variant='outlined'
                      size='small'
                      style={{
                        minWidth: 50,
                        padding: '0',
                        flexGrow: 0,
                        fontSize: 'xx-small'
                      }}
                    >
                      {virtuals[i].type}
                    </Button>
                    <Button
                      disabled
                      variant='outlined'
                      size='small'
                      style={{
                        minWidth: 50,
                        padding: '0',
                        flexGrow: 0,
                        fontSize: 'xx-small'
                      }}
                    >
                      {virtuals[i].pixel_count} Leds
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          <AddVirtual />
          {/* <AddVirtual devices={combNodes} /> */}
        </List>
        <Divider />
        <Button
          endIcon={bottomBarOpen ? <ArrowDownward /> : <ArrowUpward />}
          startIcon={<Equalizer />}
          onClick={() => setBottomBarOpen(!bottomBarOpen)}
          style={{ lineHeight: '17px' }}
        >
          WebAudio
        </Button>
        {bottomBarOpen && (
          <Button
            endIcon={drawerBottomHeight === 350 ? <Settings /> : <Close />}
            startIcon={<Equalizer />}
            onClick={(e) => {
              e.stopPropagation()
              return setDrawerBottomHeight(drawerBottomHeight === 350 ? 800 : 350)
            }}
            style={{ lineHeight: '17px' }}
          >
            Advanced
          </Button>
        )}
        <Divider />

        <div style={{ height: 61, padding: '0 0.5rem' }}>
          <div style={{ display: 'flex' }}>
            <Typography onClick={() => navigate('/')} gutterBottom variant='subtitle2' style={{ color: '#444' }}>
              {'.'}
            </Typography>
            <Typography variant='subtitle2' style={{ color: '#444' }}>
              {'...'}
            </Typography>
            <Typography
              onClick={() => window && window.localStorage.removeItem('wled-manager-ip')}
              gutterBottom
              variant='subtitle2'
              style={{ color: '#444' }}
            >
              {'.'}
            </Typography>
          </div>

          <Typography variant='subtitle2' style={{ color: '#444' }}>
            by Blade
          </Typography>
        </div>
      </Drawer>

      <Drawer
        className={classes.drawerBottom}
        variant='persistent'
        anchor='bottom'
        open={bottomBarOpen}
        sx={{
          '& .MuiDrawer-paper': cls(theme).drawerBottomPaper({
            drawerBottomHeight
          })
        }}
      >
        <div
          style={{
            height: (drawerBottomHeight === 350 ? 0 : 50) + 'px',
            width: '100%'
          }}
        >
          {drawerBottomHeight !== 350 && (
            <>
              <Stack direction='row' alignItems='center' justifyContent={'space-between'}>
                <Typography style={{ paddingLeft: 40, paddingTop: 20 }} variant='h5'>
                  WebAudio settings
                </Typography>
                {bottomBarOpen && (
                  <div
                    style={{
                      padding: '0 5px',
                      margin: '0 2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      return setDrawerBottomHeight(drawerBottomHeight === 350 ? 800 : 350)
                    }}
                  >
                    {drawerBottomHeight === 350 ? <Settings /> : <Close />}
                  </div>
                )}
              </Stack>
              <Stack direction='row' alignItems='flex-start' justifyContent={'center'}>
                <div
                  style={{
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <TextField
                    label='FFT-size'
                    error={error === 'fft'}
                    helperText={error === 'fft' ? '[32,32768] and power of 2' : ''}
                    size='small'
                    type='number'
                    // min={32}
                    // max={32768}
                    style={{ width: 120, margin: 10 }}
                    variant='outlined'
                    defaultValue={audioSettings.fft}
                    onBlur={(e) => {
                      if (
                        parseInt(e.target.value) != 0 &&
                        (parseInt(e.target.value) & (parseInt(e.target.value) - 1)) == 0 &&
                        parseInt(e.target.value) >= 32 &&
                        parseInt(e.target.value) <= 32768
                      ) {
                        setAudioSettings({ fft: parseInt(e.target.value) })
                        setError('')
                      } else {
                        setError('fft')
                      }
                    }}
                  />
                  <TextField
                    label='Bands'
                    error={error === 'bands'}
                    helperText={error === 'bands' ? 'min: 1' : ''}
                    size='small'
                    type='number'
                    // min={1}
                    // max={128}
                    style={{ width: 120, margin: 10 }}
                    variant='outlined'
                    defaultValue={audioSettings.bands}
                    onBlur={(e) => {
                      if (parseInt(e.target.value) > 0) {
                        setAudioSettings({ bands: parseInt(e.target.value) })
                        setError('')
                      } else {
                        setError('bands')
                      }
                    }}
                  />
                  <TextField
                    label='SampleRate'
                    disabled
                    size='small'
                    type='number'
                    style={{ width: 120, margin: 10 }}
                    variant='outlined'
                    defaultValue={audioSettings.sampleRate}
                  />
                  <TextField
                    label='Left FB'
                    helperText='via left-click'
                    disabled
                    size='small'
                    style={{ width: 120, margin: 10 }}
                    variant='outlined'
                    value={leftFb !== -1 ? leftFb : 'unset'}
                  />
                  <TextField
                    label='Right FB'
                    helperText='via right-click'
                    disabled
                    size='small'
                    style={{ width: 120, margin: 10 }}
                    variant='outlined'
                    value={rightFb !== -1 ? rightFb : 'unset'}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  {is2D ? (
                    <Stack direction='column' justifyContent='flex-start'>
                      <Typography marginTop={3} marginBottom={2}>
                        2D Matrix detected
                      </Typography>
                      <Stack direction='row' spacing={2}>
                        <TextField
                          select
                          variant='outlined'
                          label='Video Input'
                          // disabled={playing}
                          value={videoDevice || 'none'}
                          style={{ width: '100%' }}
                          onChange={(e) => {
                            setVideoDevice(e.target.value as 'screen' | 'camera' | 'none')
                          }}
                        >
                          {['camera', 'screen', 'none'].map((d, i) => (
                            <MenuItem key={i} value={d} disabled={d === 'screen'}>
                              {d}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField
                          label='Width'
                          size='small'
                          type='number'
                          style={{ width: 120, margin: 10 }}
                          variant='outlined'
                          defaultValue={sizeW}
                          onBlur={(e) => {
                            if (parseInt(e.target.value) > 0) {
                              setSizeW(parseInt(e.target.value))
                            }
                          }}
                        />
                        <TextField
                          label='Height'
                          size='small'
                          type='number'
                          style={{ width: 120, margin: 10 }}
                          variant='outlined'
                          defaultValue={sizeH}
                          onBlur={(e) => {
                            if (parseInt(e.target.value) > 0) {
                              setSizeH(parseInt(e.target.value))
                            }
                          }}
                        />
                        <TextField
                          label='Zoom'
                          size='small'
                          type='number'
                          style={{ width: 120, margin: 10, marginBottom: 10 }}
                          variant='outlined'
                          value={zoom}
                          onChange={(e) => {
                            if (parseInt(e.target.value) > 0) {
                              setZoom(parseInt(e.target.value))
                            }
                          }}
                        />
                      </Stack>
                      <Stack direction='row' spacing={2}>
                        <Button startIcon={<Cast />} onClick={startCapture}>
                          Share
                        </Button>
                        <Button startIcon={<Stop />} onClick={stopCapture}>
                          Stop
                        </Button>
                      </Stack>
                      <video autoPlay muted hidden width={sizeW + 'px'} height={sizeH + 'px'} ref={videoRef}></video>
                      <canvas width={sizeW + 'px'} height={sizeH + 'px'} hidden ref={vcanvasRef}></canvas>
                      <div>
                        <canvas
                          onClick={(e: any) => {
                            const canvas = e.target

                            // Calculate the x and y coordinates of the click relative to the canvas
                            const x = Math.floor(((e.nativeEvent.offsetX / canvas.width) * 32) / zoom) + 1
                            const y = Math.floor(((e.nativeEvent.offsetY / canvas.height) * 8) / zoom) + 1

                            console.log(`Clicked pixel at x: ${x}, y: ${y}`, ctx)
                            selectPixel(x, y)
                            if (ctx) {
                              ctx.fillStyle = 'white'
                              ctx.fillRect(x, y, 1, 1)
                            }
                          }}
                          width={sizeW + 'px'}
                          height={sizeH + 'px'}
                          style={{ zoom: zoom }}
                          ref={canvasRef}
                        ></canvas>
                      </div>
                    </Stack>
                  ) : (
                    <></>
                  )}
                </div>
              </Stack>
            </>
          )}
        </div>

        <AudioDataContainer
          selectedPixels={selectedPixels}
          audioDeviceId={audioDevice}
          videoDevice={videoDevice}
          theStream={theStream}
          fft={audioSettings.fft}
          bandCount={audioSettings.bands}
          drawerBottomHeight={drawerBottomHeight}
        />
      </Drawer>

      <Box
        sx={{
          marginLeft: drawerWidth + 'px',
          ...cls(theme).content(),
          ...cls(theme).contentBottom({ drawerBottomHeight }),
          ...(!leftBarOpen ? cls(theme).contentShift : {}),
          ...(!bottomBarOpen ? cls(theme).contentBottomShift : {})
        }}
      >
        <Box
          sx={{
            ...cls(theme).menuButton({ drawerBottomHeight }),
            ...(!leftBarOpen ? cls(theme).contentBottomShift : {})
          }}
          onClick={() => setLeftBarOpen(!leftBarOpen)}
        >
          <div onClick={() => setLeftBarOpen(!leftBarOpen)} style={{ flex: 1, minWidth: 'unset' }}>
            {leftBarOpen ? <ChevronLeft /> : <ChevronRight />}
          </div>
        </Box>
        {virtualView ? (
          <div style={{ width: '100%', height: '100%' }}>
            <div
              style={{
                width: '100%',
                height: 69,
                borderBottom: '1px solid #333'
              }}
            >
              <Typography style={{ paddingLeft: 40, paddingTop: 20 }} variant='h5'>
                {virtualView}
              </Typography>
            </div>
            <div style={{ width: '100%', height: '100%', padding: 40 }}>
              {virtual &&
                virtual.seg &&
                virtual.seg.length &&
                virtual.seg.map((s, i) => (
                  <Card
                    onContextMenu={() => removeSeg(i)}
                    key={i}
                    style={{
                      cursor: 'pointer',
                      margin: '0.5rem',
                      padding: '0.5rem 0.25rem 0.5rem 0.5rem',
                      background: '#202020'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography
                        style={{
                          color: '#fff',
                          fontSize: '1rem',
                          overflowX: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {`${s.device} - ${s.name}`}
                      </Typography>
                      <Button
                        disabled
                        variant='outlined'
                        size='small'
                        style={{ minWidth: 100, padding: '0', flexGrow: 0 }}
                      >
                        {s.seg?.[1] - s.seg?.[0]} Leds
                      </Button>
                    </div>
                  </Card>
                ))}
              <AddSegment devices={combNodes} handleSegments={handleSegments} />
            </div>
          </div>
        ) : (
          <iframe src={`http://${iframe}/`} width='100%' height='100%' style={{ border: 0 }} />
        )}
      </Box>

      <Box
        style={{
          height: drawerBottomHeight === 350 ? 30 : 450 + 'px',
          width: '100%'
        }}
        sx={{
          ...cls(theme).barBottom({ drawerBottomHeight }),
          ...(!bottomBarOpen ? cls(theme).barBottomShift : {})
        }}
      >
        <div
          style={{
            width: '100%',
            height: 30,
            backgroundColor: '#333',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: 'translateZ(0px)'
          }}
          onClick={() => {
            if (bottomBarOpen && drawerBottomHeight !== 350) {
              setDrawerBottomHeight(350)
            }
            return setBottomBarOpen(!bottomBarOpen)
          }}
        >
          <div
            style={{
              padding: '0 5px',
              margin: '0 2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            !WebAudio
          </div>
          <div style={{ display: 'flex' }}>
            {bottomBarOpen && (
              <div
                style={{
                  padding: '0 5px',
                  margin: '0 2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  return setDrawerBottomHeight(drawerBottomHeight === 350 ? 800 : 350)
                }}
              >
                {drawerBottomHeight === 350 ? <Settings /> : <Close />}
              </div>
            )}
            <div
              style={{
                padding: '0 5px',
                margin: '0 2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {bottomBarOpen ? <ArrowDownward /> : <ArrowUpward />}
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

export default Manager
