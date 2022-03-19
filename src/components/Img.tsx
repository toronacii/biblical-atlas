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
    const [column, row] = coordinate.split('');
    const activeRow = +row;
    const activeColumn = column.charCodeAt(0) - 64;

    grid = (
      <Grid width={width} height={height}>
        {Array(rows).fill(null).map((_, i) => (
          (i + 1 !== activeRow) && <Row key={i} width={width} height={rowSize} rowNumber={i + 1} />
        ))}
        {Array(columns).fill(null).map((_, i) => (
          (i + 1 !== activeColumn) && <Column key={i} width={columnSize} height={height} columnNumber={i + 1} />
        ))}
      </Grid>)
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

const Grid = styled.div<{ width: number, height: number }>(
  props => ({
    position: 'absolute',
    top: 0,
    opacity: '.7',
    // backgroundColor: '#aaa',
    width: props.width,
    height: props.height,
    overflow: 'hidden',
    boxSizing: 'border-box'
  }))

const Row = styled(Grid)<{ rowNumber: number }>(
  ({ rowNumber, height }) => ({
    top: (rowNumber - 1) * height,
    backgroundColor: '#000'
  })
)

const Column = styled(Grid)<{ columnNumber: number }>(
  ({ columnNumber, width }) => ({
    left: (columnNumber - 1) * width,
    backgroundColor: '#000'
  })
)
