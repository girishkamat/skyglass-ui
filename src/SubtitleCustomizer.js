import * as React from 'react';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { MenuItem, Select, Slider, Box, TextField, Button } from "@mui/material";
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import Edit from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

export default function SubtitleCustomizer({ appSettings, setAppSettings }) {


  const [profileData, setProfileData] = React.useState({})
  const [editMode, setEditMode] = React.useState(false)

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


  const updateAppSettingsForSubtitles = (updatedSubtitleSettings) => {
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

  const handleSwitchChange = (event) => {
    updateAppSettingsForSubtitles({ switch: event.target.value })
  }

  const handleLanguageChange = (event) => {
    updateAppSettingsForSubtitles({ language: event.target.value })
  }

  const handleProfileChange = (newProfileId) => {
    const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId == newProfileId)
    updateAppSettingsForSubtitles({
      profileId: newProfileId,
      profileName: profile.profileName,
      font: profile.font,
      size: profile.size,
      color: profile.color,
      background: colorWithOpacity(profile.backgroundHex, profile.opacity),
      backgroundHex: profile.backgroundHex,
      opacity: profile.opacity,
      lineSpacing: profile.lineSpacing,
      position: profile.position
    })
  }

  const handleProfilePreview = (profileId, show) => {
    if(show) {
      const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId == profileId)
      setProfileData({ ...profile })
    } else {
      setProfileData({})
    }
  }

  const handleCopyOrEditProfile = (profileId, isCopy) => {
    const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId == profileId)
    setProfileData({
      ...profile,
      isCopy: isCopy,
      profileId: isCopy ? (Math.max(...appSettings.subtitleSettings.profiles.map((p) => p.profileId)) + 1) : profileId,
      profileName: isCopy ? '' : profile.profileName
    })
    setEditMode(true)
  }

  const handleDeleteProfile = (profileId) => {
    const currentProfileId = appSettings.subtitleSettings.profileId
    const updatedProfiles = [...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== profileId)]
    if (currentProfileId === profileId) {
      const profile = appSettings.subtitleSettings.profiles[0]
      updateAppSettingsForSubtitles(
        {
          ...profile,
          profiles: updatedProfiles
        }
      )
    } else {
      updateAppSettingsForSubtitles({
        profiles: updatedProfiles
      })
    }
  }

  const handleSaveProfile = (e) => {
    if (profileData.profileName != "") {
      const existingProfile = appSettings.subtitleSettings.profiles.find(profile => profile.profileId == profileData.profileId)
      if (existingProfile) {
        updateAppSettingsForSubtitles({
          ...profileData,
          profiles: [
            ...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== profileData.profileId), 
            {...profileData, preset: false}
          ]
        })
      } else {
        updateAppSettingsForSubtitles({
          ...profileData,
          profiles: [
            ...appSettings.subtitleSettings.profiles, 
            {...profileData, preset: false}
          ]
        })
      }
      setProfileData({})
      setEditMode(false)
    }
  }

  const handleCancelEdit = (e) => {
    setProfileData({})
    setEditMode(false)
  }

  const handleProfileNameChange = (e) => {
    setProfileData({
      ...profileData,
      ...{ profileName: e.target.value }
    })
  }

  const handleFontChange = (e) => {
    setProfileData({
      ...profileData,
      ...{ font: e.target.value }
    })
  }

  const handleFontSizeChange = (e) => {
    setProfileData({
      ...profileData,
      ...{ size: e.target.value }
    })
  }

  const handleFontColorChange = (e) => setProfileData({
    ...profileData,
    ...{ color: e.target.value }
  })

  function handleBackground(e) {
    setProfileData({
      ...profileData,
      ...{
        background: colorWithOpacity(e.target.value, profileData.opacity / 100),
        backgroundHex: e.target.value
      }
    })
  }

  function handleOpacity(newValue) {
    setProfileData({
      ...profileData,
      ...{
        opacity: newValue,
        background: colorWithOpacity(profileData.backgroundHex, newValue / 100)
      }
    })
  }

  const handleLineSpacingChange = (e) => setProfileData({
    ...profileData,
    ...{ lineSpacing: e.target.value }
  })

  const handlePosition = (e) => setProfileData({
    ...profileData,
    ...{ position: e.target.value }
  })

  return (
    <div style={{
      width: '1200px', display: 'grid',
      placeItems: 'center'
    }}>
      {(profileData.profileId != null || editMode) && (<div style={{
        padding: '5px',
        marginBottom: '5px',
        fontFamily: profileData.font,
        fontSize: `${profileData.size}px`,
        color: profileData.color
      }}>
        <div style={{ display: 'inline-block' }}>
          <div style={{ lineHeight: profileData.lineSpacing, textAlign: 'center', display: 'block', backgroundColor: profileData.background }}>
            {appSettings.subtitleSettings.language === "english" ? "Preview subtitle" : "Vista previa del subtítulo"}
          </div>
          <div style={{ lineHeight: profileData.lineSpacing, textAlign: 'center', display: 'block', backgroundColor: profileData.background }}>
            {appSettings.subtitleSettings.language === "english" ? "Preview subtitle again" : "Vista previa del subtítulo nuevamente"}
          </div>
        </div>
      </div>)}

      <Stack direction="row" sx={{ bgcolor: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: '15px', height: '600px', width: '700px' }} spacing={1}>

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

        <Stack sx={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
            <strong>Profiles</strong>
          </Typography>

          <List dense={true} sx={{ color: 'text.primary' }}>
            {appSettings.subtitleSettings.profiles.map((profile) => (
              <ListItem disableGutters key={profile.profileId}
                secondaryAction={
                  <>
                    {profile.preset && <IconButton edge="end" onClick={() => handleCopyOrEditProfile(profile.profileId, true)}>
                      <ContentCopyIcon />
                    </IconButton>}
                    {!profile.preset && <IconButton edge="end" onClick={() => handleCopyOrEditProfile(profile.profileId, false)}>
                      <Edit />
                    </IconButton>}
                    {!profile.preset &&
                      <IconButton edge="end" onClick={() => handleDeleteProfile(profile.profileId)}>
                        <DeleteIcon key={profile.profileId} />
                      </IconButton>}
                  </>}
              >

                <ListItemButton
                  disableGutters
                  selected={appSettings.subtitleSettings.profileId === profile.profileId}
                  onClick={() => handleProfileChange(profile.profileId)}
                  onMouseOver={() => handleProfilePreview(profile.profileId, true)}
                  onMouseOut={() => handleProfilePreview(profile.profileId, false)}
                >
                  {/* <Tooltip style={{backgroundColor: "transparent"}} title={
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableBody>
                            <TableRow>
                              <TableCell><strong>Font</strong></TableCell>
                              <TableCell>{profile.font}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Font Size</strong></TableCell>
                              <TableCell>{profile.size}px</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Font Color</strong></TableCell>
                              <TableCell>{profile.color}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Background</strong></TableCell>
                              <TableCell>{profile.backgroundHex}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Opacity</strong></TableCell>
                              <TableCell>{profile.opacity}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Line Spacing</strong></TableCell>
                              <TableCell>{profile.lineSpacing}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell><strong>Position</strong></TableCell>
                              <TableCell>{profile.position}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }> */}
                  <ListItemText primary={profile.profileName} sx={{ paddingLeft: '10px' }} />
                  {/* </Tooltip> */}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>

        {editMode &&
          <div
            style={{
              color: 'text.primary',
              padding: "10px",
              marginLeft: "10px",
            }}
          >
            {editMode && (
              <Stack spacing={2}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                  <strong>{profileData.isCopy ? "Copy" : "Edit"} Profile</strong>
                </Typography>
                <TextField
                  required
                  error={profileData.profileName === "" || appSettings.subtitleSettings.profiles.filter(p => p.profileId !== profileData.profileId).map(p => p.profileName).includes(profileData.profileName)}
                  label="Profile Name"
                  variant="outlined"
                  fullWidth
                  value={profileData.profileName}
                  sx={{ my: 2 }}
                  onChange={handleProfileNameChange}
                  size="small"
                />

                <FormControl>
                  <InputLabel id="font-label">Font</InputLabel>
                  <Select
                    labelId="font-label"
                    id="font"
                    value={profileData.font}
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
                    value={profileData.size}
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
                    value={profileData.color}
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
                    value={profileData.backgroundHex}
                    label="Background"
                    onChange={handleBackground}
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
                    value={profileData.opacity}
                    onChange={(e, newValue) => handleOpacity(newValue)}
                    min={0} max={100} size="small"
                    valueLabelDisplay="auto"
                    slots={{
                      valueLabel: ValueLabelComponent,
                    }}
                  />
                </FormControl>

                <FormControl>
                  <InputLabel id="lineSpacing-label">Line Spacing</InputLabel>
                  <Select
                    labelId="lineSpacing-label"
                    id="lineSpacing"
                    value={profileData.lineSpacing}
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
                    value={profileData.position}
                    label="Position"
                    onChange={handlePosition}
                    size="small"
                  >
                    <MenuItem value={"bottom"}>Bottom</MenuItem>
                    <MenuItem value={"top"}>Top</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSaveProfile}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </Stack>
            )}
          </div>
        }
      </Stack>

    </div>
  );
}
