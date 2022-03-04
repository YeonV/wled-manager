const storeSettings = (set, get) => ({

    device: '',
    setDevice: (newDevice) => set(() => ({
        device: newDevice
    })),

    devices: [],
    setDevices: (newDevices) => set(() => ({
        devices: newDevices
    })),

    virtual: '',
    setVirtual: (newVirtual) => set(() => ({
        virtual: newVirtual
    })),

    virtuals: [],
    setVirtuals: (newVirtuals) => set(() => ({
        virtuals: newVirtuals
    })),

    addVirtual: (newVirtual) => set((state) => ({
        virtuals: state.virtuals.find(v=>v.name === newVirtual.name) ? [...state.virtuals.filter(v=>v.name !== newVirtual.name), newVirtual] : [...state.virtuals, newVirtual]
    })),
    removeVirtual: (newVirtual) => set((state) => ({
        virtuals: state.virtuals.find(v=>v.name === newVirtual.name) ? [...state.virtuals.filter(v=>v.name !== newVirtual.name)] : state.virtuals
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
    gcolor: "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)",
    setGcolor: (newColor) => set(() => ({
        gcolor: newColor
    })),

})
export default storeSettings
