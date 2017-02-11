'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var mainWindow = null;
var firstWindow=null;
const ipc = require('electron').ipcMain;
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 450, height: 450, resizable: false});
	mainWindow.loadURL('file://' + __dirname + '/app/getDir.html');
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
ipc.on('load-page', (event, arg) => {
    mainWindow.loadURL(arg);
});