let vaultItems = JSON.parse(localStorage.getItem('local_vault')) || [];
let profileData = JSON.parse(localStorage.getItem('user_profile')) || { name: '' };
let currentVaultCategory = 'wishlist';
let currentWishlistSubTab = 'online';
let currentStudySubTab = 'learn';
let currentMediaSubTab = 'movie';
let currentSocialSubTab = 'threads';
let currentBraindumpSubTab = 'image';
let currentFormType = '', currentEditId = null;
let currentAvatarUrl = null;
let pendingAvatarFile = null;
let isHolidayGreetingActive = false;

// BIẾN CHO PHÂN TRANG (PAGINATION / LAZY LOAD) TOÀN DIỆN KHÔNG LAG
let currentPageItemLimit = 12; // Mỗi lần load tối đa 12 mục
let currentLoadedCount = 12;
let trackedBlobUrls = {}; // Theo dõi và giải phóng bộ nhớ đệm ảo

const starMessages = [
    () => `Mong ngày hôm nay sẽ dịu dàng với ${profileData.name || 'đại ka'}.`,
    () => "Đừng lo lắng quá, mọi chuyện rồi sẽ ổn thôi mà."
];


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

    let userBday = 2;
    let userBmonth = 10;
    if (profileData.birthday) {
        const parts = profileData.birthday.split('-');
        if (parts.length === 3) {
            userBmonth = parseInt(parts[1], 10);
            userBday = parseInt(parts[2], 10);
        }
    }

    const userName = profileData.name ? profileData.name : 'đại ka';

    if (date === userBday && month === userBmonth) {
        holidayId = `birthday_${year}`;
        currentTitle = "Happy Birthday Princess! 🎂";
        currentMsg = `Chúc mừng sinh nhật ${userName}! Tuổi mới thật hạnh phúc, xinh đẹp và luôn là phiên bản hoàn hảo nhất nhé! 💕`;
        currentIcon = "🎉";
        hasConfetti = true;
    } else if (date === 25 && month === 12) {
        holidayId = `noel_${year}`;
        currentTitle = "Merry Christmas! 🎄";
        currentMsg = `Giáng Sinh ấm áp nhé! Chúc ${userName} luôn hạnh phúc, bình yên và nhận được thật nhiều điều ngọt ngào trong đêm đông này! ❄️`;
        currentIcon = "☃️";
    } else if (date === 8 && month === 3) {
        holidayId = `women_day_${year}`;
        currentTitle = "Happy Women's Day! 🌸";
        currentMsg = `Chúc ngày 8/3 của ${userName} luôn ngập tràn những điều ngọt ngào. Hãy tỏa sáng theo cách của riêng ${userName}, vì ${userName} xứng đáng với mọi điều tốt đẹp nhất thế gian này!`;
        currentIcon = "💝";
    } else if (date === 20 && month === 10) {
        holidayId = `vn_women_${year}`;
        currentTitle = "Ngày Của Nhành Hoa Đẹp Nhất 💐";
        currentMsg = `Chào mừng ngày 20/10! Chúc ${userName} luôn rạng rỡ, xinh tươi và có một ngày tràn đầy niềm vui, sự chiều chuộng, dịu dàng.`;
        currentIcon = "❤️";
    } else if (date === 20 && month === 11) {
        holidayId = `teacher_${year}`;
        currentTitle = "Tri Ân Ngày 20/11 ✨";
        currentMsg = `Chúc ${userName} một ngày 20/11 thật ý nghĩa, rạng rỡ và nhiều niềm vui!`;
        currentIcon = "👩‍🏫";
    } else if (date === 1 && month === 1) {
        holidayId = `tet_${month}_${date}_${year}`;
        currentTitle = "Chúc Mừng Năm Mới! 🧧";
        currentMsg = `Năm mới đến rồi, chúc ${userName} và gia đình luôn bình an, vạn điều may mắn và thành công rực rỡ!`;
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
            welcomeText.innerText = (profileData && profileData.name && profileData.name.trim() !== "") ? `Xin chào ${profileData.name}...` : "Xin chào đại ka...";
        }
        if (starText) {
            starText.innerText = starMessages[Math.floor(Math.random() * starMessages.length)]();
        }
    }
}

function setupPopupInputsTheme() {
    const ctrl = document.getElementById('popup-name-input');
    if (ctrl) {
        if (document.body.classList.contains('light-theme')) {
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
    if (document.getElementById('lock-pwd-1')) document.getElementById('lock-pwd-1').value = "";
    if (document.getElementById('lock-pwd-2')) document.getElementById('lock-pwd-2').value = "";
    if (document.getElementById('lock-pwd-input')) document.getElementById('lock-pwd-input').value = "";

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
        lockScreen.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
            lockScreen.remove();
            const intro = document.getElementById('intro-screen');
            if (intro) {
                const isHolidayToday = runHolidayCheckRoutine();
                loadProfileImages();
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
            } else {
                loadProfileImages();
            }
        }, 500);
    }
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

function loadProfileImages() {
    if (!db) return;
    getMediaFromDB("user_avatar_blob", function (blobFile) {
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
    if (document.getElementById('popup-birthday-input')) document.getElementById('popup-birthday-input').value = profileData.birthday || '';
    if (document.getElementById('main-profile-name')) {
        document.getElementById('main-profile-name').innerText = (profileData.name && profileData.name.trim() !== "") ? profileData.name : 'Đại Ka';
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
    const birthdayInput = document.getElementById('popup-birthday-input') ? document.getElementById('popup-birthday-input').value : '';

    profileData.name = nameInput;
    profileData.birthday = birthdayInput;
    localStorage.setItem('user_profile', JSON.stringify(profileData));

    if (document.getElementById('main-profile-name')) {
        document.getElementById('main-profile-name').innerText = (nameInput !== "") ? nameInput : 'Người Dùng';
    }

    if (pendingAvatarFile) {
        saveMediaToDB("user_avatar_blob", pendingAvatarFile, function () {
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
    const newPass = document.getElementById('change-app-password').value.trim();
    const confirmPass = document.getElementById('change-app-password-confirm').value.trim();

    if (newPass !== "") {
        if (newPass === confirmPass) {
            localStorage.setItem('app_password', newPass);
            showToast("Đã cập nhật mật khẩu mới thành công!");

            document.getElementById('change-app-password').value = "";
            document.getElementById('change-app-password-confirm').value = "";
        } else {
            showToast("Mật khẩu xác nhận không khớp!", "error");
            return;
        }
    } else {
        showToast("Đã cập nhật cấu hình hệ thống!");
    }
    closeSettings();
}

function changeWishlistSubTab(subtype) { currentWishlistSubTab = subtype; updateSubTabsUI('wishlist', subtype); resetPaginationAndLoad(); }
function changeStudySubTab(subtype) { currentStudySubTab = subtype; updateSubTabsUI('study', subtype); resetPaginationAndLoad(); }
function changeMediaSubTab(subtype) { currentMediaSubTab = subtype; updateSubTabsUI('media', subtype); resetPaginationAndLoad(); }
function changeSocialSubTab(subtype) { currentSocialSubTab = subtype; updateSubTabsUI('social', subtype); resetPaginationAndLoad(); }
function changeBraindumpSubTab(subtype) { currentBraindumpSubTab = subtype; updateSubTabsUI('braindump', subtype); resetPaginationAndLoad(); }

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

function updateSubTabsUI(cat, activeSub) {
    const isLight = document.body.classList.contains('light-theme');
    const activeClass = 'flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 truncate';
    const inactiveClass = `flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${isLight ? 'text-amber-900 sub-tab-inactive-etc' : 'text-gray-400'} truncate`;

    if (cat === 'wishlist') {
        ['online', 'ticket', 'hotel'].forEach(t => {
            document.getElementById(`sub-wishlist-${t}`).className = t === activeSub ? activeClass : inactiveClass;
        });
    } else if (cat === 'study') {
        document.getElementById('sub-study-learn').className = activeSub === 'learn' ? activeClass + ' text-xs' : inactiveClass + ' text-xs';
        document.getElementById('sub-study-teach').className = activeSub === 'teach' ? activeClass + ' text-xs' : inactiveClass + ' text-xs';
    } else if (cat === 'media') {
        ['movie', 'youtube', 'tiktok'].forEach(t => {
            document.getElementById(`sub-media-${t}`).className = t === activeSub ? activeClass : inactiveClass;
        });
    } else if (cat === 'social') {
        ['threads', 'instagram', 'facebook'].forEach(t => {
            document.getElementById(`sub-social-${t}`).className = t === activeSub ? activeClass : inactiveClass;
        });
    } else if (cat === 'braindump') {
        document.getElementById('sub-braindump-image').className = activeSub === 'image' ? activeClass + ' text-xs' : inactiveClass + ' text-xs';
        document.getElementById('sub-braindump-video').className = activeSub === 'video' ? activeClass + ' text-xs' : inactiveClass + ' text-xs';
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

    let wishlistTitlePlaceholder = "Tên món đồ...";
    let wishlistUrlPlaceholder = "Link sản phẩm...";
    let wishlistFormDesc = "Em muốn lưu món đồ gì?";

    if (currentWishlistSubTab === 'ticket') {
        wishlistTitlePlaceholder = "Tên phim / Chuyến bay / Show diễn...";
        wishlistUrlPlaceholder = "Link mã vé / Website đặt vé...";
        wishlistFormDesc = "Lưu thông tin đặt vé cho lịch trình sắp tới";
    } else if (currentWishlistSubTab === 'hotel') {
        wishlistTitlePlaceholder = "Tên Khách sạn / Homestay / Resort...";
        wishlistUrlPlaceholder = "Link đặt phòng / Bản đồ định vị...";
        wishlistFormDesc = "Quản lý điểm lưu trú cho chuyến đi";
    }

    const configs = {
        'wishlist': { t: "Thông tin mua sắm & đặt chỗ 🛍️", d: wishlistFormDesc, p: wishlistTitlePlaceholder, l: wishlistUrlPlaceholder },
        'media': { t: "Lưu liên kết giải trí 🎬", d: `Sẽ tự gom vào nhánh con ${currentMediaSubTab.toUpperCase()}`, p: "Tên video/phim...", l: "Dán link trực tiếp..." },
        'social': { t: "Lưu bài viết Social 📱", d: `Sẽ tự gom vào nhánh con ${currentSocialSubTab.toUpperCase()}`, p: "Tiêu đề bài viết...", l: "Dán đường dẫn Link MXH..." },
        'study': { t: "Cất tài liệu học & dạy 📚", d: `Sẽ tự gom vào nhánh con ${currentStudySubTab.toUpperCase()}`, p: "Tên tài liệu...", l: "Link Drive hoặc Website..." },
        'braindump': { t: "Khoảnh khắc bí mật 🔒", d: `Sẽ tự động đưa vào mục ${currentBraindumpSubTab === 'image' ? 'ẢNH' : 'VIDEO'} theo tệp tải lên`, p: "Ghi chú ngắn cho khoảnh khắc...", l: "" }
    };

    const c = configs[currentVaultCategory];
    document.getElementById('form-title').innerText = editId ? "Cập nhật mục" : c.t;
    document.getElementById('form-desc').innerText = c.d;

    let fileUpload = (currentVaultCategory === 'braindump' && !editId) ? `
                <div class="relative w-full h-32 bg-gray-900/30 border-2 border-gray-400/30 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2">
                    <input type="file" id="add-vault-file" accept="${currentBraindumpSubTab === 'image' ? 'image/*' : 'video/*'}" class="absolute inset-0 opacity-0 cursor-pointer" onchange="document.getElementById('file-status').innerText=this.files[0].name">
                    <span class="text-3xl">${currentBraindumpSubTab === 'image' ? '📸' : '🎬'}</span><span id="file-status" class="text-xs opacity-60">Chọn tệp tin bí mật</span>
                </div>` : '';

    let studyFileUpload = (currentVaultCategory === 'study' && !editId) ? `
                <div class="relative w-full h-16 bg-gray-900/20 border border-dashed border-gray-700 rounded-2xl flex items-center justify-center gap-3">
                    <input type="file" id="add-study-file" class="absolute inset-0 opacity-0 cursor-pointer" onchange="updateStudyFileName(this)">
                    <span id="study-file-status" class="text-xs opacity-70">Hoặc chọn File đính kèm tải lên máy</span>
                </div>` : '';

    let secondInputHTML = '';
    if (currentVaultCategory !== 'braindump') {
        secondInputHTML = `<input type="text" id="add-vault-url" value="${defUrl}" placeholder="${c.l}" class="w-full h-16 border rounded-2xl px-5 text-base outline-none focus:border-indigo-500 shadow-inner transition-all">`;
    }

    fields.innerHTML = `
                <input type="text" id="add-vault-title" value="${defName}" placeholder="${c.p}" class="w-full h-16 border rounded-2xl px-5 text-base outline-none focus:border-indigo-500 shadow-inner transition-all">
                ${secondInputHTML}
                ${studyFileUpload}${fileUpload}`;

    fields.querySelectorAll('input').forEach(inp => {
        if (document.body.classList.contains('light-theme')) {
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
document.getElementById('modal-form').addEventListener('click', function (e) { if (e.target === this) closeFormModal(); });

function submitForm() {
    const title = document.getElementById('add-vault-title').value.trim();
    if (!title) return showToast("Tiêu đề trống!", "error");
    const uuid = () => Math.random().toString(36).substring(2, 15);

    if (currentVaultCategory === 'braindump' && !currentEditId) {
        const file = document.getElementById('add-vault-file').files[0];
        if (!file) return showToast("Chưa chọn file!", "error");

        // GIỚI HẠN AN TOÀN TRÁNH TRÀN BỘ NHỚ LÚC UP: 40MB
        if (file.size > 40 * 1024 * 1024) {
            return showToast("Tệp quá lớn (Tối đa 40MB) để tránh lỗi trình duyệt!", "error");
        }

        const itemId = uuid();
        saveMediaToDB(itemId, file, () => {
            vaultItems.unshift({ id: itemId, title, isIndexedDB: true, fileType: file.type, category: 'braindump', secretType: currentBraindumpSubTab });
            finalizeSubmit();
        });
    } else if (currentVaultCategory === 'study' && !currentEditId) {
        const sFile = document.getElementById('add-study-file').files[0];
        if (sFile) {
            if (sFile.size > 40 * 1024 * 1024) {
                return showToast("Tệp quá lớn (Tối đa 40MB) để bảo mật hệ thống!", "error");
            }
            const itemId = uuid();
            saveMediaToDB(itemId, sFile, () => {
                vaultItems.unshift({ id: itemId, title, isIndexedDB: true, fileType: sFile.type, fileName: sFile.name, category: 'study', studyType: currentStudySubTab });
                finalizeSubmit();
            });
        } else {
            const url = document.getElementById('add-vault-url').value.trim();
            vaultItems.unshift({ id: uuid(), title, url, category: 'study', studyType: currentStudySubTab });
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
            if (currentVaultCategory === 'wishlist') itemObj.wishlistType = currentWishlistSubTab;
            if (currentVaultCategory === 'media') itemObj.mediaType = currentMediaSubTab;
            if (currentVaultCategory === 'social') itemObj.socialType = currentSocialSubTab;
            vaultItems.unshift(itemObj);
        }
        finalizeSubmit();
    }
}

// SỬA LẠI HÀM NÀY: Reset phân trang khi thêm mới dữ liệu
function finalizeSubmit() {
    localStorage.setItem('local_vault', JSON.stringify(vaultItems));
    resetPaginationAndLoad();
    closeFormModal();
    showToast("Đã ghi nhớ!");
}

// CHỨC NĂNG MỚI: Reset bộ đếm phân trang khi chuyển tab hoặc tìm kiếm
function resetPaginationAndLoad() {
    currentLoadedCount = currentPageItemLimit;

    // Giải phóng toàn bộ Blob URL cũ tránh rò rỉ dung lượng RAM của máy
    for (let key in trackedBlobUrls) {
        if (trackedBlobUrls[key]) {
            URL.revokeObjectURL(trackedBlobUrls[key]);
        }
    }
    trackedBlobUrls = {};

    loadVault();
    // Cuộn mượt lên trên đầu
    document.getElementById('main-scroll-wrapper').scrollTop = 0;
}

// SỬA ĐỔI TOÀN DIỆN: Hàm load dữ liệu áp dụng Infinite Scroll & Lazy Load cấu trúc cực khỏe
function loadVault() {
    if (!db) return;
    const container = document.getElementById('vault-list');
    const search = document.getElementById('vault-search').value.toLowerCase();

    let items = vaultItems.filter(i => i.category === currentVaultCategory);
    if (currentVaultCategory === 'wishlist') items = items.filter(i => (i.wishlistType || 'online') === currentWishlistSubTab);
    if (currentVaultCategory === 'study') items = items.filter(i => (i.studyType || 'learn') === currentStudySubTab);
    if (currentVaultCategory === 'media') items = items.filter(i => (i.mediaType || 'movie') === currentMediaSubTab);
    if (currentVaultCategory === 'social') items = items.filter(i => (i.socialType || 'threads') === currentSocialSubTab);
    if (currentVaultCategory === 'braindump') items = items.filter(i => (i.secretType || 'image') === currentBraindumpSubTab);

    if (search) items = items.filter(i => i.title.toLowerCase().includes(search));

    if (items.length === 0) {
        container.innerHTML = '';
        container.removeAttribute('class'); container.className = 'space-y-4 tab-slide-fade';
        let msg = "CHƯA LƯU LIÊN KẾT NÀO";
        if (currentVaultCategory === 'wishlist') {
            msg = (currentWishlistSubTab === 'online') ? "DANH SÁCH MUA SẮM TRỐNG" : (currentWishlistSubTab === 'ticket' ? "DANH SÁCH ĐẶT VÉ TRỐNG" : "DANH SÁCH ĐẶT PHÒNG TRỐNG");
        }
        if (currentVaultCategory === 'study') msg = (currentStudySubTab === 'learn') ? "CHƯA LƯU TÀI LIỆU TỰ HỌC NÀO" : "CHƯA LƯU TÀI LIỆU GIẢNG DẠY NÀO";
        if (currentVaultCategory === 'media') msg = "CHƯA LƯU LIÊN KẾT NÀO";
        if (currentVaultCategory === 'social') msg = `CHƯA LƯU NỘI DUNG ${currentSocialSubTab.toUpperCase()} NÀO`;
        if (currentVaultCategory === 'braindump') msg = currentBraindumpSubTab === 'image' ? "DANH SÁCH ẢNH TRỐNG" : "DANH SÁCH VIDEO TRỐNG";

        container.innerHTML = `
                    <div class="py-16 text-center flex flex-col items-center justify-center">
                        <div class="text-6xl mb-4 opacity-60">📦</div>
                        <p class="text-sm font-bold uppercase tracking-widest mb-5 text-gray-400">${msg}</p>
                        <button onclick="openFormModal('vault')" class="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 rounded-xl text-xs font-extrabold active:scale-95 transition shadow-lg shadow-emerald-400/20">
                            ✨ Thêm mục đầu tiên ngay
                        </button>
                    </div>`;
        return;
    }

    // CHỈ LẤY ĐÚNG SỐ LƯỢNG PHÂN TRANG (Ví dụ 12 cái đầu tiên)
    let paginatedItems = items.slice(0, currentLoadedCount);

    // Giữ cấu trúc Grid cho Secret và List cho các tab khác
    container.removeAttribute('class');
    container.className = (currentVaultCategory === 'braindump') ? 'grid grid-cols-2 gap-3 tab-slide-fade' : 'space-y-4 tab-slide-fade';

    // Tạo fragment để cập nhật DOM 1 lần duy nhất, tránh lag giật giao diện
    let fragment = document.createDocumentFragment();

    paginatedItems.forEach(item => {
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
            fragment.appendChild(card);

            // CHỈ LẤY FILE KHI ĐƯỢC HIỂN THỊ (LAZY LOAD FILE TỪ DATABASE)
            setTimeout(() => {
                if (!trackedBlobUrls[item.id]) {
                    getMediaFromDB(item.id, (blob) => {
                        const el = document.getElementById(mediaId);
                        if (el && blob) {
                            const url = URL.createObjectURL(blob);
                            trackedBlobUrls[item.id] = url; // Lưu vết để xóa sau
                            el.outerHTML = item.fileType.startsWith('video/') ? `<video src="${url}" controls class="w-full h-full object-cover" playsinline preload="metadata"></video>` : `<img src="${url}" class="w-full h-full object-cover" loading="lazy">`;
                        } else if (el) {
                            el.innerHTML = `<div class="flex flex-col items-center opacity-40"><span class="text-xl">⚠️</span><span class="text-[9px]">Thiếu file gốc</span></div>`;
                        }
                    });
                } else {
                    const el = document.getElementById(mediaId);
                    if (el) {
                        el.outerHTML = item.fileType.startsWith('video/') ? `<video src="${trackedBlobUrls[item.id]}" controls class="w-full h-full object-cover" playsinline></video>` : `<img src="${trackedBlobUrls[item.id]}" class="w-full h-full object-cover">`;
                    }
                }
            }, 50);

        } else {
            card.className = 'glass-card p-5 rounded-3xl flex flex-col gap-4';
            let buttonsHTML = `
                        <button onclick="openFormModal('vault', '${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl">✏️</button>
                        <button onclick="deleteVaultItem('${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl text-red-400">✕</button>`;

            if (item.isIndexedDB) {
                buttonsHTML = `
                            <button onclick="downloadMediaItem('${item.id}', '${item.fileName || item.title}', '${item.fileType}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl text-indigo-400">📥</button>
                            <button onclick="openFormModal('vault', '${item.id}')" class="w-11 h-11 flex items-center justify-center bg-gray-500/10 rounded-xl font-bold text-white">✏️</button>
                            <button onclick="deleteVaultItem('${item.id}')" class="w-11 h-11 flex items-center justify-center bg-red-500/10 text-red-400 rounded-xl">✕</button>`;
            }

            let iconType = "📄";
            let actionLinkHTML = '';

            if (item.category === 'wishlist') iconType = (item.wishlistType === 'ticket') ? "🎫" : (item.wishlistType === 'hotel' ? "🏨" : "🛍️");
            if (item.category === 'media') iconType = (item.mediaType === 'youtube') ? "📺" : (item.mediaType === 'tiktok') ? "🎵" : "🎬";
            if (item.category === 'social') iconType = (item.socialType === 'threads') ? "🧵" : (item.socialType === 'instagram') ? "📸" : "👥";

            if (item.url) {
                actionLinkHTML = `<a href="${item.url}" target="_blank" class="text-xs text-indigo-400 font-bold mt-1 inline-block">🔗 Mở liên kết</a>`;
            }

            card.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex-1 overflow-hidden pr-2 flex items-start gap-2.5">
                                <div class="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">${iconType}</div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold text-base truncate h4-title-text">${item.title}</h4>
                                    ${actionLinkHTML}
                                </div>
                            </div>
                            <div class="flex items-center gap-3 shrink-0">${buttonsHTML}</div>
                        </div>`;
            fragment.appendChild(card);
        }
    });

    container.innerHTML = '';
    container.appendChild(fragment);

    // THÊM NÚT TẢI THÊM NẾU CÒN PHẦN TỬ PHÍA SAU
    if (items.length > currentLoadedCount) {
        let loadMoreDiv = document.createElement('div');
        loadMoreDiv.className = 'col-span-2 pt-4 pb-2 text-center w-full';
        loadMoreDiv.innerHTML = `
                    <button onclick="triggerLoadNextPage()" class="w-full py-3.5 bg-gray-500/10 border border-white/5 rounded-2xl text-xs font-bold opacity-80 active:scale-95 transition-all">
                        Xem Thêm Khoảnh Khắc Phía Trước 📜
                    </button>
                `;
        container.appendChild(loadMoreDiv);
    }
}

// CHỨC NĂNG MỚI: Kích hoạt tải trang tiếp theo khi cô ấy ấn nút hoặc cuộn
function triggerLoadNextPage() {
    currentLoadedCount += currentPageItemLimit;
    loadVault();
}

// LẮNG NGHE SỰ KIỆN CUỘN TỰ ĐỘNG (INFINITE SCROLL) CỰC KỲ THÔNG MINH
document.getElementById('main-scroll-wrapper').addEventListener('scroll', function () {
    // Khi cuộn gần sát đáy 80px, tự động gọi xem thêm dữ liệu
    if (this.scrollTop + this.clientHeight >= this.scrollHeight - 80) {
        const search = document.getElementById('vault-search').value.toLowerCase();
        let items = vaultItems.filter(i => i.category === currentVaultCategory);
        if (currentVaultCategory === 'wishlist') items = items.filter(i => (i.wishlistType || 'online') === currentWishlistSubTab);
        if (currentVaultCategory === 'study') items = items.filter(i => (i.studyType || 'learn') === currentStudySubTab);
        if (currentVaultCategory === 'media') items = items.filter(i => (i.mediaType || 'movie') === currentMediaSubTab);
        if (currentVaultCategory === 'social') items = items.filter(i => (i.socialType || 'threads') === currentSocialSubTab);
        if (currentVaultCategory === 'braindump') items = items.filter(i => (i.secretType || 'image') === currentBraindumpSubTab);
        if (search) items = items.filter(i => i.title.toLowerCase().includes(search));

        if (items.length > currentLoadedCount) {
            triggerLoadNextPage();
        }
    }
});

// SỬA LẠI HÀM NÀY: Gọi reset để tối ưu RAM hoàn chỉnh khi chuyển danh mục chính
function filterVault(cat) {
    currentVaultCategory = cat;
    document.querySelectorAll('.vault-filter-btn').forEach(b => { b.classList.replace('bg-pink-600', 'bg-gray-900/60'); b.classList.add('text-gray-400'); });
    if (document.getElementById(`vbtn-${cat}`)) { document.getElementById(`vbtn-${cat}`).classList.replace('bg-gray-900/60', 'bg-pink-600'); document.getElementById(`vbtn-${cat}`).classList.remove('text-gray-400'); }

    document.getElementById('wishlist-sub-tabs').classList.add('hidden');
    document.getElementById('study-sub-tabs').classList.add('hidden');
    document.getElementById('media-sub-tabs').classList.add('hidden');
    document.getElementById('social-sub-tabs').classList.add('hidden');
    document.getElementById('braindump-sub-tabs').classList.add('hidden');

    if (cat === 'wishlist') { document.getElementById('wishlist-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('wishlist', currentWishlistSubTab); }
    else if (cat === 'study') { document.getElementById('study-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('study', currentStudySubTab); }
    else if (cat === 'media') { document.getElementById('media-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('media', currentMediaSubTab); }
    else if (cat === 'social') { document.getElementById('social-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('social', currentSocialSubTab); }
    else if (cat === 'braindump') { document.getElementById('braindump-sub-tabs').classList.replace('hidden', 'flex'); updateSubTabsUI('braindump', currentBraindumpSubTab); }

    resetPaginationAndLoad();
}

let confirmCallback = null;
function deleteVaultItem(id) {
    confirmCallback = () => {
        if (vaultItems.find(i => i.id === id)?.isIndexedDB) deleteMediaFromDB(id);

        // Giải phóng bộ nhớ đệm ảo của file bị xóa ngay lập tức
        if (trackedBlobUrls[id]) {
            URL.revokeObjectURL(trackedBlobUrls[id]);
            delete trackedBlobUrls[id];
        }

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
dbRequest.onupgradeneeded = function (e) {
    let database = e.target.result;
    if (!database.objectStoreNames.contains("mediaFiles")) database.createObjectStore("mediaFiles", { keyPath: "id" });
};
dbRequest.onsuccess = function (e) { db = e.target.result; resetPaginationAndLoad(); loadProfileImages(); };

function saveMediaToDB(id, blobData, callback) {
    let transaction = db.transaction(["mediaFiles"], "readwrite");
    let store = transaction.objectStore("mediaFiles");
    store.put({ id: id, data: blobData }).onsuccess = callback;
}

function getMediaFromDB(id, callback) {
    if (!db) return callback(null);
    try {
        let transaction = db.transaction(["mediaFiles"], "readonly");
        let store = transaction.objectStore("mediaFiles");
        let request = store.get(id);
        request.onsuccess = function (e) { callback(e.target.result ? e.target.result.data : null); };
        request.onerror = function () { callback(null); };
    } catch (e) { callback(null); }
}

function deleteMediaFromDB(id) {
    db.transaction(["mediaFiles"], "readwrite").objectStore("mediaFiles").delete(id);
}

window.addEventListener('DOMContentLoaded', () => {
    updateTimeAndTheme(); initPasswordScreen(); filterVault('wishlist');
});

let appLogOutTimer = null;

// TỰ ĐỘNG KHÓA MÀN HÌNH CÓ THỜI GIAN CHỜ (1 PHÚT)
document.addEventListener('visibilitychange', () => {
    const hasPassword = localStorage.getItem('app_password');
    if (!hasPassword) return; // Nếu chưa cài pass thì bỏ qua

    if (document.visibilityState === 'hidden') {
        // Khi cô ấy thoát ra ngoài, bắt đầu đếm ngược 60 giây (60000 ms)
        appLogOutTimer = setTimeout(() => {
            // Nếu quá 1 phút mà chưa quay lại, tiến hành dựng màn hình khóa
            if (!document.getElementById('lock-screen')) {
                const lockDiv = document.createElement('div');
                lockDiv.id = 'lock-screen';
                lockDiv.className = 'fixed inset-0 z-[1005] flex flex-col items-center justify-center text-center px-4 transition-all duration-500';
                lockDiv.innerHTML = `
                            <div class="star-dust" style="top:10%; left:20%;"></div>
                            <div class="star-dust" style="top:25%; right:15%; animation-delay: 0.5s;"></div>
                            <div class="star-dust" style="top:70%; left:10%; animation-delay: 1.2s;"></div>
                            <div class="star-dust" style="top:85%; right:25%; animation-delay: 0.8s;"></div>
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] -translate-x-10 -translate-y-10"></div>
                                <div class="w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] translate-x-10 translate-y-10"></div>
                            </div>
                            <div class="glass-card w-full max-w-md sm:max-w-sm p-8 space-y-6 shadow-2xl relative z-10 fade-in flex flex-col items-center">
                                <div class="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🔒</div>
                                <div class="space-y-1.5">
                                    <h2 id="lock-title" class="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Không Gian Bảo Mật</h2>
                                    <p id="lock-desc" class="text-xs text-gray-700 font-medium">Vui lòng nhập mật mã để truy cập mật thất</p>
                                </div>
                                <div class="w-full space-y-3 pt-2" id="lock-inputs-container"></div>
                                <button onclick="checkOrSetPassword()" class="h-14 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-600/20 active:scale-[0.96] transition-all">
                                    Xác Nhận Nhập 🔑
                                </button>
                            </div>
                        `;
                document.body.appendChild(lockDiv);
            }
            initPasswordScreen();
        }, 60000);

    } else if (document.visibilityState === 'visible') {
        // Nếu cô ấy quay lại app TRƯỚC 1 phút, hủy lệnh đếm ngược, không khóa nữa
        if (appLogOutTimer) {
            clearTimeout(appLogOutTimer);
            appLogOutTimer = null;
        }
    }
});

// --- BACKUP & RESTORE HỆ THỐNG ZIP ---
async function exportDataZip() {
    try {
        showToast("Đang gom dữ liệu, vui lòng đợi...", "success");
        const zip = new JSZip();

        // 1. Lưu LocalStorage (Text & Cấu hình)
        const dump = {
            local_vault: localStorage.getItem('local_vault'),
            user_profile: localStorage.getItem('user_profile'),
            app_password: localStorage.getItem('app_password'),
            last_holiday_shown: localStorage.getItem('last_holiday_shown')
        };
        zip.file("hub_backup.json", JSON.stringify(dump));

        // 2. Gom Blobs từ IndexedDB
        if (db) {
            const blobsFolder = zip.folder("mediaFiles");
            const transaction = db.transaction(["mediaFiles"], "readonly");
            const store = transaction.objectStore("mediaFiles");
            const request = store.getAll();

            await new Promise((resolve, reject) => {
                request.onsuccess = function (e) {
                    const items = e.target.result;
                    if (items && items.length > 0) {
                        items.forEach(item => {
                            if (item.data) blobsFolder.file(item.id, item.data);
                        });
                    }
                    resolve();
                };
                request.onerror = reject;
            });
        }

        // Tự động tải file zip về máy
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "KhoBau_Backup.zip";
        link.click();
        showToast("Đã tải xong file Backup (.zip)!");
    } catch (e) {
        showToast("Lỗi khi tạo Backup: " + e.message, "error");
    }
}

async function importDataZip(input) {
    if (!input.files || !input.files[0]) return;
    try {
        showToast("Đang bung file nén, kiên nhẫn chút nhé...", "success");
        const zipFile = input.files[0];
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(zipFile);

        // 1. Phục hồi JSON
        const jsonFile = loadedZip.file("hub_backup.json");
        if (jsonFile) {
            const jsonText = await jsonFile.async("string");
            const dump = JSON.parse(jsonText);
            if (dump.local_vault) localStorage.setItem('local_vault', dump.local_vault);
            if (dump.user_profile) localStorage.setItem('user_profile', dump.user_profile);
            if (dump.app_password) localStorage.setItem('app_password', dump.app_password);
            if (dump.last_holiday_shown) localStorage.setItem('last_holiday_shown', dump.last_holiday_shown);
        }

        // 2. Phục hồi IndexedDB Blobs
        if (db) {
            const transaction = db.transaction(["mediaFiles"], "readwrite");
            const store = transaction.objectStore("mediaFiles");

            const mediaFolder = loadedZip.folder("mediaFiles");
            if (mediaFolder) {
                const fileNames = Object.keys(mediaFolder.files).filter(k => !mediaFolder.files[k].dir);
                for (const fileName of fileNames) {
                    const blobData = await mediaFolder.files[fileName].async("blob");
                    const id = fileName.replace("mediaFiles/", "");
                    store.put({ id: id, data: blobData });
                }
            }
        }

        showToast("Khôi phục thành công! Tải lại trang...", "success");
        setTimeout(() => location.reload(), 1500);
    } catch (e) {
        showToast("Lỗi giải nén: File ZIP hỏng hoặc sai định dạng", "error");
    }
    input.value = "";
}

// --- TỐI ƯU MOBILE UX & EASTER EGG ---
function optimizeMobileInputs() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.activeElement.blur(); // Tự động đóng bàn phím ảo iOS

                if (document.getElementById('modal-form').classList.contains('flex')) submitForm();
                else if (document.getElementById('modal-profile-edit').classList.contains('flex')) savePopupProfile();
            }
        });
    });
}
window.addEventListener('DOMContentLoaded', optimizeMobileInputs);
