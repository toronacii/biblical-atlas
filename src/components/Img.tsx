import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapWithCoordinate } from '../models/map';

declare type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & MapWithCoordinate;

export const Img: React.FC<ImgProps> = ({ rowSizePercent, columnSizePercent, withCoordinates, rows, columns, coordinate, ...props }) => {
  const [{ width, height }, setDimension] = useState({ width: 0, height: 0 })
  const imgRef = useRef<HTMLImageElement>(null)
  const handleResizeCover = useCallback(() => setDimension({
    width: imgRef.current?.clientWidth || 0,
    height: imgRef.current?.clientHeight || 0
  }), [imgRef])

  useEffect(() => {
    window.addEventListener('resize', handleResizeCover)
    return () => window.removeEventListener('resize', handleResizeCover)
  }, [handleResizeCover])

  let grid;

  if (withCoordinates && width && height) {
    const rowSize = (rowSizePercent || 0) * height / 100;
    const columnSize = (columnSizePercent || 0) * width / 100;
    const [, column, row] = /(\w)(.*)/.exec(coordinate) || [];
    const activeRow = +row;
    const activeColumn = column.charCodeAt(0) - 64;
    const activeCell = Math.ceil((columns * (activeRow - 1)) + activeColumn);

    grid = (
      <Grid width={width} height={height}>
        <InternalGridContainer width={columnSize * columns} height={rowSize * rows}>
          {Array(rows * columns).fill(null).map((_, i) => (
            <Cell key={i}
              width={columnSize}
              height={rowSize}
              isActive={activeCell === i + 1} />))}
        </InternalGridContainer>
      </Grid >)
  }


  return (
    <Container>
      <img alt=""
        ref={imgRef}
        {...props}
        onLoad={handleResizeCover} />
      {grid}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`;

const Grid = styled.div<Box>(
  props => ({
    position: 'absolute',
    top: 0,
    opacity: '.4',
    width: props.width,
    height: props.height,
    overflow: 'hidden',
    boxSizing: 'border-box'
  }))

const InternalGridContainer = styled.div<Box>(
  ({ width, height }) => ({
    width,
    height,
    display: 'flex', 
    flexWrap: 'wrap'
  })
);

const Cell = styled.div<Box & { isActive: boolean }>(
  ({ width, height, isActive }) => ({
    width,
    height,
    backgroundColor: isActive ? 'transparent' : '#000'
  })
)

declare type Box = {width: number, height: number};