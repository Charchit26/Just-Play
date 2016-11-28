var myAudioApp=angular.module('myAudioApp',[]);

myAudioApp.controller('mainCtrlr',function($scope){
   $scope.songsList= [{
                        id: "1",
						title: 'Kalimba',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Kalimba.mp3'
                     },
                     {
                        id: "1",
						title: 'Maid with the Flaxen Hair',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Maid with the Flaxen Hair.mp3'
                     },
                     {
                        id: "1",
						title: 'Sleep Away',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Sleep Away.mp3'
                     },
                     {
                        id: "1",
						title: 'Kalimba',
						artist: 'Mr. Scruff',
						url: 'C:/Users/Public/Music/Sample Music/Kalimba.mp3' 
                     }];
	$scope.playSound=function(input){
		console.log("You just clicked for url : "+input);
        $scope.audioURL=input;
    };
	
	var currentFile = "";
    $scope.playAudio = function(){
            // Check for audio element support.
            if (window.HTMLAudioElement) {
				console.log("SDfs")
                try {
					var audioURL='C:/Users/Public/Music/Sample Music/Kalimba.mp3';
                    var oAudio = document.getElementById('mainAudio');
                    var btn = document.getElementById('play'); 
                    //var audioURL = document.getElementById('audiofile'); 

                    //Skip loading if current file hasn't changed.
                    if (audioURL !== currentFile) {
                        oAudio.src = audioURL;
                        currentFile = audioURL;                       
                    }

                    // Tests the paused attribute and set state. 
                    if (oAudio.paused) {
                        oAudio.play();
                        btn.textContent = "Pause";
                    }
                    else {
                        oAudio.pause();
                        btn.textContent = "Play";
                    }
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
                }
            }
        }
		
	function rewindAudio() {
             // Check for audio element support.
            if (window.HTMLAudioElement) {
                try {
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime -= 30.0;
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
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime += 30.0;
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
                    var oAudio = document.getElementById('myaudio');
                    oAudio.currentTime = 0;
                }
                catch (e) {
                    // Fail silently but show in F12 developer tools console
                     if(window.console && console.error("Error:" + e));
               }
            }
        }
});
