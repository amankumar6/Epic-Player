songList.sort(function (a, b) { return (a.name > b.name ? 1 : -1); });
var loader = document.getElementById("loading"), headericon = document.querySelector('.header-icon'), searchinput = document.getElementById("search_input"), progress = document.querySelector('.progress_bar'), currentTime = document.querySelector('.current_time'), duration = document.querySelector('.total_duration'), progress_div = document.querySelector('.progress_div'), music = document.querySelector('audio'), musiccontainer = document.querySelector('.music_container'), prev = document.getElementById('prev'), play = document.getElementById('play'), next = document.getElementById('next'), volume = document.getElementById('volume'), title = document.getElementById('title'), artist = document.getElementById('artist'), img = document.querySelector('.music_img_change'), musiclist = document.querySelector('.music_list'), noresult = document.querySelector('.no_result'), shuffle = document.getElementById('shuffle'), repeat = document.getElementById('repeat'), compatibility = document.querySelector('.compatibility'), canvas = document.getElementById("cnv1");
var context, audioctx, analyser, oscillator, freqArr, barHeight, source, WIDTH, HEIGHT, bigBars = 0, INTERVAL = 128, SAMPLES = 2048, r = 0, g = 0, b = 255, x = 0, isPlay = false, ismute = false, songIndex = 0, volumeSlider = document.querySelector('.volume_slider'), tempslidervalue = volumeSlider.value, minValue = 1, lastRandom = 0, repeatCheck = false, shuffleCheck = false;
function displayLoader() {
    loader.style.display = 'none';
    loadSong(songList[songIndex]);
}
if (screen.width < 480 && screen.height < 480) {
    musiclist.classList.add('d-none');
    compatibility.classList.replace('d-none', 'd-flex');
    canvas.classList.add('d-none');
    musiccontainer.classList.replace('d-flex', 'd-none');
    compatibility.innerHTML = "<p>Sorry Your Device is not Epic to use Epic Player.</p>";
}
if (screen.width < 480 && screen.height >= 480) {
    musiclist.classList.add('d-none');
    compatibility.classList.replace('d-none', 'd-flex');
    canvas.classList.add('d-none');
    musiccontainer.classList.replace('d-flex', 'd-none');
    compatibility.innerHTML = "\n    <p>\n        <img src=\"src/screen_rotation-white-18dp.svg\" alt=\"rotate\" class=\"rotate_device\"> Rotate you device and reload the page to use Epic Player.\n    </p>\n";
}
if (screen.width >= 480 || screen.height >= 480) {
    window.addEventListener('keydown', function (e) {
        (e.keyCode == 32 && e.target == document.body) ? e.preventDefault() : null;
    });
    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            event.stopPropagation();
            isPlay ? pausemusic() : playmusic(songIndex);
        }
        e.keyCode == 39 ? music.currentTime += 5 : e.keyCode == 37 ? music.currentTime -= 5 : e.keyCode == 77 ? MforMute() : '';
    };
}
musiclist.innerHTML = (songList.map(function (song, songIndex) {
    return "\n    <li class=\"music_list_item\" songIndex=\"" + songIndex + "\">\n        <h3 id=\"song_index\" class=\"col-1 offset-md-1\">" + (songIndex + 1) + ".</h3>\n        <div class=\"img_container_list col-1\">\n            <img src=\"./src/image/" + song.album + ".jpg\">\n        </div>\n        <h1 class=\"col-3 offset-1 offset-md-0\" id=\"title_list\">" + song.name + "</h1>\n        <h2 class=\"col-4 col-md-3\" id=\"artist_list\">" + song.artist + "</h2>\n        <h3 class=\"col-2 text-truncate\" title=\"" + song.album + "\">" + song.album + "</h3>\n    </li>\n";
}).join(""));
var musiclistitem = document.querySelectorAll(".music_list_item");
function search() {
    var txtValue, count = 0, search_result, filter = searchinput.value.toUpperCase();
    musiclistitem.forEach(function (element) {
        search_result = element.getElementsByTagName("h1")[0];
        txtValue = (element.getElementsByTagName("h1")[0]).innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            element.style.display = "";
            musiclist.style.display = "block";
            noresult.style.display = "none";
        }
        else {
            search_result = element.getElementsByTagName("h2")[0];
            txtValue = search_result.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                element.style.display = "";
                musiclist.style.display = "block";
                noresult.style.display = "none";
            }
            else {
                element.style.display = "none";
                count++;
                if (count == musiclistitem.length) {
                    musiclist.style.display = "none";
                    var noResultContent = document.querySelector('.no_result_txt');
                    noResultContent.innerText = '"' + searchinput.value + "\"";
                    noresult.style.display = "grid";
                }
            }
        }
    });
    event.stopPropagation();
}
function remove_all_active_list() {
    musiclistitem.forEach(function (element) { return element.classList.remove("active_music"); });
}
function repeatEvent() {
    if (repeatCheck) {
        repeat.classList.replace('fa-repeat-1-alt', 'fa-repeat');
        repeat.classList.remove('active_icon');
    }
    else {
        repeat.classList.replace('fa-repeat', 'fa-repeat-1-alt');
        repeat.classList.add('active_icon');
    }
    repeatCheck = !repeatCheck;
}
function shuffleEvent() {
    if (shuffleCheck) {
        shuffle.classList.remove('active_icon');
        shuffle.title = "Shuffle: On";
    }
    else {
        shuffle.classList.add('active_icon');
        shuffle.title = "Shuffle: Off";
    }
    shuffleCheck = !shuffleCheck;
}
function shuffleSong() {
    songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    while (lastRandom === songIndex) {
        songIndex = Math.floor(Math.random() * ((songList.length - 1) - minValue + 1)) + minValue;
    }
    loadSong(songList[songIndex]);
    playmusic(songIndex);
    musiclistitem[songIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
    minValue = 0;
    lastRandom = songIndex;
}
function playmusic(e) {
    remove_all_active_list();
    audioctx.resume();
    musiclistitem[e].classList.add("active_music");
    isPlay = true;
    music.play();
    play.classList.replace('fa-play', 'fa-pause');
    play.title = "Pause";
}
function pausemusic() {
    isPlay = false;
    music.pause();
    play.classList.replace('fa-pause', 'fa-play');
    play.title = "Play";
}
function loadSong(songList) {
    title.textContent = songList.name;
    artist.textContent = songList.artist;
    artist.title = songList.artist;
    music.src = "src/music/" + songList.name + ".mp3";
    // music.src = songList.src;
    img.src = "src/image/" + songList.album + ".jpg";
    music.volume = (volumeSlider.value) / 100;
    musiclistitem[songIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
}
function prevSong() {
    if (shuffleCheck) {
        shuffleSong();
    }
    else {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
}
function nextSong() {
    if (shuffleCheck) {
        shuffleSong();
    }
    else {
        songIndex = (songIndex + 1) % songList.length;
        remove_all_active_list();
        musiclistitem[songIndex].classList.add("active_music");
        loadSong(songList[songIndex]);
        playmusic(songIndex);
    }
}
function timeUpdate() {
    var position = music.currentTime / music.duration;
    progress.style.width = position * 100 + "%";
    convertTime(Math.round(music.currentTime));
    (music.ended && !repeatCheck && !shuffleCheck) ? nextSong() : (music.ended && !repeatCheck && shuffleCheck) ? shuffleSong() : (music.ended && repeatCheck && !shuffleCheck) ? playmusic(songIndex) : (music.ended && repeatCheck && shuffleCheck) ? playmusic(songIndex) : '';
}
function convertTime(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent = min + ":" + sec;
    totalTime(Math.round(music.duration));
}
function totalTime(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = seconds % 60;
    sec = sec < 10 ? "0" + sec : sec;
    music.duration ? duration.textContent = min + ":" + sec : '';
}
function progressBar(e) {
    var move_progress = (e.offsetX / e.srcElement.clientWidth) * music.duration;
    music.currentTime = move_progress;
}
function volumeCheck() {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
    (music.volume > 0.45) ? volumeup() : (music.volume <= 0.45 && music.volume > 0) ? volumelow() : volumedown();
}
function volumeChange() {
    music.volume = (volumeSlider.value) / 100;
    tempslidervalue = (volumeSlider.value) / 100;
    volumeCheck();
}
function MforMute() {
    if (music.volume != 0) {
        volumedown();
        volumeCheck();
    }
    else if (music.volume == 0) {
        volumeup();
        volumeCheck();
    }
}
function volumedown() {
    ismute = true;
    volume.classList.replace('fa-volume-down', 'fa-volume-mute');
    volume.classList.replace('fa-volume-up', 'fa-volume-mute');
    music.volume = 0;
    volumeSlider.value = 0;
    volume.title = "Unmute";
}
function volumelow() {
    volume.classList.replace('fa-volume-mute', 'fa-volume-down');
    volume.classList.replace('fa-volume-up', 'fa-volume-down');
    volume.title = "Mute";
}
function volumeup() {
    ismute = false;
    volume.classList.replace('fa-volume-down', 'fa-volume-up');
    volume.classList.replace('fa-volume-mute', 'fa-volume-up');
    volumeSlider.value = tempslidervalue * 100;
    music.volume = (volumeSlider.value) / 100;
    volume.title = "Mute";
}
volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
window.addEventListener('load', function () {
    context = canvas.getContext("2d");
    audioctx = new AudioContext();
    WIDTH = window.innerWidth - 50;
    canvas.width = WIDTH;
    HEIGHT = 500;
    canvas.height = 500;
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;
    oscillator = audioctx.createOscillator();
    oscillator.connect(audioctx.destination);
    source = audioctx.createMediaElementSource(music);
    source.connect(analyser);
    source.connect(audioctx.destination);
    freqArr = new Uint8Array(analyser.frequencyBinCount);
    barHeight = HEIGHT;
    window.requestAnimationFrame(draw);
});
function draw() {
    if (!music.paused) {
        bigBars = 0;
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        for (var i = 0; i < INTERVAL; i++) {
            if (barHeight >= (240)) {
                bigBars++;
            }
            var num = i;
            barHeight = ((freqArr[num] - 128) * 3) + 2;
            if (barHeight <= 1) {
                barHeight = 2;
            }
            r = r + 10;
            if (r > 255) {
                r = 255;
            }
            g = g + 1;
            if (g > 255) {
                g = 255;
            }
            b = b - 2;
            if (b < 0) {
                b = 0;
            }
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            context.fillRect(x, HEIGHT - barHeight, (WIDTH / INTERVAL) - 1, barHeight);
            x = x + (WIDTH / INTERVAL);
        }
    }
    window.requestAnimationFrame(draw);
}
window.addEventListener('load', displayLoader);
searchinput.addEventListener('keyup', search);
searchinput.addEventListener('input', function (e) {
    if (!e.inputType && searchinput.value === '') {
        searchinput.value = null;
        search();
    }
});
musiclistitem.forEach(function (element, index) {
    element.addEventListener("click", function () {
        remove_all_active_list();
        loadSong(songList[index]);
        playmusic(index);
        musiclistitem[index].classList.add("active_music");
        songIndex = index;
        searchinput.value = null;
        search();
    });
});
repeat.addEventListener('click', repeatEvent);
shuffle.addEventListener('click', shuffleEvent);
play.addEventListener('click', function () { return isPlay ? pausemusic() : playmusic(songIndex); });
prev.addEventListener('click', prevSong);
next.addEventListener('click', nextSong);
headericon.addEventListener('click', function () { return (!isPlay) && playmusic(songIndex); });
music.addEventListener("timeupdate", timeUpdate);
progress_div.addEventListener('click', progressBar);
progress_div.addEventListener("wheel", function (e) { return Math.sign(e.deltaY) < 0 ? music.currentTime += 5 : music.currentTime -= 5; });
volumeSlider.addEventListener('change', volumeChange);
volumeSlider.addEventListener('mousemove', volumeChange);
volumeSlider.addEventListener('keyup', function (e) {
    event.stopPropagation();
    e.keyCode == 77 ? MforMute() : '';
});
volumeSlider.addEventListener('input', function () { return volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)'; });
volume.addEventListener('click', function () {
    ismute ? volumeup() : volumedown();
    volumeCheck();
});
