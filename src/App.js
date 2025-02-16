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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif !important',
  },
});


export default function App() {

  const remoteImg = React.useRef(null);

  const fonts = [
    "Arial, sans-serif",
    "Helvetica, sans-serif",
    "Verdana, sans-serif",
    "Tahoma, sans-serif",
    "Verdana, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Lato, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Courier New, monspace",
    "Dyslexie, Arial, sans-serif"
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
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.2,
    position: "bottom"
  },
  {
    profileId: 1,
    profileName: 'Easy Read',
    preset: true,
    font: "Dyslexie, Arial, sans-serif",
    size: 30,
    color: "#000000",
    backgroundHex: "#FFFDD0",
    opacity: 100,
    lineSpacing: 1.6,
    position: "bottom"
  },
  {
    profileId: 2,
    profileName: 'High Contrast',
    preset: true,
    font: "Arial, sans-serif",
    size: 20,
    color: "#FFFFFF",
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.2,
    position: "bottom"
  },
  {
    profileId: 3,
    profileName: 'Low Distraction',
    preset: true,
    font: "Arial, sans-serif",
    size: 30,
    color: "#B3EBF2",
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.4,
    position: "bottom"
  },
  {
    profileId: 4,
    profileName: 'Ultra Visible',
    preset: true,
    font: "Arial, sans-serif",
    size: 50,
    color: "#FFFFFF",
    backgroundHex: "#000000",
    opacity: 100,
    lineSpacing: 1.6,
    position: "bottom"
  }
]

  const subtitleSettings = {
    switch: 'off',
    language: 'english',
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
    subtitleSettings: {...subtitleSettings, ...defaultProfiles[0]}
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
    var offset = remoteImg.current.getBoundingClientRect();
    var x = Math.floor((e.pageX - offset.left) / offset.width * 10000) / 100;
    var y = Math.floor((e.pageY - offset.top) / offset.height * 10000) / 100;
    console.log(x + "," + y)
    const newAppSettings = {}

    if (x > 17 && x < 31 && y > 19 && y < 23) {
      // subtitles button
      newAppSettings.visibleBottomNav = !appSettings.visibleBottomNav
      if (!newAppSettings.visibleBottomNav) {
        newAppSettings.bottomNavTabIndex = 0
      } else {
        newAppSettings.bottomNavTabIndex = 1
      }
    } else if (x > 60 && x < 82 && y > 31 && y < 40) {
      // right button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex + 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (x > 17 && x < 36 && y > 32 && y < 42) {
      // left button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex - 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (x > 17 && x < 31 && y > 50 && y < 54) {
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
          {appSettings.subtitleSettings.language === "english" ? <div>
            <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, paddingLeft: '5px', paddingRight: '5px', textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background }}>
              {appSettings.subtitleSettings.language === "english" ? "This is a preview of subtitles" : "Esta es una vista previa de los subtítulos"}
            </div>
            <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, paddingLeft: '5px', paddingRight: '5px', textAlign: 'center', backgroundColor: appSettings.subtitleSettings.background }}>
              {appSettings.subtitleSettings.language === "english" ? "This is another line showing preview of subtitles" : " Esta es otra línea que muestra una vista previa de los subtítulos"}
            </div>
          </div> : ""}
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
              <SubtitleCustomizer appSettings={appSettings} setAppSettings={setAppSettings} />
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
        {appSettings.subtitleSettings.switch === "on" && appSettings.visibleBottomNav === false ?
          <div>
            <div
              style={{
                position: 'absolute',
                bottom: `${appSettings.subtitleSettings.position === "bottom" ? "80" : "720"}px`,
                left: `${appSettings.subtitleSettings.size === 20 ? "350" : appSettings.subtitleSettings.size === 30 ? "250" : "200" }px`,
                padding: '8px 16px'
              }}
            >
              {subtitleComponent(appSettings.subtitleSettings.language)}
            </div></div> : ""}
      </div>
      <div className="remoteContainer">
        <img onClick={handleRemoteClick} ref={remoteImg} src='/sky-remote.jpg' className="remoteImage" />
      </div>
    </div>
  );
}
