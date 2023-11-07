/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { app, shell, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { DgramAsPromised } from 'dgram-as-promised'
import { nativeTheme } from 'electron'

const path = require('path')
// const isProd: boolean = process.env.NODE_ENV === "production";
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 480,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: true,
      nodeIntegration: true,
      webSecurity: false,
      backgroundThrottling: false,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  nativeTheme.themeSource = 'dark'
  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('disable-background-timer-throttling')
  app.commandLine.appendSwitch('disable-backgrounding-occluded-windows')

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  ipcMain.handle('fetch', (_event, url: string) => fetch(url).then((res) => res.json()))

  // ipcMain.on("close", () => {
  //   app.quit();
  // });

  let socket
  let PORT
  let message

  ipcMain.handle('UDP-start', () => {
    socket = DgramAsPromised.createSocket('udp4')
    PORT = 21324
  })

  ipcMain.handle('UDP', async (_event, arg) => {
    message = Buffer.from(arg[1])
    await socket?.send(message, 0, message.length, PORT, arg[0].ip)
  })
  ipcMain.handle('UDP-stop', async () => {
    await socket?.stop()
  })

  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,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'
  )

  const tray = new Tray(icon.resize({ width: 22, height: 22 }))

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = createWindow()

  mainWindow.setIcon(icon.resize({ width: 16, height: 16 }))
  ipcMain.handle('resizeWindow', (_event, arg) => {
    ;(mainWindow as any)?.setSize(arg[0], arg[1])
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => (mainWindow as any).show() },
    { label: 'Minimize', click: () => (mainWindow as any).minimize() },
    { label: 'Minimize to tray', click: () => (mainWindow as any).hide() },
    // { label: 'Test Notifiation', click: () => showNotification() },
    { label: 'seperator', type: 'separator' },
    {
      label: 'Dev',
      click: () => (mainWindow as any).webContents.openDevTools()
    },
    { label: 'seperator', type: 'separator' },
    { label: 'Exit', click: () => app.quit() }
  ])
  tray.setToolTip('WLED Manager')
  tray.setContextMenu(contextMenu)

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
