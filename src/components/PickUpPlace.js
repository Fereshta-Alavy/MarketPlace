import React, { useState } from "react";
import {
  Form,
  Button,
  Input,
  Notification,
  Radio,
  Progress
} from "element-react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

export default function PickUpPlace({ setCoordinates, setAddress, address }) {
  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  return (
    <div className="canvas">
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places...",
                className: "location-search-input"
              })}
            />

            <div className="autoComplete_dropdown_container">
              {loading ? <div>...loading</div> : null}

              {suggestions.map(suggestion => {
                const style = suggestion.active
                  ? { backgroundColor: "#41b6e6", cursor: "pointer" }
                  : { backgroundColor: "#fff", cursor: "pointer" };
                return (
                  <div
                    className="input-suggestions"
                    {...getSuggestionItemProps(suggestion, { style })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}
