'use strict';

class MapBlock {
  constructor (middleTileCoords, settings = {}) {
    this.settings = this.mergeSettings({
      x: 0,
      y: 0,
      mapArrayPos: {
        x: 0,
        y: 0
      },
      color: this.randomColor()
    }, settings);

    this.tiles = [];
    this.middleTileCoords = middleTileCoords;

    this.map = new PIXI.Container();

    this.setPosition(this.settings);
    this.getTiles();
    this.populateMap();
  }

  randomColor () {
    return '0x' + Math.floor(Math.random()*16777215).toString(16);
  }

  mergeSettings (settings1, settings2) {
    return Object.assign({}, settings1, settings2);
  }

  getTiles () {
    if (!this.middleTileCoords) return;
    // TODO: make this more obvious, refactor mapAPI args
    const mapBlockHalfRow = Math.floor(constants.MAPBLOCK_ROW_LENGTH / 2);
    const tileOffsetX = this.settings.mapArrayPos.x - 1;
    const tileOffsetY = this.settings.mapArrayPos.y - 1;
    const offsetX = tileOffsetX * constants.MAPBLOCK_ROW_LENGTH - mapBlockHalfRow;
    const offsetY = tileOffsetY * constants.MAPBLOCK_ROW_LENGTH - mapBlockHalfRow;
    this.tiles = mapAPI.getBlockTiles(this.middleTileCoords, constants.MAPBLOCK_ROW_LENGTH, offsetX, offsetY);
    // console.log(this.tiles);
  }

  populateMap () {
    if (!this.map) {
      console.error('Cannot populate map before map container is created');
      return;
    }
    const graphics = new PIXI.Graphics();
    let offsetX = 0;
    let offsetY = 0;

    for (let i = 0; i < constants.MAPBLOCK_ROW_LENGTH; i++) {
      offsetY = i * constants.MAPBLOCK_TILE_SIZE;
      for (let j = 0; j < constants.MAPBLOCK_ROW_LENGTH; j++) {
        offsetX = j * constants.MAPBLOCK_TILE_SIZE;
        this.map.addChild(graphics);
        graphics.beginFill(this.settings.color);
        graphics.lineStyle(2, 0x000000);
        graphics.drawRect(offsetX, offsetY, constants.MAPBLOCK_TILE_SIZE, constants.MAPBLOCK_TILE_SIZE);

        if (this.tiles.length) {
          var style = new PIXI.TextStyle({
              fontFamily: 'Arial',
              fontSize: 20,
              fill: ['#ffffff'],
              stroke: '#000000',
              strokeThickness: 2
          });
          const tile = this.tiles[i * constants.MAPBLOCK_ROW_LENGTH + j];
          const basicText = new PIXI.Text(tile.coords, style);
          basicText.x = offsetX + 5;
          basicText.y = offsetY + 5;
          graphics.addChild(basicText);
        }
      }
    }
  }

  setPosition (position) {
    const mapSize = constants.MAPBLOCK_TILE_SIZE * constants.MAPBLOCK_ROW_LENGTH;
    this.map.x = position.x + this.settings.mapArrayPos.x * mapSize;
    this.map.y = position.y + this.settings.mapArrayPos.y * mapSize;
  }
}
