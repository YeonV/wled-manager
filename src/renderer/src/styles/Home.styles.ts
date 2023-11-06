import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    textAlign: 'center',
    paddingTop: 0,
    backgroundColor: '#222',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& img': {
      width: 256
    }
  },
  bar: {
    height: '30px',
    width: '100vw',
    WebkitAppRegion: 'drag',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}))
