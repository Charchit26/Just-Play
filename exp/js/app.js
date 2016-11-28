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
});
