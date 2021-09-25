import { app,
  Tray,
  Menu,
  nativeImage,
  ipcMain
 } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const path = require('path');
const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let tray = null;

(async () => {
  await app.whenReady();

  
  
  const mainWindow = createWindow('main', {
    width: 480,
    height: 800,
    titleBarStyle: "hidden", // <-- add this line if needed
    webPreferences: {
      enableRemoteModule: true // <-- add this line
    },
  });

  ipcMain.on('resize-me-please', (event, arg) => {
    mainWindow.setSize(arg[0],arg[1])
  })

  // tray = new Tray(nativeImage.createFromDataURL('data:image/x-icon;base64,AAABAAEAEBAAAAEAGACGAAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAE1JREFUOI1j/P//PwOxgNGeAUMxE9G6cQCKDWAhpADZ2f8PMjBS3QW08QK20KaZC2gfC9hCnqouoNgARgY7zMxAyNlUdQHlXiAlO2MDAD63EVqNHAe0AAAAAElFTkSuQmCC'))
  
 
  const icon = nativeImage.createFromPath(path.join(__dirname, 'images/logo32.png')).resize({width: 16, height: 16})
  // const icon = isProd ? nativeImage.createFromPath('./images/logo256.png') : path.join(__dirname, 'images/logo256.png')
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Minimize', click: () => mainWindow.minimize() },
    { label: 'Minimize to tray', click: () => mainWindow.hide() },
    // { label: 'Test Notifiation', click: () => showNotification() },
    { label: 'seperator', type: 'separator' },
    { label: 'Dev', click: () => mainWindow.webContents.openDevTools() },
    { label: 'seperator', type: 'separator' },
    { label: 'Exit', click: () => app.quit() }
  ])
  tray.setToolTip('WLED Manager')
  tray.setContextMenu(contextMenu)
  
  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
