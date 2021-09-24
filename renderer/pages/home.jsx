import React, { useEffect } from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';
import { Theme, makeStyles, createStyles, styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Check, Error, HourglassEmpty, PlayArrow, Save } from '@material-ui/icons';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Link from '../components/Link';

import { Box, CircularProgress, Fab, TextField } from '@material-ui/core';
import { useRouter } from 'next/router';

const CssTextField = styled(TextField, {
  shouldForwardProp: (props) => props !== "focuscolor"
})((p) => ({
  // input label when focused
  "& label.Mui-focused": {
    color: p.focuscolor
  },
  // focused color for input with variant='standard'
  "& .MuiInput-underline:after": {
    borderBottomColor: p.focuscolor
  },
  // focused color for input with variant='filled'
  "& .MuiFilledInput-underline:after": {
    borderBottomColor: p.focuscolor
  },
  // focused color for input with variant='outlined'
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: p.focuscolor
    }
  }
}));

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
      backgroundColor: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      '& img': {
        width: 256
      }
    },

  })
);

function Home() {
  const classes = useStyles({});
  const router = useRouter();

  const [ip, setIp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [noBar, setNoBar] = React.useState(true);


  const handleButtonClick = (newIp) => {
    setSuccess(false)
    setError(false)
    setLoading(true)
    fetch(`http://${newIp || ip}/json/info`)
      .then(r => r.json())
      .then((res) => {
        if (res.name) {
          setSuccess(true)
          window && window.localStorage.setItem("wled-manager-ip", newIp || ip)
          router.push(`/yz?ip=${newIp || ip}`)
        }
      }).catch((error) => {
        setLoading(false)
        setError(true)
        window && window.localStorage.removeItem("wled-manager-ip")
      })
  }

  useEffect(() => {
    ipcRenderer.send('resize-me-please', [480, 800])
    if (window && window.localStorage.getItem("wled-manager-ip")) {
      setIp(window.localStorage.getItem("wled-manager-ip"))
      handleButtonClick(window.localStorage.getItem("wled-manager-ip"))
    }
    if (document && document.querySelectorAll('.titlebar').length > 0) {
      setNoBar(false)
    }
  }, [])
  return (
    <React.Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <div style={{ height: noBar ? '100vh' : 'calc(100vh - 30px)' }} className={classes.root}>
        <div></div>
        <div>

          {success ? <img src="/images/green.png" /> : error ? <img src="/images/red.png" /> : loading ? <img src="/images/orange.png" /> : <img src="/images/blue.png" />}
          <Typography variant="h4" style={{ color: "#444" }} onClick={() => window.location.reload()}>
            WLED Manager
          </Typography>
          <div style={{ display: 'flex', marginTop: '2rem' }}>

            <CssTextField onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                // Do code here
                ev.preventDefault();
                handleButtonClick()
              }
            }} focused focuscolor={success ? '#00a32e' : error ? '#e40303' : loading ? '#ffaa00' : '#004dff'} id="ip" label="WLED IP" style={{ width: 256 }} variant="outlined" value={ip} onChange={(e) => setIp(e.target.value)} />


          </div>


        </div>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab
            color="primary"
            style={{
              zIndex: 2, ...(loading && {
                backgroundColor: '#ffaa00',
                '&:hover': {
                  backgroundColor: '#ffaa00',
                },
              }), ...(error && {
                backgroundColor: '#e40303',
                '&:hover': {
                  backgroundColor: '#e40303',
                },
              }), ...(success && {
                backgroundColor: '#008026',
                '&:hover': {
                  backgroundColor: '#008026',
                },
              })
            }}
            onClick={() => handleButtonClick()}
          >
            {success ? <Check /> : error ? <Error /> : loading ? <HourglassEmpty /> : <PlayArrow />}
          </Fab>
          {loading && (
            <CircularProgress
              size={68}
              style={{
                color: success ? '#00a32e' : error ? '#e40303' : loading ? '#ffaa00' : '#004dff',
                position: 'absolute',
                top: -6,
                left: -6,
                zIndex: 1,
              }}
            />
          )}
        </Box>
        <div></div>
        <Typography gutterBottom variant="h6" style={{ color: "#444" }}>
          by Blade
        </Typography>
      </div>
    </React.Fragment>
  );
};

export default Home;
