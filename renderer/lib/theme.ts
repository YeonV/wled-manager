import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#004dff',
    },
    secondary: {
      main: '#800000',
    },    
    error: {
      main: '#e40303',
    },
    warning: {
      main: '#ffaa00',
    },
    success: {
      main: '#008026',
    },
    background: {
      default: '#222',
    },
  },
});
