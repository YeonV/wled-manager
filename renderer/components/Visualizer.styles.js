import { makeStyles } from '@material-ui/core/styles';

const useVisualizerStyles = makeStyles(theme => ({
    flexContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '275px'
    },
    frequencyBands: {
        padding: 'calc(100vw / 260)',
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
    },
    effectNote: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#444'
    }
}));

export default useVisualizerStyles