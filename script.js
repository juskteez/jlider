$(document).ready(function() {

		// Video
		var jLi_video = $(".videoPlaying").get(0);

		// Buttons
		var playButton = $("#play-pause").get(0);
		var muteButton = $("#mute").get(0);
		var fullScreenButton = $("#full-screen").get(0);

		// Sliders
		var seekBar = $("#seek-bar").get(0);
		var volumeBar = $("#volume-bar").get(0);

		// Event listener for the play/pause button
		playButton.addEventListener("click", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  if (jLi_video.paused == true) {
		    // Play the video
		    jLi_video.play();

		    // Update the button text to 'Pause'
		    playButton.innerHTML = "Pause";
		  } else {
		    // Pause the video
		    jLi_video.pause();

		    // Update the button text to 'Play'
		    playButton.innerHTML = "Play";
		  }
		});

		// Event listener for the mute button
		muteButton.addEventListener("click", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  if (jLi_video.muted == false) {
		    // Mute the video
		    jLi_video.muted = true;

		    // Update the button text
		    muteButton.innerHTML = "Unmute";
		  } else {
		    // Unmute the video
		    jLi_video.muted = false;

		    // Update the button text
		    muteButton.innerHTML = "Mute";
		  }
		});

		// Event listener for the full-screen button
		fullScreenButton.addEventListener("click", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  if (jLi_video.requestFullscreen) {
		    jLi_video.requestFullscreen();
		  } else if (jLi_video.mozRequestFullScreen) {
		    jLi_video.mozRequestFullScreen(); // Firefox
		  } else if (jLi_video.webkitRequestFullscreen) {
		    jLi_video.webkitRequestFullscreen(); // Chrome and Safari
		  }
		});

		// Event listener for the seek bar
		seekBar.addEventListener("change", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  // Calculate the new time
		  var time = jLi_video.duration * (seekBar.value / 100);

		  // Update the video time
		  jLi_video.currentTime = time;
		});

		// Update the seek bar as the video plays
		jLi_video.addEventListener("timeupdate", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  // Calculate the slider value
		  var value = (100 / jLi_video.duration) * jLi_video.currentTime;

		  // Update the slider value
		  seekBar.value = value;
		});

		// Pause the video when the slider handle is being dragged
		seekBar.addEventListener("mousedown", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  jLi_video.pause();
		});

		// Play the video when the slider handle is dropped
		seekBar.addEventListener("mouseup", function() {
			var jLi_video = $(".videoPlaying").get(0);
		  jLi_video.play();
		});

		// Event listener for the volume bar
		volumeBar.addEventListener("change", function() {
			var jLi_video = $(".videoPlaying").get(0);
			// Update the video volume
			jLi_video.volume = volumeBar.value;
		});

	$('#play1').click(function() {
		$('.video').removeClass('videoPlaying');
		$('#video1').addClass('videoPlaying');
	});
	$('#play2').click(function() {
		$('.video').removeClass('videoPlaying');
		$('#video2').addClass('videoPlaying');
	});
});