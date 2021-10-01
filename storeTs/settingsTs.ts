import create, {GetState, SetState, StateCreator, StoreApi} from 'zustand';
// import { MyState } from "./storeTs";

type colorType = {
    r:number, 
    g:number, 
    b:number
}

export interface SettingsSlice {
    device: string;
    setDevice: (newDevice:string) => void;
    devices: [];
    setDevices: (newDevices:any) => void;
    iframe: string;
    setIframe: (ip:string) => void;
    audioDevice: string;
    setAudioDevice: (newDevice:string) => void;
    audioDevices: [];
    setAudioDevices: (newDevices:any) => void;
    color: colorType;
    setColor: (newColor:colorType) => void;
  }

const storeSettings: StateCreator<SettingsSlice> | StoreApi<SettingsSlice> = (set, get) => ({  

    device: '',
    setDevice: (newDevice:string) => set(() => ({
        device: newDevice
    })),

    devices: [],
    setDevices: (newDevices:any) => set(() => ({
        devices: newDevices
    })),

    iframe: '',
    setIframe: (ip:string) => set(() => ({
        iframe: ip
    })),  
    
    audioDevice: 'default',
    setAudioDevice: (newDevice:string) => set(() => ({
        audioDevice: newDevice
    })),

    audioDevices: [],
    setAudioDevices: (newDevices:any) => set(() => ({
        audioDevices: newDevices
    })),

    color: { r: 50, g: 100, b: 150 },
    setColor: (newColor:colorType) => set(() => ({
        color: newColor
    })),   

})
export default storeSettings
