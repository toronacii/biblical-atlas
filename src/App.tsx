import styled from "@emotion/styled";
import { Autocomplete, Box, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Img } from "./components/Img";
import { useMaps } from "./hooks/useMaps";
import { usePlaces } from "./hooks/usePlaces";
import { MapWithCoordinate } from './models/map'
import { Place } from "./models/place";

function App() {
  const places = usePlaces();
  const { getMapsByUbications } = useMaps();
  const [maps, setMaps] = useState<MapWithCoordinate[]>([])
  const [activeTab, setActiveTab] = useState<number | null>(null)

  const handleSelectPlace = (place: Place | null) => {
    const maps = place ? getMapsByUbications(place.ubications) : [];
    setMaps(maps);
    setActiveTab(place && 0)
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box padding={2}>
      <Autocomplete
        disablePortal
        options={places}
        sx={{ width: 300 }}
        getOptionLabel={(option: any) => option.name}
        renderInput={(params) => <TextField {...params} label="Lugares" />}
        onChange={(_: any, value) => handleSelectPlace(value)}
      />

      {activeTab !== null && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleChangeTab}>
              {maps.map(({ page }, i) => <Tab key={'tab-' + page + i} label={`Mapa ${page}`} {...a11yProps(i)} />)}
            </Tabs>
          </Box>
          {maps.map((map, i) => (
            <TabPanel key={'tabpannel-' + map.filename + i} value={activeTab} index={i}>
              <Img
                key={'img-' + map.filename + i}
                src={`${process.env.PUBLIC_URL}/data/maps/${map.filename}`}
                {...map} />
            </TabPanel>
          ))}
        </Box>)}
    </Box>
  );
}

// const ImgContainer = styled.div`
//   width: 100%;
//   height: 90vh;

//   img {
//     max-height: 100%
//   }
// `;

export default App;
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
