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

  function colorWithOpacity(colorHex, opacity) {
    const rgb = extractRgbFromHex(colorHex)
    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`;
  }

  // Blend semi-transparent background over white
  const blendWithWhite = (rgb, alpha) => {
    const blendedR = Math.round((1 - alpha) * 255 + alpha * rgb.red);
    const blendedG = Math.round((1 - alpha) * 255 + alpha * rgb.green);
    const blendedB = Math.round((1 - alpha) * 255 + alpha * rgb.blue);
    return { red: blendedR, green: blendedG, blue: blendedB };
  };

  const getLuminance = (rgb) => {
    const adjust = (c) => (c <= 10 ? c / 3294 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
    return 0.2126 * adjust(rgb.red) + 0.7152 * adjust(rgb.green) + 0.0722 * adjust(rgb.blue);
  };

  const getContrastRatio = (foregroundHex, backgroundHex, backgroundOpacity) => {
    // Blend background with white
    const foregroundRgb = extractRgbFromHex(foregroundHex)
    const backgroundRgb = extractRgbFromHex(backgroundHex)

    const blendedBackgroundRgb = blendWithWhite(backgroundRgb, (backgroundOpacity / 100).toFixed(2));

    // Calculate luminance
    const lum1 = getLuminance(foregroundRgb);
    const lum2 = getLuminance(blendedBackgroundRgb);

    const [L1, L2] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1];
    return ((L1 + 0.05) / (L2 + 0.05)).toFixed(2);
  };


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
      background: colorWithOpacity(e.target.value, appSettings.subtitleSettings.opacity / 100),
      backgroundHex: e.target.value
    })
  }


  function handleOpacity(newValue) {
    updateAppSettingsForSubtitles({
      opacity: newValue,
      background: colorWithOpacity(appSettings.subtitleSettings.backgroundHex, newValue / 100)
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
    const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId == newProfileId)
    updateAppSettingsForSubtitles({
      profileId: newProfileId,
      profileName: profile.profileName,
      font: profile.font,
      size: profile.size,
      color: profile.color,
      background: colorWithOpacity(profile.backgroundHex, profile.opacity / 100),
      backgroundHex: profile.backgroundHex,
      opacity: profile.opacity,
      lineSpacing: profile.lineSpacing,
      position: profile.position
    })
  };

  const handleSaveProfile = () => {
    const existingProfile = appSettings.subtitleSettings.profiles.find((profile) => profile.profileName === appSettings.subtitleSettings.profileName)

    if (existingProfile) {
      const existingProfileId = existingProfile.profileId
      updateAppSettingsForSubtitles({
        profiles: [...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== existingProfileId),
        ...[{
          profileId: existingProfileId,
          profileName: appSettings.subtitleSettings.profileName,
          font: appSettings.subtitleSettings.font,
          size: appSettings.subtitleSettings.size,
          color: appSettings.subtitleSettings.color,
          backgroundHex: appSettings.subtitleSettings.backgroundHex,
          opacity: appSettings.subtitleSettings.opacity,
          lineSpacing: appSettings.subtitleSettings.lineSpacing,
          position: appSettings.subtitleSettings.position,
        }]]
      })
    } else {
      const newProfileId = Math.max(...appSettings.subtitleSettings.profiles.map((p) => p.profileId)) + 1
      updateAppSettingsForSubtitles({
        profileId: newProfileId,
        profiles: [...appSettings.subtitleSettings.profiles, ...[{
          profileId: newProfileId,
          profileName: appSettings.subtitleSettings.profileName,
          font: appSettings.subtitleSettings.font,
          size: appSettings.subtitleSettings.size,
          color: appSettings.subtitleSettings.color,
          backgroundHex: appSettings.subtitleSettings.backgroundHex,
          opacity: appSettings.subtitleSettings.opacity,
          lineSpacing: appSettings.subtitleSettings.lineSpacing,
          position: appSettings.subtitleSettings.position,
        }]]
      })
    }
  }

  const handleDeleteProfile = (profileId) => {
    var newProfileId = appSettings.subtitleSettings.profileId
    if (newProfileId === profileId) {
      newProfileId = 0
    }
    const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId == newProfileId)

    updateAppSettingsForSubtitles({
      profileId: newProfileId,
      profileName: profile.profileName,
      profiles: [...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== profileId)],
      font: profile.font,
      size: profile.size,
      color: profile.color,
      background: colorWithOpacity(profile.backgroundHex, profile.opacity / 100),
      backgroundHex: profile.backgroundHex,
      opacity: profile.opacity,
      lineSpacing: profile.lineSpacing,
      position: profile.position
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
      }}>
        <div style={{ display: 'inline-block' }}>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, textAlign: 'center', display: 'block', backgroundColor: appSettings.subtitleSettings.background }}>
            {appSettings.subtitleSettings.language === "english" ? "This is a preview of subtitles" : "Esta es una vista previa de los subtítulos"}
          </div>
          <div style={{ lineHeight: appSettings.subtitleSettings.lineSpacing, textAlign: 'center', display: 'block', backgroundColor: appSettings.subtitleSettings.background }}>
            {appSettings.subtitleSettings.language === "english" ? "This is another line showing preview of subtitles" : " Esta es otra línea que muestra una vista previa de los subtítulos"}
          </div>
        </div>
      </div>

      <Stack direction="row" sx={{ bgcolor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '15px', width: '800px' }} spacing={1}>

        <Stack sx={{ padding: '10px', borderRight: 1, borderColor: 'gray', width: '200px' }} spacing={2}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Subtitles</strong>
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

        </Stack>

        <Stack sx={{ padding: '20px', borderRight: 1, borderColor: 'gray' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Profiles</strong>
          </Typography>

          <List dense={true} sx={{ color: 'text.primary' }}>
            {appSettings.subtitleSettings.profiles.map((profile) => (
              <ListItem disableGutters key={profile.profileId}
                secondaryAction={!profile.preset ? <IconButton edge="end" onClick={() => handleDeleteProfile(profile.profileId)}>
                  <DeleteIcon key={profile.profileId} />
                </IconButton> : ""}
              >
                <ListItemButton
                  disableGutters
                  selected={appSettings.subtitleSettings.profileId === profile.profileId}
                  onClick={() => handleProfileChange(profile.profileId)}
                >
                  <ListItemText primary={profile.profileName} sx={{ paddingLeft: '10px' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>

        <Stack sx={{ padding: '10px', width: '300px' }} spacing={2}>

          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Profile Settings</strong>
          </Typography>

          <TextField
            label="Profile Name"
            variant="outlined"
            fullWidth
            value={appSettings.subtitleSettings.profileName}
            sx={{ my: 2 }}
            onChange={handleProfileNameChange}
            size="small"
          />

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

          <Button
            variant="contained"
            onClick={handleSaveProfile}
            size="small"
            disabled={appSettings.subtitleSettings.profiles.filter((p) => p.preset).map((p) => p.profileName).includes(appSettings.subtitleSettings.profileName)}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
