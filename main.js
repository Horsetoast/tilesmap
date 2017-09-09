'use strict';

const mapAPI = map(constants.MAP_SIZE);
var game = new Game(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(game.app.view);
