import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import { remote } from 'electron';
import { useRouter } from 'next/router';
import { ipcRenderer } from 'electron';
import { ArrowDownward, ArrowUpward, ChevronLeft, ChevronRight, Close, Equalizer, Refresh, Settings } from '@material-ui/icons';
import { Drawer, List, Divider, Card, Typography, Button, IconButton, Tooltip } from '@material-ui/core';
import useLeftBarStyles from '../styles/yz.styles';
import { template } from '../components/MenuTemplate';
import AudioDataContainer from '../components/AudioContainer';
import useStore from '../store/store';

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
  const audioDevice = useStore(state => state.audioDevice)
  const setDrawerBottomHeight = useStore(state => state.setDrawerBottomHeight)
  const drawerWidth = useStore(state => state.drawerWidth)
  const drawerBottomHeight = useStore(state => state.drawerBottomHeight)
  const audioSettings = useStore(state => state.audioSettings)
  // const fft = useStore(state => state.audioSettings.fft)
  // const bands = useStore(state => state.audioSettings.bands)
  const setAudioSettings = useStore(state => state.setAudioSettings)
  const classes = useLeftBarStyles({ drawerWidth, drawerBottomHeight, bottomBarOpen });

  const [combNodes, setCombNodes] = useState([])
  const [isZeroConf, setIsZeroConf] = useState(router.query.zeroconf || (typeof window !== 'undefined' && window.localStorage.getItem("wled-manager-zeroconf") === 'true') || false)
  const [singleMode, setSingleMode] = useState(router.query.singlemode || false)

  useEffect(() => {
    const { Menu } = remote;
    const customTitleBar = require('custom-electron-titlebar');
    const titlebar = new customTitleBar.Titlebar({
      backgroundColor: customTitleBar.Color.fromHex('#444'),
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
    ipcRenderer.send('resize-me-please', [1024, 1080])
  }, [])

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
            await fetch(`http://${service.referer.address}/json/info`)
              .then(r => r.json())
              .then((re) => {
                if (!combNodes.filter(n => n.ip === service.referer.address).length > 0) {
                  setCombNodes((comb) => [...comb, {
                    "name": service.name,
                    "type": re.arch === "esp8266" ? 82 : 32,
                    "ip": service.referer.address,
                    "vid": re.vid,
                    "pixel_count": re.leds.count
                  }])
                }
                if (!devices.filter(n => n.ip === service.referer.address).length) {
                  setDevices([...devices, {
                    "name": service.name,
                    "type": re.arch === "esp8266" ? 82 : 32,
                    "ip": service.referer.address,
                    "vid": re.vid,
                    "pixel_count": re.leds.count
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
                fetch(`http://${node.ip}/json/info`)
                  .then(r => r.json())
                  .then((re) => {
                    if (!combNodes.filter(n => n.ip === node.ip).length > 0) {
                      setCombNodes((comb) => [...comb, {
                        "name": node.name,
                        "type": re.arch === "esp8266" ? 82 : 32,
                        "ip": node.ip,
                        "vid": re.vid,
                        "pixel_count": re.leds.count
                      }])
                    }
                    if (!devices.filter(n => n.ip === node.ip).length) {
                      setDevices([...devices, {
                        "name": node.name,
                        "type": re.arch === "esp8266" ? 82 : 32,
                        "ip": node.ip,
                        "vid": re.vid,
                        "pixel_count": re.leds.count
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
  console.log(audioSettings)
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
          }} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: combNodes[i].ip === iframe ? '#404040' : '#202020' }}>
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
        <Card key={"test1"} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: '#202020' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ color: "#fff", fontSize: '1rem' }}>
              Dummy Virtual 1
            </Typography>
            <Button disabled variant="outlined" size="small" style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
              span
            </Button>
          </div>
        </Card>
        <Card key={"test2"} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 0.5rem', background: '#202020' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ color: "#fff", fontSize: '1rem' }}>
              Dummy Virtual 2
            </Typography>
            <Button disabled variant="outlined" size="small" style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
              copy
            </Button>
          </div>
        </Card>
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
      <div style={{ height: drawerBottomHeight === 350 ? 0 : 450, width: '100%' }}>


        {drawerBottomHeight !== 350 && 'WebAudio settings'}


      </div>
      <AudioDataContainer audioDeviceId={audioDevice} fft={audioSettings.fft} bandCount={audioSettings.bands} />
    </Drawer>

    <main className={clsx(classes.content, classes.contentBottom, { [classes.contentShift]: !leftBarOpen }, { [classes.contentBottomShift]: !bottomBarOpen })}>
      <div onClick={() => setLeftBarOpen(!leftBarOpen)} className={clsx(classes.menuButton, { [classes.contentBottomShift]: !leftBarOpen })}>
        {/* <div onClick={() => setLeftBarOpen(!leftBarOpen)} style={{ flex: 1, minWidth: 'unset' }}> */}
        {leftBarOpen ? <ChevronLeft /> : <ChevronRight />}
        {/* </div> */}
      </div>
      <iframe src={`http://${iframe}/`} width="100%" height="100%" style={{ border: 0 }} />
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
