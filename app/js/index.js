var myApp=angular.module('myApp',[]);

myApp.controller('mainController',function($scope){
	var mainAudio = document.getElementById('mainAudio');
	var currentPlayingFile = "";
	$scope.audioPlayingFlag=false;
	$scope.dummyList=[{
		url:"a.mp3",
		title:"channa mereya",
		artist: "arijit"
	}];
	$scope.loadAudio=function(audioToBeLoaded){
		console.log("new song to be loaded: ",audioToBeLoaded);
		currentPlayingFile=audioToBeLoaded;
		//$scope.currentIndex = getIndexOf($scope.songsList, input.url, 'url');
		UpdateTheTime();
		$scope.playAudio();
	}
	
	$scope.playAudio=function(){
		if (window.HTMLAudioElement) {
            try {
				if(currentPlayingFile=='' || currentPlayingFile=='undefined'){
					$scope.loadAudio($scope.dummyList[0]);
				}//load some audio if there is nothing to play
				//Skip loading if current file hasn't changed.
                mainAudio.src = currentPlayingFile.url;                      
				mainAudio.play();
				$scope.audioPlayingFlag=true;
            }
            catch (e) {
                // Fail silently but show in F12 developer tools console
                 if(window.console && console.error("Error:" + e));
            }
		}
	}
	
	$scope.pauseAudio=function(){
		mainAudio.pause();
		$scope.audioPlayingFlag=false;
	}
	
	mainAudio.addEventListener('timeupdate', UpdateTheTime, false);
	mainAudio.addEventListener('durationchange', SetSeekBar, false);
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
	} 
	else {
	   mainAudio.muted = false;
	}
}