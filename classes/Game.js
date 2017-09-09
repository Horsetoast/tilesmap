'use strict';

class Game {

  constructor () {
    this.app = null;
    this.mapContainer = null;
    this.isDragged = false;
    this.dragStart = {};
    this.dragOffset = {};
    this.startPosition = {};
    this.lastPosition = {};

    this.createApp();
    this.initEvents();
    this.createMapContainer();
  }

  createApp () {
    this.app = new PIXI.Application(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    this.app.stage.interactive = true;
  }

  initEvents () {
    if (!this.app) {
      console.error('Events cannot be initialized before app is created');
      return;
    }
    this.dragStartHandler = this.dragStartHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.dragMoveHandler = this.dragMoveHandler.bind(this);
    this.updateLastPosition = this.updateLastPosition.bind(this);

    this.app.stage.on('pointerdown', this.dragStartHandler);
    this.app.stage.on('pointerup', this.dragEndHandler);
    this.app.stage.on('pointerout', this.dragEndHandler);
    this.app.stage.on('pointermove', this.dragMoveHandler);
  }

  createMapContainer () {
    this.mapContainer = new MapContainer();
    this.app.stage.addChild(this.mapContainer.container);
  }

  updateLastPosition () {
    this.lastPosition.x = this.mapContainer.getAnchorMap().x;
    this.lastPosition.y = this.mapContainer.getAnchorMap().y;
    if (this.isDragged) {
      setTimeout(this.updateLastPosition, 100);
    }
  }

  dragStartHandler (event) {
    this.isDragged = true;
    this.dragStart.x = event.data.global.x;
    this.dragStart.y = event.data.global.y;
    this.startPosition.x = this.mapContainer.getAnchorMap().x;
    this.startPosition.y = this.mapContainer.getAnchorMap().y;
    this.updateLastPosition();
  }

  dragEndHandler (event) {
    if (this.isDragged === false) return;
    this.isDragged = false;

    let start = null;
    let duration = 1000;
    let endVelocity = {
      x: this.mapContainer.getAnchorMap().x - this.lastPosition.x,
      y: this.mapContainer.getAnchorMap().y - this.lastPosition.y
    };

    const kineticMove = (timestamp) => {
      if (!start) start = window.performance.now();
      var progress = window.performance.now() - start;

      let delta = 1 - (progress / duration);

      this.mapContainer.updateMapBlocks({
        x: this.mapContainer.getAnchorMap().x + (endVelocity.x / 10) * delta,
        y: this.mapContainer.getAnchorMap().y + (endVelocity.y / 10) * delta
      });

      if (progress < duration && this.isDragged === false) {
        window.requestAnimationFrame(kineticMove);
      }
    }

    if (Math.abs(endVelocity.x) > 30 || Math.abs(endVelocity.y) > 30) {
      kineticMove();
    }
  }

  dragMoveHandler (event) {
    if(this.isDragged) {
      this.dragOffset.x = event.data.global.x;
      this.dragOffset.y = event.data.global.y;
      this.mapContainer.updateMapBlocks({
        x: this.startPosition.x + (this.dragOffset.x - this.dragStart.x),
        y: this.startPosition.y + (this.dragOffset.y - this.dragStart.y)
      });
    }
  }
}
