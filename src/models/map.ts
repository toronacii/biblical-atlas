import { Ubication } from "./place";

export interface Map {
    page: string,
    withCoordinates: boolean,
    filename: string,
    rows: number,
    columns: number,
    rowSizePercent: number,
    columnSizePercent: number
}

export type MapWithCoordinate = Map & Pick<Ubication, 'coordinate'>;