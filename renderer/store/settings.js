const storeSettings = (set, get) => ({

    device: '',
    setDevice: (newDevice) => set(() => ({
        device: newDevice
    })),

    devices: [],
    setDevices: (newDevices) => set(() => ({
        devices: newDevices
    })),

    iframe: '',
    setIframe: (ip) => set(() => ({
        iframe: ip
    })),

    audioDevice: 'default',
    setAudioDevice: (newDevice) => set(() => ({
        audioDevice: newDevice
    })),

    audioDevices: [],
    setAudioDevices: (newDevices) => set(() => ({
        audioDevices: newDevices
    })),

    audioSettings: {
        fft: 2048,
        bands: 64,
        sampleRate: 48000
    },
    setAudioSettings: (config) => set((state) => ({
        audioSettings: {...state.audioSettings, ...config}
    })),
    
    leftFb: -1,
    setLeftFb: (config) => set((state) => ({
        leftFb: config
    })),

    rightFb: -1,
    setRightFb: (config) => set((state) => ({
        rightFb: config
    })),

    color: { r: 0, g: 255, b: 179 },
    setColor: (newColor) => set(() => ({
        color: newColor
    })),

    bgColor: { r: 0, g: 0, b: 0 },
    setBgColor: (newColor) => set(() => ({
        bgColor: newColor
    })),

})
export default storeSettings
