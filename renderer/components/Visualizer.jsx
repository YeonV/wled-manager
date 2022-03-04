import React, { useRef, useState, useEffect } from 'react';
import { useTheme, styled } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { PlayArrow, Stop } from '@material-ui/icons';
import { Button, MenuItem, TextField, Typography, Paper, Box, Slider } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import useStore from '../store/store';
import Effect, { effects } from '../effects/effects';
import Toggle from './Toggle';
import useVisualizerStyles from './Visualizer.styles';


const YZslider = styled(Slider)({
    color: 'white',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
        width: 0,
    },
    '& .MuiSlider-rail': {
        border: 'none',
        width: 0,
    },
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        marginLeft: -9,
        backgroundColor: '#fff0',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            content: '"⬍"',
            position: 'absolute',
            left: 0,
            top: -8,
            width: 20,
            height: 20,
            fontSize: 30,
            color: '#444',
        },
        '&:after': {
            top: 12,
            left: -20,
            content: "",
            position: 'absolute',
            height: 10,
            width: '100vw',
            borderTop: '1px dashed #444',
            borderRadius: 0,
            right: 'unset',
            bottom: 'unset',
        },
        '&:hover': {
            '&:after': {
                borderColor: '#aaa'
            },
            '&:before': {
                color: '#aaa'
            }
        }
    },
});


export default function Visualizer({
    frequencyBandArray,
    getFrequencyData,
    initializeAudioAnalyser,
    stop,
    refresh,
    audioContext,
    fft,
    bandCount
}) {

    const classes = useVisualizerStyles();
    const theme = useTheme();
    const amplitudeValues = useRef(null);
    const timeStarted = useRef(null);
    const lastShift = useRef(null);
    const lastAudio = useRef(null);

    const device = useStore(state => state.device)
    const devices = useStore(state => state.devices)
    const audioDevice = useStore(state => state.audioDevice)
    const setAudioDevice = useStore(state => state.setAudioDevice)
    const audioDevices = useStore(state => state.audioDevices)
    const setAudioDevices = useStore(state => state.setAudioDevices)
    const color = useStore(state => state.color)
    const setColor = useStore(state => state.setColor)
    const bgColor = useStore(state => state.bgColor)
    const setBgColor = useStore(state => state.setBgColor)
    const gcolor = useStore(state => state.gcolor)
    const setGcolor = useStore(state => state.setGcolor)
    const setAudioSettings = useStore(state => state.setAudioSettings)
    const setLeftFb = useStore(state => state.setLeftFb)
    const setRightFb = useStore(state => state.setRightFb)

    const [activeFb, setActiveFb] = useState(-1)
    const [activeRightFb, setActiveRightFb] = useState(-1)
    const [playing, setPlaying] = useState(false)
    const [flipped, setFlipped] = useState(false)
    const [effect, setEffect] = useState("Power (Left FB)")
    const [volume, setVolume] = useState(0)
    const [innerVolume, setInnerVolume] = useState(0)   
    const virtualView = useStore(state => state.virtualView)
    const virtual = useStore(state => state.virtual)
    const setDrawerBottomHeight = useStore(state => state.setDrawerBottomHeight)


    const settingColor = (clr) => {
        setColor(clr)
        if (playing) {
            refresh()
        }
    }
    const settingBgColor = (clr) => {
        setBgColor(clr)
        if (playing) {
            refresh()
        }
    }
    const settingGcolor = (clr) => {
        setGcolor(clr)
        if (playing) {
            console.log("refreshing")           
            handleStopButtonClick()
        } 
        
    }

    const settingFlipped = (flp) => {
        setFlipped(flp)
        if (playing) {
            refresh()
        }
    }
    const settingActiveFb = (act) => {
        setActiveFb(act)
        if (playing) {
            refresh()
        }
    }
    const settingActiveRightFb = (act) => {
        setActiveRightFb(act)
        if (playing) {
            refresh()
        }
    }
    const settingVolume = () => {
        setInnerVolume(volume)
        if (playing) {
            refresh()
        }
    }

    function adjustFreqBandStyle(newAmplitudeData) {
        if (audioContext.state === 'closed') {
            cancelAnimationFrame(runSpectrum)
            return
        }
        amplitudeValues.current = newAmplitudeData;
        if (frequencyBandArray.length > 0) {
            let domElements = frequencyBandArray.map((num) =>
                document.getElementById(num))
            if (domElements.length > 0) {
                for (let i = 0; i < frequencyBandArray.length; i++) {
                    let num = frequencyBandArray[i]
                    if (domElements[num]) {
                        domElements[num].style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`
                        domElements[num].style.height = `${amplitudeValues.current[num]}px`
                    }
                }
                if (activeFb > -1) {
                    const ledDataPrefix = [2, 1];
                    const ledData = Effect({
                        type: effect,
                        config: {
                            ampValues: amplitudeValues.current,
                            pixel_count: virtualView ? virtual.pixel_count : device.pixel_count,
                            color,
                            bgColor,
                            gcolor,
                            activeFb,
                            activeRightFb,
                            volume: volume,
                            timeStarted: timeStarted,
                            lastShift,
                            lastAudio
                        }
                    })
                    // console.log(ledData)
                    // const header = "VER_YZ"
                    // const myVals = "00000000000000000000000000000000"
                    // const sampleAvc = "0001"
                    // const sample = "0001"
                    // const sampleAvg = "0001"
                    // const samplePeak = "1"
                    // const fftResult = "0000000000000000"
                    // const FFT_Magnitude = "00000000"
                    // const FFT_MajorPeak = "00000000"

                    // ledData && ledData.length > 1 && ipcRenderer.send('UDPSR', [{ ip: device.ip }, 
                    //     `${header}${myVals}${sampleAvc}${sample}${sampleAvg}${samplePeak}${fftResult}${FFT_Magnitude}${FFT_MajorPeak}`])

                    if (virtualView) {
                        virtual.seg && virtual.seg.length && virtual.seg.map(s=>{
                            ledData && ledData.length > 1 && ipcRenderer.send('UDP', [{ ip: devices.find(d=>d.name === s.device).ip }, flipped
                                ? [...ledDataPrefix, ...ledData.reverse().flat()].splice(s.seg[0]*3, s.seg[1]*3)
                                : [...ledDataPrefix, ...ledData.flat()].splice(s.seg[0]*3, s.seg[1]*3)])
                        })
                    } else {                    
                        ledData && ledData.length > 1 && ipcRenderer.send('UDP', [{ ip: device.ip }, flipped
                            ? [...ledDataPrefix, ...ledData.reverse().flat()]                            
                            : [...ledDataPrefix, ...ledData.flat()]])
                    }

                    // ledData && ledData.length > 1 && ipcRenderer.send('UDP', [{ ip: device.ip }, (amplitudeValues.current[activeFb] - volume * 2.55) > 0
                    //     ? [...ledDataPrefix, ...tmp.reverse().flat()]
                    //     : [...ledDataPrefix, ...tmp.flat()]])
                }
            }
        }
    };

    function runSpectrum() {
        if (audioContext.state === 'running') {
            getFrequencyData(adjustFreqBandStyle)
            requestAnimationFrame(runSpectrum)
        }
    }

    function handleStartButtonClick() {
        ipcRenderer.send('UDP-start')
        // ipcRenderer.send('UDPSR-start')
        timeStarted.current = performance.now();
        setPlaying(true)
        initializeAudioAnalyser()
        requestAnimationFrame(runSpectrum)
    }

    function handleStopButtonClick() {
        setPlaying(false)
        ipcRenderer.send('UDP-stop')
        // console.log(performance.now() - timeStarted.current)
        // ipcRenderer.send('UDPSR-stop')
        if (frequencyBandArray.length > 0) {
            let domElements = frequencyBandArray.map((num) =>
                document.getElementById(num))
            for (let i = 0; i < frequencyBandArray.length; i++) {
                let num = frequencyBandArray[i]
                domElements[num].style.backgroundColor = theme.palette.background.paper
            }
        }
        stop(800)
    }

    function handleFreqBandClick(num) {
        if (activeFb === num) {
            settingActiveFb(-1)
            return
        }
        if (activeRightFb > -1) {
            if (num > activeRightFb) {
                settingActiveRightFb(-1)
                settingActiveFb(num)
                return
            }
            settingActiveFb(num)
        } else {
            settingActiveFb(num)
        }
    }

    function handleFreqBandRightClick(num) {
        if (activeRightFb === num) {
            settingActiveRightFb(-1)
            return
        }
        if (activeFb > -1) {
            if (activeFb > num) {
                settingActiveRightFb(num)
                settingActiveFb(-1)
                return
            }
            settingActiveRightFb(num)
        } else {
            settingActiveRightFb(num)
        }
    }

    function preventHorizontalKeyboardNavigation(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
        }
    }

    useEffect(() => {
        if (playing) {
            setTimeout(() => {
                initializeAudioAnalyser()
                requestAnimationFrame(runSpectrum)
            }, 100)           
        }
        setLeftFb(activeFb)
        setRightFb(activeRightFb)
    }, [color, bgColor, flipped, innerVolume, activeFb, activeRightFb])

    useEffect(() => {
        handleStopButtonClick()
    }, [fft, bandCount])

    useEffect(() => {
        setAudioSettings({
            sampleRate: audioContext.sampleRate
        })
        navigator.mediaDevices.enumerateDevices()
            .then(function (adevices) {
                setAudioDevices(adevices)
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            })
    }, [])
  
    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flex: 1, paddingTop: 10 }}>
                    <Button
                        variant="outlined"
                        disabled={playing}
                        id='startButton'
                        onClick={() => handleStartButtonClick()}
                    >
                        <PlayArrow />
                    </Button>
                    <Button
                        variant="outlined"
                        id='startButton'
                        disabled={!playing}
                        onClick={() => handleStopButtonClick()}
                    >
                        <Stop />
                    </Button>
                    <TextField
                        select
                        variant="outlined"
                        label="Audio Input"
                        disabled={playing}
                        value={audioDevice || 'default'}
                        style={{ width: '100%' }}
                        onChange={(e) => { setAudioDevice(e.target.value) }}
                    >
                        {audioDevices.filter(cd => cd.kind === 'audioinput').map((d, i) =>
                            <MenuItem key={i} value={d.deviceId}>
                                {d.label}
                            </MenuItem>
                        )}
                    </TextField>
                    <TextField
                        select
                        variant="outlined"
                        disabled={playing}
                        title="Effect"
                        label="Effect"
                        value={effect}
                        style={{ width: '50%' }}
                        onChange={(e) => { 
                            if (e.target.value === 'BladeWave (Range)') {
                                setBgColor({r: 0, g: 0, b:0})
                            }
                            if (e.target.value === 'BladePower (Left FB)') {
                                setActiveRightFb(-1)
                            }
                            setEffect(e.target.value) 
                        }}
                    >
                        {effects.map((d, i) =>
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        )}
                    </TextField>
                </div>
                <div style={{ display: 'flex', paddingTop: 10 }}>
                    {effect.indexOf("radient") === -1 &&
                        <ColorPicker label="COL" color={color} onChange={settingColor} setDrawerBottomHeight={setDrawerBottomHeight} />}
                    {effect !== "BladeWave (Range)" && effect.indexOf("radient") === -1 &&
                        <ColorPicker label="BG" color={bgColor} onChange={settingBgColor} setDrawerBottomHeight={setDrawerBottomHeight} />
                    }
                    {effect.indexOf("radient") > -1 && <ColorPicker label="GR" color={gcolor} onChange={settingGcolor} setDrawerBottomHeight={setDrawerBottomHeight} gradient />}
                    <Toggle label="Flip" value={flipped} setValue={settingFlipped} />
                </div>
            </div>
            <Box sx={{ height: 255, position: 'absolute', zIndex: 1, pointerEvents: 'none', top: 88, left: 0, right: 0, paddingLeft: 16, background: `linear-gradient(to top, #000c, #000c ${volume}%, transparent ${volume + 1}%)` }} />
            <Box sx={{ height: 255, position: 'absolute', zIndex: 2, top: 88, left: 0, paddingLeft: 16 }}>
                <YZslider
                    orientation="vertical"
                    value={volume}
                    onChange={(e, v) => setVolume(v)}
                    onChangeCommitted={settingVolume}
                    min={0}
                    max={100}
                    aria-label="Temperature"
                    onKeyDown={preventHorizontalKeyboardNavigation}
                />
            </Box>
            {(activeFb === -1 && effect === 'BladePower') &&
                <Typography variant={"h3"} className={classes.effectNote}>
                    Please select a band at the bottom
                </Typography>
            }
            <div className={`${classes.flexContainer} ${(activeFb > -1 || activeRightFb > -1) ? 'selection-active' : ''}`}>
                {frequencyBandArray.map((num) =>
                    <div style={{ position: 'relative' }} key={num}>
                        <Paper
                            className={`${classes.frequencyBands} ${(activeFb > -1 && activeRightFb > -1)
                                ? ((activeFb <= num && activeRightFb >= num)
                                    ? 'selected'
                                    : '')
                                : (activeFb === num || activeRightFb === num)
                                    ? 'selected'
                                    : ''}`}
                            style={{ background: `rgb(${color.r}, ${color.g}, ${color.b})`, padding: `calc(100vw / ${(frequencyBandArray.length) * 4} )` }}
                            elevation={4}
                            id={num}
                            key={num}
                            onClick={() => handleFreqBandClick(num)}
                            onContextMenu={() => handleFreqBandRightClick(num)}
                        />
                        <div
                            className={`${classes.frequencyBandsBg} ${(activeFb > -1 && activeRightFb > -1)
                                ? ((activeFb <= num && activeRightFb >= num)
                                    ? 'selected'
                                    : '')
                                : (activeFb === num || activeRightFb === num)
                                    ? 'selected'
                                    : ''}`}
                            style={{ backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`, padding: `calc(100vw / ${frequencyBandArray.length * 4} )` }}
                            onClick={() => handleFreqBandClick(num)}
                            onContextMenu={() => handleFreqBandRightClick(num)}
                        />
                    </div>
                )}
            </div>
        </div>

    );

}
