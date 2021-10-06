import React, { useRef, useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { PlayArrow, Stop } from '@material-ui/icons';
import { Button, MenuItem, TextField, Typography, Paper } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import useStore from '../store/store';
import Effect, { effects } from '../effects';
import Toggle from './Toggle';
import useVisualizerStyles from './Visualizer.styles';

export default function VisualDemo({
    frequencyBandArray,
    getFrequencyData,
    initializeAudioAnalyser,
    stop,
    refresh,
    audioContext
}) {

    const classes = useVisualizerStyles();
    const theme = useTheme();
    const amplitudeValues = useRef(null);

    const device = useStore(state => state.device)
    const audioDevice = useStore(state => state.audioDevice)
    const setAudioDevice = useStore(state => state.setAudioDevice)
    const audioDevices = useStore(state => state.audioDevices)
    const setAudioDevices = useStore(state => state.setAudioDevices)
    const color = useStore(state => state.color)
    const setColor = useStore(state => state.setColor)
    const bgColor = useStore(state => state.bgColor)
    const setBgColor = useStore(state => state.setBgColor)

    const [activeFb, setActiveFb] = useState(-1)
    const [playing, setPlaying] = useState(false)
    const [flipped, setFlipped] = useState(false)
    const [effect, setEffect] = useState("BladePower")

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
    const settingFlipped = (flp) => {
        setFlipped(flp)
        if (playing) {
            refresh()
        }
    }

    useEffect(() => {
        if (playing) {
            setTimeout(() => {
                initializeAudioAnalyser()
                requestAnimationFrame(runSpectrum)
            }, 100)
        }
    }, [color, bgColor, flipped])

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
                    domElements[num].style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`
                    domElements[num].style.height = `${amplitudeValues.current[num]}px`
                }
                if (activeFb > -1) {
                    const ledDataPrefix = [2, 1];

                    const ledData = Effect({
                        type: effect,
                        config: {
                            ampValues: amplitudeValues.current,
                            pixel_count: device.pixel_count,
                            color,
                            bgColor,
                            activeFb
                        }
                    })
                    // console.log(ledData)
                    ledData && ledData.length > 1 && ipcRenderer.send('UDP', [{ ip: device.ip }, flipped
                        ? [...ledDataPrefix, ...ledData.reverse().flat()]
                        : [...ledDataPrefix, ...ledData.flat()]])
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
        setPlaying(true)
        initializeAudioAnalyser()
        requestAnimationFrame(runSpectrum)
    }
    function handleStopButtonClick() {
        setPlaying(false)
        ipcRenderer.send('UDP-stop')
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
            setActiveFb(-1)
        } else {
            setActiveFb(num)
            if (playing) {
                handleStopButtonClick()
            }
        }
    }

    useEffect(() => {
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
                        onChange={(e) => { setEffect(e.target.value) }}
                    >
                        {effects.map((d, i) =>
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        )}
                    </TextField>
                </div>
                <div style={{ display: 'flex', paddingTop: 10 }}>
                    <ColorPicker label="COL" color={color} onChange={settingColor} />
                    {effect !== "BladeWave (Test)" &&
                        <ColorPicker label="BG" color={bgColor} onChange={settingBgColor} />
                    }
                    <Toggle label="Flip" value={flipped} setValue={settingFlipped} />
                </div>
            </div>
            {(activeFb === -1 && effect === 'BladePower') &&
                <Typography variant={"h3"} className={classes.effectNote}>
                    Please select a band at the bottom
                </Typography>
            }
            <div className={`${classes.flexContainer} ${activeFb > -1 ? 'selection-active' : ''}`}>
                {frequencyBandArray.map((num) =>
                    <div style={{ position: 'relative' }} key={num}>
                        <Paper
                            className={`${classes.frequencyBands} ${activeFb === num ? 'selected' : ''}`}
                            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, padding: `calc(100vw / ${(console.log(frequencyBandArray.length) || frequencyBandArray.length) * 4} )` }}
                            elevation={4}
                            id={num}
                            key={num}
                            onClick={() => handleFreqBandClick(num)}
                        />
                        <div
                            className={`${classes.frequencyBandsBg} ${activeFb === num ? 'selected' : ''}`}
                            style={{ backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`, padding: `calc(100vw / ${(console.log(frequencyBandArray.length) || frequencyBandArray.length) * 4} )` }}
                            onClick={() => handleFreqBandClick(num)}
                        />
                    </div>
                )}
            </div>
        </div>

    );

}
