import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240

const useLeftBarStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
            backgroundColor: '#ffffff30',
            width: '8px',
            borderRadius: '8px',
        },
        '*::-webkit-scrollbar-track': {
            backgroundColor: '#00000060',
            borderRadius: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#555555',
            borderRadius: '8px',
        },
        '*::-webkit-scrollbar-button': {
            display: 'none',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        backgroundColor: '#111',
    },
    drawerPaper: {
        width: drawerWidth,
        overflowX: 'hidden',
        backgroundColor: '#111',
    },
    drawerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        paddingTop: '30px',
        height: '99px',
        ...theme.mixins.toolbar,
    },

    activeView: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: theme.shadows[12],
        '&:hover,&:focus,&:visited,&': {
            backgroundColor: theme.palette.secondary.main,
            boxShadow: theme.shadows[12],
        },
        color: '#fff',
    },
    content: {
        flexGrow: 1,
        height: 'calc(100vh - 30px)',
        background: 'transparent',
        padding: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: drawerWidth,
        '@media (max-width: 580px)': {
            padding: '8px',
        },
    },
    menuButton: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: drawerWidth,
        position: 'absolute',
        top: 69,
        left: 0,
        width: 42,
        height: 42,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex'
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));

export default useLeftBarStyles