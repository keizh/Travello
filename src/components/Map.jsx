/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCities } from "../context/CitiesContext";
import { useGeolocation } from "../CustomHooks/useGeolocation";
import { useURLPosition } from "../CustomHooks/useURLPosition";
import Button from "./Button";

function Map() {
  // center co-ordinate values
  const [mapPosition, setMapPosition] = useState([59, 50]);
  // for markers setup
  const { cities } = useCities();

  // to avoid confusion
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
    error,
  } = useGeolocation();

  if (error !== null) alert(error);

  const { Lat: mapLat, Lng: mapLng } = useURLPosition();

  // when we click on a city , url stroes the lat,lng & opens detailed view
  // also display the the marker
  // all city markers are already laided out
  // we only have to center the map view
  // default center values when none marker choosen
  // when u move back from a detailed city view , the center should still be focused at the choosen
  // fetching from url if only it exists in url , unless it will contain undefined value
  // const [searchParams, setSearchParams] = useSearchParams();
  // const mapLat = searchParams.get("lat");
  // const mapLng = searchParams.get("lng");

  // useEffect is used fot synchrnoization of state value
  //  if any dependency change
  useEffect(
    function () {
      if (mapLat && mapLng) {
        setMapPosition([mapLat, mapLng]);
      }
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition) {
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
      }
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        Get Current Position
      </Button>
      {isLoadingPosition ? "Loading..." : "Use your Position"}
      {/* react leaflet  */}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((element) => (
          <Marker
            position={[element.position.lat, element.position.lng]}
            key={element.id}
          >
            <Popup>
              <span>{element.emoji}</span>
              <span>{element.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <CenterTheMap Position={mapPosition} />
        <DetectClickOnMap />
      </MapContainer>
    </div>
  );
}

// In leaflet library everything works with components
// function like this is also implmented with component
function CenterTheMap({ Position }) {
  const map = useMap();
  map.setView(Position);
  return null;
}

function DetectClickOnMap() {
  const navigate = useNavigate();
  useMapEvent("click", (e) => {
    // console.log(e)
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
  });
  return null;
}

export default Map;
