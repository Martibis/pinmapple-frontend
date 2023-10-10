import React, { useEffect, useState } from "react";
import pinmappleWithText from "../assets/pinmapple-with-text.png";
import pinmapple from "../assets/pinmapple.png";
import location from "../assets/location.png";
import "../styles/HomePage.scss";
import { useParams } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
  Marker,
  InfoWindow,
  OverlayView,
  StandaloneSearchBox,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import LoadingPage from "./LoadingPage";
import axios from "axios";
import PostSummary from "../components/PostSummary";
import ReactTooltip from "react-tooltip";
import FilterComponent from './../components/FilterComponent';

const libraries = ["places"];

const HomePage = () => {
  const params = useParams();
  const [userLocation, setUserLocation] = useState();
  const [codeMode, setCodeMode] = useState(false);
  /* const [showOverlayView, setShowOverlayView] = useState(false); */
  const [overlayPos, setOverlayPos] = useState({ lat: 0, lng: 0 });

  const [mapRef, setMapRef] = useState();
  const [searchBoxRef, setSearchBoxRef] = useState();
  const [infoWindowRef, setInfoWindowRef] = useState();
  const [markerClustererRef, setMarkerClustererRef] = useState();

  const [copiedToClipBoard, setCopiedToClipboard] = useState(false);

  const [mapCenter, setMapCenter] = useState({
    lat: 17,
    lng: 0,
  });

  const [codeModeMarker, setCodeModeMarker] = useState();
  const [codeModeDescription, setCodeModeDescription] = useState("");

  const [markers, setMarkers] = useState([]);
  const [clusterMarkers, setClusterMarkers] = useState([]);

  const [markersLoading, setMarkersLoading] = useState(true);
  const [markersError, setMarkersError] = useState(null);

  const [clusterMarkersLoading, setClusterMarkersLoading] = useState(false);
  const [clusterMarkersError, setClusterMarkersError] = useState(null);

  const [searchParams, setSearchParams] = useState({ curated_only: true });

  const [showFilters, setShowFilters] = useState(false);


  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: libraries,
  });

  function newSearchParams(s) {
    setSearchParams({ ...searchParams, ...s });
  }

  async function markerClick(marker, id) {
    let position = {
      lat: marker.latLng.lat(),
      lng: marker.latLng.lng(),
    };
    setClusterMarkers([]);
    setMapCenter({ lat: position.lat, lng: position.lng });
    setOverlayPos(position);
    infoWindowRef.open(mapRef);
    let idsInCluster = [id];

    setClusterMarkersLoading(true);
    await axios
      .post(process.env.REACT_APP_API_BASE_URL + "marker/ids", {
        marker_ids: idsInCluster,
      })
      .then((resp) => {
        setClusterMarkers(resp.data);
        console.log(resp.status);
      })
      .catch((err) => {
        setClusterMarkersError(err);
        console.log(err);
      })
      .finally(() => {
        setClusterMarkersLoading(false);
      });
  }

  async function clusterClick(cluster) {
    let position = {
      lat: cluster.center.lat(),
      lng: cluster.center.lng(),
    };
    setClusterMarkers([]);
    setMapCenter({ lat: position.lat, lng: position.lng });
    setOverlayPos(position);
    infoWindowRef.open(mapRef);
    let markers = cluster.getMarkers();
    let idsInCluster = [];
    for (let i = 0; i < markers.length; i++) {
      idsInCluster.push(markers[i].id);
    }

    setClusterMarkersLoading(true);
    await axios
      .post(process.env.REACT_APP_API_BASE_URL + "marker/ids", {
        marker_ids: idsInCluster,
      })
      .then((resp) => {
        setClusterMarkers(resp.data);
        console.log(resp.status);
      })
      .catch((err) => {
        setClusterMarkersError(err);
        console.log(err);
      })
      .finally(() => {
        setClusterMarkersLoading(false);
      });
  }
  function onPlacesChanged() {
    if (!mapRef || !searchBoxRef) {
      return;
    }
    let bounds = new window.google.maps.LatLngBounds();
    let places = searchBoxRef.getPlaces();
    if (places?.length === 0) {
      return;
    }
    if (places[0].geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(places[0].geometry.viewport);
    } else {
      bounds.extend(places[0].geometry.location);
    }
    mapRef.fitBounds(bounds);
  }

  const handleFilter = filterData => {
    console.log('Filter data:', filterData);
    newSearchParams({
      tags: filterData && filterData.tags && filterData.tags.length && filterData.tags[0] ? filterData.tags : [],
      author: filterData ? filterData.username : '',
      post_title: filterData ? filterData.postTitle : '',
      start_date: filterData ? filterData.startDate : '',
      end_date: filterData ? filterData.endDate : '',
      permlink: '',
      curated_only: filterData.isCurated
    });
  };

  useEffect(() => {
    //TODO: make an axios post request to get all markers
    setMarkersLoading(true);
    axios
      .post(
        process.env.REACT_APP_API_BASE_URL + "marker/0/150000",
        searchParams
      )
      .then((resp) => {
        console.log(resp.data.length);
        setMarkers(resp.data);
      })
      .catch((err) => {
        setMarkersError(err);
        console.log(err);
      })
      .finally(() => {
        setMarkersLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    if (markerClustererRef) {
      markerClustererRef.clearMarkers();
      markerClustererRef.addMarkers(
        markers.map(
          (marker) =>
            new window.google.maps.Marker({
              position: {
                lat: marker.lattitude,
                lng: marker.longitude,
              },
              id: marker.id,
            })
        )
      );
    }
  }, [markers])

  return (
    <div id="home-page">
      <div className="pinmapple-with-text">
        <img src={pinmappleWithText} alt="" />
      </div>
      <div className="buymeberries">
        <a
          href="https://buymeberri.es/@pinmapple"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://buymeberries.com/assets/bmb-1-l.png" alt="" />
        </a>
      </div>
      {codeMode ? (
        <div className="code-mode-div">
          <input
            type="text"
            placeholder="Short description here"
            maxLength={250}
            onChange={(t) => {
              setCodeModeDescription(t.target.value);
            }}
          />
          <p className="info-text">
            {codeModeMarker
              ? copiedToClipBoard
                ? "Copied succesfully!"
                : "Click the code to copy, then add it to your post on Hive."
              : "Click on the map on the location of your post for the code to be generated."}
          </p>
          {codeModeMarker ? (
            <p
              className="code-to-copy"
              onClick={() => {
                navigator.clipboard.writeText(
                  "[//]:# (!pinmapple " +
                  codeModeMarker.lat.toFixed(5) +
                  " lat " +
                  codeModeMarker.lng.toFixed(5) +
                  " long " +
                  codeModeDescription +
                  " d3scr)"
                );
                setCopiedToClipboard(true);
              }}
            >
              {"[//]:# (!pinmapple " +
                codeModeMarker.lat.toFixed(5) +
                " lat " +
                codeModeMarker.lng.toFixed(5) +
                " long " +
                codeModeDescription +
                " d3scr)"}
            </p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="nav-tools">
        <p
          onClick={() => {
            infoWindowRef.close();
            if (!codeMode) {
              markerClustererRef.clearMarkers();
              markerClustererRef.repaint();
            } else {
              markerClustererRef.addMarkers(
                markers.map(
                  (marker) =>
                    new window.google.maps.Marker({
                      position: {
                        lat: marker.lattitude,
                        lng: marker.longitude,
                      },
                      id: marker.id,
                    })
                )
              );
            }
            ReactTooltip.rebuild();
            setCodeMode(!codeMode);
          }}
          id="code-mode-switch"
        >
          {codeMode ? "browse map" : "get code"}
        </p>
        <p
          id="get-loaction-button"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                setUserLocation(pos);

                mapRef.panTo(pos);
                mapRef.setZoom(16);
              });
            } else {
              // Browser doesn't support Geolocation
              console.log("Couldn't access your location");
            }
          }}
        >
          my location
        </p>
        {codeMode ? (
          <></>
        ) : (
          <p id="get-map-filters" onClick={() => {
            setShowFilters(!showFilters);
          }}>
            filter the map
          </p>
        )}
        <div className="filler"></div>
        <p id="get-faq" data-tip="Coming soon">
          FAQ
        </p>
      </div>
      {
        showFilters ? (
          <FilterComponent onFilter={handleFilter} />
        ) : <></>
      }
      {
        markersLoading ? <div className="loader-container">
          <div className="loader">
            <img src={pinmapple} alt="" />
          </div>
          <p>Getting pins...</p>
        </div> : <></>
      }
      {isLoaded ? (
        <GoogleMap
          /* onZoomChanged={() => {
            setShowOverlayView(false);
          }} */
          onLoad={(m) => {
            setMapRef(m);
          }}
          id="google-maps"
          onClick={(e) => {
            /* setShowOverlayView(false); */
            infoWindowRef.close();
            if (codeMode) {
              setCopiedToClipboard(false);
              setCodeModeMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={3}
          center={mapCenter}
          clickableIcons={false}
          options={{
            minZoom: 2,
            /* scrollwheel: showOverlayView ? false : true, */
            streetViewControl: window.innerWidth > 800 ? true : false,
            zoomControl: window.innerWidth > 800 ? true : false,
            mapTypeControl: window.innerWidth > 800 ? true : false,
            mapTypeControlOptions: {
              style: window.google?.maps.MapTypeControlStyle.DROPDOWN_MENU,
              position: window.google?.maps.ControlPosition.RIGHT_TOP,
            },
            fullscreenControl: false,
          }}
        >
          <StandaloneSearchBox
            onLoad={(s) => {
              setSearchBoxRef(s);
            }}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="search-box">
              <input type="text" placeholder="Search a location" />
            </div>
          </StandaloneSearchBox>
          <MarkerF position={codeModeMarker} visible={codeMode}></MarkerF>
          <MarkerF
            position={userLocation}
            icon={location}
            options={{
              scale: 0.5,
            }}
          />
          <MarkerClusterer
            onLoad={(m) => {
              setMarkerClustererRef(m);
            }}
            averageCenter={true}
            zoomOnClick={false}
            onClick={(cluster) => {
              clusterClick(cluster);
            }}
          >
            {(clusterer) =>
              markers.map((marker) => (
                <MarkerF
                  key={marker.id}
                  position={{ lat: marker.lattitude, lng: marker.longitude }}
                  clusterer={clusterer}
                  //Little trick to pass data
                  options={marker}
                  visible={!codeMode}
                  clickable={true}
                  onClick={(m) => {
                    markerClick(m, marker.id);
                  }}
                />
              ))
            }
          </MarkerClusterer>

          <InfoWindow
            position={overlayPos}
            mapPaneName={OverlayView.FLOAT_PANE}
            onLoad={(i) => {
              setInfoWindowRef(i);
              i.close();
            }}
          >
            <div
              /* className={"overlay-content" + (showOverlayView ? "" : "hidden")}
              style={showOverlayView ? overlayStyle : { display: "none" }} */
              className="overlay-content"
            >
              {clusterMarkers.map((marker) => (
                <PostSummary
                  key={marker.postLink}
                  marker={marker}
                ></PostSummary>
              ))}
            </div>
          </InfoWindow>
        </GoogleMap>
      ) : (
        <LoadingPage></LoadingPage>
      )}
    </div>
  );
};

export default HomePage;
