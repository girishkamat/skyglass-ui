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
    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`;
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
    "Verdana, sans-serif",
  ];

  const sizes = new Map([
    [20, "Small"], [30, "Medium"], [40, "Large"], [50, "Extra Large"]
  ])

  const colors = new Map([
    ["#000000", "Black"], ["#FFFFFF", "White"], ["#FFFF00", "Yellow"], ["#CCCCCC", "Light Gray"], ["#FFFDD0", "Cream"], ["#B3EBF2", "Pastel Blue"], ["#0000FF", "Blue"], ["#A9A9A9", "Dark Gray"]
  ])

  const backgrounds = new Map([
    ["#FFFFFF", "White"], ["#000000", "Black"], ["#FFFF00", "Yellow"], ["#CCCCCC", "Light Gray"], ["#FFFDD0", "Cream"], ["#B3EBF2", "Pastel Blue"], ["#0000FF", "Blue"], ["#A9A9A9", "Dark Gray"]
  ])

  const lineSpacings = new Map([
    ["1.2", "Low"], ["1.4", "Medium"], ["1.6", "High"]
  ])

  const defaultProfiles = [{
    profileId: 0,
    profileName: 'Default',
    preset: true,
    font: "Arial, sans-serif",
    size: 20,
    color: "#FFFFFF",
    background: colorWithOpacity("#000000", 100),
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.2,
    position: "bottom",
    description: "Default settings suitable for most users"
  },
  {
    profileId: 1,
    profileName: 'Easy Read',
    preset: true,
    font: "OpenDyslexic",
    size: 30,
    color: "#000000",
    background: colorWithOpacity("#FFFDD0", 100),
    backgroundHex: "#FFFDD0",
    opacity: 100,
    lineSpacing: 1.6,
    position: "bottom",
    description: "For users with dyslexia or cognitive processing challenges who need enhanced readability"
  },
  {
    profileId: 2,
    profileName: 'High Contrast',
    preset: true,
    font: "Arial, sans-serif",
    size: 20,
    color: "#FFFFFF",
    background: colorWithOpacity("#000000", 100),
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.2,
    position: "bottom",
    description: "For users with colour blindness who need distinct, high-contrast subtitles"
  },
  {
    profileId: 3,
    profileName: 'Low Distraction',
    preset: true,
    font: "Arial, sans-serif",
    size: 30,
    color: "#B3EBF2",
    background: colorWithOpacity("#000000", 100),
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.4,
    position: "bottom",
    description: "For users with sensory sensitivities who need minimal visual interference"
  },
  {
    profileId: 4,
    profileName: 'Ultra Visible',
    preset: true,
    font: "Arial, sans-serif",
    size: 50,
    color: "#FFFFFF",
    background: colorWithOpacity("#000000", 100),
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.6,
    position: "bottom",
    description: "For users with visual impairments who need large, high-contrast subtitles"
  }
  ]

  const subtitleSettings = {
    switch: 'off',
    language: 'english',
    profileId: 0,
    profiles: defaultProfiles,
    fonts: fonts,
    sizes: sizes,
    colors: colors,
    backgrounds: backgrounds,
    lineSpacings: lineSpacings
  }

  const [appSettings, setAppSettings] = React.useState({
    visibleBottomNav: false,
    bottomNavTabIndex: 0,
    subtitlePopupAnchorEl: null,
    subtitleSettings: {
      ...subtitleSettings,
      ...subtitleSettings.profiles.find((p) => p.profileId == subtitleSettings.profileId),
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
        ...appSettings.subtitleSettings.profiles.find((p) => p.profileId == appSettings.subtitleSettings.profileId),
        switch: 'on'
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

  const subtitleComponent = (language) => {
    return (
      <div style={{ display: 'inline-block' }}>
        <div style={{
          marginBottom: '10px',
          fontFamily: appSettings.subtitleSettings.font,
          fontSize: `${appSettings.subtitleSettings.size}px`,
          color: appSettings.subtitleSettings.color,
        }}>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, paddingLeft: '5px', paddingRight: '5px', textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background }}>
            {appSettings.subtitleSettings.language === "english" ? "The journey begins now." : "El viaje comienza ahora."}
          </div>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, paddingLeft: '5px', paddingRight: '5px', textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background }}>
            {appSettings.subtitleSettings.language === "english" ? "Are you ready?" : "¿Estás listo?"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="tvContainer">
        <Box sx={{ maxWidth: '100%', maxHeight: '100%', display: 'inline-block', position: 'relative' }}>
          <img src='/movie5.jpg' className="movieImage" />
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
                sx={{ position: 'relative', left: 20, bottom: 80, width: '100%' }}
              >
                <BottomNavigationAction label="Search" icon={<SearchIcon />} />
                <BottomNavigationAction label="Subtitles" icon={<SubtitlesIcon />} />
                <BottomNavigationAction label="Audio Description" icon={<AudiotrackIcon />} />
                <BottomNavigationAction label="Viewing Mode" icon={<AspectRatioIcon />} />
                <BottomNavigationAction label="Night Mode" icon={<DarkModeIcon />} />
              </BottomNavigation>
              : ""}
          </ThemeProvider>
        </Box>
        {appSettings.subtitleSettings.switch === "on" && appSettings.visibleBottomNav === false &&
          <div
            style={{
              position: 'absolute',
              bottom: `${appSettings.subtitleSettings.position === "bottom" ? "80" : "700"}px`,
              left: `${appSettings.subtitleSettings.size === 20 ? "450" : appSettings.subtitleSettings.size === 30 ? "360" : appSettings.subtitleSettings.size === 40 ? "300" : "250"}px`,
              padding: '8px 16px'
            }}
          >
            {subtitleComponent(appSettings.subtitleSettings.language)}
          </div>}
      </div>
      <div className="remoteContainer">
        <img onClick={handleRemoteClick} ref={remoteImg} src='/sky-remote.jpg' className="remoteImage" />
      </div>
    </div>
  );
}
