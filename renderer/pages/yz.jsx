import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import { remote, nativeImage } from 'electron';
import { useRouter } from 'next/router';
import { ipcRenderer } from 'electron';
import { useTheme } from '@material-ui/core/styles';
import { ChevronLeft, ChevronRight, Menu as MenuIcon } from '@material-ui/icons';
import { Drawer, List, Divider, IconButton, Card, Typography, Button } from '@material-ui/core';
import useLeftBarStyles from '../styles/LeftBar.styles';
import { MenuTools, template } from '../components/MenuTemplate';

const LeftBar = () => {
  if (typeof window === 'undefined') {
    return <>server-side-rendered</>
  }

  const classes = useLeftBarStyles();
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(true)
  const router = useRouter()
  const [iframe, setIframe] = useState(router.query.ip || (typeof window !== 'undefined' && window.localStorage.getItem("wled-manager-ip")) || '')
  const [combNodes, setCombNodes] = useState([])
  const [nodes, setNodes] = useState([])
  const [node, setNode] = useState('')

  React.useEffect(() => {
    const { Menu, MenuItem } = remote;
    const customTitleBar = require('custom-electron-titlebar');
    const titlebar = new customTitleBar.Titlebar({
      backgroundColor: customTitleBar.Color.fromHex('#444'),
      icon: '/images/logo.png',
    });
    // const menu = new Menu(); // starting with empty menu

    // const menu = Menu.getApplicationMenu() // starting with default menu
    // menu.append(new MenuItem(MenuTemplate));
    const temp = template()
    const menu = Menu.buildFromTemplate(temp)

    titlebar.updateMenu(menu);
    return () => {
      titlebar.dispose();
    };
  }, []);

  useEffect(() => {
    fetch(`http://${iframe}/json/nodes`)
      .then(r => r.json())
      .then((res) => setNodes(res.nodes));
    fetch(`http://${iframe}/json/info`)
      .then(r => r.json())
      .then((re) => { setNode(re) });
    if (router.query && router.query.ip) {
      setIframe(router.query.ip)
    }
  }, [])

  useEffect(() => {
    node && setCombNodes([...nodes, {
      "name": node.name,
      "type": node.arch === "esp8266" ? 82 : 32,
      "ip": iframe,
      "vid": node.vid
    }])
  }, [nodes, node])

  useEffect(() => {
    ipcRenderer.send('resize-me-please', [1024, 1080])
  }, [])

  return (<>
    <Head>
      <title>WLED Manager - by Blade</title>
    </Head>
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.drawerHeader}>
        <div style={{ paddingLeft: '16px' }}>
          <Typography variant="h6" onClick={() => window.reload()}>
            WLED Manager
          </Typography>
        </div>
        <IconButton onClick={() => setDrawerOpen(false)}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <Divider />
      <div style={{ padding: '0.25rem 0.25rem 0.25rem 1.5rem' }}>
        <Typography variant="h6" color="textSecondary">
          Devices
        </Typography>
      </div>
      <Divider />
      <List style={{ flexGrow: 1 }}>
        {combNodes.length > 0 && combNodes.map((d, i) => (

          <Card key={i} onClick={() => {
            setIframe(combNodes[i].ip)
          }} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 1rem', background: combNodes[i].ip === iframe ? '#404040' : '#202020' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography style={{ color: "#fff", fontSize: '1.3rem' }}>
                {combNodes[i].name}
              </Typography>
              <Button disabled variant="outlined" size="small" style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
                {combNodes[i].type === 32 ? 'ESP32' : 'ESP8266'}
              </Button>
            </div>
          </Card>
        ))}
        <Divider style={{ marginTop: '2rem' }} />
        <div style={{ padding: '0.25rem 0.25rem 0.25rem 1.5rem' }}>
          <Typography variant="h6" color="textSecondary">
            Virtuals
          </Typography>
        </div>
        <Divider />
        <Card key={"test1"} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 1rem', background: '#202020' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ color: "#fff", fontSize: '1.3rem' }}>
              Virtual 1
            </Typography>
            <Button disabled variant="outlined" size="small" style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
              span
            </Button>
          </div>
        </Card>
        <Card key={"test2"} style={{ cursor: 'pointer', margin: '0.5rem', padding: '0.5rem 0.25rem 0.5rem 1rem', background: '#202020' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography style={{ color: "#fff", fontSize: '1.3rem' }}>
              Virtual 2
            </Typography>
            <Button disabled variant="outlined" size="small" style={{ padding: '0', flexGrow: 0, fontSize: 'xx-small' }}>
              copy
            </Button>
          </div>
        </Card>
      </List>
      <Divider />
      <div style={{ height: 61, padding: '0 0.5rem' }}>
        <div style={{ display: 'flex'}}>
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

    <main className={clsx(classes.content, { [classes.contentShift]: !drawerOpen })}>
      {!drawerOpen && <IconButton onClick={() => setDrawerOpen(true)} style={{ position: 'absolute', top: '5rem', left: '1rem' }}>
        <MenuIcon />
      </IconButton>}
      <iframe src={`http://${iframe}/`} width="100%" height="100%" style={{ border: 0 }} />
    </main>
  </>
  );
};

export default LeftBar;
