import React, { useState } from "react";
import { TextField } from "@mui/material";
import "./LocationSearchBar.css";

interface LocationSearchBarProps {
  setLocationHandler: (name: string) => void;
}

export const LocationSearchBar = (props: LocationSearchBarProps) => {
  const [currentSearch, setCurrentSearch] = useState("");

  const handleEnterPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && currentSearch !== "") {
      props.setLocationHandler(currentSearch);
      setCurrentSearch("");
    }
  };

  return (
    <div className="LocationSearchBarContainer">
      <TextField
        id="LocationSearchBar"
        label="Location"
        type={"search"}
        value={currentSearch}
        onChange={(event) => setCurrentSearch(event.target.value)}
        onKeyDown={handleEnterPress}
      />
    </div>
  );
};
