var myAudioApp=angular.module('myAudioApp',[]);

myAudioApp.controller('mainCtrlr',function($scope,$http){
	$http.get('http://127.0.0.1:6656/index.json').
        then(function(response) {
			$scope.songsList=response.data;
        });
  
  /*$scope.sosList=[{
						title: 'Ekla Cholo Re',
						artist: 'Mr. Scruff',
						url: "http://127.0.0.1:6656/Ekla%20Cholo%20Re%20-%20Tamilmini.net.mp3",
						length: '2:03'
                     },
                     {
						title: 'Maid with the Flaxen Hair',
						artist: 'Mr. Scruff',
						url: 'http://127.0.0.1:6656/twenty%20one%20pilots-%20Heathens%20(from%20Suicide%20Squad-%20The%20Album)%20%5BOFFICIAL%20VIDEO%5D.mp4',
						length: '3:28'
                     },
                     {
						title: 'Sleep Away',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Sleep Away.mp3',
						length: '2:13'
                     },
                     {
						title: 'Kalimba',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Kalimba.mp3',
						length: '2:55'
                     }]
	*/
	var mainAudio = document.getElementById('mainAudio');
	$scope.audioPlayingFlag=false;
	// $scope.seekbar = document.getElementById("audioSeekBar");
	$scope.currentSong='';
	
	$scope.loadAudio=function(input){
		console.log("New song loaded : "+input.url);
		$scope.currentSong=input;
        $scope.audioURL=input.url;
		$scope.currentIndex = getIndexOf($scope.songsList, input.url, 'url');
		UpdateTheTime();
		$scope.playAudio();
    };
	
	var currentFile = "";
    $scope.playAudio = function(){
            // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
					if($scope.audioURL=='' || angular.isUndefined($scope.audioURL)){
						$scope.loadAudio($scope.songsList[0]);
					}
					//Skip loading if current file hasn't changed.
                    if ($scope.audioURL !== currentFile) {
                        mainAudio.src = $scope.audioURL;
                        currentFile = $scope.audioURL;                       
                    }
                    
					mainAudio.play();
					$scope.audioPlayingFlag=true;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }
		
	$scope.pauseAudio = function(){
		mainAudio.pause();
		$scope.audioPlayingFlag=false;
	};
		
	$scope.prevAudio = function(){
		mainAudio.pause();
		if($scope.currentIndex > 0){
			$scope.loadAudio($scope.songsList[$scope.currentIndex-1]);
		}
		else{
			//reload the current track
			$scope.loadAudio($scope.songsList[0]);
		}
	};
	
	$scope.nextAudio = function(){
		mainAudio.pause();
		if($scope.currentIndex < $scope.songsList.length){
			$scope.loadAudio($scope.songsList[$scope.currentIndex+1]);
		}
		else{
			//loop play list
			console.log("Play list finished, Starting from the beginning");
			$scope.loadAudio($scope.songsList[0]);
		}
	};
	
		// Fired when an audio is finished playing
	mainAudio.addEventListener('ended',function(){
		console.log("Audio finished playing, switching to next one in the list");
		mainAudio.pause();
		if($scope.currentIndex < $scope.songsList.length){
			$scope.loadAudio($scope.songsList[$scope.currentIndex+1]);
		}
		else{
			//loop play list
			console.log("Play list finished, Starting from the beginning");
			$scope.loadAudio($scope.songsList[0]);
		}
    });
	
	mainAudio.addEventListener('timeupdate', UpdateTheTime, false);
	mainAudio.addEventListener('durationchange', SetSeekBar, false);
	volume.value = mainAudio.volume;
	
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
			
			// Rewinds the audio file by 30 seconds.
	function rewindAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var mainAudio = document.getElementById('myaudio');
                    mainAudio.currentTime -= 30.0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Fast forwards the audio file by 30 seconds.
    function forwardAudio() {

             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var mainAudio = document.getElementById('myaudio');
                    mainAudio.currentTime += 30.0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }

             // Restart the audio file to the beginning.
    function restartAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var mainAudio = document.getElementById('myaudio');
                    mainAudio.currentTime = 0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
               }
            }
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
		if ( i == 0 ) return false;
		while ( --i ) {
			var j = Math.floor( Math.random() * ( i + 1 ) );
			var tempi = $scope.songsList[i];
			var tempj = $scope.songsList[j];
			$scope.songsList[i] = tempj;
			$scope.songsList[j] = tempi;
		}
	}
});

function ChangeTheTime() {
		mainAudio.currentTime = audioSeekbar.value;
	}
 function ChangeVolume() {
	var myVol = volume.value;
	mainAudio.volume = myVol;
	if (myVol == 0) {
	   mainAudio.muted = true;
	} 
	else {
	   mainAudio.muted = false;
	}
}

$(document).ready(function() {
    $('#cSongImg').click(function() {
        $("#fileInput").toggleClass('open');
		$("#fileInput").toggleClass('hidden');
    });
	$('#fileInput').keypress(function(e) {
		if(e.which == 13) {
			alert($('#fileInput').val());
			$("#cSongImg").click();
		}
	});
});