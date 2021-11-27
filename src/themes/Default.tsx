import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";

let themeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#B39DDB",
    },
    secondary: {
      main: "#90caf9",
    },
    error: {
      main: "#ffab91",
    },
    info: {
      main: "#90caf9",
    },
    warning: {
      main: "#ffcc80",
    },
    success: {
      main: "#a5d6a7",
    },
    divider: "#b0bec5",
    text: {
      primary: "#eeeeee",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
  },
  spacing: 10,
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        fullWidth: true,
        disableFocusRipple: true,
      },
      styleOverrides: {
        root: {
          padding: "10px 20px 10px 20px",
          width: "100%",
          fontSize: 12,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        avatar: {
          marginRight: "0px",
        },
        root: {
          width: "100%",
        },
        content: {
          padding: "0px",
          margin: "0px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          paddingBottom: "50px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          width: "100%",
          overflow: "scroll",
          maxHeight: "90%",
          maxWidth: "400px",
          height: "90%",
          flexDirection: "column",
          display: "flex",
          "&:last-child": {
            paddingBottom: "20px",
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          paddingBottom: "10px",
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.0)",
            color: "#B39DDB",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          marginTop: "10px",
          paddingTop: "10px",
          border: "0px",
          boxShadow: "0px",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#424242",
          border: "0px",
          boxShadow: "none",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "0px",
          paddingRight: "0px",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          overflow: "scroll",
        },
      },
    },
  },
  typography: {},
});

themeOptions = responsiveFontSizes(themeOptions, { factor: 1.1 });

export default themeOptions;
