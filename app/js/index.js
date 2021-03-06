//Add Folder to playlist
//const remote = require('electron').remote;
//const ipcRenderer = require('electron').ipcRenderer;
const {
    dialog
} = require('electron').remote
var Set = require("collections/set");
var myApp = angular.module('myApp', []);
localStorage.removeItem("chosenDir");
var id3 = require('id3js');
var allowedExt = ['.mp3', '.mp4', '.mkv'];
var allowedExtSet = new Set(allowedExt);
var fs = require('fs');
var path = require('path');



myApp.directive('backImg', function() {
    return function(scope, element, attrs) {
        attrs.$observe('backImg', function(value) {
            if (value == '' || value == 'undefined') {
                value = "images/albumart.jpg";
            }
            element.css({
                'background-image': 'url(' + value + ')',
                'background-size': 'cover'
            });
        });
    };
});

myApp.controller('mainController', function($scope, $interval) {
    var mainAudio = document.getElementById('mainAudio');
    var currentPlayingFile = "";
    $scope.audioPlayingFlag = false;

    // [{
    // 	url:"a.mp3",
    // 	title:"channa mereya",
    // 	artist: "arijit"
    // }];
    var walk = function(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    }
                    else {
                        if (allowedExtSet.has(path.extname(file))) {
                            results.push(file);
                        }
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    };

    var getList = function() {
        var JSONArray = [];
        var chosenDir = localStorage.getItem("chosenDir");
        console.log(chosenDir);
        if (chosenDir != '' && chosenDir != undefined) {
            walk(chosenDir, function(err, results) {
                if (err) {
                    throw err;
                } else {
                  console.log("Dfsdf");
                    results.forEach(function(element, index, array) {
                        id3({
                            file: element,
                            type: id3.OPEN_LOCAL
                        }, function(err, tags) {
                            // tags now contains your ID3 tags
                            if (err) {
                                console.log('Error in getting ID3 tags' + err);
                            } else {
                                if (tags.v2.title == '' || tags.v2.title == undefined) {
                                    tags.v2.title = path.basename(element);
                                }
                                var JSONObj = {
                                    url: element,
                                    title: tags.v2.title,
                                    artist: tags.v2.artist,
                                    album: tags.v2.album,
                                    band: tags.v2.band,
                                    genre: tags.v2.genre,
                                    image: tags.v2.image
                                };
                                JSONArray.push(JSONObj);
                            }
                        }); //id3 fn ends here
                        if (index === array.length - 1) {
                          getListCallback(JSONArray);
                        };
                    });
                }
            });
        }
        var getListCallback = function(result){
          console.log(result);
          $scope.songsList=result;
          console.log($scope.songsList);
          //  $scope.songsList=Array.from(JSONArray);
          setTimeout(function(){
        $scope.$apply();
    }, 250);

        }
    }

    $scope.addFolder = function() {
        //console.log(dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']}));
        $scope.path = dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory', 'multiSelections']
        });
        if ($scope.path != '' && $scope.path != undefined) {
            localStorage.setItem("chosenDir", $scope.path);
            getList();
            //ipcRenderer.send('load-page', 'file://' + __dirname + '/index.html');
        }
    };
    $scope.loadAudio = function(audioToBeLoaded) {
        console.log("new song to be loaded: ", audioToBeLoaded);
        currentPlayingFile = audioToBeLoaded;
        $scope.currentSong = currentPlayingFile;
        $scope.currentIndex = getIndexOf($scope.songsList, audioToBeLoaded.url, 'url');
        mainAudio.src = currentPlayingFile.url;
        UpdateTheTime();
        $scope.playAudio();
    }

    $scope.playAudio = function() {
        if (window.HTMLAudioElement) {
            try {
                if (currentPlayingFile == '' || currentPlayingFile == 'undefined') {
                    $scope.loadAudio($scope.songsList[0]);
                } //load some audio if there is nothing to play
                //Skip loading if current file hasn't changed.
                mainAudio.play();
                $scope.audioPlayingFlag = true;
            } catch (e) {
                // Fail silently but show in F12 developer tools console
                if (window.console && console.error("Error:" + e));
            }
        }
    }

    $scope.pauseAudio = function() {
        mainAudio.pause();
        $scope.audioPlayingFlag = false;
    }


    $scope.nextAudio = function() {
        mainAudio.pause();
        console.log($scope.currentIndex);
        if ( ($scope.currentIndex+1)!=undefined && $scope.currentIndex+1 < $scope.songsList.length) {
            $scope.loadAudio($scope.songsList[$scope.currentIndex + 1]);
        } else {
            //loop play list
            console.log("Play list finished, Starting from the beginning");
            $scope.loadAudio($scope.songsList[0]);
        }
    };

    $scope.prevAudio = function() {
        mainAudio.pause();
        console.log($scope.currentIndex);
        if ( ($scope.currentIndex-1)!=undefined && ($scope.currentIndex-1)>0) {
            $scope.loadAudio($scope.songsList[$scope.currentIndex - 1]);
        } else {
            //loop play list
            console.log("Play list finished, Starting from the beginning");
            $scope.loadAudio($scope.songsList[0]);
        }
    };

    // Fired when an audio is finished playing
    mainAudio.addEventListener('ended', function() {
        console.log("Audio finished playing, switching to next one in the list");
        mainAudio.pause();
        if ($scope.currentIndex+1 < $scope.songsList.length) {
            $scope.loadAudio($scope.songsList[$scope.currentIndex + 1]);
        } else {
            //loop play list
            console.log("Play list finished, Starting from the beginning");
            $scope.loadAudio($scope.songsList[0]);
        }
    });

    mainAudio.addEventListener('timeupdate', UpdateTheTime, false);
    mainAudio.addEventListener('durationchange', UpdateTheTime, false);
    //volume.value = mainAudio.volume;

    // fires when page loads, it sets the min and max range of the video

    function SetSeekBar() {
        audioSeekbar.min = 0;
        audioSeekbar.max = mainAudio.duration;
    }

    // fires when seekbar is changed

    function UpdateTheTime() {
        var sec = mainAudio.currentTime;
        var h = Math.floor(sec / 3600);
        sec = sec % 3600;
        var min = Math.floor(sec / 60);
        sec = Math.floor(sec % 60);
        if (sec.toString().length < 2) sec = "0" + sec;
        if (min.toString().length < 2) min = "0" + min;
        document.getElementById('lblTime').innerHTML = h + ":" + min + ":" + sec;
        var sec2 = mainAudio.duration;
        var h2 = Math.floor(sec2 / 3600);
        sec2 = sec2 % 3600;
        var min2 = Math.floor(sec2 / 60);
        sec2 = Math.floor(sec2 % 60);
        if (sec2.toString().length < 2) sec2 = "0" + sec2;
        if (min2.toString().length < 2) min2 = "0" + min2;
        document.getElementById('lblTimeLength').innerHTML = h2 + ":" + min2 + ":" + sec2;
        audioSeekbar.min = mainAudio.startTime;
        audioSeekbar.max = mainAudio.duration;
        audioSeekbar.value = mainAudio.currentTime;
    }

    function getIndexOf(arr, val, prop) {
        var l = arr.length,
            k = 0;
        for (k = 0; k < l; k = k + 1) {
            if (arr[k][prop] === val) {
                return k;
            }
        }
        return false;
    }

    $scope.shuffle = function() {
        var i = $scope.songsList.length;
        if (i == 0) return false;
        while (--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempi = $scope.songsList[i];
            var tempj = $scope.songsList[j];
            $scope.songsList[i] = tempj;
            $scope.songsList[j] = tempi;
        }
    }
});

//vanilla functions
function ChangeTheTime() {
    mainAudio.currentTime = audioSeekbar.value;
}

function ChangeVolume() {
    var myVol = volume.value;
    mainAudio.volume = myVol;
    if (myVol == 0) {
        mainAudio.muted = true;
    } else {
        mainAudio.muted = false;
    }
}
