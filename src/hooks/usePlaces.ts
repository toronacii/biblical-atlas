import { useState, useEffect } from "react";
import { Place } from "../models/place";

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  useEffect(() => {
    fetch('./data/places.json')
      .then(response => response.json())
      .then(setPlaces)
  }, [])

  return places;
}