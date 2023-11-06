import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useLeftBarStyles = makeStyles(() => ({
  '@global': {
    '*::-webkit-scrollbar': {
      backgroundColor: '#ffffff30',
      width: '8px',
      borderRadius: '8px'
    },
    '*::-webkit-scrollbar-track': {
      backgroundColor: '#00000060',
      borderRadius: '8px'
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: '#555555',
      borderRadius: '8px'
    },
    '*::-webkit-scrollbar-button': {
      display: 'none'
    }
  },
  drawerBottom: {
    flexShrink: 0,
    backgroundColor: '#111'
  }
}))
export const cls = (theme: Theme) => ({
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    paddingTop: '30px',
    height: '99px',
    '&&': {
      minHeight: '99px'
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
      boxShadow: theme.shadows[12]
    },
    color: '#fff'
  },
  content: () => ({
    flexGrow: 1,
    zIndex: 0,
    height: 'calc(100vh - 60px)',
    background: 'transparent',
    padding: 0,
    position: 'relative',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen
    }),
    '@media (max-width: 580px)': {
      padding: '8px'
    }
  }),
  contentBottom: (props: any) => ({
    flexGrow: 1,
    background: 'transparent',
    padding: 0,
    transition: theme.transitions.create('padding', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    paddingBottom: props.drawerBottomHeight + 'px'
  }),
  barBottom: (props: any) => ({
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginTop: -props.drawerBottomHeight + 'px'
  }),
  barBottomShift: {
    transition: `${theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })} !important`,
    marginTop: '0 !important'
  },
  contentShift: {
    transition: `${theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })} !important`,
    marginLeft: '0 !important'
  },
  contentBottomShift: {
    transition: `${theme.transitions.create('padding', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })} !important`,
    paddingBottom: '0 !important'
  },
  menuButton: (props: any) => ({
    position: 'absolute',
    top: `calc((100% - 32px - ${props.drawerBottomHeight}px) / 2)`,
    left: -1,
    width: 42,
    height: 42,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    borderLeft: '1px solid #111',
    zIndex: 1200
  }),
  drawerPaper: (props: any) => ({
    width: props.drawerWidth + 'px',
    height: `calc(100% - ${!props.bottomBarOpen ? '30' : props.drawerBottomHeight + 30}px )`,
    overflowX: 'hidden',
    backgroundColor: '#111',
    transition: 'height 0.15s ease-in',
    paddingBottom: props.drawerBottomHeight + 'px'
  }),
  noselect: {
    WebkitTouchCallout: 'none' /* iOS Safari */,
    WebkitUserSelect: 'none' /* Safari */,
    KhtmlUserSelect: 'none' /* Konqueror HTML */,
    MozUserSelect: 'none' /* Firefox */,
    MsUserSelect: 'none' /* Internet Explorer/Edge */,
    userSelect: 'none' /* Non-prefixed version */
  },
  drawer: (props: any) => ({
    width: props.drawerWidth + 'px',
    flexShrink: 0,
    backgroundColor: '#111'
  }),
  drawerBottomPaper: (props: any) => ({
    height: props.drawerBottomHeight + 'px',
    overflow: 'hidden',
    backgroundColor: '#111'
  })
})

export default useLeftBarStyles
