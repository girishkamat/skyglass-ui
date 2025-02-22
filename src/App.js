import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import SearchIcon from '@mui/icons-material/Search';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Popper from '@mui/material/Popper';
import SubtitleCustomizer from './SubtitleCustomizer'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "@fontsource/opendyslexic"
import "@fontsource/roboto";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif !important',
  },
});

class Remote {

  constructor(remoteImg) {
    this.remoteImg = remoteImg
  }

  coordinates(e) {
    var offset = this.remoteImg.current.getBoundingClientRect();
    var x = Math.floor((e.pageX - offset.left) / offset.width * 10000) / 100;
    var y = Math.floor((e.pageY - offset.top) / offset.height * 10000) / 100;
    return [x, y]
  }

  isSubtitles(e) {
    const [x, y] = this.coordinates(e)
    return x > 17 && x < 31 && y > 19 && y < 23
  }

  isRightButton(e) {
    const [x, y] = this.coordinates(e)
    return x > 60 && x < 82 && y > 31 && y < 40
  }

  isLeftButton(e) {
    const [x, y] = this.coordinates(e)
    return x > 17 && x < 36 && y > 32 && y < 42
  }

  isUpButton(e) {
    const [x, y] = this.coordinates(e)
    return x > 28 && x < 73 && y > 27 && y < 32
  }

  isDownButton(e) {
    const [x, y] = this.coordinates(e)
    return x > 30 && x < 67 && y > 40 && y < 45
  }

  isBackButton(e) {
    const [x, y] = this.coordinates(e)
    return x > 17 && x < 31 && y > 50 && y < 54
  }
}

export default function App() {

  function colorWithOpacity(colorHex, opacity) {
    const rgb = extractRgbFromHex(colorHex)
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity / 100})`;
  }

  function extractRgbFromHex(hex) {
    hex = hex.replace(/^#/, "");

    // If shorthand notation (e.g., #abc), expand it to full form (#aabbcc)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    // Convert to RGB values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { red: r, green: g, blue: b };
  }

  function findSize(sizeName) {
    return sizes.entries().find(([key, value]) => value === sizeName)[0]
  }

  function findLetterSpacing(letterSpacingName) {
    return letterSpacings.entries().find(([key, value]) => value === letterSpacingName)[0]
  }

  function findLineSpacing(lineSpacingName) {
    return lineSpacings.entries().find(([key, value]) => value === lineSpacingName)[0]
  }

  const profileRefs = React.useRef([]);
  const remoteImg = React.useRef(null);
  const remote = new Remote(remoteImg);

  const fonts = [
    "Arial, sans-serif",
    "Courier New, monspace",
    "Helvetica, sans-serif",
    "OpenDyslexic",
    "Roboto",
    "Tahoma, sans-serif",
    "Times New Roman, serif",
    "Tiresias, sans-serif",
    "Verdana, sans-serif",
  ];

  const sizes = new Map([
    [19, "Small"], [23, "Medium"], [27, "Large"], [31, "Extra Large"]
  ])

  const colors = new Map([
    ["#000000", "Black"], ["#FFFFFF", "White"], ["#FAF9F6", "Off White"], ["#CCCCCC", "Light Gray"], ["#A9A9A9", "Dark Gray"], ["#FFFDD0", "Cream"], ["#FFFF00", "Yellow"], ["#B3EBF2", "Pastel Blue"]
  ])

  const backgrounds = new Map([
    ["#000000", "Black"], ["#FFFFFF", "White"], ["#FAF9F6", "Off White"], ["#CCCCCC", "Light Gray"], ["#A9A9A9", "Dark Gray"], ["#FFFDD0", "Cream"], ["#FFFF00", "Yellow"], ["#B3EBF2", "Pastel Blue"]
  ])

  const lineSpacings = new Map([
    ["1.2", "Low"], ["1.5", "Medium"], ["1.6", "High"]
  ])

  const letterSpacings = new Map([
    ["0", "Default"], ["0.12", "Increased"], ["0.15", "Extra"]
  ])

  const defaultProfiles = [
    {
      profileId: 0,
      profileName: 'No Subtitles',
      description: 'Subtitles are switched off',
    },
    {
      profileId: 1,
      profileName: 'Default',
      preset: true,
      font: "Arial, sans-serif",
      size: findSize("Medium"),
      color: "#FFFFFF",
      background: colorWithOpacity("#000000", 40),
      backgroundHex: "#000000",
      opacity: 40,
      lineSpacing: findLineSpacing("Low"),
      letterSpacing: findLetterSpacing("Default"),
      position: "bottom",
      description: "Default settings suitable for most users"
    },
    {
      profileId: 2,
      profileName: 'Easy Read',
      preset: true,
      font: "OpenDyslexic",
      size: findSize("Large"),
      color: "#000000",
      background: colorWithOpacity("#FFFDD0", 100),
      backgroundHex: "#FFFDD0",
      opacity: 100,
      lineSpacing: findLineSpacing("Medium"),
      letterSpacing: findLetterSpacing("Increased"),
      position: "bottom",
      description: "For users having difficulties with word recognition, spelling, and decoding"
    },
    {
      profileId: 3,
      profileName: 'High Contrast',
      preset: true,
      font: "Arial, sans-serif",
      size: findSize("Medium"),
      color: "#FFFFFF",
      background: colorWithOpacity("#000000", 100),
      backgroundHex: "#000000",
      opacity: 100,
      lineSpacing: findLineSpacing("Medium"),
      letterSpacing: findLetterSpacing("Increased"),
      position: "bottom",
      description: "Enhances readability through strong color contrasts between text and background"
    },
    {
      profileId: 4,
      profileName: 'Low Distraction',
      preset: true,
      font: "Arial, sans-serif",
      size: findSize("Medium"),
      color: "#B3EBF2",
      background: colorWithOpacity("#000000", 70),
      backgroundHex: "#000000",
      opacity: 55,
      lineSpacing: findLineSpacing("Medium"),
      letterSpacing: findLetterSpacing("Increased"),
      position: "bottom",
      description: "For users who are hyper sensitive to light and require minimal visual interference"
    },
    {
      profileId: 5,
      profileName: 'Ultra Visible',
      preset: true,
      font: "Arial, sans-serif",
      size: findSize("Extra Large"),
      color: "#FFFFFF",
      background: colorWithOpacity("#000000", 70),
      backgroundHex: "#000000",
      opacity: 70,
      lineSpacing: findLineSpacing("High"),
      letterSpacing: findLetterSpacing("Extra"),
      position: "bottom",
      description: "For users with visual impairments who need large, high-contrast subtitles"
    }
  ]

  const subtitleSettings = {
    profileId: 0,
    profiles: defaultProfiles,
    fonts: fonts,
    sizes: sizes,
    colors: colors,
    backgrounds: backgrounds,
    lineSpacings: lineSpacings,
    letterSpacings: letterSpacings
  }

  const [appSettings, setAppSettings] = React.useState({
    visibleBottomNav: false,
    bottomNavTabIndex: 0,
    subtitlePopupAnchorEl: null,
    subtitleSettings: {
      ...subtitleSettings,
      ...subtitleSettings.profiles.find((p) => p.profileId === subtitleSettings.profileId),
    }
  })

  const subtitlesPopperOpen = Boolean(appSettings.subtitlePopupAnchorEl);
  const subtitlesPopperId = subtitlesPopperOpen ? 'subtitlesPopper' : undefined;

  React.useEffect(() => {
    if (appSettings.bottomNavTabIndex === 1) {
      setAppSettings({ ...appSettings, subtitlePopupAnchorEl: document.getElementById("subtitlesNav") })
    } else {
      setAppSettings({ ...appSettings, subtitlePopupAnchorEl: null })
    }
  }, [appSettings.bottomNavTabIndex]);

  const handleRemoteClick = (e) => {

    const newAppSettings = {}

    if (remote.isSubtitles(e)) {
      // subtitles button
      newAppSettings.visibleBottomNav = !appSettings.visibleBottomNav
      newAppSettings.subtitleSettings = {
        ...appSettings.subtitleSettings,
        ...appSettings.subtitleSettings.profiles.find((p) => p.profileId === appSettings.subtitleSettings.profileId)
      }
      if (!newAppSettings.visibleBottomNav) {
        newAppSettings.bottomNavTabIndex = 0
      } else {
        newAppSettings.bottomNavTabIndex = 1
      }
    } else if (remote.isRightButton(e)) {
      // right button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex + 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (remote.isLeftButton(e)) {
      // left button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex - 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (remote.isBackButton(e)) {
      // back button
      newAppSettings.visibleBottomNav = false
      newAppSettings.bottomNavTabIndex = 0
    }
    setAppSettings({ ...appSettings, ...newAppSettings })
  }

  const subtitleComponent = () => {
    return (
      <div style={{
        fontFamily: appSettings.subtitleSettings.font,
        fontSize: `${appSettings.subtitleSettings.size}px`,
        color: appSettings.subtitleSettings.color,
        display: 'grid',
        placeItems: 'center'
      }}>
        <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, display: 'inline', letterSpacing: `${appSettings.subtitleSettings.letterSpacing}rem`, textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background, whiteSpace: 'nowrap' }}>
          The journey begins now.
        </div>
        <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, display: 'inline', letterSpacing: `${appSettings.subtitleSettings.letterSpacing}rem`, textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background, whiteSpace: 'nowrap' }}>
          Are you ready?
        </div>
      </div>

    )
  }

  return (
    <div className="container">
      <Box sx={{ position: 'relative', justifyContent: 'center' }}>
        <img src='/skyglass.jpg' className="movieImage" alt="Movie background" />
        <ThemeProvider theme={darkTheme}>
          <Popper
            id={subtitlesPopperId}
            open={subtitlesPopperOpen}
            anchorEl={appSettings.subtitlePopupAnchorEl}
            placement='top'
          >
            <SubtitleCustomizer appSettings={appSettings} setAppSettings={setAppSettings} profileRefs={profileRefs} />
          </Popper>

          {appSettings.visibleBottomNav ?
            <BottomNavigation
              id="subtitlesNav"
              showLabels
              value={appSettings.bottomNavTabIndex}
              onChange={(event, newValue) => {
                setAppSettings({ ...appSettings, bottomNavTabIndex: newValue })
              }}
              sx={{ position: 'relative', left: 20, bottom: 80, width: '97%' }}
            >
              <BottomNavigationAction label="Search" icon={<SearchIcon />} />
              <BottomNavigationAction label="Subtitles" icon={<SubtitlesIcon />} />
              <BottomNavigationAction label="Audio Description" icon={<AudiotrackIcon />} />
              <BottomNavigationAction label="Viewing Mode" icon={<AspectRatioIcon />} />
              <BottomNavigationAction label="Night Mode" icon={<DarkModeIcon />} />
            </BottomNavigation>
            : ""}
        </ThemeProvider>
        {appSettings.subtitleSettings.profileId >= 1 && appSettings.visibleBottomNav === false &&
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: `${appSettings.subtitleSettings.position === "bottom" ? "15%" : "80%"}`,
            }}
          >
            {subtitleComponent()}
          </div>}
      </Box>
      <div className="remoteContainer">
        <img onClick={handleRemoteClick} ref={remoteImg} src='/sky-remote.jpg' className="remoteImage" alt='SKY Glass Remote' />
      </div>
    </div>
  );
}
