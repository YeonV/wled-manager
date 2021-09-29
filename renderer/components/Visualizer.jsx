import React, { useRef, useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { ipcRenderer } from 'electron';
import { PlayArrow, Stop } from '@material-ui/icons';
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import ColorPicker from './ColorPicker';
import { setPriority } from 'os';

const useStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '235px'
    },
    frequencyBands: {
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
            borderColor: 'white',
            opacity: 1,
        },
        '&.selected': {
            borderColor: 'cyan',
            opacity: 1,
        },
    }
}));

export default function VisualDemo({
    frequencyBandArray,
    getFrequencyData,
    initializeAudioAnalyser,
    stop,
}) {

    const classes = useStyles();
    const theme = useTheme();
    const amplitudeValues = useRef(null);

    const [activeFb, setActiveFb] = useState(-1)
    const [audioDevices, setAudioDevices] = useState([])
    const [audioDevice, setAudioDevice] = useState("default")
    const [color, setColor] = useState({ r: 50, g: 100, b: 150 });
    const [ip, setIp] = useState("192.168.1.170")
    const [pixelCount, setPixelCount] = useState(256)

    function adjustFreqBandStyle(newAmplitudeData) {
        amplitudeValues.current = newAmplitudeData;
        if (frequencyBandArray.length > 0) {
            let domElements = frequencyBandArray.map((num) =>
                document.getElementById(num))

            for (let i = 0; i < frequencyBandArray.length; i++) {
                let num = frequencyBandArray[i]
                domElements[num].style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`
                domElements[num].style.height = `${amplitudeValues.current[num]}px`
            }
            if (activeFb > -1) {
                const ledDataPrefix = [2, 1];
                const ledData = Array(pixelCount).fill([0, 0, 0]).fill([color.r, color.g, color.b], (255 - amplitudeValues.current[activeFb])).flat()
                ipcRenderer.send('UDP', [{ ip: ip }, [...ledDataPrefix, ...ledData]])
            }
        }

    };

    function runSpectrum() {
        getFrequencyData(adjustFreqBandStyle)

        requestAnimationFrame(runSpectrum)
    }

    function handleStartButtonClick() {
        // ipcRenderer.send('UDP', [2,1,255,0,0,255,0,0,255,0,0,255,0,0])
        initializeAudioAnalyser()
        requestAnimationFrame(runSpectrum)
    }
    function handleStopButtonClick() {
        stop()
        cancelAnimationFrame(runSpectrum)
        setTimeout(() => {
            if (frequencyBandArray.length > 0) {
                let domElements = frequencyBandArray.map((num) =>
                    document.getElementById(num))
                for (let i = 0; i < frequencyBandArray.length; i++) {
                    let num = frequencyBandArray[i]
                    domElements[num].style.backgroundColor = theme.palette.background.paper
                }
            }
        }, 1000);

    }

    function handleFreqBandClick(num) {
        if (activeFb === num) {
            setActiveFb(-1)
        } else {
            setActiveFb(num)
        }
    }

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                console.log(devices)
                setAudioDevices(devices)
                // setAudioDevice(devices[0])
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            })
    }, [])

    return (

        <div>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flex:1 }}>
                    <Tooltip
                        title="Start"
                        aria-label="Start"
                        placement="bottom">
                        <Button
                            variant="outlined"
                            id='startButton'
                            onClick={() => handleStartButtonClick()}
                        >
                            <PlayArrow />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title="Stop"
                        aria-label="Stop"
                        placement="bottom">
                        <Button
                            variant="outlined"
                            id='startButton'
                            onClick={() => handleStopButtonClick()}
                        >
                            <Stop />
                        </Button>
                    </Tooltip>
                    <Select
                        variant="outlined"
                        disableUnderline
                        value={audioDevice}
                        style={{ width: '100%' }}
                        onChange={(e) => {
                            setAudioDevice(e.target.value)
                            // WEBAUDIO CHANGE INPUT DEVICE
                        }}
                    >
                        {audioDevices.filter(cd => cd.kind === 'audioinput').map((d, i) =>
                            <MenuItem key={i} value={d.deviceId} disabled>
                                {d.label}
                            </MenuItem>
                        )}

                    </Select>
                </div>
                <div style={{ display: 'flex' }}>
                    <TextField variant="outlined" value={pixelCount} onChange={(e) => setPixelCount(e.target.value)} style={{ width: 100 }} />
                    <TextField variant="outlined" value={ip} onChange={(e) => setIp(e.target.value)} style={{ width: 230 }} />
                    <ColorPicker color={color} onChange={setColor} />
                </div>
            </div>

            <div className={`${classes.flexContainer} ${activeFb > -1 ? 'selection-active' : ''}`}>
                {frequencyBandArray.map((num) =>
                    <Paper
                        className={`${classes.frequencyBands} ${activeFb === num ? 'selected' : ''}`}
                        elevation={4}
                        id={num}
                        key={num}
                        onClick={() => handleFreqBandClick(num)}
                    />
                )}
            </div>

        </div>

    );

}
