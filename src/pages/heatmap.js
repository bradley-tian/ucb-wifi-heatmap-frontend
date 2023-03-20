import React from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerHighlight from "../assets/marker-highlight.png";
import { Icon } from 'leaflet'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

function Heatmap() {

    const [params, setParams] = useSearchParams();
    let initial = params.get('lon') && params.get('lat') ? [params.get('lon'), params.get('lat')] : [37.8719, -122.2585];
    const [current, setCurrent] = useState(initial);
    const uuid = params.get('uuid') ? params.get('uuid') : 'Anonymous';
    let initialized = false;

    const coords = {
        sather_gate: [37.8703, -122.2595],
        mlk: [37.8692, -122.2597],
        moffitt: [37.8725, -122.2608],
        doe: [37.8722, -122.2592],
        east_asian: [37.8736, -122.2600],
        kresge: [37.8738, -122.2583],
        haas: [37.8716, -122.2533],
    }

    const Unstable = { fillColor: '#F9E238' };
    const Slow = { fillColor: '#F99838' };
    const Down = { fillColor: '#F94F38' };

    //Theme Configuration
    const theme = createTheme({
        palette: {
            primary: {
                main: '#28B5E2',
            },
            neutral: {
                main: '#FFFFFF',
                contrastText: '#4EB0F3',
            },
        },
    });

    function BerkeleyMarker(props) {
        return (
            <Marker position={props.pos} icon={
                new Icon({
                    iconUrl: props.pos === current ? markerHighlight : markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                })
            }>
                <Popup>
                    {props.desc}
                </Popup>
            </Marker>
        )
    }

    function Zone(props) {
        return (
            <Circle center={props.pos} pathOptions={props.deg} radius={props.rad} />
        )
    }

    //Fetch geolocation from query string
    useEffect(() => {
        if (!initialized && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                initial = [position.coords.latitude, position.coords.longitude];
                console.log(`Initial: ${initial}`);
                initialized = true;
            });
        };
    }, [])

    function BerkeleyMap(props) {
        return (
            <div className="leaflet-container">
                <MapContainer center={props.current} zoom={17} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <BerkeleyMarker pos={coords.sather_gate} desc='Sather Gate' />
                    <BerkeleyMarker pos={coords.mlk} desc='MLK Jr. Building (ASUC Student Union)' />
                    <BerkeleyMarker pos={coords.moffitt} desc='Moffitt Library' />
                    <BerkeleyMarker pos={coords.doe} desc='Doe Library' />
                    <BerkeleyMarker pos={coords.east_asian} desc='East Asian Library' />
                    <BerkeleyMarker pos={coords.kresge} desc='Kresge Library' />
                    <BerkeleyMarker pos={coords.haas} desc='Haas School of Business' />
                    <BerkeleyMarker pos={props.current} desc={`Current User: ${uuid}`} />

                    <Zone pos={coords.moffitt} deg={Down} rad={50} />

                    <Zone pos={coords.mlk} deg={Unstable} rad={80} />
                    <Zone pos={coords.mlk} deg={Slow} rad={50} />
                    <Zone pos={coords.mlk} deg={Down} rad={30} />

                    <Zone pos={coords.haas} deg={Slow} rad={40} />
                    <Zone pos={coords.haas} deg={Unstable} rad={65} />
                </MapContainer>
            </div>
        )
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="page">
                    <BerkeleyMap current={current}></BerkeleyMap>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Button
                                variant="contained"
                                color="neutral"
                                onClick={() => {
                                    setCurrent(initial);
                                }}
                                className="resetLocation">Reset Location</Button>
                        </Grid>
                        <Grid item xs={3.5}>
                            <FormControl fullWidth>
                                <InputLabel>Manually Select Location</InputLabel>
                                <Select
                                    id="location"
                                    value=''
                                    label='Manually Select Location'
                                    onChange={event => {
                                        setCurrent(event.target.value);
                                        console.log(current);
                                        setParams(params);
                                    }}
                                >
                                    <MenuItem value={coords.doe}>Doe Library</MenuItem>
                                    <MenuItem value={coords.east_asian}>East Asian Library</MenuItem>
                                    <MenuItem value={coords.haas}>Haas Courtyard</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
            </ThemeProvider>
        </>
    );
}

export default Heatmap;