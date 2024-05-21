var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var elements = {
    loader: document.getElementById("loading"),
    headerIcon: document.querySelector(".header-icon"),
    searchInput: document.getElementById("search_input"),
    progress: document.querySelector(".progress_bar"),
    currentTime: document.querySelector(".current_time"),
    duration: document.querySelector(".total_duration"),
    progressDiv: document.querySelector(".progress_div"),
    music: document.querySelector("audio"),
    musicContainer: document.querySelector(".music_container"),
    prev: document.getElementById("prev"),
    play: document.getElementById("play"),
    next: document.getElementById("next"),
    volume: document.getElementById("volume"),
    title: document.getElementById("title"),
    artist: document.getElementById("artist"),
    img: document.querySelector(".music_img_change"),
    musicList: document.querySelector(".music_list"),
    noResult: document.querySelector(".no_result"),
    shuffle: document.getElementById("shuffle"),
    repeat: document.getElementById("repeat"),
    compatibility: document.querySelector(".compatibility"),
    canvas: document.getElementById("cnv1"),
    volumeSlider: document.querySelector(".volume_slider"),
};
var endpoint = "https://res.cloudinary.com/dbvthtwhc/raw/upload/v1613398922/songList.json";
var context, audioCtx, analyser, oscillator, freqArr, barHeight, source, WIDTH, HEIGHT, bigBars = 0, INTERVAL = 128, SAMPLES = 2048, r = 0, g = 0, b = 255, x = 0, isPlay = false, isMute = false, songIndex = 0, volumeSlider = document.querySelector('.volume_slider'), tempSliderValue = volumeSlider.value, minValue = 1, lastRandom = 0, repeatCheck = false, shuffleCheck = false;
var songList = [];
function documentReady() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchSongList()];
                case 1:
                    _a.sent();
                    setupAudioContext();
                    loadInitialSong();
                    setupEventListeners();
                    handleDeviceCompatibility();
                    setupAudioVisualizer();
                    return [2 /*return*/];
            }
        });
    });
}
function fetchSongList() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(endpoint)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    songList = _a.sent();
                    songList.sort(function (a, b) { return a.name.localeCompare(b.name); });
                    elements.loader.style.display = "none";
                    renderSongList();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to fetch song list:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderSongList() {
    elements.musicList.innerHTML = songList
        .map(function (song, index) { return "\n                <li class=\"music_list_item\" data-song-index=\"".concat(index, "\">\n                    <h3 class=\"col-1 offset-md-1\">").concat(index + 1, ".</h3>\n                    <div class=\"img_container_list col-1\">\n                    <img src=\"./src/image/").concat(song.album, ".jpg\">\n                    </div>\n                    <h1 class=\"col-3 offset-1 offset-md-0\">").concat(song.name, "</h1>\n                    <h2 class=\"col-4 col-md-3\">").concat(song.artist, "</h2>\n                    <h3 class=\"col-2 text-truncate\" title=\"").concat(song.album, "\">").concat(song.album, "</h3>\n                </li>\n            "); })
        .join("");
}
function setupAudioContext() {
    context = elements.canvas.getContext('2d');
    audioCtx = new AudioContext();
    WIDTH = window.innerWidth - 50;
    elements.canvas.width = WIDTH;
    HEIGHT = 500;
    elements.canvas.height = 500;
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = SAMPLES;
    oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    source = audioCtx.createMediaElementSource(elements.music);
    source.connect(analyser);
    source.connect(audioCtx.destination);
    freqArr = new Uint8Array(analyser.frequencyBinCount);
    barHeight = HEIGHT;
    window.requestAnimationFrame(setupAudioVisualizer);
}
function loadInitialSong() {
    loadSong(songList[songIndex]);
}
function setupEventListeners() {
    // Setup volume slider background
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
    // Keyboard shortcuts
    window.addEventListener("keydown", handleShortcutKeys);
    // Search events
    elements.searchInput.addEventListener('keyup', handleSearch);
    elements.searchInput.addEventListener('input', handleSearchInput);
    // Music list item click events
    document.querySelectorAll('.music_list_item').forEach(function (element, index) {
        element.addEventListener('click', function () {
            handleMusicListItemClick(index);
        });
    });
    // Repeat and shuffle button events
    elements.repeat.addEventListener('click', toggleRepeat);
    elements.shuffle.addEventListener('click', toggleShuffle);
    // Play, prev, and next button events
    elements.play.addEventListener('click', togglePlay);
    elements.prev.addEventListener('click', prevSong);
    elements.next.addEventListener('click', nextSong);
    elements.headerIcon.addEventListener('click', playPauseHeaderIcon);
    // Music progress and volume events
    elements.music.addEventListener('timeupdate', updateProgress);
    elements.progressDiv.addEventListener('click', setProgress);
    elements.progressDiv.addEventListener('wheel', handleProgressWheel);
    volumeSlider.addEventListener('change', handleVolumeChange);
    volumeSlider.addEventListener('mousemove', handleVolumeChange);
    volumeSlider.addEventListener('keyup', handleVolumeKeyUp);
    volumeSlider.addEventListener('input', handleVolumeInput);
    elements.volume.addEventListener('click', handleVolumeIconClick);
}
// Function to handle search input events
function handleSearchInput(e) {
    if (!e.inputType && elements.searchInput.value === '') {
        elements.searchInput.value = null;
        handleSearch();
    }
}
// Function to handle music list item click events
function handleMusicListItemClick(index) {
    remove_all_active_list();
    loadSong(songList[index]);
    playMusic(index);
    document.querySelectorAll('.music_list_item')[index].classList.add('active_music');
    songIndex = index;
    elements.searchInput.value = null;
    handleSearch();
}
// Function to handle play/pause button click
function togglePlay() {
    isPlay ? pauseMusic() : playMusic(songIndex);
}
// Function to handle header icon click (play if paused)
function playPauseHeaderIcon() {
    !isPlay && playMusic(songIndex);
}
// Function to handle progress wheel event
function handleProgressWheel(e) {
    Math.sign(e.deltaY) < 0 ? (elements.music.currentTime += 5) : (elements.music.currentTime -= 5);
}
// Function to handle volume key up event
function handleVolumeKeyUp(e) {
    event.stopPropagation();
    e.keyCode == 77 ? toggleMute() : '';
}
// Function to update volume slider background on input
function handleVolumeInput() {
    volumeSlider.style.background = 'linear-gradient(90deg, #1DB954 ' + volumeSlider.value + '%, #ddd 0)';
}
// Function to handle volume icon click event
function handleVolumeIconClick() {
    isMute ? volumeUp() : volumeDown();
    updateVolumeSliderBackground();
}
function handleShortcutKeys(event) {
    if (screen.width >= 480 || screen.height >= 480) {
        window.addEventListener("keydown", function (e) {
            if (e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });
        document.body.onkeyup = function (e) {
            if (e.keyCode == 32) {
                event.stopPropagation();
                isPlay ? pauseMusic() : playMusic(songIndex);
            }
            if (e.keyCode == 39) {
                elements.music.currentTime += 5;
            }
            else if (e.keyCode == 37) {
                elements.music.currentTime -= 5;
            }
            else if (e.keyCode == 77) {
                toggleMute();
            }
        };
    }
}
function handleSearch() {
    var musicListItem = document.querySelectorAll('.music_list_item');
    var txtValue, count = 0, search_result, filter = elements.searchInput.value.toUpperCase();
    musicListItem.forEach(function (element) {
        search_result = element.getElementsByTagName('h1')[0];
        txtValue = element.getElementsByTagName('h1')[0].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            element.style.display = '';
            elements.musicList.style.display = 'block';
            elements.noResult.style.display = 'none';
        }
        else {
            search_result = element.getElementsByTagName('h2')[0];
            txtValue = search_result.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                element.style.display = '';
                elements.musicList.style.display = 'block';
                elements.noResult.style.display = 'none';
            }
            else {
                element.style.display = 'none';
                count++;
                if (count == musicListItem.length) {
                    elements.musicList.style.display = 'none';
                    var noResultContent = document.querySelector('.no_result_txt');
                    noResultContent.innerText =
                        '"' + elements.searchInput.value + '"';
                    elements.noResult.style.display = 'grid';
                }
            }
        }
    });
    event.stopPropagation();
}
function remove_all_active_list() {
    var musicListItem = document.querySelectorAll('.music_list_item');
    musicListItem.forEach(function (e) {
        return e.classList.remove('active_music');
    });
}
function togglePlayPause() {
    isPlay ? pauseMusic() : playMusic(songIndex);
}
function playMusic(index) {
    var musicListItem = document.querySelectorAll('.music_list_item');
    remove_all_active_list();
    audioCtx.resume();
    musicListItem[index].classList.add('active_music');
    isPlay = true;
    elements.music.play();
    elements.play.classList.replace('fa-play', 'fa-pause');
    elements.play.title = 'Pause';
}
function pauseMusic() {
    elements.music.pause();
    elements.play.classList.replace("fa-pause", "fa-play");
    elements.play.title = "Play";
    isPlay = false;
}
function prevSong() {
    var musicListItem = document.querySelectorAll('.music_list_item');
    if (shuffleCheck) {
        shuffleSong();
    }
    else {
        songIndex = (songIndex - 1 + songList.length) % songList.length;
        remove_all_active_list();
        musicListItem[songIndex].classList.add('active_music');
        loadSong(songList[songIndex]);
        playMusic(songIndex);
    }
}
function nextSong() {
    var musicListItem = document.querySelectorAll('.music_list_item');
    if (shuffleCheck) {
        shuffleSong();
    }
    else {
        songIndex = (songIndex + 1) % songList.length;
        remove_all_active_list();
        musicListItem[songIndex].classList.add('active_music');
        loadSong(songList[songIndex]);
        playMusic(songIndex);
    }
}
function handleSongClick(event) {
    var target = event.target;
    var listItem = target.closest(".music_list_item");
    if (listItem) {
        var index = Number(listItem.getAttribute("data-song-index"));
        playMusic(index);
        songIndex = index;
    }
}
function loadSong(song) {
    var musicListItem = document.querySelectorAll('.music_list_item');
    elements.title.textContent = song.name;
    elements.artist.textContent = song.artist;
    elements.artist.title = song.artist;
    elements.music.src = "src/music/" + song.name + ".mp3";
    // elements.music.src = song.src;
    elements.img.src = "src/image/" + song.album + ".jpg";
    elements.music.volume = parseFloat(elements.volumeSlider.value) / 100;
    musicListItem[songIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
    });
}
function updateProgress() {
    var _a = elements.music, currentTime = _a.currentTime, duration = _a.duration;
    var progressPercent = (currentTime / duration) * 100;
    elements.progress.style.width = "".concat(progressPercent, "%");
    elements.currentTime.textContent = formatTime(currentTime);
    duration ? elements.duration.textContent = formatTime(duration) : '';
    if (elements.music.ended) {
        if (!repeatCheck && !shuffleCheck) {
            nextSong();
        }
        else if (!repeatCheck && shuffleCheck) {
            shuffleSong();
        }
        else if (repeatCheck) {
            playMusic(songIndex);
        }
    }
}
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return "".concat(minutes, ":").concat(secs < 10 ? "0" : "").concat(secs);
}
function setProgress(event) {
    var width = this.clientWidth;
    var clickX = event.offsetX;
    var duration = elements.music.duration;
    elements.music.currentTime = (clickX / width) * duration;
}
// Handles changes in the volume slider
function handleVolumeChange() {
    var volume = parseFloat(elements.volumeSlider.value) / 100;
    elements.music.volume = volume;
    tempSliderValue = volume;
    isMute = volume === 0;
    updateVolumeSliderBackground();
    updateVolumeIcon();
}
// Sets up the volume slider background based on the current value
function updateVolumeSliderBackground() {
    volumeSlider.style.background =
        "linear-gradient(90deg, #1DB954 ".concat(volumeSlider.value, "%, #ddd 0)");
}
// Updates the volume icon based on the current volume level and mute state
function updateVolumeIcon() {
    if (isMute) {
        elements.volume.classList.replace("fa-volume-up", "fa-volume-mute");
    }
    else if (elements.music.volume > 0.45) {
        elements.volume.classList.replace("fa-volume-mute", "fa-volume-up");
        elements.volume.classList.replace("fa-volume-down", "fa-volume-up");
    }
    else if (elements.music.volume > 0) {
        elements.volume.classList.replace("fa-volume-mute", "fa-volume-down");
        elements.volume.classList.replace("fa-volume-up", "fa-volume-down");
    }
    else {
        elements.volume.classList.replace("fa-volume-up", "fa-volume-mute");
        elements.volume.classList.replace("fa-volume-down", "fa-volume-mute");
    }
}
// Increases the volume and updates the UI
function volumeUp() {
    isMute = false;
    elements.music.volume = tempSliderValue;
    volumeSlider.value = tempSliderValue * 100;
    updateVolumeSliderBackground();
    updateVolumeIcon();
    elements.volume.title = 'Mute';
}
// Sets the volume to a low level and updates the UI
function volumeLow() {
    elements.volume.title = 'Mute';
    updateVolumeIcon();
}
// Mutes the volume and updates the UI
function volumeDown() {
    isMute = true;
    elements.music.volume = 0;
    volumeSlider.value = 0;
    updateVolumeSliderBackground();
    updateVolumeIcon();
    elements.volume.title = 'Unmute';
}
// Toggles the mute state and updates the UI accordingly
function toggleMute() {
    if (elements.music.volume !== 0) {
        volumeDown();
    }
    else {
        volumeUp();
    }
}
function toggleShuffle() {
    if (shuffleCheck) {
        elements.shuffle.classList.remove('active_icon');
        elements.shuffle.title = 'Shuffle: On';
    }
    else {
        elements.shuffle.classList.add('active_icon');
        elements.shuffle.title = 'Shuffle: Off';
    }
    shuffleCheck = !shuffleCheck;
}
function shuffleSong() {
    var musicListItem = document.querySelectorAll('.music_list_item');
    songIndex =
        Math.floor(Math.random() * (songList.length - 1 - minValue + 1)) +
            minValue;
    while (lastRandom === songIndex) {
        songIndex =
            Math.floor(Math.random() * (songList.length - 1 - minValue + 1)) + minValue;
    }
    loadSong(songList[songIndex]);
    playMusic(songIndex);
    musicListItem[songIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
    });
    minValue = 0;
    lastRandom = songIndex;
}
function toggleRepeat() {
    if (repeatCheck) {
        elements.repeat.classList.replace('fa-repeat-1-alt', 'fa-repeat');
        elements.repeat.classList.remove('active_icon');
    }
    else {
        elements.repeat.classList.replace('fa-repeat', 'fa-repeat-1-alt');
        elements.repeat.classList.add('active_icon');
    }
    repeatCheck = !repeatCheck;
}
function handleDeviceCompatibility() {
    if (window.screen.width < 480 && window.screen.height < 480) {
        elements.musicList.classList.add('d-none');
        elements.compatibility.classList.replace('d-none', 'd-flex');
        elements.canvas.classList.add('d-none');
        elements.musicContainer.classList.replace('d-flex', 'd-none');
        elements.compatibility.innerHTML = "<p>Sorry Your Device is not Epic to use Epic Player.</p>";
    }
    if (screen.width < 480 && screen.height >= 480) {
        elements.musicList.classList.add('d-none');
        elements.compatibility.classList.replace('d-none', 'd-flex');
        elements.canvas.classList.add('d-none');
        elements.musicContainer.classList.replace('d-flex', 'd-none');
        elements.compatibility.innerHTML = "\n            <p>\n                <img src=\"src/screen_rotation-white-18dp.svg\" alt=\"rotate\" class=\"rotate_device\"> Rotate you device and reload the page to use Epic Player.\n            </p>\n        ";
    }
}
function setupAudioVisualizer() {
    if (!elements.music.paused) {
        bigBars = 0;
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        for (var i = 0; i < INTERVAL; i++) {
            if (barHeight >= 240) {
                bigBars++;
            }
            var num = i;
            barHeight = (freqArr[num] - 128) * 3 + 2;
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
            context.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
            context.fillRect(x, HEIGHT - barHeight, WIDTH / INTERVAL - 1, barHeight);
            x = x + WIDTH / INTERVAL;
        }
    }
    window.requestAnimationFrame(setupAudioVisualizer);
}
document.addEventListener("DOMContentLoaded", documentReady);
