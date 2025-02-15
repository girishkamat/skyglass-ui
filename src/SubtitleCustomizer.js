import * as React from 'react';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { MenuItem, Select, Slider, Box, TextField, Button } from "@mui/material";
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Switch  from "@mui/material/Switch";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';

function ValueLabelComponent(props) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.node,
};

export default function SubtitleCustomizer({ appSettings, setAppSettings }) {


  function hexToRgb(hex, opacity) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // Parse shorthand hex codes (e.g., #abc -> #aabbcc)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    // Convert to RGB values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgb(${r}, ${g}, ${b}, ${opacity})`;
  }

  function updateAppSettingsForSubtitles(updatedSubtitleSettings) {
    setAppSettings({
      ...appSettings,
      ...{
        subtitleSettings: {
          ...appSettings.subtitleSettings,
          ...updatedSubtitleSettings
        }
      }
    })
  }

  function handleBackground(e) {
    updateAppSettingsForSubtitles({
      background: hexToRgb(e.target.value, appSettings.subtitleSettings.opacity / 100),
      backgroundHex: e.target.value
    })
  }


  function handleOpacity(newValue) {
    updateAppSettingsForSubtitles({
      opacity: newValue,
      background: hexToRgb(appSettings.subtitleSettings.backgroundHex, newValue / 100)
    })
  }

  const handleLanguageChange = (event) => {
    updateAppSettingsForSubtitles({
      language: event.target.value
    })
  }

  const handleProfileNameChange = (event) => {
    updateAppSettingsForSubtitles({
      profileName: event.target.value
    })
  }

  const handlePosition = (event) => {
    updateAppSettingsForSubtitles({
      position: event.target.value
    })
  };

  const handleProfileChange = (newProfileId) => {
    updateAppSettingsForSubtitles({
      currentProfile: newProfileId,
      font: appSettings.subtitleSettings.profiles.get(newProfileId).font,
      size: appSettings.subtitleSettings.profiles.get(newProfileId).size,
      color: appSettings.subtitleSettings.profiles.get(newProfileId).color,
      background: hexToRgb(appSettings.subtitleSettings.profiles.get(newProfileId).backgroundHex, appSettings.subtitleSettings.profiles.get(newProfileId).opacity / 100),
      backgroundHex: appSettings.subtitleSettings.profiles.get(newProfileId).backgroundHex,
      opacity: appSettings.subtitleSettings.profiles.get(newProfileId).opacity,
      lineSpacing: appSettings.subtitleSettings.profiles.get(newProfileId).lineSpacing,
      position: appSettings.subtitleSettings.profiles.get(newProfileId).position
    })
  };

  const handleSaveProfile = () => {
    const newCurrentProfile = appSettings.subtitleSettings.profileName
    const newProfileId = appSettings.subtitleSettings.profiles.size
    updateAppSettingsForSubtitles({
      currentProfile: newProfileId,
      profileName: '',
      profiles: new Map([...appSettings.subtitleSettings.profiles, [
        newProfileId, {
          profileName: newCurrentProfile,
          font: appSettings.subtitleSettings.font,
          size: appSettings.subtitleSettings.size,
          color: appSettings.subtitleSettings.color,
          backgroundHex: appSettings.subtitleSettings.backgroundHex,
          opacity: appSettings.subtitleSettings.opacity,
          lineSpacing: appSettings.subtitleSettings.lineSpacing,
          position: appSettings.subtitleSettings.position,
        }
      ]])
    })
  }

  const handleDeleteProfile = (profileId) => {
    var newCurrentProfile = appSettings.subtitleSettings.currentProfile
    if (appSettings.subtitleSettings.currentProfile === profileId) {
      newCurrentProfile = 0
    }

    updateAppSettingsForSubtitles({
      currentProfile: newCurrentProfile,
      profiles: new Map([...appSettings.subtitleSettings.profiles.entries().filter(([key, value]) => key !== profileId)]),
      font: appSettings.subtitleSettings.profiles.get(newCurrentProfile).font,
      size: appSettings.subtitleSettings.profiles.get(newCurrentProfile).size,
      color: appSettings.subtitleSettings.profiles.get(newCurrentProfile).color,
      background: hexToRgb(appSettings.subtitleSettings.profiles.get(newCurrentProfile).backgroundHex, appSettings.subtitleSettings.profiles.get(newCurrentProfile).opacity / 100),
      backgroundHex: appSettings.subtitleSettings.profiles.get(newCurrentProfile).backgroundHex,
      opacity: appSettings.subtitleSettings.profiles.get(newCurrentProfile).opacity,
      lineSpacing: appSettings.subtitleSettings.profiles.get(newCurrentProfile).lineSpacing,
      position: appSettings.subtitleSettings.profiles.get(newCurrentProfile).position
    })
  }

  const handleSwitchChange = (event) => {
    updateAppSettingsForSubtitles({ switch: event.target.value })
  }

  const handleFontChange = (event) => {
    updateAppSettingsForSubtitles({ font: event.target.value })
  }

  const handleFontSizeChange = (e) => {
    updateAppSettingsForSubtitles({ size: e.target.value })
  }

  const handleFontColorChange = (e) => updateAppSettingsForSubtitles({ color: e.target.value })

  const handleLineSpacingChange = (e) => updateAppSettingsForSubtitles({ lineSpacing: e.target.value })

  const handleTextShadowSwitch = (switchState) => updateAppSettingsForSubtitles({ textShadow: switchState })

  return (
    <div style={{
      width: '1200px', display: 'grid',
      placeItems: 'center'
    }}>
      <div style={{
        padding: '5px',
        marginBottom: '5px',
        fontFamily: appSettings.subtitleSettings.font,
        fontSize: `${appSettings.subtitleSettings.size}px`,
        color: appSettings.subtitleSettings.color,
        backgroundColor: appSettings.subtitleSettings.background,
        textShadow: `${appSettings.subtitleSettings.textShadow ? '4px 4px 10px rgba(0, 0, 0, 1)' : 'unset'}`
      }}>
        <div style={{ display: 'inline-block' }}>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, textAlign: 'center', display: 'block' }}>
          {appSettings.subtitleSettings.language === "english" ? "This is a preview of subtitles" : "Esta es una vista previa de los subtítulos" }
          </div>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, textAlign: 'center', display: 'block' }}>
          {appSettings.subtitleSettings.language === "english" ? "This is another line showing preview of subtitles" : " Esta es otra línea que muestra una vista previa de los subtítulos" }
          </div>
        </div>
      </div>

      <Stack direction="row" sx={{ bgcolor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '15px', width: '500px' }} spacing={1}>

        <Stack sx={{ padding: '10px', borderRight: 1, borderColor: 'gray' }} spacing={2}>

          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Subtitle Settings</strong>
          </Typography>

          <FormControl>
            <InputLabel id="font-label">Font</InputLabel>
            <Select
              labelId="font-label"
              id="font"
              value={appSettings.subtitleSettings.font}
              label="Font"
              onChange={handleFontChange}
              size="small"
            >
              {appSettings.subtitleSettings.fonts.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font.split(",")[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="fontSize-label">Font Size</InputLabel>
            <Select
              labelId="fontSize-label"
              id="fontSize"
              value={appSettings.subtitleSettings.size}
              label="Font Size"
              onChange={handleFontSizeChange}
              size="small"
            >
              {Array.from(appSettings.subtitleSettings.sizes).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="fontColor-label">Font Color</InputLabel>
            <Select
              labelId="fontColor-label"
              id="fontColor"
              value={appSettings.subtitleSettings.color}
              label="Font Color"
              onChange={handleFontColorChange}
              size="small"
            >
              {Array.from(appSettings.subtitleSettings.colors).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            sx={{ color: 'text.primary' }}
            control={<Switch checked={appSettings.subtitleSettings.textShadow} onChange={(e) => handleTextShadowSwitch(e.target.checked)} />}
            label="Font Shadow"
            labelPlacement="start"
          />

          <FormControl>
            <InputLabel id="fontBackground-label">Background</InputLabel>
            <Select
              labelId="fontBackground-label"
              id="fontBackground"
              value={appSettings.subtitleSettings.backgroundHex}
              label="Background"
              onChange={(e) => handleBackground(e)}
              size="small"
            >
              {Array.from(appSettings.subtitleSettings.backgrounds).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Typography id="input-slider" gutterBottom sx={{ color: 'text.primary' }}>
              Background Opacity
            </Typography>
            <Slider
              aria-labelledby="opacity-slider"
              value={appSettings.subtitleSettings.opacity}
              onChange={(e, newValue) => handleOpacity(newValue)}
              min={0} max={100} size="small"
              valueLabelDisplay="auto"
              slots={{
                valueLabel: ValueLabelComponent,
              }} />
          </FormControl>

          <FormControl>
            <InputLabel id="lineSpacing-label">Line Spacing</InputLabel>
            <Select
              labelId="lineSpacing-label"
              id="lineSpacing"
              value={appSettings.subtitleSettings.lineSpacing}
              label="Line Spacing"
              onChange={handleLineSpacingChange}
              size="small"
            >
              {Array.from(appSettings.subtitleSettings.lineSpacings).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="position-label">Position</InputLabel>
            <Select
              labelId="position-label"
              id="position"
              value={appSettings.subtitleSettings.position}
              label="Position"
              onChange={(e) => handlePosition(e)}
              size="small"
            >
              <MenuItem value={"bottom"}>Bottom</MenuItem>
              <MenuItem value={"top"}>Top</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Profile Name"
            variant="outlined"
            fullWidth
            value={appSettings.subtitleSettings.profileName}
            sx={{ my: 2 }}
            onChange={handleProfileNameChange}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            size="small"
          >
            Save
          </Button>
        </Stack>

        <Stack sx={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Profiles</strong>
          </Typography>

          <List dense={true} sx={{ color: 'text.primary' }}>
            {Array.from(appSettings.subtitleSettings.profiles).map(([profileId, profile]) => (
              <ListItem disableGutters key={profileId}
                secondaryAction={profileId !== 0 ? <IconButton edge="end" onClick={() => handleDeleteProfile(profileId)}>
                  <DeleteIcon key={profileId} />
                </IconButton> : ""}

              >
                <ListItemButton
                  disableGutters
                  selected={appSettings.subtitleSettings.currentProfile === profileId}
                  onClick={() => handleProfileChange(profileId)}
                >
                  <ListItemText primary={profile.profileName} sx={{ paddingLeft: '10px' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Languages</strong>
          </Typography>
          <Box >
            <FormControl sx={{ color: 'text.primary' }}>
              <RadioGroup
                value={appSettings.subtitleSettings.language}
                onChange={handleLanguageChange}
                size="small"
              >
                <FormControlLabel value="english" control={<Radio />} label="English" />
                <FormControlLabel value="spanish" control={<Radio />} label="Spanish" />
              </RadioGroup>
            </FormControl>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Switch On/Off</strong>
          </Typography>
          <Box >

            <FormControl sx={{ color: 'text.primary' }}>
              <RadioGroup
                value={appSettings.subtitleSettings.switch}
                onChange={handleSwitchChange}
                size="small"
              >
                <FormControlLabel value="off" control={<Radio />} label="Off" />
                <FormControlLabel value="on" control={<Radio />} label="On" />
              </RadioGroup>
            </FormControl>
          </Box>
        </Stack>
      </Stack>
    </div>
  );
}
