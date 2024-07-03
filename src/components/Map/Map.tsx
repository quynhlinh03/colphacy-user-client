import { Flex, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";

declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

const Map: React.FC<{
  onDrag?: (lat: number, lng: number) => void;
  onStreetAddressChange?: (streetAddress: string) => void;
  control?: any;
  errors?: any;
  initialLat?: any;
  initialLng?: any;
  isView: boolean;
}> = ({
  onDrag,
  onStreetAddressChange,
  control,
  errors,
  initialLat,
  initialLng,
  isView,
}) => {
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const initMap = () => {
    let autocompleteInput = document.getElementById(
      "autocomplete-input"
    ) as HTMLInputElement;
    let autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput
    );

    let map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 16.07, lng: 108.15 },
      zoom: 13,
    });

    let marker = new window.google.maps.Marker({
      map: map,
      draggable: true,
      position: { lat: 16.07, lng: 108.15 },
    });

    if (initialLat && initialLng) {
      map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: initialLat, lng: initialLng },
        zoom: 13,
      });

      marker = new window.google.maps.Marker({
        map: map,
        draggable: isView ? false : true,
        position: { lat: initialLat, lng: initialLng },
      });
    }

    autocomplete.addListener(
      "place_changed",
      debounce(function () {
        const place = autocomplete.getPlace();
        marker.setPosition(place.geometry.location);
        map.setCenter(place.geometry.location);
        map.setZoom(14);
        const latLng = marker.getPosition();
        onDrag && onDrag(latLng.lat(), latLng.lng());

        autocompleteInput.value = place.name;
        onStreetAddressChange && onStreetAddressChange(place.name);
      }, 500)
    );

    marker.addListener("dragend", function () {
      const latLng = marker.getPosition();
      onDrag && onDrag(latLng.lat(), latLng.lng());
    });
  };

  useEffect(() => {
    window.initMap = initMap;

    const loadScript = () => {
      if (
        !document.querySelector(
          `script[src="https://maps.googleapis.com/maps/api/js?key=${import.meta.env.KEY_MAP}&libraries=places&callback=initMap"]`
        )
      ) {
        const script = document.createElement("script");
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.KEY_MAP}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    if (!window.google || !window.google.maps) {
      loadScript();
    } else {
      initMap();
    }
  }, [initialLat, initialLng]);
  return (
    <>
      <Flex direction="column" p={10}>
        {control && (
          <Controller
            name="address.streetAddress"
            control={control}
            rules={{ required: "Vui lòng nhập Địa chỉ cụ thể" }}
            render={({ field }) => (
              <TextInput
                style={
                  isView
                    ? {
                        pointerEvents: "none",
                      }
                    : {}
                }
                pb={20}
                {...field}
                name="address.streetAddress"
                type="text"
                id="autocomplete-input"
                placeholder="Địa chỉ cụ thể"
                onChange={(event) => {
                  field.onChange(event);
                  const address = event.target.value;
                  if (onStreetAddressChange) {
                    onStreetAddressChange(address);
                  }
                }}
                error={
                  errors.address?.streetAddress
                    ? errors.address.streetAddress.message
                    : false
                }
              />
            )}
          ></Controller>
        )}
        <div
          id="map"
          style={control ? { height: "24rem" } : { height: "14rem" }}
        ></div>
      </Flex>
    </>
  );
};

export default Map;
