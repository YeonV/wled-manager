import React, { useRef, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { PlayArrow, Stop } from '@material-ui/icons';
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import useStore from '../store/store';

const useStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '275px'
    },
    frequencyBands: {
        padding: 'calc(100vw / 160)',
        flexShrink: 1,
        margin: 'calc(100vw / 500)',
        transform: 'rotateX(180deg)',
        transformOrigin: 'top',
        border: '1px solid transparent',
        cursor: 'pointer',
        zIndex: 10,
        '.selection-active &': {
            opacity: 0.3,
        },
        '&:hover': {
            borderColor: '#999',
            opacity: 1,
        },
        '&.selected': {
            borderColor: '#bbb',
            opacity: 1,
        },
    },
    frequencyBandsBg: {
        position: 'absolute',
        top: 0,
        height: '255px',
        zIndex: -1,
        padding: 'calc(100vw / 160)',
        flexShrink: 1,
        margin: 'calc(100vw / 500)',
        transform: 'rotateX(180deg)',
        transformOrigin: 'top',
        border: '1px solid transparent',
        cursor: 'pointer',
        '.selection-active &': {
            opacity: 0.3,
        },
        '&:hover': {
            opacity: 1,
        },
        '&.selected': {
            opacity: 1,
        },
        '&&:not(.selected)': {
            backgroundColor: 'transparent !important'
        },
    }
}));

export default function VisualDemo({
    frequencyBandArray,
    getFrequencyData,
    initializeAudioAnalyser,
    stop,
    audioContext
}) {

    const classes = useStyles();
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
                    const ratio = amplitudeValues.current[activeFb] / 256
                    const ledData = Array(device.pixel_count)
                        .fill([color.r, color.g, color.b])
                        .fill([bgColor.r, bgColor.g, bgColor.b], parseInt( device.pixel_count * ratio)) 
                        .flat()
                    ipcRenderer.send('UDP', [{ ip: device.ip }, [...ledDataPrefix, ...ledData]])
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
        setTimeout(() => {
            if (frequencyBandArray.length > 0) {
                let domElements = frequencyBandArray.map((num) =>
                    document.getElementById(num))
                for (let i = 0; i < frequencyBandArray.length; i++) {
                    let num = frequencyBandArray[i]
                    domElements[num].style.backgroundColor = theme.palette.background.paper
                }
            }
            stop()
        }, 200);
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
                <div style={{ display: 'flex', flex: 1 }}>
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
                    <Select
                        variant="outlined"
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
                    </Select>
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField variant="outlined" value={device.pixel_count} disabled style={{ width: 100 }} />
                    <TextField variant="outlined" value={device.ip} disabled style={{ width: 230 }} />
                    <ColorPicker color={color} disabled={playing} onChange={setColor} />
                    <ColorPicker color={bgColor} disabled={playing} onChange={setBgColor} />
                </div>
            </div>

            <div className={`${classes.flexContainer} ${activeFb > -1 ? 'selection-active' : ''}`}>
                {frequencyBandArray.map((num) =>
                <div style={{ position: 'relative'}} key={num}>
                    <Paper
                        className={`${classes.frequencyBands} ${activeFb === num ? 'selected' : ''}`}
                        style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`}}
                        elevation={4}
                        id={num}
                        key={num}
                        onClick={() => handleFreqBandClick(num)}
                    />
                    <div
                        className={`${classes.frequencyBandsBg} ${activeFb === num ? 'selected' : ''}`}
                        style={{ backgroundColor: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`}}                        
                        onClick={() => handleFreqBandClick(num)}
                    />
                    </div>
                )}
            </div>

        </div>

    );

}
