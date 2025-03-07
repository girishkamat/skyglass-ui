import * as React from 'react';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { MenuItem, Select, Slider, Box, TextField, Button } from "@mui/material";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import Edit from "@mui/icons-material/Edit";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddBoxTwoToneIcon from '@mui/icons-material/AddBoxTwoTone';
import CheckIcon from "@mui/icons-material/Check";

export default function SubtitleCustomizer({ appSettings, setAppSettings, profileRefs }) {

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
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity / 100})`;
  }

  // // Blend semi-transparent background over white
  // const blendWithWhite = (rgb, alpha) => {
  //   const blendedR = Math.round((1 - alpha) * 255 + alpha * rgb.red);
  //   const blendedG = Math.round((1 - alpha) * 255 + alpha * rgb.green);
  //   const blendedB = Math.round((1 - alpha) * 255 + alpha * rgb.blue);
  //   return { red: blendedR, green: blendedG, blue: blendedB };
  // };

  // const getLuminance = (rgb) => {
  //   const adjust = (c) => (c <= 10 ? c / 3294 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
  //   return 0.2126 * adjust(rgb.red) + 0.7152 * adjust(rgb.green) + 0.0722 * adjust(rgb.blue);
  // };
  //
  // const getContrastRatio = (foregroundHex, backgroundHex, backgroundOpacity) => {
  //   // Blend background with white
  //   const foregroundRgb = extractRgbFromHex(foregroundHex)
  //   const backgroundRgb = extractRgbFromHex(backgroundHex)

  //   const blendedBackgroundRgb = blendWithWhite(backgroundRgb, (backgroundOpacity / 100).toFixed(2));

  //   // Calculate luminance
  //   const lum1 = getLuminance(foregroundRgb);
  //   const lum2 = getLuminance(blendedBackgroundRgb);

  //   const [L1, L2] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1];
  //   return ((L1 + 0.05) / (L2 + 0.05)).toFixed(2);
  // };


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

  // const handleSwitchChange = (event) => {
  //   updateAppSettingsForSubtitles({ switch: event.target.value })
  // }

  const handleProfileChange = (newProfileId) => {
    const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId === newProfileId)
    if (profile) {
      updateAppSettingsForSubtitles({
        ...profile
      })
    }
  }

  const handleProfileMouseOver = (profileId) => {
    if (!editMode) {
      const profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId === profileId)
      console.log(profile)
      setProfileData({ ...profile })
    }
  }

  const handleProfileMouseOut = () => {
    if (!editMode) {
      setProfileData({})
    }
  }

  const addEditOrCopy = (mode, profileId) => {
    var profile = {}
    if (mode === "Add") {
      const defaultProfile = appSettings.subtitleSettings.profiles.find(p => p.profileId === 1)
      profile = { ...defaultProfile, opacity: 100, background: colorWithOpacity(defaultProfile.backgroundHex, 100) }
    } else {
      profile = appSettings.subtitleSettings.profiles.find((p) => p.profileId === profileId)
    }

    setProfileData({
      ...profile,
      mode: mode,
      profileId: mode === "Edit" ? profileId : (Math.max(...appSettings.subtitleSettings.profiles.map((p) => p.profileId)) + 1),
      profileName: mode === "Edit" ? profile.profileName : ''
    })
    setEditMode(true)
  }

  const handleDeleteProfile = (profileId) => {
    const currentProfileId = appSettings.subtitleSettings.profileId
    const updatedProfiles = [...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== profileId)]
    if (currentProfileId === profileId) {
      const profile = appSettings.subtitleSettings.profiles[1]
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
    if (profileData.profileName !== "") {
      const existingProfile = appSettings.subtitleSettings.profiles.find(profile => profile.profileId === profileData.profileId)
      if (existingProfile) {
        updateAppSettingsForSubtitles({
          ...profileData,
          profiles: [
            ...appSettings.subtitleSettings.profiles.filter((profile) => profile.profileId !== profileData.profileId),
            { ...profileData, preset: false, description: null }
          ]
        })
      } else {
        updateAppSettingsForSubtitles({
          ...profileData,
          profiles: [
            ...appSettings.subtitleSettings.profiles,
            { ...profileData, preset: false, description: null }
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
        background: colorWithOpacity(e.target.value, profileData.opacity),
        backgroundHex: e.target.value
      }
    })
  }

  function handleOpacity(newValue) {
    setProfileData({
      ...profileData,
      ...{
        opacity: newValue,
        background: colorWithOpacity(profileData.backgroundHex, newValue)
      }
    })
  }

  // const handleLineSpacingChange = (e) => setProfileData({
  //   ...profileData,
  //   ...{ lineSpacing: e.target.value }
  // })

  const handleLetterSpacingChange = (e) => setProfileData({
    ...profileData,
    ...{ letterSpacing: e.target.value }
  })

  const handlePosition = (e) => setProfileData({
    ...profileData,
    ...{ position: e.target.value }
  })

  return (
    <div>
      {(profileData.profileId >= 1 || editMode) && (<div style={{
        marginBottom: '5px',
        fontFamily: profileData.font,
        fontSize: `${profileData.size}px`,
        color: profileData.color,
        display: 'grid',
        placeItems: 'center'
      }}>
        <div style={{ letterSpacing: `${profileData.letterSpacing}rem`, textAlign: 'center', display: 'inline', backgroundColor: profileData.background, whiteSpace: 'nowrap' }}>
          Preview subtitle
        </div>

        <div style={{ letterSpacing: `${profileData.letterSpacing}rem`, textAlign: 'center', display: 'inline', backgroundColor: profileData.background, whiteSpace: 'nowrap' }}>
          Preview subtitle again
        </div>
      </div>)}

      <Stack direction="row" sx={{ backgroundColor: 'background.paper', padding: '20px', borderRadius: '15px' }} spacing={1}>

        {/* <Stack sx={{ padding: '20px', borderRight: 1, width: '100px' }} spacing={2}>
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

        </Stack> */}

        <Stack sx={{ padding: '20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
              <strong>Profiles</strong>
            </Typography>
            <Tooltip title="Add Profile" arrow>
              <IconButton variant="contained" onClick={() => addEditOrCopy("Add")} sx={{ 
                opacity: editMode ? 0.5 : 1,   // Grey out effect
                pointerEvents: editMode ? "none" : "auto", // Prevent interactions
              }}>
                <AddBoxTwoToneIcon style={{ fontSize: 40 }} color="primary" />
              </IconButton>
            </Tooltip>
          </Box>


          <List dense={true} sx={{ 
            color: 'text.primary', 
            minHeight: '51vh', 
            maxHeight: '51vh', 
            minWidth: '24vw', 
            maxWidth: '24vw', 
            overflowY: 'auto',
            opacity: editMode ? 0.5 : 1,   // Grey out effect
            pointerEvents: editMode ? "none" : "auto", // Prevent interactions
          }}>
            {appSettings.subtitleSettings.profiles.map((profile, index) => (
              <ListItem
                disablePadding
                key={profile.profileId}
                secondaryAction={
                  <>
                    {profile.preset &&
                      <Tooltip title="Copy Profile" arrow>
                        <IconButton edge="end" onClick={() => addEditOrCopy("Copy", profile.profileId)} >
                          <ContentCopyIcon color="primary" />
                        </IconButton></Tooltip>}
                    {profile.profileId >= 1 && !profile.preset && 
                     <Tooltip title="Edit Profile" arrow>
                    <IconButton edge="end" onClick={() => addEditOrCopy("Edit", profile.profileId)}>
                      <Edit color="primary" />
                    </IconButton></Tooltip>}
                    {profile.profileId >= 1 && !profile.preset &&
                     <Tooltip title="Delete Profile" arrow>
                      <IconButton edge="end" onClick={() => handleDeleteProfile(profile.profileId)}>
                        <DeleteIcon key={profile.profileId} color="primary" />
                      </IconButton></Tooltip>}
                  </>}
              >

                <ListItemButton
                  disableGutters
                  onClick={() => handleProfileChange(profile.profileId)}
                  onMouseOver={() => handleProfileMouseOver(profile.profileId)}
                  onMouseOut={() => handleProfileMouseOut()}
                  ref={(el) => (profileRefs.current[index] = el)}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    {appSettings.subtitleSettings.profileId === profile.profileId && <CheckIcon color="primary" fontSize="medium" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={profile.profileName} sx={{ color: 'text.primary' }}
                    secondary={profile.description &&
                      <React.Fragment>
                        <Typography sx={{ color: 'text.disabled' }}>
                          {profile.description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>


        {editMode && (
          <Stack spacing={2} sx={{
            color: 'text.primary',
            borderRadius: '15px',
            padding: "25px",
            marginLeft: "10px",
            backgroundColor: 'action.disabledBackground',
            maxHeight: '63vh', overflowY: 'auto'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
              <strong>{profileData.mode} Profile</strong>
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

            {/* <FormControl>
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
            </FormControl> */}

            <FormControl>
              <InputLabel id="letterSpacing-label">Letter Spacing</InputLabel>
              <Select
                labelId="letterSpacing-label"
                id="letterSpacing"
                value={profileData.letterSpacing}
                label="Letter Spacing"
                onChange={handleLetterSpacingChange}
                size="small"
              >
                {Array.from(appSettings.subtitleSettings.letterSpacings).map(([key, value]) => (
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
            <Stack direction='row' spacing={2}>
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
          </Stack>
        )}

      </Stack>

    </div>
  );
}
