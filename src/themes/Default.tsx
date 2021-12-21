import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { purple } from 'material-ui-colors';

let theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },

    background: {
      default: '#f0f0f0',
      paper: '#fff',
    }
  },
});

theme = responsiveFontSizes(theme, { factor: 1.1 });

export default theme;