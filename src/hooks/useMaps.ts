import { useEffect, useState } from "react";
import { Map, MapWithCoordinate } from "../models/map";
import { Ubication } from "../models/place";

export function useMaps() {
  const [maps, setMaps] = useState<Map[]>([]);
  useEffect(() => {
    fetch('./data/maps.json')
      .then(response => response.json())
      .then(setMaps)
  }, [])

  const getMapsByUbications = (ubications: Ubication[]): MapWithCoordinate[] => {
    return ubications
      .map(({ page, coordinate }) => maps
        .filter(map => map.page === page && map.withCoordinates === !!coordinate)
        .map(map => ({ ...map, coordinate })))
      .reduce((maps, items) => [...maps, ...items ], [])
  }

  return { maps, getMapsByUbications };
}