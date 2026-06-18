let vaultItems = JSON.parse(localStorage.getItem('local_vault')) || [];
let profileData = JSON.parse(localStorage.getItem('user_profile')) || { name: '' };
let customTracks = JSON.parse(localStorage.getItem('custom_tracks')) || [];
let currentVaultCategory = 'wishlist';
let currentStudySubTab = 'learn'; 
let currentMediaSubTab = 'movie'; 
let currentSocialSubTab = 'threads'; 
let currentFormType = '', currentEditId = null;
let currentAvatarUrl = null;
let savedTrackName = "Giai điệu không gian";
let isForceTestingTheme = false; 
let pendingAvatarFile = null;
let isHolidayGreetingActive = false; 

const defaultTracks = [];
const starMessages = ["Mong ngày hôm nay sẽ dịu dàng với bạn.", "Đừng lo lắng quá, mọi chuyện rồi sẽ ổn thôi mà."];

// 🎄 ENGINE PHÂN TÍCH VÀ CÀI ĐẶT LỜI CHÚC NGÀY LỄ CHÍNH XÁC
function runHolidayCheckRoutine() {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    const welcomeText = document.getElementById('intro-welcome-text');
    const starMsgText = document.getElementById('star-message');
    const iconBox = document.getElementById('intro-star-icon');

    let holidayId = "";
    let currentTitle = "";
    let currentMsg = "";
    let currentIcon = "";
    let hasConfetti = false;

    // Kiểm tra mốc ngày lễ
    if (date === 2 && month === 10) { 
        holidayId = `test_holiday_${year}`;
        currentTitle = "Ngày Lễ Kỷ Niệm Ngọc Ngào! 🌸";
        currentMsg = "Chúc mừng ngày đặc biệt của hai chúng mình! Cảm ơn em vì đã luôn đồng hành, chịu đựng và mang đến cho anh những điều tuyệt vời nhất thế gian này. Thương em nhiều lắm! 💕";
        currentIcon = "💝";
        hasConfetti = true;
    } else if (date === 2 && month === 10) {
        holidayId = `birthday_${year}`;
        currentTitle = "Happy Birthday Princess! 🎂";
        currentMsg = "Chúc mừng sinh nhật cô gái tuyệt vời nhất vũ trụ! Tuổi mới thật hạnh phúc, rạng rỡ và luôn là kho báu quý giá nhất nhé. Yêu em! 💕";
        currentIcon = "🎉";
        hasConfetti = true;
    } else if (date === 24 && month === 12) {
        holidayId = `noel_${year}`;
        currentTitle = "Merry Christmas! 🎄";
        currentMsg = "Giáng Sinh ấm áp nhé kho báu của anh! Chúc em luôn hạnh phúc, bình yên và nhận được thật nhiều điều ngọt ngào trong đêm đông này. Thần tình yêu luôn bên em! ❄️";
        currentIcon = "☃️";
    } else if (date === 8 && month === 3) {
        holidayId = `women_day_${year}`;
        currentTitle = "Happy Women's Day! 🌸";
        currentMsg = "Chúc ngày 8/3 của em luôn ngập tràn những điều ngọt ngào. Hãy tỏa sáng theo cách của riêng em, vì em xứng đáng với mọi điều tốt đẹp nhất thế gian này!";
        currentIcon = "💝";
    } else if (date === 20 && month === 10) {
        holidayId = `vn_women_${year}`;
        currentTitle = "Ngày Của Nhành Hoa Đẹp Nhất 💐";
        currentMsg = "Chào mừng ngày 20/10! Chúc cô báu nhỏ luôn rạng rỡ, xinh tươi và có một ngày tràn đầy niềm vui, sự chiều chuộng dịu dàng nha.";
        currentIcon = "❤️";
    } else if (date === 20 && month === 11) {
        holidayId = `teacher_${year}`;
        currentTitle = "Tri Ân Ngày 20/11 ✨";
        currentMsg = "Chúc em một ngày 20/11 thật ý nghĩa, nhiều đóa hoa thơm và nụ cười rạng rỡ trên môi. Cảm ơn em vì những điều tuyệt vời em luôn mang lại!";
        currentIcon = "👩‍🏫";
    } else if ((date >= 1 && date <= 4) && (month === 1 || month === 2)) {
        holidayId = `tet_${month}_${date}_${year}`;
        currentTitle = "Chúc Mừng Năm Mới! 🧧";
        currentMsg = "Năm mới đến rồi, chúc kho báu nhỏ của anh luôn bình an, vạn điều may mắn, mọi dự định đều thành công rực rỡ và nụ cười mãi nở trên môi nhé!";
        currentIcon = "🧨";
    }

    if (holidayId !== "") {
        const isAlreadyShown = localStorage.getItem('last_holiday_shown');
        if (isAlreadyShown === holidayId) {
            isHolidayGreetingActive = false;
            return false;
        }

        if (welcomeText) welcomeText.innerText = currentTitle;
        if (starMsgText) starMsgText.innerText = currentMsg;
        if (iconBox) iconBox.innerText = currentIcon;
        
        if (hasConfetti) {
            setTimeout(() => { triggerConfetti(); }, 900);
            setTimeout(() => { triggerConfetti(); }, 1600);
        }

        localStorage.setItem('last_holiday_shown', holidayId);
        isHolidayGreetingActive = true;
        return true;
    }

    isHolidayGreetingActive = false;
    return false;
}

function applyIntroWelcomeText() {
    const welcomeText = document.getElementById('intro-welcome-text');
    const starText = document.getElementById('star-message');
    
    if (!isHolidayGreetingActive) {
        if (welcomeText) {
            welcomeText.innerText = (profileData && profileData.name && profileData.name.trim() !== "") ? `Xin chào ${profileData.name}...` : "Xin chào kho báu...";
        }
        if (starText) {
            starText.innerText = starMessages[Math.floor(Math.random() * starMessages.length)];
        }
    }
}

function openInfoModal() {
    const m = document.getElementById('modal-info');
    m.classList.remove('hidden'); m.classList.add('flex');
    setTimeout(() => document.getElementById('info-card').classList.remove('translate-y-full'), 10);
}
function closeInfoModal() {
    document.getElementById('info-card').classList.add('translate-y-full');
    setTimeout(() => document.getElementById('modal-info').classList.replace('flex', 'hidden'), 300);
}
document.getElementById('modal-info').addEventListener('click', function(e) { if (e.target === this) closeInfoModal(); });

function exportAppDataBackup() {
    try {
        const dataObj = {
            app_password: localStorage.getItem('app_password') || "",
            user_profile: profileData,
            local_vault: vaultItems,
            custom_tracks: customTracks
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `infinite_vault_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast("Đã xuất file! Hãy chọn lưu tệp vào ứng dụng Tệp/iCloud.");
    } catch (err) { showToast("Lỗi hệ thống khi sao lưu!", "error"); }
}

function importAppDataBackup(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (!parsed.local_vault || !Array.isArray(parsed.local_vault)) return showToast("File không đúng định dạng!", "error");
            if (parsed.app_password) localStorage.setItem('app_password', parsed.app_password);
            vaultItems = parsed.local_vault; localStorage.setItem('local_vault', JSON.stringify(vaultItems));
            if (parsed.user_profile) { profileData = parsed.user_profile; localStorage.setItem('user_profile', JSON.stringify(profileData)); }
            if (parsed.custom_tracks) { customTracks = parsed.custom_tracks; localStorage.setItem('custom_tracks', JSON.stringify(customTracks)); }
            showToast("Khôi phục thành công! Đang tải lại web...");
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) { showToast("Không thể đọc tệp này!", "error"); }
    };
    reader.readAsText(input.files[0]);
}

function forceToggleThemeTesting() {
    isForceTestingTheme = true;
    const body = document.body;
    const clockIcon = document.getElementById('clock-status-icon');
    const clockParent = document.getElementById('clock-parent-box');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        if (clockIcon) clockIcon.innerText = "☀️";
        if (clockParent) {
            clockParent.classList.remove('bg-black/10', 'border-white/5');
            clockParent.classList.add('bg-white/60', 'border-black/5');
        }
        showToast("Đã ép sang Light Theme!");
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if (clockIcon) clockIcon.innerText = "🌙";
        if (clockParent) {
            clockParent.classList.remove('bg-white/60', 'border-black/5');
            clockParent.classList.add('bg-black/10', 'border-white/5');
        }
        showToast("Đã ép ngược lại Dark Theme!");
    }
    filterVault(currentVaultCategory); 
}

function setupPopupInputsTheme() {
    const ctrl = document.getElementById('popup-name-input');
    if (ctrl) {
        if(document.body.classList.contains('light-theme')) {
            ctrl.style.backgroundColor = "#fcf8f5"; ctrl.style.borderColor = "#d6ccc2"; ctrl.style.color = "#2b221a";
        } else {
            ctrl.style.backgroundColor = "rgba(17, 24, 39, 0.6)"; ctrl.style.borderColor = "rgba(255, 255, 255, 0.05)"; ctrl.style.color = "#f3f4f6";
        }
    }
}

function toggleInputVisibility(inputId, btnEl) {
    const el = document.getElementById(inputId);
    if (el && btnEl) {
        if (el.type === 'password') { el.type = 'text'; btnEl.innerText = '👀'; } 
        else { el.type = 'password'; btnEl.innerText = '🙈'; }
    }
}

function initPasswordScreen() {
    const hasPassword = localStorage.getItem('app_password');
    const container = document.getElementById('lock-inputs-container');
    const title = document.getElementById('lock-title');
    const desc = document.getElementById('lock-desc');
    container.innerHTML = '';

    if (!hasPassword) {
        title.innerText = "Thiết Lập Mật Mã";
        desc.innerText = "Tạo mật mã riêng tư để bảo vệ không gian mật thất";
        container.innerHTML = `
            <div class="relative w-full">
                <input type="password" id="lock-pwd-1" placeholder="Nhập mật mã mới..." class="w-full h-16 border rounded-2xl pl-5 pr-12 text-base text-center outline-none focus:border-indigo-500 shadow-inner tracking-widest transition-all">
                <button onclick="toggleInputVisibility('lock-pwd-1', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-lg opacity-60 active:scale-75 transition" type="button">🙈</button>
            </div>
            <div class="relative w-full">
                <input type="password" id="lock-pwd-2" placeholder="Xác nhận lại..." class="w-full h-16 border rounded-2xl pl-5 pr-12 text-base text-center outline-none focus:border-indigo-500 shadow-inner tracking-widest transition-all">
                <button onclick="toggleInputVisibility('lock-pwd-2', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-lg opacity-60 active:scale-75 transition" type="button">🙈</button>
            </div>`;
    } else {
        title.innerText = "Không Gian Bảo Mật";
        desc.innerText = "Vui lòng nhập mật mã để truy cập mật thất";
        container.innerHTML = `
            <div class="relative w-full">
                <input type="password" id="lock-pwd-input" placeholder="Nhập mật mã bí mật..." class="w-full h-16 border rounded-2xl pl-5 pr-12 text-base text-center outline-none focus:border-pink-500 shadow-inner tracking-widest transition-all">
                <button onclick="toggleInputVisibility('lock-pwd-input', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-lg opacity-60 active:scale-75 transition" type="button">🙈</button>
            </div>`;
    }

    const inputs = container.querySelectorAll('input');
    inputs.forEach(inp => {
        inp.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; 
        inp.style.borderColor = "rgba(255, 255, 255, 0.8)"; 
        inp.style.color = "#5c4d41";
    });
}

function checkOrSetPassword() {
    const hasPassword = localStorage.getItem('app_password');
    if (!hasPassword) {
        const p1 = document.getElementById('lock-pwd-1').value.trim();
        const p2 = document.getElementById('lock-pwd-2').value.trim();
        if (!p1) return showToast("Ô mật mã trống!", "error");
        if (p1 !== p2) return showToast("Mật mã xác nhận không khớp!", "error");
        localStorage.setItem('app_password', p1);
        showToast("Thiết lập mật mã thành công!");
        unlockApp();
    } else {
        const inputPass = document.getElementById('lock-pwd-input').value.trim();
        if (inputPass === hasPassword) { unlockApp(); } 
        else { showToast("Sai mật mã!", "error"); }
    }
}

function unlockApp() {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen) {
        const isHolidayToday = runHolidayRoutineInternal();
        loadProfileImages();
        
        lockScreen.classList.add('opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            lockScreen.remove();
            const intro = document.getElementById('intro-screen');
            
            if (intro) {
                if (isHolidayToday) {
                    setTimeout(() => {
                        intro.classList.replace('hidden', 'flex');
                        setTimeout(() => {
                            intro.classList.add('intro-hide');
                            setTimeout(() => intro.remove(), 1200);
                        }, 5000); 
                    }, 400);
                } else {
                    intro.remove();
                }
            }
        }, 500);
    }
}

function runHolidayRoutineInternal() {
    return runHolidayCheckRoutine();
}

function updateTimeAndTheme() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const clockEl = document.getElementById('realtime-clock');
    if (clockEl) clockEl.innerText = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    if (isForceTestingTheme) return;

    const currentHour = now.getHours();
    const body = document.body;
    const clockIcon = document.getElementById('clock-status-icon');
    const clockParent = document.getElementById('clock-parent-box');
    
    if (currentHour >= 6 && currentHour < 18) {
        if (!body.classList.contains('light-theme')) {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            if (clockIcon) clockIcon.innerText = "☀️";
            if (clockParent) {
                clockParent.classList.remove('bg-black/10', 'border-white/5');
                clockParent.classList.add('bg-white/60', 'border-black/5');
            }
        }
    } else {
        if (!body.classList.contains('dark-theme')) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            if (clockIcon) clockIcon.innerText = "🌙";
            if (clockParent) {
                clockParent.classList.remove('bg-white/60', 'border-black/5');
                clockParent.classList.add('bg-black/10', 'border-white/5');
            }
        }
    }
}
setInterval(updateTimeAndTheme, 1000);

function openMusicModal() {
    const inputs = document.querySelectorAll('#modal-music input[type="text"]');
    inputs.forEach(inp => {
        if(document.body.classList.contains('light-theme')) {
            inp.style.backgroundColor = "#fcf8f5"; inp.style.borderColor = "#d6ccc2"; inp.style.color = "#2b221a";
        } else {
            inp.style.backgroundColor = "rgba(17, 24, 39, 0.6)"; inp.style.borderColor = "rgba(255, 255, 255, 0.05)"; inp.style.color = "#f3f4f6";
        }
    });
    renderTrackList();
    const m = document.getElementById('modal-music'); m.classList.remove('hidden'); m.classList.add('flex');
    setTimeout(() => document.getElementById('music-card').classList.remove('translate-y-full'), 10);
}

function closeMusicModal() {
    document.getElementById('music-card').classList.add('translate-y-full');
    setTimeout(() => document.getElementById('modal-music').classList.replace('flex', 'hidden'), 300);
}
document.getElementById('modal-music').addEventListener('click', function(e) { if (e.target === this) closeMusicModal(); });

function renderTrackList() {
    const container = document.getElementById('music-track-list'); container.innerHTML = '';
    const audio = document.getElementById('bg-audio');
    const searchKeyword = document.getElementById('music-search').value.toLowerCase().trim();
    let allTracks = [...defaultTracks, ...customTracks];
    
    if (searchKeyword) allTracks = allTracks.filter(t => t.title.toLowerCase().includes(searchKeyword));
    if (allTracks.length === 0) {
        container.innerHTML = `<div class="py-8 text-center text-xs opacity-40 italic">Kho nhạc hiện đang trống...</div>`;
        return;
    }

    allTracks.forEach(track => {
        const isCurrent = (audio.src === track.url && !audio.paused);
        const item = document.createElement('div');
        item.className = 'w-full h-14 bg-gray-500/5 border border-white/5 rounded-2xl flex items-center justify-between px-4 gap-2 shrink-0';
        item.innerHTML = `
            <div onclick="playTrack('${track.url}', '${track.title}')" class="flex-1 min-w-0 h-full flex items-center cursor-pointer text-left">
                <span class="text-sm font-semibold truncate ${isCurrent ? 'text-indigo-400' : ''}">${track.title}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
                <button onclick="playTrack('${track.url}', '${track.title}')" class="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-base">
                    ${isCurrent ? '⏸️' : '▶️'}
                </button>
            </div>`;
        container.appendChild(item);
    });
}

function playTrack(url, name) {
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('music-btn');
    const statusLabel = document.getElementById('current-track-name');
    const headerTitle = document.getElementById('header-track-title');
    const quickStopBtn = document.getElementById('quick-stop-btn');
    const quickMuteBtn = document.getElementById('quick-mute-btn');
    const quickClearBtn = document.getElementById('quick-clear-btn');
    const miniPlayer = document.getElementById('header-mini-player');
    const wave = document.getElementById('mini-audio-wave');
    
    if (audio.src === url && !audio.paused) {
        audio.pause(); btn.innerText = "🎵"; btn.classList.remove('spin-slow', 'bg-indigo-500/30');
        if (wave) wave.classList.replace('flex', 'hidden'); 
        statusLabel.innerText = "Trạng thái: Đang dừng phát"; quickStopBtn.innerText = "▶️";
    } else if (audio.src === url && audio.paused) {
        audio.play().then(() => {
            btn.innerText = "💿"; btn.classList.add('spin-slow', 'bg-indigo-500/30');
            if (wave) wave.classList.replace('hidden', 'flex'); 
            statusLabel.innerText = `Đang phát: ${name}`; quickStopBtn.innerText = "⏸️";
        });
    } else {
        audio.src = url; savedTrackName = name;
        audio.play().then(() => {
            btn.innerText = "💿"; btn.classList.add('spin-slow', 'bg-indigo-500/30');
            if (wave) wave.classList.replace('hidden', 'flex'); 
            statusLabel.innerText = `Đang phát: ${name}`; headerTitle.innerText = name;
            quickStopBtn.innerText = "⏸️"; quickStopBtn.classList.remove('hidden');
            quickMuteBtn.classList.remove('hidden'); quickClearBtn.classList.remove('hidden');
            miniPlayer.classList.add('bg-indigo-500/10', 'border-indigo-500/20');
        }).catch(() => { showToast("Hãy chạm màn hình rồi chọn lại nhạc nhé!", "error"); });
    }
    renderTrackList();
}

function handleQuickPlayPause(event) {
    if (event) event.stopPropagation(); 
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('music-btn');
    const statusLabel = document.getElementById('current-track-name');
    const quickStopBtn = document.getElementById('quick-stop-btn');
    const wave = document.getElementById('mini-audio-wave');

    if (!audio.paused) {
        audio.pause(); btn.innerText = "🎵"; btn.classList.remove('spin-slow', 'bg-indigo-500/30');
        if (wave) wave.classList.replace('flex', 'hidden');
        statusLabel.innerText = "Trạng thái: Đang dừng phát"; quickStopBtn.innerText = "▶️";
    } else {
        audio.play().then(() => {
            btn.innerText = "💿"; btn.classList.add('spin-slow', 'bg-indigo-500/30');
            if (wave) wave.classList.replace('hidden', 'flex');
            statusLabel.innerText = `Đang phát: ${savedTrackName}`; quickStopBtn.innerText = "⏸️";
        });
    }
    renderTrackList();
}

// BẬT TẮT TIẾNG NHANH
function handleQuickMute(event) {
    if (event) event.stopPropagation(); 
    const audio = document.getElementById('bg-audio');
    const muteBtn = document.getElementById('quick-mute-btn');
    if (audio.muted) { audio.muted = false; muteBtn.innerText = "🔊"; muteBtn.classList.remove('bg-red-500/20', 'text-red-400', 'border-red-500/30'); } 
    else { audio.muted = true; muteBtn.innerText = "🔇"; muteBtn.classList.add('bg-red-500/20', 'text-red-400', 'border-red-500/30'); }
}

function handleQuickClear(event) {
    if (event) event.stopPropagation(); 
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('music-btn');
    const statusLabel = document.getElementById('current-track-name');
    const headerTitle = document.getElementById('header-track-title');
    const quickStopBtn = document.getElementById('quick-stop-btn');
    const quickMuteBtn = document.getElementById('quick-mute-btn');
    const quickClearBtn = document.getElementById('quick-clear-btn');
    const miniPlayer = document.getElementById('header-mini-player');
    const wave = document.getElementById('mini-audio-wave');

    audio.pause(); audio.removeAttribute('src'); audio.load();
    btn.innerText = "🎵"; btn.classList.remove('spin-slow', 'bg-indigo-500/30');
    if (wave) wave.classList.replace('flex', 'hidden');
    statusLabel.innerText = "Trạng thái: Đang dừng phát"; headerTitle.innerText = "Giai điệu không gian";
    quickStopBtn.classList.add('hidden'); quickMuteBtn.classList.add('hidden'); quickClearBtn.classList.add('hidden');
    miniPlayer.classList.remove('bg-indigo-500/10', 'border-indigo-500/20');
    renderTrackList();
}

function loadProfileImages() {
    if (!db) return;
    getMediaFromDB("user_avatar_blob", function(blobFile) {
        if (blobFile) {
            if (currentAvatarUrl) URL.revokeObjectURL(currentAvatarUrl);
            currentAvatarUrl = URL.createObjectURL(blobFile);
            
            const mainPreview = document.getElementById('main-avatar-preview');
            if (mainPreview) { mainPreview.src = currentAvatarUrl; mainPreview.classList.remove('hidden'); }
            if (document.getElementById('main-avatar-placeholder')) document.getElementById('main-avatar-placeholder').classList.add('hidden');
            
            const popupPreview = document.getElementById('popup-avatar-preview');
            if (popupPreview) { popupPreview.src = currentAvatarUrl; popupPreview.classList.remove('hidden'); }
            if (document.getElementById('popup-avatar-placeholder')) document.getElementById('popup-avatar-placeholder').classList.add('hidden');
            
            const introImg = document.getElementById('intro-avatar-img');
            if (introImg) introImg.src = currentAvatarUrl;
            const introBox = document.getElementById('intro-avatar-box');
            if (introBox) introBox.classList.remove('hidden');
            const introIcon = document.getElementById('intro-star-icon');
            if (introIcon) introIcon.classList.add('hidden');
        }
    });
    if (document.getElementById('popup-name-input')) document.getElementById('popup-name-input').value = profileData.name || '';
    if (document.getElementById('main-profile-name')) {
        document.getElementById('main-profile-name').innerText = (profileData.name && profileData.name.trim() !== "") ? profileData.name : 'Kho báu nhỏ';
    }
    applyIntroWelcomeText();
}

function openProfileModal() {
    pendingAvatarFile = null;
    loadProfileImages();
    setupPopupInputsTheme();
    document.getElementById('modal-profile-edit').classList.replace('hidden', 'flex');
}
function closeProfileModal() {
    document.getElementById('modal-profile-edit').classList.replace('flex', 'hidden');
}

function uploadPopupAvatar(input) {
    if (input.files && input.files[0]) {
        pendingAvatarFile = input.files[0];
        const preview = document.getElementById('popup-avatar-preview');
        if (preview) { preview.src = URL.createObjectURL(pendingAvatarFile); preview.classList.remove('hidden'); }
        if (document.getElementById('popup-avatar-placeholder')) document.getElementById('popup-avatar-placeholder').classList.add('hidden');
    }
}

function savePopupProfile() {
    const nameInput = document.getElementById('popup-name-input').value.trim();
    profileData.name = nameInput; 
    localStorage.setItem('user_profile', JSON.stringify(profileData));
    
    if (document.getElementById('main-profile-name')) {
        document.getElementById('main-profile-name').innerText = (nameInput !== "") ? nameInput : 'Kho báu nhỏ';
    }

    if (pendingAvatarFile) {
        saveMediaToDB("user_avatar_blob", pendingAvatarFile, function() { 
            pendingAvatarFile = null; 
            loadProfileImages(); 
            closeProfileModal(); 
            showToast("Đã cập nhật hồ sơ cục bộ!");
        });
    } else {
        applyIntroWelcomeText();
        closeProfileModal(); 
        showToast("Đã cập nhật biệt danh!");
    }
}

function saveProfile() {
    showToast("Đã cập nhật cấu hình hệ thống!");
    closeSettings();
}

function openSettings() {
    document.getElementById('modal-settings').classList.replace('hidden', 'flex'); 
}
function closeSettings() { document.getElementById('modal-settings').classList.replace('flex', 'hidden'); }

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container'); if (!container) return;
    const toast = document.createElement('div');
    let colorClass = 'bg-emerald-500 border-emerald-400'; let icon = '✅';
    if (type === 'error') { colorClass = 'bg-red-500 border-red-400'; icon = '❌'; }
    toast.className = `${colorClass} border-2 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-2xl backdrop-blur-md toast-enter text-white pointer-events-auto`;
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.replace('toast-enter', 'toast-leave'); setTimeout(() => toast.remove(), 400); }, 3000);
}

function downloadMediaItem(id, fileName, fileType) {
    getMediaFromDB(id, (blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = fileName;
            document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        } else { showToast("Không tìm thấy tệp!", "error"); }
    });
}

function triggerConfetti() {
    confetti({ particleCount: 125, spread: 75, origin: { y: 0.65 }, colors: ['#f472b6', '#818cf8', '#c084fc'] });
}

function changeStudySubTab(subtype) { currentStudySubTab = subtype; updateSubTabsUI('study', subtype); loadVault(); }
function changeMediaSubTab(subtype) { currentMediaSubTab = subtype; updateSubTabsUI('media', subtype); loadVault(); }
function changeSocialSubTab(subtype) { currentSocialSubTab = subtype; updateSubTabsUI('social', subtype); loadVault(); }

function updateSubTabsUI(cat, activeSub) {
    const isLight = document.body.classList.contains('light-theme');
    const activeClass = 'flex-1 py-2.5 rounded-lg text-xs font-bold transition-all bg-indigo-600/30 text-indigo-400 border border-indigo-500/20';
    const inactiveClass = `flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${isLight ? 'text-amber-900 sub-tab-inactive-etc' : 'text-gray-400'}`;

    if (cat === 'study') {
        document.getElementById('sub-study-learn').className = activeSub === 'learn' ? activeClass : inactiveClass;
        document.getElementById('sub-study-teach').className = activeSub === 'teach' ? activeClass : inactiveClass;
    } else if (cat === 'media') {
        ['movie', 'youtube', 'tiktok'].forEach(t => {
            document.getElementById(`sub-media-${t}`).className = t === activeSub ? activeClass + ' truncate text-[11px]' : inactiveClass + ' truncate text-[11px]';
        });
    } else if (cat === 'social') {
        ['threads', 'indigo', 'facebook'].forEach(t => {
            document.getElementById(`sub-social-${t}`).className = t === activeSub ? activeClass + ' truncate text-[11px]' : inactiveClass + ' truncate text-[11px]';
        });
    }
    triggerTabAnimation();
}

function triggerTabAnimation() {
    const list = document.getElementById('vault-list');
    if (list) { list.classList.remove('tab-slide-fade'); void list.offsetWidth; list.classList.add('tab-slide-fade'); }
}

function updateStudyFileName(input) {
    if (input.files && input.files[0]) {
        document.getElementById('study-file-status').innerText = `Đã chọn: ${input.files[0].name.slice(0, 20)}...`;
        if (!document.getElementById('add-vault-title').value.trim()) {
            document.getElementById('add-vault-title').value = input.files[0].name.split('.').slice(0, -1).join('.');
        }
    }
}

function openFormModal(type, editId = null) {
    currentFormType = type; currentEditId = editId;
    const fields = document.getElementById('form-fields'); fields.innerHTML = '';
    let defName = '', defUrl = '';
    if (editId) { const v = vaultItems.find(x => x.id === editId); defName = v?.title || ''; defUrl = v?.url || ''; }

    const configs = {
        'wishlist': { t: "Mục mua sắm mới", d: "Bạn muốn lưu món đồ gì?", p: "Tên món đồ...", l: "Link sản phẩm..." },
        'media': { t: "Lưu liên kết giải trí 🎬", d: `Sẽ tự gom vào nhánh con ${currentMediaSubTab.toUpperCase()}`, p: "Tên video/phim...", l: "Dán link trực tiếp..." },
        'social': { t: "Lưu bài viết Social 📱", d: `Sẽ tự gom vào nhánh con ${currentSocialSubTab.toUpperCase()}`, p: "Tiêu đề bài viết...", l: "Dán đường dẫn Link MXH..." },
        'study': { t: "Cất tài liệu học & dạy 📚", d: `Sẽ tự gom vào nhánh con ${currentStudySubTab.toUpperCase()}`, p: "Tên tài liệu...", l: "Link Drive hoặc Website..." },
        'braindump': { t: "Khoảnh khắc bí mật 🔒", d: "Ảnh/Video lưu hoàn toàn cục bộ trên máy", p: "Ghi chú ngắn...", l: "" }
    };

    const c = configs[currentVaultCategory];
    document.getElementById('form-title').innerText = editId ? "Cập nhật mục" : c.t;
    document.getElementById('form-desc').innerText = c.d;

    let fileUpload = (currentVaultCategory === 'braindump' && !editId) ? `
        <div class="relative w-full h-32 bg-gray-900/30 border-2 border-gray-400/30 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2">
            <input type="file" id="add-vault-file" accept="image/*,video/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="document.getElementById('file-status').innerText=this.files[0].name">
            <span class="text-3xl">📸</span><span id="file-status" class="text-xs opacity-60">Chọn Ảnh / Video</span>
        </div>` : '';

    let studyFileUpload = (currentVaultCategory === 'study' && !editId) ? `
        <div class="relative w-full h-16 bg-gray-900/20 border border-dashed border-gray-700 rounded-2xl flex items-center justify-center gap-3">
            <input type="file" id="add-study-file" class="absolute inset-0 opacity-0 cursor-pointer" onchange="updateStudyFileName(this)">
            <span id="study-file-status" class="text-xs opacity-70">Hoặc chọn File đính kèm tải lên máy</span>
        </div>` : '';

    fields.innerHTML = `
        <input type="text" id="add-vault-title" value="${defName}" placeholder="${c.p}" class="w-full h-16 border rounded-2xl px-5 text-base outline-none focus:border-indigo-500 shadow-inner transition-all">
        ${currentVaultCategory !== 'braindump' ? `<input type="text" id="add-vault-url" value="${defUrl}" placeholder="${c.l}" class="w-full h-16 border rounded-2xl px-5 text-base outline-none focus:border-indigo-500 shadow-inner transition-all">` : ''}
        ${studyFileUpload}${fileUpload}`;

    fields.querySelectorAll('input[type="text"]').forEach(inp => {
        if(document.body.classList.contains('light-theme')) {
            inp.style.backgroundColor = "#fcf8f5"; inp.style.borderColor = "#d6ccc2"; inp.style.color = "#2b221a";
        } else {
            inp.style.backgroundColor = "rgba(17, 24, 39, 0.6)"; inp.style.borderColor = "rgba(255, 255, 255, 0.05)"; inp.style.color = "#f3f4f6";
        }
    });

    const m = document.getElementById('modal-form'); m.classList.remove('hidden'); m.classList.add('flex');
    setTimeout(() => document.getElementById('form-card').classList.remove('translate-y-full'), 10);
}

function closeFormModal() {
    document.getElementById('form-card').classList.add('translate-y-full');
    setTimeout(() => document.getElementById('modal-form').classList.replace('flex', 'hidden'), 300);
}
document.getElementById('modal-form').addEventListener('click', function(e) { if (e.target === this) closeFormModal(); });

function submitForm() {
    const title = document.getElementById('add-vault-title').value.trim();
    if (!title) return showToast("Tiêu đề trống!", "error");
    const uuid = () => Math.random().toString(36).substring(2, 15);

    if (currentVaultCategory === 'braindump' && !currentEditId) {
        const file = document.getElementById('add-vault-file').files[0];
        if (!file) return showToast("Chưa chọn file!", "error");
        const itemId = uuid();
        saveMediaToDB(itemId, file, () => {
            vaultItems.push({ id: itemId, title, isIndexedDB: true, fileType: file.type, category: 'braindump' });
            finalizeSubmit();
        });
    } else if (currentVaultCategory === 'study' && !currentEditId) {
        const sFile = document.getElementById('add-study-file').files[0];
        if (sFile) {
            const itemId = uuid();
            saveMediaToDB(itemId, sFile, () => {
                vaultItems.push({ id: itemId, title, isIndexedDB: true, fileType: sFile.type, fileName: sFile.name, category: 'study', studyType: currentStudySubTab });
                finalizeSubmit();
            });
        } else {
            const url = document.getElementById('add-vault-url').value.trim();
            vaultItems.push({ id: uuid(), title, url, category: 'study', studyType: currentStudySubTab });
            finalizeSubmit();
        }
    } else {
        if (currentEditId) {
            const idx = vaultItems.findIndex(v => v.id === currentEditId);
            if (idx > -1) {
                vaultItems[idx].title = title;
                if (currentVaultCategory !== 'braindump') vaultItems[idx].url = document.getElementById('add-vault-url').value.trim();
            }
        } else {
            const url = document.getElementById('add-vault-url').value.trim();
            let itemObj = { id: uuid(), title, url, category: currentVaultCategory };
            if (currentVaultCategory === 'media') itemObj.mediaType = currentMediaSubTab;
            if (currentVaultCategory === 'social') itemObj.socialType = currentSocialSubTab;
            vaultItems.push(itemObj);
        }
        finalizeSubmit();
    }
}

function finalizeSubmit() { localStorage.setItem('local_vault', JSON.stringify(vaultItems)); loadVault(); closeFormModal(); showToast("Đã ghi nhớ!"); }

function loadVault() {
    if (!db) return;
    const container = document.getElementById('vault-list'); container.innerHTML = '';
    const search = document.getElementById('vault-search').value.toLowerCase();
    
    let items = vaultItems.filter(i => i.category === currentVaultCategory);
    if (currentVaultCategory === 'study') items = items.filter(i => (i.studyType || 'learn') === currentStudySubTab);
    if (currentVaultCategory === 'media') items = items.filter(i => (i.mediaType || 'movie') === currentMediaSubTab);
    if (currentVaultCategory === 'social') items = items.filter(i => (i.socialType || 'threads') === currentSocialSubTab);

    if(search) items = items.filter(i => i.title.toLowerCase().includes(search));
    
    if(items.length === 0) {
        container.removeAttribute('class'); container.className = 'space-y-4 tab-slide-fade';
        let msg = "CHƯA LƯU LIÊN KẾT NÀO";
        if (currentVaultCategory === 'study') msg = (currentStudySubTab === 'learn') ? "CHƯA LƯU TÀI LIỆU TỰ HỌC NÀO" : "CHƯA LƯU TÀI LIỆU GIẢNG DẠY NÀO";
        if (currentVaultCategory === 'media') msg = "CHƯA LƯU LIÊN KẾT GIẢI TRÍ NÀO";
        if (currentVaultCategory === 'social') msg = `CHƯA LƯU NỘI DUNG ${currentSocialSubTab.toUpperCase()} NÀO`;
        if (currentVaultCategory === 'wishlist') msg = "KHO ĐỒ ĐANG TRỐNG";
        if (currentVaultCategory === 'braindump') msg = "KHO ĐỒ ĐANG TRỐNG";

        container.innerHTML = `
            <div class="py-16 text-center flex flex-col items-center justify-center">
                <div class="text-6xl mb-4 opacity-60">📦</div>
                <p class="text-sm font-bold uppercase tracking-widest mb-5 text-gray-400">${msg}</p>
                <button onclick="openFormModal('vault')" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-lg shadow-indigo-600/20">
                    ✨ Thêm mục đầu tiên ngay
                </button>
            </div>`;
        return;
    }

    container.removeAttribute('class');
    container.className = (currentVaultCategory === 'braindump') ? 'grid grid-cols-2 gap-3 tab-slide-fade' : 'space-y-4 tab-slide-fade';

    items.forEach(item => {
        let card = document.createElement('div');
        if (currentVaultCategory === 'braindump') {
            card.className = 'glass-card p-3 rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden group shadow-md';
            let mediaId = `media-${item.id}`;
            card.innerHTML = `
                <div class="w-full aspect-square bg-gray-900/40 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden relative shadow-inner">
                    <div id="${mediaId}" class="absolute inset-0 flex items-center justify-center text-[11px] italic opacity-50">⌛ Đang tải...</div>
                </div>
                <div class="flex flex-col gap-2 min-w-0 px-0.5 mt-1">
                    <h4 class="font-bold text-xs truncate h4-title-text">${item.title}</h4>
                    
                    <div class="flex items-center w-full pt-2 border-t border-white/5 gap-2">
                        <button onclick="downloadMediaItem('${item.id}', '${item.title}', '${item.fileType}')" class="flex-1 h-10 flex items-center justify-center bg-indigo-600/10 text-indigo-400 rounded-xl font-bold active:scale-95 transition">📥</button>
                        <button onclick="openFormModal('vault', '${item.id}')" class="flex-1 h-10 flex items-center justify-center bg-gray-500/10 rounded-xl font-bold text-white active:scale-95 transition">✏️</button>
                        <button onclick="deleteVaultItem('${item.id}')" class="flex-1 h-10 flex items-center justify-center bg-red-500/10 text-red-400 rounded-xl font-bold active:scale-95 transition">✕</button>
                    </div>
                </div>`;
            container.appendChild(card);
            getMediaFromDB(item.id, (blob) => {
                const el = document.getElementById(mediaId);
                if (el && blob) {
                    const url = URL.createObjectURL(blob);
                    el.outerHTML = item.fileType.startsWith('video/') ? `<video src="${url}" controls class="w-full h-full object-cover" playsinline></video>` : `<img src="${url}" class="w-full h-full object-cover">`;
                }
            });
        } else {
            card.className = 'glass-card p-5 rounded-3xl flex flex-col gap-4';
            let buttonsHTML = `
                <button onclick="openFormModal('vault', '${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl">✏️</button>
                <button onclick="deleteVaultItem('${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl text-red-400">✕</button>`;
            
            if (item.isIndexedDB) {
                buttonsHTML = `
                    <button onclick="downloadMediaItem('${item.id}', '${item.fileName||item.title}', '${item.fileType}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl text-indigo-400">📥</button>
                    <button onclick="openFormModal('vault', '${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl font-bold text-white">✏️</button>
                    <button onclick="deleteVaultItem('${item.id}')" class="w-11 h-11 flex items-center justify-center bg-red-500/10 text-red-400 rounded-xl">✕</button>`;
            }

            let iconType = "📄";
            if (item.category === 'media') iconType = (item.mediaType === 'youtube') ? "📺" : (item.mediaType === 'tiktok') ? "🎵" : "🎬";
            if (item.category === 'social') iconType = (item.socialType === 'threads') ? "🧵" : (item.socialType === 'instagram') ? "📸" : "👥";

            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1 overflow-hidden pr-2 flex items-start gap-2.5">
                        <div class="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">${iconType}</div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-bold text-base truncate h4-title-text">${item.title}</h4>
                            ${item.url ? `<a href="${item.url}" target="_blank" class="text-xs text-indigo-400 font-bold mt-1 inline-block">🔗 Mở liên kết</a>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">${buttonsHTML}</div>
                </div>`;
            container.appendChild(card);
        }
    });
}

function filterVault(cat) { 
    currentVaultCategory = cat; 
    document.querySelectorAll('.vault-filter-btn').forEach(b => { b.classList.replace('bg-pink-600', 'bg-gray-900/60'); b.classList.add('text-gray-400'); });
    if(document.getElementById(`vbtn-${cat}`)) { document.getElementById(`vbtn-${cat}`).classList.replace('bg-gray-900/60', 'bg-pink-600'); document.getElementById(`vbtn-${cat}`).classList.remove('text-gray-400'); }
    
    document.getElementById('study-sub-tabs').classList.add('hidden');
    document.getElementById('media-sub-tabs').classList.add('hidden');
    document.getElementById('social-sub-tabs').classList.add('hidden');

    if (cat === 'study') { document.getElementById('study-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('study', currentStudySubTab); }
    else if (cat === 'media') { document.getElementById('media-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('media', currentMediaSubTab); }
    else if (cat === 'social') { document.getElementById('social-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('social', currentSocialSubTab); }
    
    loadVault(); 
}

let confirmCallback = null;
function deleteVaultItem(id) {
    confirmCallback = () => {
        if (vaultItems.find(i => i.id === id)?.isIndexedDB) deleteMediaFromDB(id);
        vaultItems = vaultItems.filter(i => i.id !== id); localStorage.setItem('local_vault', JSON.stringify(vaultItems));
        loadVault(); showToast("Đã xóa vĩnh viễn!");
    };
    document.getElementById('modal-confirm').classList.replace('hidden', 'flex');
    setTimeout(() => document.getElementById('modal-confirm').classList.replace('opacity-0', 'opacity-100'), 10);
}
function closeConfirmModal() { document.getElementById('modal-confirm').classList.replace('opacity-100', 'opacity-0'); setTimeout(() => document.getElementById('modal-confirm').classList.replace('flex', 'hidden'), 300); }
document.getElementById('btn-confirm-action').onclick = () => { confirmCallback?.(); closeConfirmModal(); };

let db;
const dbRequest = indexedDB.open("SecureMomentsDB", 1);
dbRequest.onupgradeneeded = function(e) {
    let database = e.target.result;
    if (!database.objectStoreNames.contains("mediaFiles")) database.createObjectStore("mediaFiles", { keyPath: "id" });
};
dbRequest.onsuccess = function(e) { db = e.target.result; loadVault(); loadProfileImages(); };

function saveMediaToDB(id, blobData, callback) {
    let transaction = db.transaction(["mediaFiles"], "readwrite");
    let store = transaction.objectStore("mediaFiles");
    store.put({ id: id, data: blobData }).onsuccess = callback;
}

function getMediaFromDB(id, callback) {
    if (!db) return callback(null);
    let transaction = db.transaction(["mediaFiles"], "readonly");
    let store = transaction.objectStore("mediaFiles");
    store.get(id).onsuccess = function(e) { callback(e.target.result ? e.target.result.data : null); };
}

function deleteMediaFromDB(id) {
    db.transaction(["mediaFiles"], "readwrite").objectStore("mediaFiles").delete(id);
}

window.addEventListener('DOMContentLoaded', () => { 
    updateTimeAndTheme(); initPasswordScreen(); filterVault('wishlist'); 
});
