/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  fetch: (url: string) => ipcRenderer.invoke('fetch', url),
  udp: (data: any) => ipcRenderer.invoke('UDP', data),
  udpStart: () => ipcRenderer.invoke('UDP-start'),
  udpStop: () => ipcRenderer.invoke('UDP-stop'),
  resizeWindow: (size: [number, number]) => ipcRenderer.invoke('resizeWindow', size),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
