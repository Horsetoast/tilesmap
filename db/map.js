const map = (mapSize) => {
  let tiles = [];
  let size = mapSize;
  let i = 0;

  for (let y = 0; y > size * (-1); y--) {
    for (let x = 0; x < size; x++) {
      tiles.push({
        id: i,
        coords: [x, y],
        type: 'ground'
      });
      i++;
    }
  }

  const findTileFromCoords = (coords) => {
    return tiles.find((tile) => {
      return (tile.coords[0] === coords[0] && tile.coords[1] === coords[1]);
    });
  }

  /* Magic mathematics no idea how to refactor this */
  const getTileWithOffset = (coords, offsetX, offsetY) => {
    let tileId = findTileFromCoords(coords).id;
    let rowFirstId = Math.abs(size * coords[1]);
    let rowLastId = rowFirstId + size;
    let firstTileId = null;
    firstTileId = (tileId + offsetX) % size + rowFirstId;
    if (firstTileId < rowFirstId) {
      firstTileId = rowLastId + firstTileId;
    }

    firstTileId = firstTileId + (offsetY * size);
    if (firstTileId < 0) {
      firstTileId = size * size + firstTileId;
    }
    firstTileId = firstTileId % (size * size);

    return firstTileId;
  }

  // const getBlockTiles = (coords, offset) => {
  //   const foundTiles = [];
  //   const middleTile = findTileFromCoords(coords);
  //
  //   if (!middleTile) {
  //     console.error('Tiles with requested coords ' + coords + ' does not exist.');
  //     return [];
  //   }
  //
  //   const firstTileId = getTileWithOffset(coords, (-1) * offset, (-1) * offset);
  //
  //   for (y = 0; y < (offset * 2) + 1; y++) {
  //     for (x = 0; x < (offset * 2) + 1; x++) {
  //       let nextTile = getTileWithOffset(tiles[firstTileId].coords, x, y);
  //       foundTiles.push(tiles[nextTile]);
  //     }
  //   }
  //
  //   return foundTiles;
  // }

  const getBlockTiles = (coords, rowLength, offsetX, offsetY) => {
    const foundTiles = [];
    const middleTile = findTileFromCoords(coords);

    if (!middleTile) {
      console.error('Tiles with requested coords ' + coords + ' does not exist.');
      return [];
    }

    // const defaultOffset = Math.floor(rowLength / 2) * (-1);
    const firstTileId = getTileWithOffset(coords, offsetX, offsetY);

    for (y = 0; y < rowLength; y++) {
      for (x = 0; x < rowLength; x++) {
        let nextTile = getTileWithOffset(tiles[firstTileId].coords, x, y);
        foundTiles.push(tiles[nextTile]);
      }
    }

    return foundTiles;
  }

  return {
    getBlockTiles,
    tiles
  }
}
