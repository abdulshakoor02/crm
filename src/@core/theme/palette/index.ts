// ** Type Imports
import { PaletteMode } from '@mui/material'
import { Skin, ThemeColor } from 'src/@core/layouts/types'

const DefaultPalette = (mode: PaletteMode, skin: Skin, themeColor: ThemeColor) => {
  // ** Vars
  const lightColor = '58, 53, 65'
  const darkColor = '231, 227, 252'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const primaryGradient = () => {
    if (themeColor === 'primary') {
      return 'linear-gradient(90deg, rgba(145,85,253,1) 0%, rgba(182,133,255,1) 100%)'
    } else if (themeColor === 'secondary') {
      return 'linear-gradient(90deg, rgba(138,141,147,1) 0%, rgba(182,185,190,1) 100%)'
    } else if (themeColor === 'success') {
      return 'linear-gradient(90deg, rgba(86,202,0,1) 0%, rgba(147,221,92,1) 100%)'
    } else if (themeColor === 'error') {
      return 'linear-gradient(90deg, rgba(255,76,81,1) 0%, rgba(255,140,144,1) 100%)'
    } else if (themeColor === 'warning') {
      return 'linear-gradient(90deg, rgba(255,180,0,1) 0%, rgba(255,207,92,1) 100%)'
    } else {
      return 'linear-gradient(90deg, rgba(22,177,255,1) 0%, rgba(106,205,255,1) 100%)'
    }
  }

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return '#FFF'
    } else if (skin === 'bordered' && mode === 'dark') {
      return '#312D4B'
    } else if (mode === 'light') {
      return '#F4F5FA'
    } else return '#28243D'
  }

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      darkBg: '#28243D',
      lightBg: '#F4F5FA',
      primaryGradient: primaryGradient(),
      darkBorderGradient: 'linear-gradient(to right, #000, #333)',
      bodyBg: mode === 'light' ? '#F4F5FA' : '#28243D', // Same as palette.background.default but doesn't consider bordered skin
      tableHeaderBg: mode === 'light' ? '#F9FAFC' : '#3D3759'
    },
    common: {
      black: '#000',
      white: '#FFF'
    },
    mode: mode,
    primary: {
      light: '#9E69FD',
      main: '#9155FD',
      dark: '#804BDF',
      contrastText: '#FFF'
    },
    secondary: {
      light: '#9C9FA4',
      main: '#8A8D93',
      dark: '#777B82',
      contrastText: '#FFF'
    },
    success: {
      light: '#6AD01F',
      main: '#56CA00',
      dark: '#4CB200',
      contrastText: '#FFF'
    },
    error: {
      light: '#FF6166',
      main: '#FF4C51',
      dark: '#E04347',
      contrastText: '#FFF'
    },
    warning: {
      light: '#FFCA64',
      main: '#FFB400',
      dark: '#E09E00',
      contrastText: '#FFF'
    },
    info: {
      light: '#32BAFF',
      main: '#16B1FF',
      dark: '#139CE0',
      contrastText: '#FFF'
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#D5D5D5',
      A200: '#AAAAAA',
      A400: '#616161',
      A700: '#303030'
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === 'light' ? '#FFF' : '#312D4B',
      default: defaultBgColor()
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  }
}

export default DefaultPalette
