import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { JumboCard } from "@jumbo/components";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import React from "react";

const PopupInfoMap = () => {
  const center = {
    lat: 47.646935,
    lng: -122.303763,
  };

  const data = [
    {
      position: { lat: 47.646145, lng: -122.303763 },
      showInfo: false,
      infoContent: (
        <div className={"d-flex"}>
          <div>
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path
                d="M3.5 0c-1.7 0-3 1.6-3 3.5 0 1.7 1 3 2.3 3.4l-.5 8c0
            .6.4 1 1 1h.5c.5 0 1-.4 1-1L4 7C5.5 6.4 6.5 5 6.5
            3.4c0-2-1.3-3.5-3-3.5zm10 0l-.8 5h-.6l-.3-5h-.4L11
            5H10l-.8-5H9v6.5c0 .3.2.5.5.5h1.3l-.5 8c0 .6.4 1 1 1h.4c.6 0
            1-.4 1-1l-.5-8h1.3c.3 0 .5-.2.5-.5V0h-.4z"
              />
            </svg>
          </div>
          <div style={{ marginLeft: 1 }}>
            <p>UW Medical Center</p>
            <p>1959 NE Pacific St</p>
            <p>Seattle, WA 98195</p>
          </div>
        </div>
      ),
      slug: "slug-1",
    },
    {
      position: { lat: 47.647935, lng: -122.303763 },
      showInfo: false,
      infoContent: (
        <div className="d-flex">
          <div>
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path
                d="M6 14.5c0 .828-.672 1.5-1.5 1.5S3 15.328 3 14.5 3.672
            13 4.5 13s1.5.672 1.5 1.5zM16 14.5c0 .828-.672 1.5-1.5
            1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zM16
            8V2H4c0-.552-.448-1-1-1H0v1h2l.75 6.438C2.294 8.805 2 9.368
            2 10c0 1.105.895 2 2 2h12v-1H4c-.552 0-1-.448-1-1v-.01L16 8z"
              />
            </svg>
          </div>
          <div className={"ml-2"}>
            <p>University of Washington Intramural Activities (IMA) Building</p>
            <p>3924 Montlake Blvd NE</p>
            <p>Seattle, WA 98195</p>
          </div>
        </div>
      ),
      slug: "slug-2",
    },
  ];

  const [marker, setMarker] = React.useState();

  const handleMarkerClick = (targetMarker) => {
    setMarker({ ...targetMarker, showInfo: true });
  };

  const handleMarkerClose = (targetMarker) => {
    setMarker({ ...targetMarker, showInfo: false });
  };

  return (
    <JumboCard
      contentWrapper
      contentSx={{ pt: 3, backgroundColor: "background.paper" }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={center}
        zoom={15}
      >
        {data?.map((item, index) => (
          <MarkerF
            icon={`${ASSET_IMAGES}/marker.png`}
            key={index}
            position={item.position}
            onClick={() => handleMarkerClick(item)}
          >
            {marker?.showInfo && item.slug === marker.slug && (
              <InfoWindowF onCloseClick={() => handleMarkerClose(item)}>
                <div>{marker.infoContent}</div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </JumboCard>
  );
};

export { PopupInfoMap };
