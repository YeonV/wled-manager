/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      fetch: (_url: string) => Promise<any>
      resizeWindow: (_size: [number, number]) => Promise<any>
      udp: (_arg: any) => Promise<any>
      udpStart: () => Promise<any>
      udpStop: () => Promise<any>
    }
  }
}
