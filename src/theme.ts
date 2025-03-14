import { createTheme } from '@mui/material/styles'
// create a theme instance
const theme = createTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
  components: {
    // Name of the component
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px', //width of the vertical scroll bar
            height: '8px', //height of the horizontal scroll bar
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
          },
          '& .MuiBox-root': {
            backgroundColor: '#FFF',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          textTransform: 'none',
          borderWidth: '0.5px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          return {
            fontSize: '0.875rem',
            '& fieldset': {
              borderWidth: '0.5px !important',
            },
          }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '0.875rem',
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          },
          color: 'black',
        },
      },
    },
  },
})

export default theme
