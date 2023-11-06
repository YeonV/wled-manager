/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateCreator } from 'zustand'
// import { MyState } from "./storeTs";

type colorType = {
  r: number
  g: number
  b: number
}

export interface SettingsSlice {
  device: any
  setDevice: (newDevice: any) => void
  devices: any[]
  setDevices: (newDevices: any) => void
  virtual: any
  setVirtual: (newVirtual: string) => void
  virtuals: any[]
  setVirtuals: (newVirtuals: any) => void
  addVirtual: (newVirtual: any) => void
  removeVirtual: (newVirtual: any) => void
  iframe: string
  setIframe: (ip: string) => void
  audioDevice: string
  setAudioDevice: (newDevice: string) => void
  audioDevices: any[]
  setAudioDevices: (newDevices: any) => void
  audioSettings: any
  setAudioSettings: (config: any) => void
  leftFb: number
  setLeftFb: (config: number) => void
  rightFb: number
  setRightFb: (config: number) => void
  color: colorType
  setColor: (newColor: colorType) => void
  bgColor: colorType
  setBgColor: (newColor: colorType) => void
  gcolor: string
  setGcolor: (newColor: string) => void
}

const storeSettings: StateCreator<SettingsSlice> = (set) => ({
  device: '',
  setDevice: (newDevice: string) =>
    set(() => ({
      device: newDevice
    })),

  devices: [],
  setDevices: (newDevices: any) =>
    set(() => ({
      devices: newDevices
    })),
  virtual: '',
  setVirtual: (newVirtual) =>
    set(() => ({
      virtual: newVirtual
    })),

  virtuals: [],
  setVirtuals: (newVirtuals) =>
    set(() => ({
      virtuals: newVirtuals
    })),

  addVirtual: (newVirtual) =>
    set((state) => ({
      virtuals: state.virtuals.find((v) => v.name === newVirtual.name)
        ? [...state.virtuals.filter((v) => v.name !== newVirtual.name), newVirtual]
        : [...state.virtuals, newVirtual]
    })),
  removeVirtual: (newVirtual) =>
    set((state) => ({
      virtuals: state.virtuals.find((v) => v.name === newVirtual.name)
        ? [...state.virtuals.filter((v) => v.name !== newVirtual.name)]
        : state.virtuals
    })),
  iframe: '',
  setIframe: (ip: string) =>
    set(() => ({
      iframe: ip
    })),

  audioDevice: 'default',
  setAudioDevice: (newDevice: string) =>
    set(() => ({
      audioDevice: newDevice
    })),

  audioDevices: [],
  setAudioDevices: (newDevices: any) =>
    set(() => ({
      audioDevices: newDevices
    })),
  audioSettings: {
    fft: 2048,
    bands: 64,
    sampleRate: 48000
  },
  setAudioSettings: (config) =>
    set((state) => ({
      audioSettings: { ...state.audioSettings, ...config }
    })),

  leftFb: -1,
  setLeftFb: (config) =>
    set(() => ({
      leftFb: config
    })),

  rightFb: -1,
  setRightFb: (config) =>
    set(() => ({
      rightFb: config
    })),
  color: { r: 50, g: 100, b: 150 },
  setColor: (newColor: colorType) =>
    set(() => ({
      color: newColor
    })),

  bgColor: { r: 0, g: 0, b: 0 },
  setBgColor: (newColor) =>
    set(() => ({
      bgColor: newColor
    })),
  gcolor:
    'linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)',
  setGcolor: (newColor) =>
    set(() => ({
      gcolor: newColor
    }))
})
export default storeSettings
