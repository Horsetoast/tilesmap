'use strict';

class MapContainer {
  constructor (tiles, settings = {}) {
    this.settings = this.mergeSettings({}, settings);

    this.mapBlocksArr = [];
    this.container = new PIXI.Container();
    this.zoomFactor = 0.75;
    this.middleTileCoords = [0, -50];

    // TODO Remove later
    this.middleGraphicsPointer = new PIXI.Graphics();

    this.zoomHandler = this.zoomHandler.bind(this);
    document.addEventListener('mousewheel', this.zoomHandler, false);

    this.createMapBlocks();
    this.initContainerPosition();
    this.scaleContainer();

    // setTimeout(this.shiftMapBlocks.bind(this), 5000);
    document.addEventListener('keydown', this.getViewedMapBlock.bind(this), false);
  }

  mergeSettings (settings1, settings2) {
    return Object.assign({}, settings1, settings2);
  }

  shiftMapBlocks (x, y) {

    const tileSize = constants.MAPBLOCK_TILE_SIZE;
    const rowLength = constants.MAPBLOCK_ROW_LENGTH;
    const mapSize = constants.MAPBLOCK_TILE_SIZE * constants.MAPBLOCK_ROW_LENGTH;

    let newMapBlocksArr = [];
    for (let row = 0; row < 3; row++) {
      let mapsRow = [];
      for (let col = 0; col < 3; col++) {
        const newMap = new MapBlock(null, {
          x: this.mapBlocksArr[row][0].map.x + 600,
          y: this.mapBlocksArr[0][0].map.y,
          offsetX: col,
          offsetY: row
        });
        mapsRow.push(newMap);
      }
      newMapBlocksArr.push(mapsRow);
    }
    this.mapBlocksArr = newMapBlocksArr;
    this.renderMapBlocks();
    console.log('shifted', this.mapBlocksArr);
  }

  renderMapBlocks () {
    this.container.removeChildren();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.container.addChild(this.mapBlocksArr[row][col].map);
      }
    }
  }

  createMapBlocks () {
    const tileSize = constants.MAPBLOCK_TILE_SIZE;
    const rowLength = constants.MAPBLOCK_ROW_LENGTH;
    const mapSize = constants.MAPBLOCK_TILE_SIZE * constants.MAPBLOCK_ROW_LENGTH;

    for (let row = 0; row < 3; row++) {
      let mapsRow = [];
      for (let col = 0; col < 3; col++) {
        const newMap = new MapBlock(this.middleTileCoords, {
          mapArrayPos: {
            x: col,
            y: row
          }
        });
        mapsRow.push(newMap);
      }
      this.mapBlocksArr.push(mapsRow);
    }
    this.renderMapBlocks();
  }

  updateMapBlocks (position) {
    for (let i = 0; i < this.mapBlocksArr.length; i++) {
      for (let j = 0; j < this.mapBlocksArr[i].length; j++) {
        this.mapBlocksArr[i][j].setPosition(position);
      }
    }
    this.getViewedMapBlock();
  }

  getViewedMapBlock () {
    let closestMap = null;
    let smallestDiff = null;
    const containerMiddle = {
      x: this.container.width / 2 / this.zoomFactor,
      y: this.container.height / 2 / this.zoomFactor
    };
    for (let i = 0; i < this.mapBlocksArr.length; i++) {
      for (let j = 0; j < this.mapBlocksArr[i].length; j++) {
        const map = this.mapBlocksArr[i][j].map;
        const mapMiddle = {
          x: map.x + map.width / 2,
          y: map.y + map.height / 2
        }
        const diff = Math.abs(containerMiddle.x - mapMiddle.x) + Math.abs(containerMiddle.y - mapMiddle.y);
        if (diff < smallestDiff || smallestDiff === null) {
          smallestDiff = diff;
          closestMap = map;
        }
      }
    }
    const graphics = this.middleGraphicsPointer;
    graphics.clear();
    graphics.beginFill(0x00FF00);
    graphics.drawCircle(closestMap.x + closestMap.width / 2, closestMap.y + closestMap.height / 2, 10, 10);
    this.container.addChild(graphics);
  }

  getAnchorMap () {
    return this.mapBlocksArr[0][0].map;
  }

  scaleContainer () {
    this.container.scale.x = this.zoomFactor;
    this.container.scale.y = this.zoomFactor;
  }

  initContainerPosition () {
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    this.container.x = (constants.CANVAS_WIDTH / 2);
    this.container.y = (constants.CANVAS_HEIGHT / 2);
  }

  zoomHandler (event) {
    const zoomDelta = event.deltaY < 0 ? 0.2 : -0.2;
    this.zoomFactor += zoomDelta;
    if (this.zoomFactor > 1) {
      this.zoomFactor = 1;
    } else if (this.zoomFactor < 0.5) {
      this.zoomFactor = 0.5;
    }

    this.scaleContainer();
  }
}
