import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import { remote } from 'electron';
import { useRouter } from 'next/router';
import { ipcRenderer } from 'electron';
import { ArrowDownward, ArrowUpward, ChevronLeft, ChevronRight, Close, Equalizer, Refresh, Settings } from '@material-ui/icons';
import { Drawer, List, Divider, Card, Typography, Button, IconButton, Tooltip, TextField } from '@material-ui/core';
import useLeftBarStyles from '../styles/yz.styles';
import { template } from '../components/MenuTemplate';
import AudioDataContainer from '../components/AudioContainer';
import useStore from '../store/store';
import AddVirtual from '../components/AddVirtual';
import AddSegment from '../components/AddSegment';
import { TitlebarColor } from 'custom-electron-titlebar';

const LeftBar = () => {
  if (typeof window === 'undefined') {
    return <>server-side-rendered</>
  }


  const router = useRouter()
  const leftBarOpen = useStore(state => state.leftBarOpen)
  const setLeftBarOpen = useStore(state => state.setLeftBarOpen)
  const bottomBarOpen = useStore(state => state.bottomBarOpen)
  const setBottomBarOpen = useStore(state => state.setBottomBarOpen)
  const iframe = useStore(state => state.iframe)
  const setIframe = useStore(state => state.setIframe)
  const devices = useStore(state => state.devices)
  const setDevices = useStore(state => state.setDevices)
  const device = useStore(state => state.device)
  const setDevice = useStore(state => state.setDevice)
  const virtuals = useStore(state => state.virtuals)
  const setVirtuals = useStore(state => state.setVirtuals)
  const virtual = useStore(state => state.virtual)
  const setVirtual = useStore(state => state.setVirtual)
  const audioDevice = useStore(state => state.audioDevice)
  const setDrawerBottomHeight = useStore(state => state.setDrawerBottomHeight)
  const drawerWidth = useStore(state => state.drawerWidth)
  const drawerBottomHeight = useStore(state => state.drawerBottomHeight)
  const audioSettings = useStore(state => state.audioSettings)
  // const fft = useStore(state => state.audioSettings.fft)
  // const bands = useStore(state => state.audioSettings.bands)
  const setAudioSettings = useStore(state => state.setAudioSettings)
  const leftFb = useStore(state => state.leftFb)
  const rightFb = useStore(state => state.rightFb)
  const classes = useLeftBarStyles({ drawerWidth, drawerBottomHeight, bottomBarOpen });

  const [combNodes, setCombNodes] = useState([])
  const [isZeroConf, setIsZeroConf] = useState(router.query.zeroconf || (typeof window !== 'undefined' && window.localStorage.getItem("wled-manager-zeroconf") === 'true') || false)
  const [singleMode, setSingleMode] = useState(router.query.singlemode || false)
  const [error, setError] = useState("")

  const virtualView = useStore(state => state.virtualView)
  const setVirtualView = useStore(state => state.setVirtualView)
  const removeVirtual = useStore(state => state.removeVirtual)
  const addVirtual = useStore(state => state.addVirtual)

  const openVirtual = (virtual) => {
    setVirtualView(virtual.name)
  }

  const handleRemoveVirtual = (v) => {
    if (v.name === virtualView) {
      setVirtualView(false)
    }
    removeVirtual(v)
  };
  const handleSegments = (segs) => {
    addVirtual({
      name: virtual.name,
      type: 'span',
      pixel_count: 0,
      seg: [...virtual.seg || [], segs]
    });
  };
  const removeSeg = (i) => {
    const segs = [ ...virtual.seg ]
    segs.splice(i, 1)

    addVirtual({
      name: virtual.name,
      type: 'span',
      pixel_count: 0,
      seg: [...segs ]
    });
  };

  useEffect(() => {
    const { Menu } = remote;
    const customTitleBar = require('custom-electron-titlebar');
    const titlebar = new customTitleBar.Titlebar({
      backgroundColor: TitlebarColor.fromHex('#444'),
      icon: '/images/logo.png',
    });
    const temp = template()
    const menu = Menu.buildFromTemplate(temp)
    titlebar.updateMenu(menu);

    return () => {
      titlebar.dispose();
    };
  }, []);

  useEffect(() => {
    setVirtual(virtuals.find(v=>v.name === virtualView))
  }, [virtualView, virtuals])


  useEffect(() => {
    virtuals.map(v=>{      
      if (v.seg && v.seg.length) {
        v.pixel_count = v.seg.map(s=>(s.seg && s.seg.length) ? s.seg[1] - s.seg[0] : 0).reduce((a,b)=>a+b)
      }
      return v
    })
  }, [virtuals])

  useEffect(() => {
    ipcRenderer.send('resize-me-please', [1024, 1080])
  }, [])

  // useEffect(() => {
  //   const virt = virtuals.find(v => v.name === virtualView)
  //   if (virt) {
  //     setVirtual(virt)
  //   }
  // }, [virtuals, virtualView])

  useEffect(() => {
    if (router.query && router.query.zeroconf) {
      setIsZeroConf(true)
    }
  }, [router.query.zeroconf])

  useEffect(() => {
    if (router.query && router.query.singlemode) {
      setSingleMode(true)
    }
  }, [router.query.singlemode])

  useEffect(() => {
    if (!isZeroConf && device) {
      console.log(device)
      if (!combNodes.filter(n => n.ip === device.ip).length > 0) {
        setCombNodes((comb) => [...comb, {
          "name": device.name,
          "type": device.type,
          "ip": device.ip,
          "vid": device.vid,
          "pixel_count": device.pixel_count
        }])
      }
      if (!devices.filter(n => n.ip === device.ip).length) {
        setDevices([...devices, {
          "name": device.name,
          "type": device.type,
          "ip": device.ip,
          "vid": device.vid,
          "pixel_count": device.pixel_count
        }])
      }
    }
  }, [devices, device])

  let bonjour = null;
  useEffect(() => {
    if (isZeroConf) {
      bonjour = require('bonjour')()
      bonjour.find({ type: 'wled' }, async (service) => {
        if (service.referer && service.referer.address) {
          if ((!combNodes.filter(n => n.ip === service.referer.address).length > 0) || (!devices.filter(n => n.ip === service.referer.address).length)) {
            console.log("wled found:", service.name)
            await fetch(`http://${service.referer.address}/json`)
              .then(r => r.json())
              .then((re) => {
                if (!combNodes.filter(n => n.ip === service.referer.address).length > 0) {
                  setCombNodes((comb) => [...comb, {
                    "name": service.name,
                    "type": re.info.arch === "esp8266" ? 82 : 32,
                    "ip": service.referer.address,
                    "vid": re.info.vid,
                    "pixel_count": re.info.leds.count,
                    "seg": re.state.seg
                  }])
                }
                if (!devices.filter(n => n.ip === service.referer.address).length) {
                  setDevices([...devices, {
                    "name": service.name,
                    "type": re.info.arch === "esp8266" ? 82 : 32,
                    "ip": service.referer.address,
                    "vid": re.info.vid,
                    "pixel_count": re.info.leds.count,
                    "seg": re.state.seg
                  }])
                }
              })
          }
        }
      })
    } else {
      fetch(`http://${iframe}/json/nodes`)
        .then(r => {
          if (r.status === 501) {
            console.log("No zeroconf for autodiscovery available. Also WLED version should be updated")
          }
          return r.json()
        })
        .then((res) => {
          if (res.nodes) {
            res.nodes.forEach((node) => {
              if ((!combNodes.filter(n => n.ip === node.ip).length > 0) || (!devices.filter(n => n.ip === node.ip).length)) {
                console.log("wled found:", node)
                fetch(`http://${node.ip}/json`)
                  .then(r => r.json())
                  .then((re) => {
                    if (!combNodes.filter(n => n.ip === node.ip).length > 0) {
                      setCombNodes((comb) => [...comb, {
                        "name": node.name,
                        "type": re.info.arch === "esp8266" ? 82 : 32,
                        "ip": node.ip,
                        "vid": re.info.vid,
                        "pixel_count": re.info.leds.count,
                        "seg": re.state.seg
                      }])
                    }
                    if (!devices.filter(n => n.ip === node.ip).length) {
                      setDevices([...devices, {
                        "name": node.name,
                        "type": re.info.arch === "esp8266" ? 82 : 32,
                        "ip": node.ip,
                        "vid": re.info.vid,
                        "pixel_count": re.info.leds.count,
                        "seg": re.state.seg
                      }])
                    }
                  })
              }
            })
          }
        })
        .catch((error) => {
          console.log("error: ", error)
        })

      if (router.query && router.query.ip) {
        setIframe(router.query.ip)
      }
    }

    return () => {
      if (isZeroConf) {
        bonjour.destroy()
      }
    }
  }, [])

   
  return (<>
    <Head>
      <title>WLED Manager - by Blade</title>
    </Head>

    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={leftBarOpen}
      classes={{ paper: clsx(classes.drawerPaper, classes.noselect, { [classes.contentBottomShift]: !bottomBarOpen }) }}
    >
      <div className={classes.drawerHeader}>
        <div>
        </div>
        {singleMode && <Tooltip title={`No zeroconf (bonjour) is available, but if WLED is updated, discovery would be possible without zeroconf. You can go back and connect to a different WLED.`}>
          <Button onClick={() => router.push('/home')} variant="outlined" size="small" style={{ color: '#999', position: 'absolute', top: 80, left: 15, minWidth: 50, padding: '0 21px', flexGrow: 0, fontSize: 'xx-small' }}>
            Single-Device-Mode
          </Button>
        </Tooltip>}
      </div>
      <Divider />
      <div style={{ padding: '0.25rem 0.25rem 0.25rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="textSecondary">
          Devices
        </Typography>
        <IconButton onClick={() => router.push('/home')} style={{ color: '#999', padding: '3px', marginRight: '16px' }}>
          <Refresh />
        </IconButton>
      </div>
      <Divider />
      <List style={{ flexGrow: 1 }}>
        {combNodes.length > 0 && combNodes.map((d, i) => (

          <Card key={i} onClick={() => {
            setIframe(combNodes[i].ip)
            setDevice(combNodes[i])
            setVirtualView(false)
          }} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: (combNodes[i].ip === iframe && !virtualView) ? '#404040' : '#202020' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography style={{ color: "#fff", fontSize: '1rem', maxWidth: 150, overflowX: 'hidden', whiteSpace: 'nowrap' }}>
                {combNodes[i].name}
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Button disabled variant="outlined" size="small" style={{ minWidth: 50, padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
                  {combNodes[i].type === 32 ? 'ESP32' : 'ESP8266'}
                </Button>
                <Button disabled variant="outlined" size="small" style={{ minWidth: 50, padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
                  {combNodes[i].pixel_count} Leds
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Divider style={{ marginTop: '2rem' }} />
        <div style={{ padding: '0.25rem 0.25rem 0.25rem 1rem' }}>
          <Typography variant="h6" color="textSecondary">
            Virtuals
          </Typography>
        </div>
        <Divider />
        {virtuals.length > 0 && virtuals.map((v, i) => (

        <Card key={i} onContextMenu={()=>handleRemoveVirtual(v)} onClick={() => {
          openVirtual(v)
        }} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: virtualView === v.name ? '#404040' : '#202020' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ color: "#fff", fontSize: '1rem', maxWidth: 150, overflowX: 'hidden', whiteSpace: 'nowrap' }}>
              {virtuals[i].name}
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button disabled variant="outlined" size="small" style={{ minWidth: 50, padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
                {virtuals[i].type}
              </Button>
              <Button disabled variant="outlined" size="small" style={{ minWidth: 50, padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
                {virtuals[i].pixel_count} Leds
              </Button>
            </div>
          </div>
        </Card>
        ))}
        <AddVirtual devices={combNodes} />
      </List>
      {/* <Divider />
      <Button endIcon={bottomBarOpen ? <ArrowDownward /> : <ArrowUpward />} startIcon={<Equalizer />} onClick={() => setBottomBarOpen(!bottomBarOpen)} style={{ lineHeight: '17px' }}>
        WebAudio
      </Button> */}
      <Divider />

      <div style={{ height: 61, padding: '0 0.5rem' }}>
        <div style={{ display: 'flex' }}>
          <Typography onClick={() => router.push('/home')} gutterBottom variant="subtitle2" style={{ color: "#444" }}>
            {'.'}
          </Typography>
          <Typography variant="subtitle2" style={{ color: "#444" }}>
            {'...'}
          </Typography>
          <Typography onClick={() => window && window.localStorage.removeItem("wled-manager-ip")} gutterBottom variant="subtitle2" style={{ color: "#444" }}>
            {'.'}
          </Typography>
        </div>

        <Typography variant="subtitle2" style={{ color: "#444" }}>
          by Blade
        </Typography>

      </div>
    </Drawer>
    <Drawer
      className={classes.drawerBottom}
      variant="persistent"
      anchor="bottom"
      open={bottomBarOpen}
      classes={{ paper: classes.drawerBottomPaper }}
    >
      <div style={{ height: drawerBottomHeight === 350 ? 0 : 50, width: '100%' }}>


        {drawerBottomHeight !== 350 && <>
          <Typography style={{ paddingLeft: 40, paddingTop: 20 }} variant="h5">WebAudio settings</Typography>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>

            <TextField label="FFT-size" error={error === "fft"} helperText={error === "fft" ? "[32,32768] and power of 2" : ""} size="small" type="number" min={32} max={32768} style={{ width: 120, margin: 10 }} variant="outlined" defaultValue={audioSettings.fft} onBlur={(e) => {
              if ((parseInt(e.target.value) != 0) && ((parseInt(e.target.value) & (parseInt(e.target.value) - 1)) == 0) && (parseInt(e.target.value) >= 32) && (parseInt(e.target.value) <= 32768)) {
                setAudioSettings({ fft: parseInt(e.target.value) });
                setError("")
              } else {
                setError("fft")
              }
            }} />
            <TextField label="Bands" error={error === "bands"} helperText={error === "bands" ? "min: 1" : ""} size="small" type="number" min={1} max={128} style={{ width: 120, margin: 10 }} variant="outlined" defaultValue={audioSettings.bands} onBlur={(e) => {
              if (parseInt(e.target.value) > 0) {
                setAudioSettings({ bands: parseInt(e.target.value) });
                setError("")
              } else {
                setError("bands")
              }
            }} />
            <TextField label="SampleRate" disabled size="small" type="number" style={{ width: 120, margin: 10 }} variant="outlined" defaultValue={audioSettings.sampleRate} />
            <TextField label="Left FB" helperText="via left-click" disabled size="small" style={{ width: 120, margin: 10 }} variant="outlined" value={leftFb !== -1 ? leftFb : 'unset'} />
            <TextField label="Right FB" helperText="via right-click" disabled size="small" style={{ width: 120, margin: 10 }} variant="outlined" value={rightFb !== -1 ? rightFb : 'unset'} />
          </div>
        </>
        }


      </div>
      <AudioDataContainer audioDeviceId={audioDevice} fft={audioSettings.fft} bandCount={audioSettings.bands} drawerBottomHeight={drawerBottomHeight} />
    </Drawer>

    <main className={clsx(classes.content, classes.contentBottom, { [classes.contentShift]: !leftBarOpen }, { [classes.contentBottomShift]: !bottomBarOpen })}>
      <div onClick={() => setLeftBarOpen(!leftBarOpen)} className={clsx(classes.menuButton, { [classes.contentBottomShift]: !leftBarOpen })}>
        {/* <div onClick={() => setLeftBarOpen(!leftBarOpen)} style={{ flex: 1, minWidth: 'unset' }}> */}
        {leftBarOpen ? <ChevronLeft /> : <ChevronRight />}
        {/* </div> */}
      </div>
      {virtualView ? <div style={{width: '100%', height: '100%' }}>
        <div style={{width: '100%', height: 69, borderBottom: '1px solid #333' }}>
          <Typography style={{ paddingLeft: 40, paddingTop: 20 }} variant="h5">{virtualView}</Typography>
        </div>
        <div style={{width: '100%', height: '100%', padding: 40 }}>
          {virtual && virtual.seg && virtual.seg.length && virtual.seg.map((s,i)=>
            <Card onContextMenu={()=>removeSeg(i)} key={i} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: '#202020' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography style={{ color: "#fff", fontSize: '1rem', overflowX: 'hidden', whiteSpace: 'nowrap' }}>
                  {`${s.device} - ${s.name}`}
                </Typography>
                <Button disabled variant="outlined" size="small" style={{ minWidth: 100, padding: '0', flexGrow: 0,  }}>
                  {s.seg?.[1] - s.seg?.[0]} Leds
                </Button>
              </div>
            </Card>        
          )}          
          <AddSegment devices={combNodes} handleSegments={handleSegments} />
        </div>
      </div> : <iframe src={`http://${iframe}/`} width="100%" height="100%" style={{ border: 0 }} />}
    </main>

    <div style={{ height: drawerBottomHeight === 350 ? 30 : 450, width: '100%' }} className={clsx(classes.barBottom, { [classes.barBottomShift]: !bottomBarOpen })}>
      <div style={{ width: '100%', height: 30, backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(0px)' }} onClick={() => {
        if (bottomBarOpen && drawerBottomHeight !== 350) { setDrawerBottomHeight(350) }
        return setBottomBarOpen(!bottomBarOpen)
      }}>
        <div style={{ padding: '0 5px', margin: '0 2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          WebAudio
        </div>
        <div style={{ display: 'flex' }}>
          {bottomBarOpen && <div style={{ padding: '0 5px', margin: '0 2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); return setDrawerBottomHeight(drawerBottomHeight === 350 ? 800 : 350) }}>{drawerBottomHeight === 350 ? <Settings /> : <Close />}</div>}
          <div style={{ padding: '0 5px', margin: '0 2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bottomBarOpen ? <ArrowDownward /> : <ArrowUpward />}</div>
        </div>
      </div>
    </div>
  </>
  );
};

export default LeftBar;
