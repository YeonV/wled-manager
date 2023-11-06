import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Fab, IconButton, TextField, Typography } from '@mui/material'
import { Check, Close, Error, HourglassEmpty, PlayArrow } from '@mui/icons-material'
import { useStyles } from './styles/Home.styles'
import useStore from './store/store'
import bonjour from 'bonjour'
import warningLogo from './images/orange.png'
import infoLogo from './images/blue.png'
import sucessLogo from './images/green.png'
import errorLogo from './images/red.png'

const Home = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  const iframe = useStore((state) => state.iframe)
  const setIframe = useStore((state) => state.setIframe)
  const setDevice = useStore((state) => state.setDevice)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [warning, setWarning] = useState<boolean | undefined>()

  const handleButtonClick = useCallback((newIp: string, zeroconf: boolean) => {
    setSuccess(false)
    setError(false)
    setLoading(true)
    window.api
      .fetch(`http://${newIp}/json`)
      .then((res) => {
        console.log('Yoo', res)
        if (res.info.name) {
          setSuccess(true)
          window && window.localStorage.setItem('wled-manager-ip', newIp)
          setDevice({
            name: res.info.name,
            type: res.info.arch === 'esp8266' ? 82 : 32,
            ip: newIp,
            vid: res.info.vid,
            pixel_count: res.info.leds.count,
            seg: res.state.seg
          })

          if (zeroconf) {
            window && window.localStorage.setItem('wled-manager-zeroconf', String(zeroconf))
            setTimeout(() => {
              navigate(`/yz?ip=${newIp}${(zeroconf && '&zeroconf=true') || ''}`)
            }, 1000)
            return
          } else {
            window.api
              .fetch(`http://${newIp}/json/nodes`)
              .then((r) => {
                console.log('soo', r)
                if (r.status === 501) {
                  setTimeout(() => {
                    navigate(`/#yz?ip=${newIp}&singlemode=true`)
                  }, 5000)
                  return setWarning(true)
                }
                setTimeout(() => {
                  navigate(`/#yz?ip=${newIp}}`)
                }, 1000)
                return r.json()
              })
              .catch((error) => {
                console.log(error)
              })
          }
        }
      })
      .catch(() => {
        setLoading(false)
        setError(true)
        window && window.localStorage.removeItem('wled-manager-ip')
      })
  }, [])

  useEffect(() => {
    window.api.resizeWindow([480, 800])
  }, [])

  useEffect(() => {
    let bonjourInstance: null | bonjour.Bonjour = null
    bonjourInstance = require('bonjour')()
    if (bonjourInstance) {
      bonjourInstance.find({ type: 'wled' }, (service) => {
        if (service.referer && service.referer.address) {
          bonjourInstance!.destroy()
          setIframe(service.referer.address)
          handleButtonClick(service.referer.address, true)
        }
      })
      return () => {
        bonjourInstance!.destroy()
      }
    }
    return
  }, [])

  return (
    <>
      <div className={classes.root}>
        <Box className={classes.bar}>
          <IconButton sx={{ WebkitAppRegion: 'no-drag' }}>
            <Close style={{ color: '#666' }} />
          </IconButton>
        </Box>
        <div>
          {warning ? (
            <img src={warningLogo} />
          ) : success ? (
            <img src={sucessLogo} />
          ) : error ? (
            <img src={errorLogo} />
          ) : loading ? (
            <img src={warningLogo} />
          ) : (
            <img src={infoLogo} />
          )}
          <Typography
            variant="h4"
            style={{ color: '#444' }}
            onClick={() => window.location.reload()}
          >
            WLED Manager
          </Typography>
          <div style={{ display: 'flex', marginTop: '2rem' }}>
            <TextField
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault()
                  handleButtonClick(iframe, false)
                }
              }}
              focused
              id="ip"
              label="WLED IP"
              style={{ width: 256 }}
              variant="outlined"
              value={iframe}
              onChange={(e) => setIframe(e.target.value)}
            />
          </div>
        </div>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab
            color="primary"
            style={{
              zIndex: 2,
              ...(loading && {
                backgroundColor: '#ffaa00',
                '&:hover': {
                  backgroundColor: '#ffaa00'
                }
              }),
              ...(error && {
                backgroundColor: '#e40303',
                '&:hover': {
                  backgroundColor: '#e40303'
                }
              }),
              ...(success && {
                backgroundColor: '#008026',
                '&:hover': {
                  backgroundColor: '#008026'
                }
              }),
              ...(warning && {
                backgroundColor: '#ffaa00',
                '&:hover': {
                  backgroundColor: '#ffaa00'
                }
              })
            }}
            onClick={() => handleButtonClick(iframe, false)}
          >
            {warning ? (
              <Error />
            ) : success ? (
              <Check />
            ) : error ? (
              <Error />
            ) : loading ? (
              <HourglassEmpty />
            ) : (
              <PlayArrow />
            )}
          </Fab>
          {loading && (
            <CircularProgress
              size={68}
              style={{
                color: warning
                  ? '#ffaa00'
                  : success
                    ? '#00a32e'
                    : error
                      ? '#e40303'
                      : loading
                        ? '#ffaa00'
                        : '#004dff',
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1
              }}
            />
          )}
        </Box>
        <div>
          {warning && (
            <Typography gutterBottom variant="h6">
              No zeroconf available and WLED too old.
              <br />
              Entering Single-Device-Mode
            </Typography>
          )}
        </div>
        <Typography gutterBottom variant="h6" style={{ color: '#444' }}>
          by Blade
        </Typography>
      </div>
    </>
  )
}

export default Home
