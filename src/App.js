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
    "Courier New, monspace"
  ];

  const sizes = new Map([
    ["20", "Small"], ["30", "Medium"], ["40", "Large"]
  ])

  const colors = new Map([
    ["#FFFFFF", "White"], ["#FFFF00", "Yellow"], ["#CCCCCC", "Light Gray"], ["#00FFFF", "Cyan"], ["#FFA500", "Orange"], ["#FF0000", "Red"]
  ])

  const backgrounds = new Map([
    ["transperant", "Transperant"], ["#FFFFFF", "White"], ["#FFFF00", "Yellow"], ["#CCCCCC", "Light Gray"], ["#00FFFF", "Cyan"], ["#FFA500", "Orange"], ["#FF0000", "Red"]
  ])

  const lineSpacings = new Map([
    ["1.2", "Low"], ["1.4", "Medium"], ["1.6", "High"]
  ])

  const [appSettings, setAppSettings] = React.useState({
    visibleBottomNav: false,
    bottomNavTabIndex: 0,
    subtitlePopupAnchorEl: null,

    subtitleSettings: {
      switch: 'off',
      language: 'english',

      font: "Arial, sans-serif",
      size: "20",
      color: "#FFFFFF",
      background: "transperant",
      backgroundHex: "transperant",
      opacity: 0,
      lineSpacing: 1.2,
      textShadow: false,
      position: "bottom",
      currentProfile: 0,
      profileName: '',

      profiles: new Map([[0, {
        profileName: 'Default',
        font: "Arial, sans-serif",
        size: 20,
        color: "#FFFFFF",
        backgroundHex: "transperant",
        opacity: 0,
        lineSpacing: 1.2,
        textShadow: false,
        position: "bottom"
      }]]),
      fonts: fonts,
      sizes: sizes,
      colors: colors,
      backgrounds: backgrounds,
      lineSpacings: lineSpacings
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
    var offset = remoteImg.current.getBoundingClientRect();
    var x = Math.floor((e.pageX - offset.left) / offset.width * 10000) / 100;
    var y = Math.floor((e.pageY - offset.top) / offset.height * 10000) / 100;
    const newAppSettings = {}
    if (x > 15 && x < 34 && y > 30 && y < 40) {
      // subtitles button
      newAppSettings.visibleBottomNav = !appSettings.visibleBottomNav
      if (!newAppSettings.visibleBottomNav) {
        newAppSettings.bottomNavTabIndex = 0
      } else {
        newAppSettings.bottomNavTabIndex = 1
      }
    } else if (x > 52 && x < 83 && y > 42 && y < 72) {
      // left button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex + 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (x > 17 && x < 52 && y > 42 && y < 72) {
      // right button
      const newBottomNavTabIndex = appSettings.bottomNavTabIndex - 1
      if (newBottomNavTabIndex >= 0 && newBottomNavTabIndex <= 4) {
        newAppSettings.bottomNavTabIndex = newBottomNavTabIndex
      }
    } else if (x > 17 && x < 34 && y > 78 && y < 85) {
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
          textShadow: `${appSettings.subtitleSettings.textShadow ? '4px 4px 10px rgba(0, 0, 0, 1)' : 'unset'}`
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
                left: `${appSettings.subtitleSettings.size === "20" ? "350" : appSettings.subtitleSettings.size === "30" ? "250" : "200" }px`,
                padding: '8px 16px'
              }}
            >
              {subtitleComponent(appSettings.subtitleSettings.language)}
            </div></div> : ""}
      </div>
      <div className="remoteContainer">
        <img onClick={handleRemoteClick} ref={remoteImg} src='/sky-remote.png' className="remoteImage" />
      </div>
    </div>
  );
}
