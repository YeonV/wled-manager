import { makeStyles } from '@material-ui/core/styles';

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
    noselect: {
        WebkitTouchCallout: 'none', /* iOS Safari */
          WebkitUserSelect: 'none', /* Safari */
           KhtmlUserSelect: 'none', /* Konqueror HTML */
             MozUserSelect: 'none', /* Firefox */
              MsUserSelect: 'none', /* Internet Explorer/Edge */
                  userSelect: 'none', /* Non-prefixed version, currently
                                        supported by Chrome and Opera */
      },
    drawerBottom: {
        flexShrink: 0,
        backgroundColor: '#111',
    },
    drawerBottomPaper: (props) => ({
        height: props.drawerBottomHeight,
        overflow: 'hidden',
        backgroundColor: '#111',        
    }),
    drawer: (props) => ({
        width: props.drawerWidth,
        flexShrink: 0,
        backgroundColor: '#111',
    }),
    drawerPaper:(props) => ({
        width: props.drawerWidth,
        height: `calc(100% - ${!props.bottomBarOpen ? '30' : props.drawerBottomHeight+30}px )`,
        overflowX: 'hidden',
        backgroundColor: '#111',
        transition: 'height 0.15s ease-in'
        // paddingBottom: props.drawerBottomHeight,
    }),
    drawerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
        paddingTop: '30px',
        height: '99px',
        '&&': {

            minHeight: '99px',
        },
        ...theme.mixins.toolbar,
        '&>div': {
            backgroundSize: '94%',
            backgroundPosition: '-207% 42%',
            backgroundRepeat: 'no-repeat',
            paddingLeft: '16px',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundImage: 'url(/images/logo.svg)'
          }
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
    content: (props) =>({
        flexGrow: 1,
        zIndex: 0,
        height: 'calc(100vh - 60px)',
        background: 'transparent',
        padding: 0,
        position: 'relative',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: props.drawerWidth,
        '@media (max-width: 580px)': {
            padding: '8px',
        },
    }),
    contentBottom: (props)=> ({
        flexGrow: 1,
        background: 'transparent',
        padding: 0,
        transition: theme.transitions.create('padding', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        paddingBottom: props.drawerBottomHeight,
    }),
    barBottom: (props)=> ({
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: -props.drawerBottomHeight,
    }),
    barBottomShift: {
        transition: `${theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        })} !important`,
        marginTop: '0 !important',
    },
    menuButton: (props)=> ({
        position: 'absolute',
        top: `calc((100% - 32px - ${props.drawerBottomHeight}px) / 2)`,
        left: -1,
        width: 42,
        height: 42,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderLeft: 0,
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        cursor: 'pointer',
        borderLeft: '1px solid #111',
        zIndex: 1200,
    }),
    contentShift: {
        transition: `${theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        })} !important`,
        marginLeft: '0 !important',
    },
    contentBottomShift: {
        transition: `${theme.transitions.create('padding', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        })} !important`,
        paddingBottom: '0 !important',
    },
}));

export default useLeftBarStyles