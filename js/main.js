(function () {
    var channels = [];
    var focusedIndex = 0;
    var columns = 3;
    var isFullscreen = false;
    var playerEl = null;
    var playerVideo = null;
    var playerMessage = null;
    var playerSpinner = null;
    var previewChannel = null;
    var previewHls = null;
    var fullscreenHls = null;
    var fullscreenDash = null;
    var previewTimer = null;
    var playGeneration = 0;
    var snapshotVideo = null;
    var snapshotHls = null;
    var snapshotQueue = [];
    var snapshotBusy = false;
    var snapshotRefreshTimer = null;
    var SNAPSHOT_REFRESH_MS = 60000;
    var SNAPSHOT_CAPTURE_TIMEOUT_MS = 8000;
    var frozenHlsByChannel = {};
    var MAX_FROZEN_PREVIEWS = 4;
    var snapshotProxyAvailable = null;
    var snapshotProxyCheckedAt = 0;
    var currentView = 'home';
    var currentSeries = null;
    var seriesSeasonFilter = 'all';
    var seriesSeasonOptions = [];
    var seriesSeasonMenuOpen = false;
    var seriesSeasonNumbers = [];
    var vodProviderTab = 'kan';
    var liveRegionTab = 'israel';
    var vodSearchQuery = '';
    var vodSearchMode = false;
    var vodReturnSeriesId = null;
    var vodReturnTab = null;
    var vodReturningFromSeries = false;
    var vodRestoreLock = false;
    var vodRestoreTimer = null;
    var vodRestoreTargetIndex = -1;
    var okHoldTimer = null;
    var okShortTimer = null;
    var okHoldItem = null;
    var okHoldFired = false;
    var okHoldSawRepeat = false;
    var okHoldDownAt = 0;
    var okSuppressHeartUntil = 0;
    var OK_HOLD_MYLIST_MS = 900;
    var OK_SHORT_FALLBACK_MS = 240;
    var vodImeOpen = false;
    var vodImeLayout = 'he';
    var vodImeFocusBefore = 0;
    var focusableItems = [];
    var hydrateNearbyTimer = null;
    var vodImageCache = Object.create(null);
    var vodImageCacheKeys = [];
    var VOD_IMAGE_CACHE_MAX = 180;
    // Tizen TV WebKit is much slower than the simulator — keep focus path lean.
    var isTizenTv =
        typeof tizen !== 'undefined' ||
        (typeof navigator !== 'undefined' &&
            /Tizen|SMART-TV|SmartTV|SamsungBrowser/i.test(navigator.userAgent || ''));
    var viewFocus = {
        home: 0,
        live: 0,
        vod: 0,
        radio: 0,
        series: 0
    };
    var isVodMode = false;
    var usingAvplayPlayback = false;
    var pendingDrm = null;
    var pendingSubtitleLang = null;
    var pendingPreferHlsJs = false;
    var reshetKsCache = null;
    var reshetKsExpiry = 0;
    var RESHET_KALTURA = 'https://5031.frp1.ott.kaltura.com/api_v3/service/';
    var RESHET_UDID = 'ISRTV-TIZEN';
    var radioAudio = null;
    var currentRadioId = null;
    var radioPlayToken = 0;
    var radioFocusTimer = null;
    var RADIO_COLUMNS = 4;
    var vodControls = null;
    var vodPlayPauseBtn = null;
    var vodSeek = null;
    var vodSeekFill = null;
    var vodSeekThumb = null;
    var vodSeekVisualPct = 0;
    var vodSeekTargetPct = 0;
    var vodSeekAnimRaf = null;
    var vodTimeCurrent = null;
    var vodTimeDuration = null;
    var vodPauseInfo = null;
    var vodPauseSeries = null;
    var vodPauseEpisode = null;
    var vodNextBtn = null;
    var vodNextFill = null;
    var vodNextLabel = null;
    var vodSeeking = false;
    var vodDurationMs = 0;
    var vodHideTimer = null;
    var vodNextPromptVisible = false;
    var vodNextIsLast = false;
    var vodNextAutoFired = false;
    var VOD_SEEK_STEP_SEC = 10;
    var VOD_SEEK_FAST_AFTER_MS = 4000;
    var VOD_SEEK_FAST_STEP_SEC = 30;
    var VOD_SEEK_FASTER_AFTER_MS = 7000;
    var VOD_SEEK_FASTER_STEP_SEC = 60;
    var VOD_SEEK_HOLD_TICK_MS = 280;
    var VOD_SEEK_HOLD_IDLE_MS = 420;
    var vodSeekHoldKey = 0;
    var vodSeekHoldStartedAt = 0;
    var vodSeekHoldLastKeyAt = 0;
    var vodSeekHoldTimer = null;
    var VOD_CONTROLS_HIDE_MS = 3000;
    var VOD_NEXT_PROMPT_SEC = 40;
    var VOD_NEXT_AUTOFILL_SEC = 10;
    var VOD_PROGRESS_KEY = 'isrtv_vod_progress';
    var VOD_MYLIST_KEY = 'isrtv_vod_mylist';
    var PROFILES_KEY = 'isrtv_profiles_v1';
    var PROFILE_ICONS = [
        'avatar-1',
        'avatar-2',
        'avatar-3',
        'avatar-4',
        'avatar-5',
        'avatar-6',
        'avatar-7',
        'avatar-8',
        'avatar-9',
        'avatar-10',
        'avatar-11',
        'avatar-12'
    ];
    var PROFILE_MAX = 6;
    var VOD_PROGRESS_MIN_SEC = 15;
    var VOD_PROGRESS_COMPLETE = 0.92;
    var VOD_PROGRESS_SAVE_MS = 10000;
    var VOD_PROGRESS_MAX = 400;
    var HOME_HUB_COUNT = 3;
    var HOME_CONTINUE_MAX = 20;
    var HOME_CONTINUE_DONE = 0.9;
    var vodProgressCache = null;
    var vodMyListCache = null;
    var currentVodEpisodeId = null;
    var vodLastProgressSaveAt = 0;
    var vodResumeTargetSec = 0;
    var vodResumeApplied = false;
    var profilesState = null;
    var profileDialogOpen = false;
    var profileDialogMode = 'select';
    var profileEditDraft = null;
    var profileChromeFocused = false;
    var profileImeTarget = false;
    var profileDialogReturnFocus = 0;
    var profileManaging = false;
    var profileDeleteConfirmOpen = false;
    var profileConfirmKind = null;
    var profileEditBaseline = null;
    var profileMenuOpen = false;
    var profileMenuReturnFocus = 0;

    function activeProfileId() {
        ensureProfilesLoaded();
        return (profilesState && profilesState.activeId) || 'default';
    }

    function profileProgressKey(profileId) {
        return VOD_PROGRESS_KEY + '__' + (profileId || activeProfileId());
    }

    function profileMyListKey(profileId) {
        return VOD_MYLIST_KEY + '__' + (profileId || activeProfileId());
    }

    function profileIconUrl(iconId) {
        var id = PROFILE_ICONS.indexOf(iconId) !== -1 ? iconId : PROFILE_ICONS[0];
        return 'images/profiles/' + id + '.png';
    }

    function newProfileId() {
        return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
    }

    function migrateLegacyDataToProfile(profileId) {
        try {
            var legacyProgress = localStorage.getItem(VOD_PROGRESS_KEY);
            var legacyMyList = localStorage.getItem(VOD_MYLIST_KEY);
            var pKey = profileProgressKey(profileId);
            var mKey = profileMyListKey(profileId);
            if (legacyProgress && !localStorage.getItem(pKey)) {
                localStorage.setItem(pKey, legacyProgress);
            }
            if (legacyMyList && !localStorage.getItem(mKey)) {
                localStorage.setItem(mKey, legacyMyList);
            }
        } catch (eMig) {
            console.warn('Profile migrate failed:', eMig);
        }
    }

    function ensureProfilesLoaded() {
        if (profilesState && profilesState.list && profilesState.list.length) {
            return profilesState;
        }
        var parsed = null;
        try {
            var raw = localStorage.getItem(PROFILES_KEY);
            parsed = raw ? JSON.parse(raw) : null;
        } catch (eLoad) {
            parsed = null;
        }
        if (!parsed || !Array.isArray(parsed.list) || !parsed.list.length) {
            var defaultId = 'default';
            profilesState = {
                activeId: defaultId,
                list: [{ id: defaultId, name: 'אני', icon: 'avatar-1' }]
            };
            migrateLegacyDataToProfile(defaultId);
            persistProfilesState();
        } else {
            profilesState = {
                activeId: parsed.activeId || parsed.list[0].id,
                list: parsed.list
                    .filter(function (p) {
                        return p && p.id && p.name;
                    })
                    .map(function (p) {
                        return {
                            id: String(p.id),
                            name: String(p.name).slice(0, 24),
                            icon: PROFILE_ICONS.indexOf(p.icon) !== -1 ? p.icon : PROFILE_ICONS[0]
                        };
                    })
            };
            if (!profilesState.list.length) {
                profilesState.list = [{ id: 'default', name: 'אני', icon: 'avatar-1' }];
                profilesState.activeId = 'default';
            }
            if (
                !profilesState.list.some(function (p) {
                    return p.id === profilesState.activeId;
                })
            ) {
                profilesState.activeId = profilesState.list[0].id;
            }
        }
        return profilesState;
    }

    function persistProfilesState() {
        try {
            localStorage.setItem(
                PROFILES_KEY,
                JSON.stringify({
                    activeId: profilesState.activeId,
                    list: profilesState.list
                })
            );
        } catch (eSave) {
            console.warn('Profiles save failed:', eSave);
        }
    }

    function getActiveProfile() {
        var state = ensureProfilesLoaded();
        var i;
        for (i = 0; i < state.list.length; i++) {
            if (state.list[i].id === state.activeId) {
                return state.list[i];
            }
        }
        return state.list[0];
    }

    function findProfileById(id) {
        var state = ensureProfilesLoaded();
        var i;
        for (i = 0; i < state.list.length; i++) {
            if (state.list[i].id === id) {
                return state.list[i];
            }
        }
        return null;
    }

    function syncProfileButton() {
        var profile = getActiveProfile();
        var img = document.getElementById('profile-btn-img');
        var nameEl = document.getElementById('profile-btn-name');
        var btn = document.getElementById('profile-btn');
        if (img) {
            img.src = profileIconUrl(profile && profile.icon);
        }
        if (nameEl) {
            nameEl.textContent = (profile && profile.name) || 'אני';
        }
        if (btn) {
            btn.setAttribute('aria-label', 'פרופיל: ' + ((profile && profile.name) || 'אני'));
            btn.setAttribute('aria-expanded', profileMenuOpen ? 'true' : 'false');
        }
    }

    function renderProfileDropdown() {
        var listEl = document.getElementById('profile-dropdown-list');
        var state = ensureProfilesLoaded();
        var activeId = state.activeId;
        var editBtn;
        var divider;
        if (!listEl) {
            return;
        }
        listEl.innerHTML = '';
        state.list.forEach(function (profile) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className =
                'profile-dropdown-item' + (profile.id === activeId ? ' is-active' : '');
            item.setAttribute('data-action', 'profile-menu-select');
            item.setAttribute('data-profile-id', profile.id);
            item.setAttribute('role', 'menuitem');
            item.innerHTML =
                '<img class="profile-dropdown-img" src="' +
                profileIconUrl(profile.icon) +
                '" alt="" />' +
                '<span class="profile-dropdown-name"></span>';
            item.querySelector('.profile-dropdown-name').textContent = profile.name;
            listEl.appendChild(item);
        });
        divider = document.createElement('div');
        divider.className = 'profile-dropdown-divider';
        divider.setAttribute('aria-hidden', 'true');
        listEl.appendChild(divider);
        editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'profile-dropdown-item profile-dropdown-edit';
        editBtn.setAttribute('data-action', 'profile-menu-edit');
        editBtn.setAttribute('role', 'menuitem');
        editBtn.innerHTML =
            '<span class="profile-dropdown-edit-icon" aria-hidden="true">✎</span>' +
            '<span class="profile-dropdown-name">עריכה</span>';
        listEl.appendChild(editBtn);
    }

    function bindProfileMenuItems() {
        var listEl = document.getElementById('profile-dropdown-list');
        var items = [];
        if (!listEl) {
            focusableItems = [];
            return;
        }
        items = Array.prototype.slice.call(listEl.querySelectorAll('.profile-dropdown-item'));
        focusableItems = items;
        channels = items;
        lastFocusedEl = null;
        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                applyFocusClass(prev, index);
            };
            item.onclick = function (e) {
                e.preventDefault();
                activateItem(item);
            };
        });
    }

    function openProfileMenu() {
        var menu = document.getElementById('profile-menu');
        var dropdown = document.getElementById('profile-dropdown');
        var state;
        var start = 0;
        var i;
        if (profileDialogOpen || isFullscreen || vodImeOpen || !menu || !dropdown) {
            return;
        }
        clearProfileChromeFocus(false);
        profileMenuReturnFocus = focusedIndex;
        profileMenuOpen = true;
        renderProfileDropdown();
        menu.classList.add('is-open');
        dropdown.hidden = false;
        document.body.classList.add('is-profile-menu-open');
        syncProfileButton();
        bindProfileMenuItems();
        state = ensureProfilesLoaded();
        for (i = 0; i < focusableItems.length; i++) {
            if (focusableItems[i].getAttribute('data-profile-id') === state.activeId) {
                start = i;
    		break;
            }
        }
        setFocus(start, false);
    }

    function closeProfileMenu() {
        var menu = document.getElementById('profile-menu');
        var dropdown = document.getElementById('profile-dropdown');
        if (!profileMenuOpen) {
            return;
        }
        profileMenuOpen = false;
        if (menu) {
            menu.classList.remove('is-open');
        }
        if (dropdown) {
            dropdown.hidden = true;
        }
        document.body.classList.remove('is-profile-menu-open');
        syncProfileButton();
        if (profileDialogOpen) {
            return;
        }
        if (currentView === 'home') {
            bindHomeItems();
        } else if (currentView === 'vod') {
            bindVodItems();
        } else if (currentView === 'series') {
            bindSeriesItems();
        } else if (currentView === 'live') {
            bindLiveItems();
        } else if (currentView === 'radio') {
            bindRadioItems();
        }
        setFocus(
            Math.min(profileMenuReturnFocus || 0, Math.max(0, focusableItems.length - 1)),
            false
        );
    }

    function toggleProfileMenu() {
        if (profileMenuOpen) {
            closeProfileMenu();
        } else {
            openProfileMenu();
        }
    }

    function moveProfileMenuFocus(dx, dy) {
        var items = focusableItems;
        var next;
        if (!items.length) {
            return;
        }
        if (dy === 0) {
            return;
        }
        next = focusedIndex + dy;
        if (next < 0) {
            closeProfileMenu();
            focusProfileChrome();
            return;
        }
        if (next >= items.length) {
            return;
        }
        setFocus(next, false);
    }

    function flushProfileCachesToStorage() {
        persistVodProgressMap();
        persistMyListIds();
    }

    function reloadActiveProfileData() {
        vodProgressCache = null;
        vodMyListCache = null;
        loadVodProgressMap();
        loadMyListIds();
    }

    function refreshViewsForProfileSwitch() {
        syncProfileButton();
        if (currentView === 'home') {
            renderHomeContinueWatching();
            bindHomeItems();
            setFocus(Math.min(viewFocus.home || 0, Math.max(0, focusableItems.length - 1)), false);
            return;
        }
        if (currentView === 'vod') {
            renderKanboxSeries();
            bindVodItems();
            setFocus(Math.min(viewFocus.vod || 0, Math.max(0, focusableItems.length - 1)), false);
            return;
        }
        if (currentView === 'series' && currentSeries) {
            renderSeriesEpisodes(currentSeries);
            bindSeriesItems();
            setFocus(Math.min(viewFocus.series || 0, Math.max(0, focusableItems.length - 1)), false);
        }
    }

    function switchProfile(profileId) {
        var profile = findProfileById(profileId);
        closeProfileMenu();
        if (!profile) {
            return;
        }
        if (profile.id === activeProfileId()) {
            closeProfileDialog();
            return;
        }
        flushProfileCachesToStorage();
        ensureProfilesLoaded().activeId = profile.id;
        persistProfilesState();
        reloadActiveProfileData();
        closeProfileDialog();
        refreshViewsForProfileSwitch();
    }

    function clearProfileChromeFocus(restoreItemFocus) {
        if (!profileChromeFocused) {
            return;
        }
        profileChromeFocused = false;
        var btn = document.getElementById('profile-btn');
        if (btn) {
            btn.classList.remove('is-focused');
        }
        if (restoreItemFocus !== false) {
            syncFocusClass();
        }
    }

    function focusProfileChrome() {
        if (profileDialogOpen || profileMenuOpen || isFullscreen || vodImeOpen) {
            return false;
        }
        profileChromeFocused = true;
        var btn = document.getElementById('profile-btn');
        var cur = focusableItems[focusedIndex];
        if (cur) {
            cur.classList.remove('is-focused');
        }
        if (btn) {
            btn.classList.add('is-focused');
            try {
                btn.focus({ preventScroll: true });
            } catch (eBtn) {
                try {
                    btn.focus();
                } catch (eBtn2) {}
            }
        }
        return true;
    }

    function tryFocusProfileChromeFromTop() {
        return focusProfileChrome();
    }

    /** Leave the profile chip downward into the main view — never onto My List (use Left for that). */
    function leaveProfileChromeDown() {
        var target = 0;
        clearProfileChromeFocus(false);
        if (!focusableItems.length) {
            return;
        }
        if (currentView === 'vod') {
            target = vodProviderTab === 'mylist' ? 0 : vodTabIndex(vodProviderTab);
        } else if (currentView === 'live') {
            target = liveTabIndex(liveRegionTab);
        }
        setFocus(Math.min(Math.max(0, target), focusableItems.length - 1), true);
    }

    function openProfileDialog(startInManage) {
        var dialog = document.getElementById('profile-dialog');
        if (!dialog) {
            return;
        }
        closeProfileMenu();
        clearProfileChromeFocus(false);
        profileDialogReturnFocus = focusedIndex;
        profileDialogOpen = true;
        profileDialogMode = 'select';
        profileManaging = !!startInManage;
        profileEditDraft = null;
        profileEditBaseline = null;
        profileDeleteConfirmOpen = false;
        profileConfirmKind = null;
        dialog.hidden = false;
        document.body.classList.add('is-profile-dialog-open');
        renderProfileSelectView();
        bindProfileDialogItems();
        setFocus(profileManaging ? 0 : Math.min(1, Math.max(0, focusableItems.length - 1)), false);
    }

    function closeProfileDialog() {
        var dialog = document.getElementById('profile-dialog');
        profileDialogOpen = false;
        profileDialogMode = 'select';
        profileManaging = false;
        profileEditDraft = null;
        profileEditBaseline = null;
        profileDeleteConfirmOpen = false;
        profileConfirmKind = null;
        hideProfileDeleteConfirm();
        document.body.classList.remove('is-profile-dialog-open');
        document.body.classList.remove('is-profile-ime-open');
        if (dialog) {
            dialog.hidden = true;
        }
        if (profileImeTarget) {
            profileImeTarget = false;
            vodImeOpen = false;
            document.body.classList.remove('is-vod-ime-open');
            var ime = document.getElementById('vod-ime');
            if (ime) {
                ime.hidden = true;
            }
        }
        // Restore underlying view focus list
        if (currentView === 'home') {
            bindHomeItems();
        } else if (currentView === 'vod') {
            bindVodItems();
        } else if (currentView === 'series') {
            bindSeriesItems();
        } else if (currentView === 'live') {
            bindLiveItems();
        } else if (currentView === 'radio') {
            bindRadioItems();
        }
        setFocus(
            Math.min(profileDialogReturnFocus || 0, Math.max(0, focusableItems.length - 1)),
            false
        );
    }

    function renderProfileSelectView() {
        var selectView = document.getElementById('profile-select-view');
        var editView = document.getElementById('profile-edit-view');
        var listEl = document.getElementById('profile-list');
        var manageBtn = document.getElementById('profile-manage-btn');
        var title = document.getElementById('profile-dialog-title');
        var state = ensureProfilesLoaded();
        var activeId = state.activeId;
        var addCard;
        if (selectView) {
            selectView.hidden = false;
        }
        if (editView) {
            editView.hidden = true;
        }
        hideProfileDeleteConfirm();
        if (title) {
            title.textContent = profileManaging ? '' : 'מי צופה?';
            title.hidden = !!profileManaging;
        }
        if (manageBtn) {
            if (profileManaging) {
                manageBtn.textContent = '×';
                manageBtn.classList.add('is-close');
                manageBtn.setAttribute('aria-label', 'סיום');
            } else {
                manageBtn.textContent = 'עריכה';
                manageBtn.classList.remove('is-close');
                manageBtn.setAttribute('aria-label', 'עריכה');
            }
            manageBtn.setAttribute('data-action', 'profile-manage');
        }
        var selectHeader = document.querySelector('#profile-select-view .profile-select-header');
        if (selectHeader) {
            selectHeader.classList.toggle('is-managing', !!profileManaging);
        }
        if (!listEl) {
            return;
        }
        listEl.innerHTML = '';
        if (state.list.length < PROFILE_MAX) {
            addCard = document.createElement('button');
            addCard.type = 'button';
            addCard.className = 'profile-card profile-card-add';
            addCard.setAttribute('data-action', 'profile-add');
            addCard.setAttribute('aria-label', 'הוסף פרופיל');
            addCard.innerHTML =
                '<span class="profile-card-add-icon" aria-hidden="true">+</span>' +
                '<span class="profile-card-name">הוסף פרופיל</span>';
            listEl.appendChild(addCard);
        }
        state.list.forEach(function (profile) {
            var card = document.createElement('button');
            card.type = 'button';
            card.className =
                'profile-card' +
                (profile.id === activeId ? ' is-active' : '') +
                (profileManaging ? ' is-managing' : '');
            card.setAttribute(
                'data-action',
                profileManaging ? 'profile-edit' : 'profile-select'
            );
            card.setAttribute('data-profile-id', profile.id);
            card.innerHTML =
                '<span class="profile-card-avatar">' +
                '<img class="profile-card-img" src="' +
                profileIconUrl(profile.icon) +
                '" alt="" />' +
                (profileManaging
                    ? '<span class="profile-card-edit-badge" aria-hidden="true">' +
                      '<svg viewBox="0 0 24 24" width="18" height="18" focusable="false">' +
                      '<path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>' +
                      '</svg></span>'
                    : '') +
                '</span>' +
                '<span class="profile-card-name"></span>';
            card.querySelector('.profile-card-name').textContent = profile.name;
            listEl.appendChild(card);
        });
    }

    function toggleProfileManaging() {
        // סיום: close entirely — profile switch lives in the top menu
        if (profileManaging) {
            closeProfileDialog();
            return;
        }
        profileManaging = true;
        profileDialogMode = 'select';
        profileEditDraft = null;
        profileEditBaseline = null;
        renderProfileSelectView();
        bindProfileDialogItems();
        setFocus(0, false);
    }

    function getUsedProfileIcons(exceptProfileId) {
        var used = {};
        ensureProfilesLoaded().list.forEach(function (profile) {
            if (exceptProfileId && profile.id === exceptProfileId) {
                return;
            }
            if (profile.icon) {
                used[profile.icon] = true;
            }
        });
        return used;
    }

    function firstAvailableProfileIcon(exceptProfileId) {
        var used = getUsedProfileIcons(exceptProfileId);
        var i;
        for (i = 0; i < PROFILE_ICONS.length; i++) {
            if (!used[PROFILE_ICONS[i]]) {
                return PROFILE_ICONS[i];
            }
        }
        return PROFILE_ICONS[0];
    }

    function renderProfileEditView() {
        var selectView = document.getElementById('profile-select-view');
        var editView = document.getElementById('profile-edit-view');
        var title = document.getElementById('profile-edit-title');
        var grid = document.getElementById('profile-icon-grid');
        var nameField = document.getElementById('profile-name-field');
        var deleteBtn = document.getElementById('profile-delete-btn');
        var previewImg = document.getElementById('profile-edit-preview-img');
        var previewPh = document.getElementById('profile-edit-preview-placeholder');
        var draft = profileEditDraft;
        var usedIcons;
        if (!draft) {
            return;
        }
        usedIcons = getUsedProfileIcons(draft.id);
        if (selectView) {
            selectView.hidden = true;
        }
        if (editView) {
            editView.hidden = false;
        }
        hideProfileDeleteConfirm();
        if (title) {
            title.textContent = draft.id ? 'עריכת פרופיל' : 'פרופיל חדש';
        }
        if (nameField) {
            nameField.textContent = draft.name || 'שם';
            nameField.classList.toggle('is-placeholder', !draft.name);
        }
        if (deleteBtn) {
            deleteBtn.hidden = !draft.id || ensureProfilesLoaded().list.length <= 1;
        }
        if (draft.icon && usedIcons[draft.icon]) {
            draft.icon = draft.id ? firstAvailableProfileIcon(draft.id) : null;
        }
        if (previewImg && previewPh) {
            if (draft.icon) {
                previewImg.src = profileIconUrl(draft.icon);
                previewImg.hidden = false;
                previewPh.hidden = true;
            } else {
                previewImg.removeAttribute('src');
                previewImg.hidden = true;
                previewPh.hidden = false;
            }
        }
        if (!grid) {
            return;
        }
        grid.innerHTML = '';
        PROFILE_ICONS.forEach(function (iconId, index) {
            var taken = !!usedIcons[iconId];
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className =
                'profile-icon-btn' +
                (draft.icon && draft.icon === iconId ? ' is-selected' : '') +
                (taken ? ' is-disabled' : '');
            btn.setAttribute('data-grid-index', String(index));
            if (taken) {
                btn.disabled = true;
                btn.setAttribute('aria-disabled', 'true');
                btn.setAttribute('tabindex', '-1');
            } else {
                btn.setAttribute('data-action', 'profile-icon');
                btn.setAttribute('data-icon', iconId);
            }
            btn.setAttribute('aria-label', iconId);
            btn.innerHTML = '<img src="' + profileIconUrl(iconId) + '" alt="" />';
            grid.appendChild(btn);
        });
        syncProfileSaveButton();
    }

    function hideProfileDeleteConfirm() {
        var confirmEl = document.getElementById('profile-confirm');
        profileDeleteConfirmOpen = false;
        profileConfirmKind = null;
        if (confirmEl) {
            confirmEl.hidden = true;
        }
    }

    function openProfileConfirm(kind) {
        var confirmEl = document.getElementById('profile-confirm');
        var titleEl = document.getElementById('profile-confirm-title');
        var yesBtn = document.getElementById('profile-confirm-yes');
        if (!confirmEl) {
            return;
        }
        if (kind === 'delete' && (!profileEditDraft || !profileEditDraft.id)) {
            return;
        }
        profileConfirmKind = kind;
        profileDeleteConfirmOpen = true;
        if (titleEl) {
            titleEl.textContent = kind === 'unsaved' ? 'שמור שינויים?' : 'האם אתה בטוח?';
        }
        if (yesBtn) {
            if (kind === 'unsaved') {
                yesBtn.classList.remove('profile-action-btn-danger');
                yesBtn.classList.add('profile-action-btn');
            } else {
                yesBtn.classList.add('profile-action-btn-danger');
            }
        }
        confirmEl.hidden = false;
        bindProfileDialogItems();
        // Focus "לא" (safer default)
        setFocus(1, false);
    }

    function openProfileDeleteConfirm() {
        openProfileConfirm('delete');
    }

    function isProfileEditDirty() {
        var draft = profileEditDraft;
        var base = profileEditBaseline;
        var name;
        if (!draft) {
            return false;
        }
        name = String(draft.name || '');
        if (!base) {
            return !!(draft.icon || name.replace(/\s+/g, ' ').trim());
        }
        return name !== String(base.name || '') || draft.icon !== base.icon;
    }

    function discardProfileEdit() {
        if (profileImeTarget) {
            closeProfileNameIme();
        }
        hideProfileDeleteConfirm();
        profileDialogMode = 'select';
        profileEditDraft = null;
        profileEditBaseline = null;
        profileManaging = true;
        renderProfileSelectView();
        bindProfileDialogItems();
        setFocus(0, false);
    }

    function requestCloseProfileEdit() {
        if (profileImeTarget) {
            closeProfileNameIme();
        }
        if (isProfileEditDirty()) {
            openProfileConfirm('unsaved');
            return;
        }
        discardProfileEdit();
    }

    function closeProfileDeleteConfirm() {
        hideProfileDeleteConfirm();
        if (profileDialogMode === 'edit') {
            bindProfileDialogItems();
            // Prefer close (X) after dismissing confirm
            var i;
            for (i = 0; i < focusableItems.length; i++) {
                if (focusableItems[i].id === 'profile-edit-close') {
                    setFocus(i, false);
                    return;
                }
            }
            for (i = 0; i < focusableItems.length; i++) {
                if (focusableItems[i].getAttribute('data-action') === 'profile-delete') {
                    setFocus(i, false);
                    return;
                }
            }
            setFocus(Math.max(0, focusableItems.length - 1), false);
        }
    }

    function bindProfileDialogItems() {
        var root = document.getElementById('profile-dialog');
        var items = [];
        if (!root) {
            focusableItems = [];
            return;
        }
        if (profileDeleteConfirmOpen) {
            items = Array.prototype.slice.call(
                root.querySelectorAll('#profile-confirm .profile-action-btn')
            );
        } else if (profileDialogMode === 'edit') {
            // Build in navigation order — querySelectorAll is document order,
            // and the close button sits above the icon grid in the DOM.
            var iconBtns = Array.prototype.slice.call(
                root.querySelectorAll(
                    '#profile-icon-grid .profile-icon-btn:not(.is-disabled):not([disabled])'
                )
            );
            var nameField = root.querySelector('#profile-name-field');
            var actionBtns = Array.prototype.slice.call(
                root.querySelectorAll(
                    '#profile-edit-view .profile-edit-actions .profile-action-btn:not([hidden])'
                )
            );
            var closeBtn = root.querySelector('#profile-edit-close');
            items = iconBtns
                .concat(nameField ? [nameField] : [])
                .concat(actionBtns)
                .concat(closeBtn ? [closeBtn] : []);
        } else {
            items = Array.prototype.slice.call(
                root.querySelectorAll(
                    '#profile-manage-btn, #profile-list .profile-card'
                )
            );
        }
        focusableItems = items;
        channels = items;
        lastFocusedEl = null;
        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                applyFocusClass(prev, index);
            };
            item.onclick = function (e) {
                e.preventDefault();
                if (item.disabled || item.classList.contains('is-disabled')) {
                    return;
                }
                activateItem(item);
            };
        });
    }

    function openProfileEdit(profileId) {
        var existing = profileId ? findProfileById(profileId) : null;
        profileDialogMode = 'edit';
        profileEditDraft = existing
            ? { id: existing.id, name: existing.name, icon: existing.icon }
            : {
                  id: null,
                  name: '',
                  icon: null
              };
        profileEditBaseline = {
            name: profileEditDraft.name,
            icon: profileEditDraft.icon
        };
        renderProfileEditView();
        bindProfileDialogItems();
        setFocus(0, false);
    }

    function syncProfileNameField() {
        var nameField = document.getElementById('profile-name-field');
        var name;
        var textEl;
        if (!nameField || !profileEditDraft) {
            return;
        }
        name = String(profileEditDraft.name || '');
        if (profileImeTarget) {
            nameField.classList.add('is-editing');
            nameField.classList.toggle('is-empty', !name);
            nameField.classList.remove('is-placeholder');
            nameField.innerHTML =
                '<span class="profile-name-text"></span>' +
                '<span class="profile-name-caret" aria-hidden="true"></span>';
            textEl = nameField.querySelector('.profile-name-text');
            if (textEl) {
                textEl.textContent = name;
            }
        } else {
            nameField.classList.remove('is-editing', 'is-empty');
            nameField.classList.toggle('is-placeholder', !name);
            nameField.textContent = name || 'שם';
        }
        syncProfileSaveButton();
        // Don't steal focus from the on-screen keyboard while typing
        if (!profileImeTarget) {
            rebindProfileEditFocus(nameField);
        }
    }

    function isProfileDraftValid() {
        var draft = profileEditDraft;
        var name;
        if (!draft) {
            return false;
        }
        name = String(draft.name || '').replace(/\s+/g, ' ').trim();
        return !!(draft.icon && name.length >= 1);
    }

    function syncProfileSaveButton() {
        var saveBtn = document.querySelector('#profile-edit-view [data-action="profile-save"]');
        var ok = isProfileDraftValid();
        var prevEl;
        if (!saveBtn) {
            return;
        }
        saveBtn.disabled = !ok;
        if (ok) {
            saveBtn.classList.remove('is-disabled');
            saveBtn.removeAttribute('aria-disabled');
        } else {
            saveBtn.classList.add('is-disabled');
            saveBtn.setAttribute('aria-disabled', 'true');
        }
        // Keep שמור in the keyboard focus ring as validity changes while typing
        if (profileImeTarget && vodImeOpen) {
            prevEl = focusableItems[focusedIndex] || null;
            bindVodImeKeys();
            restoreProfileImeFocus(prevEl);
        }
    }

    function restoreProfileImeFocus(prevEl) {
        var i;
        var action;
        if (!focusableItems.length) {
            return;
        }
        if (prevEl) {
            for (i = 0; i < focusableItems.length; i++) {
                if (focusableItems[i] === prevEl) {
                    setFocus(i, false);
                    return;
                }
            }
            action = prevEl.getAttribute && prevEl.getAttribute('data-action');
            if (action) {
                for (i = 0; i < focusableItems.length; i++) {
                    if (focusableItems[i].getAttribute('data-action') === action) {
                        setFocus(i, false);
                        return;
                    }
                }
            }
            if (
                prevEl.getAttribute &&
                prevEl.getAttribute('data-ime-row') != null &&
                prevEl.getAttribute('data-ime-col') != null
            ) {
                i = findVodImeKeyIndex(
                    parseInt(prevEl.getAttribute('data-ime-row'), 10),
                    parseInt(prevEl.getAttribute('data-ime-col'), 10)
                );
                if (i >= 0) {
                    setFocus(i, false);
                    return;
                }
            }
        }
        setFocus(Math.min(focusedIndex, Math.max(0, focusableItems.length - 1)), false);
    }

    function rebindProfileEditFocus(preferredEl) {
        var prevEl = preferredEl || focusableItems[focusedIndex] || null;
        var i;
        if (!(profileDialogOpen && profileDialogMode === 'edit')) {
            return;
        }
        bindProfileDialogItems();
        if (prevEl) {
            for (i = 0; i < focusableItems.length; i++) {
                if (focusableItems[i] === prevEl) {
                    setFocus(i, false);
                    return;
                }
            }
            // Same logical control (save button node may stay, icons recreated)
            if (prevEl.getAttribute && prevEl.getAttribute('data-action') === 'profile-save') {
                for (i = 0; i < focusableItems.length; i++) {
                    if (focusableItems[i].getAttribute('data-action') === 'profile-save') {
                        setFocus(i, false);
                        return;
                    }
                }
            }
            if (prevEl.getAttribute && prevEl.getAttribute('data-icon')) {
                for (i = 0; i < focusableItems.length; i++) {
                    if (focusableItems[i].getAttribute('data-icon') === prevEl.getAttribute('data-icon')) {
                        setFocus(i, false);
                        return;
                    }
                }
            }
            if (prevEl.id === 'profile-name-field') {
                for (i = 0; i < focusableItems.length; i++) {
                    if (focusableItems[i].id === 'profile-name-field') {
                        setFocus(i, false);
                        return;
                    }
                }
            }
        }
        setFocus(Math.min(focusedIndex, Math.max(0, focusableItems.length - 1)), false);
    }

    function saveProfileEdit() {
        var state = ensureProfilesLoaded();
        var draft = profileEditDraft;
        var name;
        var i;
        var ime;
        if (!draft || !isProfileDraftValid()) {
            return;
        }
        name = String(draft.name || '').replace(/\s+/g, ' ').trim();
        name = name.slice(0, 24);
        if (draft.id) {
            for (i = 0; i < state.list.length; i++) {
                if (state.list[i].id === draft.id) {
                    state.list[i].name = name;
                    state.list[i].icon = draft.icon;
    		break;
                }
            }
        } else {
            if (state.list.length >= PROFILE_MAX) {
                return;
            }
            state.list.push({
                id: newProfileId(),
                name: name,
                icon: draft.icon
            });
        }
        persistProfilesState();
        syncProfileButton();
        // Close keyboard if open, stay on עריכת פרופילים
        profileImeTarget = false;
        vodImeOpen = false;
        document.body.classList.remove('is-vod-ime-open');
        document.body.classList.remove('is-profile-ime-open');
        ime = document.getElementById('vod-ime');
        if (ime) {
            ime.hidden = true;
        }
        profileDialogMode = 'select';
        profileEditDraft = null;
        profileEditBaseline = null;
        profileManaging = true;
        renderProfileSelectView();
        bindProfileDialogItems();
        setFocus(0, false);
    }

    function deleteProfileEdit() {
        var state = ensureProfilesLoaded();
        var draft = profileEditDraft;
        var next;
        if (!draft || !draft.id || state.list.length <= 1) {
            return;
        }
        flushProfileCachesToStorage();
        state.list = state.list.filter(function (p) {
            return p.id !== draft.id;
        });
        try {
            localStorage.removeItem(profileProgressKey(draft.id));
            localStorage.removeItem(profileMyListKey(draft.id));
        } catch (eDel) {}
        if (state.activeId === draft.id) {
            next = state.list[0];
            state.activeId = next.id;
            persistProfilesState();
            reloadActiveProfileData();
            refreshViewsForProfileSwitch();
        } else {
            persistProfilesState();
            syncProfileButton();
        }
        profileDialogMode = 'select';
        profileEditDraft = null;
        profileEditBaseline = null;
        profileManaging = true;
        renderProfileSelectView();
        bindProfileDialogItems();
        setFocus(0, false);
    }

    function moveProfileDialogFocus(dx, dy) {
        var items = focusableItems;
        var idx = focusedIndex;
        var cols = 4;
        var next;
        var i;
        var iconCount;
        var curGrid;
        var targetGrid;
        var row;
        var col;
        var best;
        var bestDist;
        var g;
        if (!items.length) {
            return;
        }

        // Profile dialog is direction:rtl — flip left/right to match on-screen order
        if (dx) {
            dx = -dx;
        }

        if (profileDeleteConfirmOpen) {
            if (dx !== 0) {
                next = idx + dx;
                if (next >= 0 && next < items.length) {
                    setFocus(next, false);
                }
            }
            return;
        }

        if (profileDialogMode === 'edit') {
            var closeIdx = -1;
            var nameIdx = -1;
            var actionStart = -1;
            var actionEnd;
            var c;
            var r;
            var dist;

            iconCount = 0;
            for (i = 0; i < items.length; i++) {
                if (items[i].classList.contains('profile-icon-btn')) {
                    iconCount += 1;
                } else if (items[i].id === 'profile-name-field') {
                    nameIdx = i;
                } else if (items[i].id === 'profile-edit-close') {
                    closeIdx = i;
                } else if (items[i].classList.contains('profile-action-btn')) {
                    if (actionStart < 0) {
                        actionStart = i;
                    }
                }
            }
            actionEnd = closeIdx >= 0 ? closeIdx : items.length;

            if (closeIdx >= 0 && idx === closeIdx) {
                if (dy > 0) {
                    if (iconCount > 0) {
                        setFocus(0, false);
                    } else if (nameIdx >= 0) {
                        setFocus(nameIdx, false);
                    }
                }
                return;
            }

            if (idx < iconCount) {
                curGrid = parseInt(items[idx].getAttribute('data-grid-index') || String(idx), 10) || 0;
                row = Math.floor(curGrid / cols);
                col = curGrid % cols;
                if (dx !== 0) {
                    c = col + dx;
                    while (c >= 0 && c < cols) {
                        targetGrid = row * cols + c;
                        for (i = 0; i < iconCount; i++) {
                            if (parseInt(items[i].getAttribute('data-grid-index'), 10) === targetGrid) {
                                setFocus(i, false);
                                return;
                            }
                        }
                        c += dx;
                    }
                    if (nameIdx >= 0) {
                        setFocus(nameIdx, false);
                    }
                    return;
                }
                r = row + dy;
                while (r >= 0 && r < 8) {
                    best = -1;
                    bestDist = Infinity;
                    for (i = 0; i < iconCount; i++) {
                        g = parseInt(items[i].getAttribute('data-grid-index'), 10);
                        if (Math.floor(g / cols) !== r) {
                            continue;
                        }
                        dist = Math.abs((g % cols) - col);
                        if (dist < bestDist) {
                            bestDist = dist;
                            best = i;
                        }
                    }
                    if (best >= 0) {
                        setFocus(best, false);
                        return;
                    }
                    r += dy;
                }
                if (dy < 0 && closeIdx >= 0) {
                    setFocus(closeIdx, false);
                } else if (dy > 0 && nameIdx >= 0) {
                    setFocus(nameIdx, false);
                }
                return;
            }

            if (idx === nameIdx) {
                if (dx !== 0 && iconCount > 0) {
                    setFocus(0, false);
                    return;
                }
                if (dy < 0 && closeIdx >= 0) {
                    setFocus(closeIdx, false);
                    return;
                }
                if (dy > 0 && actionStart >= 0 && actionStart < actionEnd) {
                    setFocus(actionStart, false);
                }
                return;
            }

            if (dy < 0) {
                if (nameIdx >= 0) {
                    setFocus(nameIdx, false);
                } else if (closeIdx >= 0) {
                    setFocus(closeIdx, false);
                }
                return;
            }
            if (dx !== 0) {
                next = idx + dx;
                if (actionStart >= 0 && next >= actionStart && next < actionEnd) {
                    setFocus(next, false);
                    return;
                }
                if (iconCount > 0) {
                    setFocus(0, false);
                }
            }
            return;
        }

        // select / manage mode: [manageBtn][cards... including optional +]
        if (idx === 0) {
            if (dy > 0 && items.length > 1) {
                setFocus(1, false);
            }
            return;
        }
        if (dy < 0) {
            setFocus(0, false);
            return;
        }
        if (dx !== 0) {
            next = idx + dx;
            if (next >= 1 && next < items.length) {
                setFocus(next, false);
            }
        }
    }

    function openProfileNameIme() {
        var ime = document.getElementById('vod-ime');
        var nameField = document.getElementById('profile-name-field');
        if (!ime || !profileEditDraft) {
            return;
        }
        profileImeTarget = true;
        vodImeOpen = true;
        ime.hidden = false;
        document.body.classList.add('is-vod-ime-open');
        document.body.classList.add('is-profile-ime-open');
        syncProfileNameField();
        if (nameField) {
            nameField.classList.add('is-editing');
        }
        renderVodImeKeys();
        bindVodImeKeys();
        updateVodImePreview();
        setFocus(0, false);
    }

    function closeProfileNameIme() {
        var ime = document.getElementById('vod-ime');
        var nameField = document.getElementById('profile-name-field');
        vodImeOpen = false;
        profileImeTarget = false;
        document.body.classList.remove('is-vod-ime-open');
        document.body.classList.remove('is-profile-ime-open');
        if (ime) {
            ime.hidden = true;
        }
        if (nameField) {
            nameField.classList.remove('is-editing', 'is-empty');
        }
        syncProfileNameField();
        if (profileDialogOpen && profileDialogMode === 'edit') {
            rebindProfileEditFocus(document.getElementById('profile-name-field'));
        }
    }

    function loadVodProgressMap() {
        if (vodProgressCache) {
            return vodProgressCache;
        }
        try {
            var raw = localStorage.getItem(profileProgressKey());
            vodProgressCache = raw ? JSON.parse(raw) : {};
            if (!vodProgressCache || typeof vodProgressCache !== 'object') {
                vodProgressCache = {};
            }
        } catch (e) {
            vodProgressCache = {};
        }
        return vodProgressCache;
    }

    function loadMyListIds() {
        if (vodMyListCache) {
            return vodMyListCache;
        }
        try {
            var raw = localStorage.getItem(profileMyListKey());
            var parsed = raw ? JSON.parse(raw) : [];
            vodMyListCache = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch (e) {
            vodMyListCache = [];
        }
        return vodMyListCache;
    }

    function persistMyListIds() {
        try {
            localStorage.setItem(profileMyListKey(), JSON.stringify(vodMyListCache || []));
        } catch (e) {
            console.warn('My List save failed:', e);
        }
    }

    function isInMyList(seriesId) {
        if (!seriesId) {
            return false;
        }
        return loadMyListIds().indexOf(seriesId) !== -1;
    }

    function toggleMyListSeries(seriesId) {
        if (!seriesId) {
            return false;
        }
        var list = loadMyListIds();
        var idx = list.indexOf(seriesId);
        var added;
        if (idx === -1) {
            list.unshift(seriesId);
            added = true;
        } else {
            list.splice(idx, 1);
            added = false;
        }
        vodMyListCache = list;
        persistMyListIds();
        syncMyListHeartButtons(seriesId, added);

        // On My List tab, update only the affected tile — avoid rebuilding the whole grid
        // (full re-render makes every heart flicker).
        if (vodProviderTab === 'mylist' && !added) {
            removeMyListTile(seriesId);
        }
        return added;
    }

    function removeMyListTile(seriesId) {
        var heart = document.querySelector(
            '#series-list .vod-mylist-btn[data-series="' + seriesId + '"]'
        );
        var tile = heart && heart.parentElement;
        var prevFocus = focusedIndex;
        var wasFocusedCard =
            heart &&
            focusableItems[focusedIndex] &&
            focusableItems[focusedIndex].getAttribute('data-series') === seriesId;

        if (tile && tile.parentElement) {
            tile.parentElement.removeChild(tile);
        }

        if (loadMyListIds().length === 0) {
            renderKanboxSeries();
            bindVodItems();
            setFocus(vodTabIndex('mylist'), false);
            return;
        }

        bindVodItems();
        if (wasFocusedCard || prevFocus >= focusableItems.length) {
            setFocus(Math.min(prevFocus, Math.max(0, focusableItems.length - 1)), false);
        }
    }

    function syncMyListHeartButtons(seriesId, active) {
        var buttons = document.querySelectorAll(
            '#series-list .vod-mylist-btn[data-series="' + seriesId + '"]'
        );
        var i;
        for (i = 0; i < buttons.length; i++) {
            if (active) {
                buttons[i].classList.add('is-active');
                buttons[i].setAttribute('aria-pressed', 'true');
            } else {
                buttons[i].classList.remove('is-active');
                buttons[i].setAttribute('aria-pressed', 'false');
            }
        }
    }

    function makeMyListHeartButton(seriesId) {
        var heart = document.createElement('button');
        heart.type = 'button';
        heart.className = 'vod-mylist-btn' + (isInMyList(seriesId) ? ' is-active' : '');
        heart.setAttribute('data-action', 'mylist-toggle');
        heart.setAttribute('data-series', seriesId);
        heart.setAttribute('aria-label', 'הוסף לרשימה שלי');
        heart.setAttribute('aria-pressed', isInMyList(seriesId) ? 'true' : 'false');
        heart.setAttribute('tabindex', '-1');
        heart.innerHTML =
            '<svg class="vod-mylist-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
            '</svg>';
        // Prevent focus steal — focusing the heart blurs the card and flashes other UI.
        heart.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });
        heart.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (Date.now() < okSuppressHeartUntil) {
                return;
            }
            toggleMyListSeries(seriesId);
        });
        return heart;
    }

    function isOkKey(e) {
        var code = e && (e.keyCode || e.which);
        return code === 13 || code === 29443;
    }

    function isVodSeriesCard(item) {
        return !!(
            item &&
            currentView === 'vod' &&
            !profileDialogOpen &&
            item.getAttribute('data-action') === 'series' &&
            item.getAttribute('data-series')
        );
    }

    function clearOkHold() {
        if (okHoldTimer) {
            clearTimeout(okHoldTimer);
            okHoldTimer = null;
        }
        if (okShortTimer) {
            clearTimeout(okShortTimer);
            okShortTimer = null;
        }
        okHoldItem = null;
        okHoldFired = false;
        okHoldSawRepeat = false;
        okHoldDownAt = 0;
    }

    function flashMyListHeart(seriesId) {
        var buttons = document.querySelectorAll(
            '#series-list .vod-mylist-btn[data-series="' + seriesId + '"]'
        );
        var i;
        for (i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('is-pulse');
            // restart animation
            void buttons[i].offsetWidth;
            buttons[i].classList.add('is-pulse');
        }
    }

    function fireOkMyList(item) {
        var seriesId;
        if (okHoldFired || !item) {
            return;
        }
        okHoldFired = true;
        if (okHoldTimer) {
            clearTimeout(okHoldTimer);
            okHoldTimer = null;
        }
        if (okShortTimer) {
            clearTimeout(okShortTimer);
            okShortTimer = null;
        }
        seriesId = item.getAttribute('data-series');
        if (seriesId && currentView === 'vod') {
            toggleMyListSeries(seriesId);
            flashMyListHeart(seriesId);
        }
    }

    function fireOkOpenSeries(item) {
        var target = item;
        if (okHoldFired || !target) {
            return;
        }
        clearOkHold();
        if (currentView === 'vod') {
            activateItem(target);
        }
    }

    function startOkHoldForMyList(item) {
        if (okHoldItem === item) {
            return;
        }
        clearOkHold();
        okHoldItem = item;
        okHoldDownAt = Date.now();
        okSuppressHeartUntil = Date.now() + OK_HOLD_MYLIST_MS + 200;
        // Simulator virtual OK often sends keydown with no keyup. Treat that as short press.
        okShortTimer = setTimeout(function () {
            okShortTimer = null;
            if (!okHoldFired && !okHoldSawRepeat && okHoldItem === item) {
                fireOkOpenSeries(item);
            }
        }, OK_SHORT_FALLBACK_MS);
        okHoldTimer = setTimeout(function () {
            okHoldTimer = null;
            // Require key repeat so a tap without keyup cannot become "הרשימה שלי".
            if (!okHoldFired && okHoldSawRepeat && okHoldItem === item) {
                fireOkMyList(item);
            }
        }, OK_HOLD_MYLIST_MS);
    }

    function onKeyUp(e) {
        // Clear on any keyup while seeking — Tizen arrow keyCodes on keyup are unreliable
        if (vodSeekHoldTimer || vodSeekHoldKey) {
            clearVodSeekHold();
        }
        if (!isOkKey(e)) {
            return;
        }
        if (!okHoldItem && !okHoldTimer && !okShortTimer && !okHoldFired) {
            return;
        }
        var item = okHoldItem;
        var fired = okHoldFired;
        clearOkHold();
        if (fired) {
            e.preventDefault();
            return;
        }
        if (item && currentView === 'vod') {
            activateItem(item);
            e.preventDefault();
        }
    }

    function persistVodProgressMap() {
        try {
            localStorage.setItem(profileProgressKey(), JSON.stringify(vodProgressCache || {}));
        } catch (e) {
            console.warn('VOD progress save failed:', e);
        }
    }

    function getVodProgress(episodeId) {
        if (!episodeId) {
            return null;
        }
        var entry = loadVodProgressMap()[episodeId];
        if (!entry || typeof entry.p !== 'number' || entry.p < VOD_PROGRESS_MIN_SEC) {
            return null;
        }
        return entry;
    }

    function clearVodProgress(episodeId) {
        if (!episodeId) {
            return;
        }
        var map = loadVodProgressMap();
        if (map[episodeId]) {
            delete map[episodeId];
            persistVodProgressMap();
        }
    }

    function pruneVodProgressMap(map) {
        var keys = Object.keys(map);
        if (keys.length <= VOD_PROGRESS_MAX) {
            return;
        }
        keys.sort(function (a, b) {
            return (map[a].t || 0) - (map[b].t || 0);
        });
        var removeCount = keys.length - VOD_PROGRESS_MAX;
        for (var i = 0; i < removeCount; i++) {
            delete map[keys[i]];
        }
    }

    function setVodProgress(episodeId, positionSec, durationSec) {
        if (!episodeId) {
            return;
        }
        positionSec = Math.floor(positionSec || 0);
        durationSec = Math.floor(durationSec || 0);
        if (positionSec < VOD_PROGRESS_MIN_SEC) {
            // Keep any existing resume point; don't wipe it during startup/resume
            return;
        }
        if (durationSec > 0 && positionSec / durationSec >= VOD_PROGRESS_COMPLETE) {
            clearVodProgress(episodeId);
            return;
        }
        var map = loadVodProgressMap();
        map[episodeId] = {
            p: positionSec,
            d: durationSec > 0 ? durationSec : ((map[episodeId] && map[episodeId].d) || 0),
            t: Date.now()
        };
        pruneVodProgressMap(map);
        persistVodProgressMap();
    }

    function saveCurrentVodProgress(force) {
        if (!isVodMode || !currentVodEpisodeId || !isFullscreen) {
            return;
        }
        // Avoid writing 0:00 over a saved resume point before seek lands
        if (!vodResumeApplied && vodResumeTargetSec > 0) {
            return;
        }
        var now = Date.now();
        if (!force && now - vodLastProgressSaveAt < VOD_PROGRESS_SAVE_MS) {
            return;
        }
        vodLastProgressSaveAt = now;
        setVodProgress(currentVodEpisodeId, getVodCurrentSec(), getVodDurationSec());
    }

    function applyVodResumeIfNeeded() {
        if (!isVodMode || !isFullscreen || vodResumeApplied || !(vodResumeTargetSec > 0)) {
            return;
        }
        var duration = getVodDurationSec();
        if (duration > 0) {
            if (vodResumeTargetSec >= duration * VOD_PROGRESS_COMPLETE) {
                vodResumeApplied = true;
                vodResumeTargetSec = 0;
                return;
            }
            if (vodResumeTargetSec >= duration - 2) {
                vodResumeApplied = true;
                vodResumeTargetSec = 0;
                return;
            }
        } else if (usingAvplayPlayback) {
            // Wait until AVPlay reports duration
            return;
        }

        var target = vodResumeTargetSec;
        vodResumeApplied = true;
        vodResumeTargetSec = 0;
        setTimeout(function () {
            if (!isFullscreen || !isVodMode) {
                return;
            }
            seekVodTo(target);
            updateVodProgress(target, getVodDurationSec());
        }, 250);
    }

    function progressPercent(entry) {
        if (!entry || !(entry.d > 0) || !(entry.p > 0)) {
            return 0;
        }
        return Math.min(100, Math.max(2, (entry.p / entry.d) * 100));
    }

    // Most recently watched in-progress episode for a series (if any).
    function getSeriesProgressEntry(series) {
        if (!series || !series.episodes || !series.episodes.length) {
            return null;
        }
        var best = null;
        var i;
        for (i = 0; i < series.episodes.length; i++) {
            var entry = getVodProgress(series.episodes[i] && series.episodes[i].id);
            if (!entry) {
                continue;
            }
            if (!best || (entry.t || 0) > (best.t || 0)) {
                best = entry;
            }
        }
        return best;
    }

    function progressEntryForCard(button) {
        if (!button) {
            return null;
        }
        var episodeId = button.getAttribute('data-episode');
        if (episodeId) {
            return getVodProgress(episodeId);
        }
        var seriesId = button.getAttribute('data-series');
        if (seriesId) {
            return getSeriesProgressEntry(findSeriesById(seriesId));
        }
        return null;
    }

    function applyProgressBarToCard(button) {
        if (!button) {
            return;
        }
        var track = button.querySelector('.vod-card-progress');
        var fill = button.querySelector('.vod-card-progress-fill');
        if (!track || !fill) {
            return;
        }
        var pct = 0;
        if (button.getAttribute('data-series')) {
            // Series tiles always show a fixed 30% marker when any episode has progress
            pct = getSeriesProgressEntry(findSeriesById(button.getAttribute('data-series'))) ? 30 : 0;
        } else {
            pct = progressPercent(progressEntryForCard(button));
        }
        if (pct > 0) {
            fill.style.width = pct + '%';
            track.classList.add('is-visible');
        } else {
            fill.style.width = '0%';
            track.classList.remove('is-visible');
        }
    }

    function refreshEpisodeProgressBars() {
        var cards = document.querySelectorAll('#episodes-list .vod-card[data-episode]');
        for (var i = 0; i < cards.length; i++) {
            applyProgressBarToCard(cards[i]);
        }
    }

    function refreshSeriesProgressBars() {
        var cards = document.querySelectorAll('#series-list .vod-card[data-series]');
        for (var i = 0; i < cards.length; i++) {
            applyProgressBarToCard(cards[i]);
        }
    }

    function refreshVodProgressBars() {
        refreshEpisodeProgressBars();
        refreshSeriesProgressBars();
    }

    function makeProgressBar(pct) {
        var track = document.createElement('span');
        track.className = 'vod-card-progress';
        var fill = document.createElement('span');
        fill.className = 'vod-card-progress-fill';
        track.appendChild(fill);
        if (pct > 0) {
            fill.style.width = pct + '%';
            track.classList.add('is-visible');
        }
        return track;
    }

    function makeEpisodeProgressBar(episodeId) {
        return makeProgressBar(progressPercent(getVodProgress(episodeId)));
    }

    function makeSeriesProgressBar(series) {
        // Fixed 30% fill — only an “in progress” indicator, not real episode %
        return makeProgressBar(getSeriesProgressEntry(series) ? 30 : 0);
    }

    function isSimulator() {
        try {
            return typeof process !== 'undefined' &&
                process.versions &&
                (!!process.versions.nw || !!process.versions['node-webkit']);
        } catch (e) {
            return false;
        }
    }

    function hasAvplay() {
        return !isSimulator() && typeof webapis !== 'undefined' && webapis.avplay;
    }

    var hubVodRotateTimer = null;

    function getRandomLiveSnapshotUrl() {
        var imgs = document.querySelectorAll('#channels .channel-snapshot');
        var candidates = [];
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].src && imgs[i].src.indexOf('blob:') === 0) {
                candidates.push(imgs[i].src);
            }
        }
        if (!candidates.length) {
            var posters = document.querySelectorAll('#channels .channel-poster');
            for (var j = 0; j < posters.length; j++) {
                if (posters[j].src) candidates.push(posters[j].src);
            }
        }
        return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : '';
    }

    function getRandomSeriesImageUrl() {
        var list = window.ISRTV_KANBOX || [];
        var candidates = [];
        list.forEach(function (s) { if (s.imageURL) candidates.push(s.imageURL); });
        return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : '';
    }

    function updateHubImages() {
        // Hub LIVE / VOD / RADIO images are permanent static assets in HTML.
    }

    function startHubVodRotation() {
        stopHubVodRotation();
    }

    function stopHubVodRotation() {
        if (hubVodRotateTimer) {
            clearInterval(hubVodRotateTimer);
            hubVodRotateTimer = null;
        }
    }

    function init() {
        ensureProfilesLoaded();
        syncProfileButton();
        renderChannels();
        renderKanboxSeries();
        renderRadioStations();
        updateHubImages();
        startHubVodRotation();
        playerEl = document.getElementById('player');
        playerVideo = document.getElementById('player-video');
        playerMessage = document.getElementById('player-message');
        playerSpinner = document.getElementById('player-spinner');
        radioAudio = document.getElementById('radio-audio');
        vodControls = document.getElementById('vod-controls');
        vodPlayPauseBtn = document.getElementById('vod-playpause');
        vodSeek = document.getElementById('vod-seek');
        vodSeekFill = document.getElementById('vod-seek-fill');
        vodSeekThumb = document.getElementById('vod-seek-thumb');
        vodTimeCurrent = document.getElementById('vod-time-current');
        vodTimeDuration = document.getElementById('vod-time-duration');
        vodPauseInfo = document.getElementById('vod-pause-info');
        vodPauseSeries = document.getElementById('vod-pause-series');
        vodPauseEpisode = document.getElementById('vod-pause-episode');
        vodNextBtn = document.getElementById('vod-next-btn');
        vodNextFill = document.getElementById('vod-next-fill');
        vodNextLabel = document.getElementById('vod-next-label');
        bindVodControls();
        bindVodSearch();

        var profileBtn = document.getElementById('profile-btn');
        if (profileBtn && !profileBtn.getAttribute('data-bound')) {
            profileBtn.setAttribute('data-bound', '1');
            profileBtn.addEventListener('click', function (e) {
                e.preventDefault();
                toggleProfileMenu();
            });
        }

        showView('home');

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopPreview();
                stopFullscreenPlayback();
                stopRadioPlayback();
                stopSnapshotCapture();
                flushProfileCachesToStorage();
                clearVodImageCache();
            } else if (!isFullscreen) {
                setFocus(viewFocus[currentView] || 0, false);
                if (currentView === 'live') {
                    startSnapshotRefresh();
                }
            }
        });

        window.addEventListener('pagehide', clearVodImageCache);
        window.addEventListener('beforeunload', clearVodImageCache);

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        // Capture phase: AVPlay / focused controls sometimes swallow bubble keyup on Tizen
        document.addEventListener(
            'keyup',
            function (e) {
                if (vodSeekHoldTimer || vodSeekHoldKey) {
                    clearVodSeekHold();
                }
            },
            true
        );
    }

    function beginVodRestoreLock() {
        vodRestoreLock = true;
        if (vodRestoreTimer) {
            clearTimeout(vodRestoreTimer);
            vodRestoreTimer = null;
        }
    }

    function endVodRestoreLockSoon() {
        if (vodRestoreTimer) {
            clearTimeout(vodRestoreTimer);
        }
        vodRestoreTimer = setTimeout(function () {
            vodRestoreLock = false;
            vodRestoreTimer = null;
            vodRestoreTargetIndex = -1;
        }, 500);
    }

    function openSeriesOverlay() {
        var seriesEl = document.getElementById('view-series');
        var vodEl = document.getElementById('view-vod');
        if (vodEl) {
            // Keep VOD mounted under the episodes layer — preserves tab, grid, scroll.
            vodEl.hidden = false;
            vodEl.classList.add('is-active');
            vodEl.classList.add('is-under-series');
        }
        if (seriesEl) {
            seriesEl.hidden = false;
            seriesEl.classList.add('is-active');
            seriesEl.classList.add('is-series-overlay');
            try {
                seriesEl.scrollTop = 0;
            } catch (eScroll) {}
            var epsList = document.getElementById('episodes-list');
            if (epsList) {
                try {
                    epsList.scrollTop = 0;
                } catch (eEps) {}
            }
        }
    }

    function closeSeriesOverlay() {
        var seriesEl = document.getElementById('view-series');
        var vodEl = document.getElementById('view-vod');
        if (seriesEl) {
            seriesEl.hidden = true;
            seriesEl.classList.remove('is-active');
            seriesEl.classList.remove('is-series-overlay');
            try {
                seriesEl.scrollTop = 0;
            } catch (eScroll) {}
            var epsListClose = document.getElementById('episodes-list');
            if (epsListClose) {
                try {
                    epsListClose.scrollTop = 0;
                } catch (eEpsClose) {}
            }
        }
        if (vodEl) {
            vodEl.classList.remove('is-under-series');
        }
    }

    function restoreVodAfterSeries() {
        var restoreSeriesId = vodReturnSeriesId;
        var restoreVodIndex = viewFocus.vod || 0;
        var restoreTab = vodReturnTab || vodProviderTab;
        var card;
        var idx;

        beginVodRestoreLock();
        closeSeriesOverlay();

        // VOD was never torn down — only re-assert tab + focus on the same card.
        if (restoreTab && restoreTab !== vodProviderTab) {
            vodProviderTab = restoreTab;
        }
        syncVodTabUi();

        card =
            restoreSeriesId &&
            document.querySelector('#series-list .vod-card[data-series="' + restoreSeriesId + '"]');
        if (!card) {
            renderKanboxSeries();
        } else {
            refreshSeriesProgressBars();
        }

        bindVodItems();
        idx = findVodFocusIndex(restoreSeriesId, restoreVodIndex);
        vodRestoreTargetIndex = idx;
        // Don't force scroll — body position was preserved under the overlay.
        setFocus(idx, false);
        endVodRestoreLockSoon();
    }

    function showView(viewName) {
        var fromSeries = viewName === 'vod' && vodReturningFromSeries;
        var views = document.querySelectorAll('.view');

        if (fromSeries) {
            vodReturningFromSeries = false;
            currentView = 'vod';
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            closeVodIme(false);
            restoreVodAfterSeries();
            return;
        }

        // Leaving episodes for any other destination
        if (currentView === 'series' || viewName !== 'series') {
            closeSeriesOverlay();
        }

        currentView = viewName;

        if (viewName === 'series') {
            // Overlay on VOD — do not hide/display:none the grid (that resets scroll + focus).
            Array.prototype.forEach.call(views, function (view) {
                if (view.id === 'view-vod' || view.id === 'view-series') {
                    return;
                }
                view.hidden = true;
                view.classList.remove('is-active');
            });
            openSeriesOverlay();
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            closeSeriesSeasonMenu(false);
            bindSeriesItems();
            setFocus(viewFocus.series || 0, false);
            return;
        }

        Array.prototype.forEach.call(views, function (view) {
            var active = view.getAttribute('data-view') === viewName;
            view.hidden = !active;
            if (active) {
                view.classList.add('is-active');
            } else {
                view.classList.remove('is-active');
            }
        });

        if (viewName === 'home') {
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            updateHubImages();
            startHubVodRotation();
            renderHomeContinueWatching();
            bindHomeItems();
        } else if (viewName === 'live') {
            stopHubVodRotation();
            stopRadioPlayback();
            syncLiveTabUi();
            renderChannels();
            bindLiveItems();
            try {
                var liveGridEnter = document.getElementById('channels');
                if (liveGridEnter) {
                    liveGridEnter.scrollTop = 0;
                }
            } catch (eLiveEnter) {}
            startSnapshotRefresh();
        } else if (viewName === 'vod') {
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            closeVodIme(false);
            bindVodSearch();
            vodReturnSeriesId = null;
            vodReturnTab = null;
            renderKanboxSeries();
            bindVodItems();
            try {
                var vodGridEnter = document.getElementById('series-list');
                if (vodGridEnter) {
                    vodGridEnter.scrollTop = 0;
                }
            } catch (eVodEnter) {}
            setFocus(typeof viewFocus.vod === 'number' ? viewFocus.vod : 0, true);
            return;
        } else if (viewName === 'radio') {
            stopPreview();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            stopHubVodRotation();
            renderRadioStations();
            bindRadioItems();
        }

        setFocus(viewFocus[viewName] || 0, true);
    }

    function seriesSeasonSelectEnabled() {
        var wrap = document.getElementById('series-season-wrap');
        return !!(wrap && !wrap.classList.contains('is-disabled') && seriesSeasonOptions.length > 1);
    }

    function seriesHeaderFocusCount() {
        return seriesSeasonSelectEnabled() ? 1 : 0;
    }

    function seasonTitleOverride(seasonNum, series) {
        var n = Number(seasonNum);
        var titles;
        var i;
        if (!series) {
            return '';
        }
        titles = series.seasonTitles;
        if (titles) {
            if (titles[n]) {
                return String(titles[n]);
            }
            if (titles[String(n)]) {
                return String(titles[String(n)]);
            }
        }
        if (series.episodes) {
            for (i = 0; i < series.episodes.length; i++) {
                if ((series.episodes[i].season || 1) === n && series.episodes[i].seasonTitle) {
                    return String(series.episodes[i].seasonTitle);
                }
            }
        }
        return '';
    }

    function seasonDisplayLabel(seasonNum, series) {
        var n = Number(seasonNum);
        var override = seasonTitleOverride(n, series);
        var ep;
        var base;
        var i;
        if (override) {
            return override;
        }
        if (n >= 800 && series && series.episodes) {
            for (i = 0; i < series.episodes.length; i++) {
                if ((series.episodes[i].season || 1) === n) {
                    ep = series.episodes[i];
                    break;
                }
            }
            if (ep && ep.name) {
                base = String(ep.name).split('—')[0].split('–')[0];
                base = base.replace(/\s*פרק\s*\d+\s*$/, '').trim();
                if (base) {
                    return base;
                }
            }
            return 'ספיישל';
        }
        return 'עונה ' + seasonNum;
    }

    /** Kan /sN/ path for ordering (UI עונה 10 may be /s12/). Specials use 800+path. */
    function seasonPathRank(seasonNum, series) {
        var n = Number(seasonNum) || 1;
        var i;
        var ep;
        var path = 0;
        if (series && series.episodes) {
            for (i = 0; i < series.episodes.length; i++) {
                ep = series.episodes[i];
                if ((ep.season || 1) !== n) {
                    continue;
                }
                if (ep.pathSeason) {
                    path = Math.max(path, Number(ep.pathSeason) || 0);
                }
            }
        }
        if (path) {
            return { path: path, special: n >= 800 ? 1 : 0 };
        }
        if (n >= 800) {
            return { path: n - 800, special: 1 };
        }
        return { path: n, special: 0 };
    }

    function compareSeasonNumbers(a, b, series) {
        var ra = seasonPathRank(a, series);
        var rb = seasonPathRank(b, series);
        if (ra.path !== rb.path) {
            return rb.path - ra.path; // higher Kan path first (newest)
        }
        if (ra.special !== rb.special) {
            return ra.special - rb.special; // main עונה before ספיישל
        }
        return b - a;
    }

    function seasonFilterLabel(value) {
        var i;
        if (value === 'all') {
            return 'הכל';
        }
        for (i = 0; i < seriesSeasonOptions.length; i++) {
            if (seriesSeasonOptions[i].value === String(value)) {
                return seriesSeasonOptions[i].label;
            }
        }
        return seasonDisplayLabel(value, currentSeries);
    }

    function syncSeriesSeasonLabel() {
        var label = document.getElementById('series-season-label');
        if (label) {
            label.textContent = seasonFilterLabel(seriesSeasonFilter);
        }
    }

    function syncSeriesSeasonSticky(item) {
        var el = document.getElementById('series-season-sticky');
        var label = '';
        var raw;
        var seasonNum;
        if (!el) {
            return;
        }
        item = item || (focusableItems && focusableItems[focusedIndex]) || null;
        if (seriesSeasonFilter !== 'all' && isFinite(seriesSeasonFilter)) {
            label = seasonDisplayLabel(seriesSeasonFilter, currentSeries);
        } else if (item && item.getAttribute) {
            raw = item.getAttribute('data-season-num') || item.getAttribute('data-season-value');
            if (raw && raw !== 'all') {
                seasonNum = parseInt(raw, 10);
                if (isFinite(seasonNum)) {
                    label = seasonDisplayLabel(seasonNum, currentSeries);
                }
            }
        }
        if (!label && seriesSeasonNumbers && seriesSeasonNumbers.length) {
            label = seasonDisplayLabel(seriesSeasonNumbers[0], currentSeries);
        }
        if (label) {
            el.hidden = false;
            el.textContent = label;
        } else {
            el.hidden = true;
            el.textContent = '';
        }
    }

    function closeSeriesSeasonMenu(restoreFocus) {
        var menu = document.getElementById('series-season-menu');
        var wrap = document.getElementById('series-season-wrap');
        var trigger = document.getElementById('series-season-trigger');
        seriesSeasonMenuOpen = false;
        if (menu) {
            menu.hidden = true;
        }
        if (wrap) {
            wrap.classList.remove('is-open');
        }
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }
        if (restoreFocus && currentView === 'series') {
            bindSeriesItems();
            setFocus(0, false);
        }
    }

    function openSeriesSeasonMenu() {
        var menu = document.getElementById('series-season-menu');
        var wrap = document.getElementById('series-season-wrap');
        var trigger = document.getElementById('series-season-trigger');
        var options;
        var startIndex = 0;
        var i;

        if (!seriesSeasonSelectEnabled() || !menu) {
            return;
        }

        seriesSeasonMenuOpen = true;
        menu.hidden = false;
        if (wrap) {
            wrap.classList.add('is-open');
        }
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        options = Array.prototype.slice.call(menu.querySelectorAll('.vod-season-option'));
        focusableItems = options;
        channels = [];
        lastFocusedEl = null;

        for (i = 0; i < options.length; i++) {
            if (options[i].getAttribute('data-season-value') === String(seriesSeasonFilter)) {
                startIndex = i;
    		break;
            }
        }

        options.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                syncSeriesSeasonSticky(item);
            };
            item.onclick = function () {
                chooseSeriesSeason(item.getAttribute('data-season-value'));
            };
        });

        setFocus(startIndex, true);
        resetPageScroll();
    }

    function chooseSeriesSeason(value) {
        if (value === 'all') {
            seriesSeasonFilter = 'all';
        } else {
            seriesSeasonFilter = parseInt(value, 10);
            if (!isFinite(seriesSeasonFilter)) {
                seriesSeasonFilter = 'all';
            }
        }
        syncSeriesSeasonLabel();
        closeSeriesSeasonMenu(false);
        if (currentSeries) {
            renderSeriesEpisodes(currentSeries);
            bindSeriesItems();
            setFocus(seriesHeaderFocusCount(), true);
            resetPageScroll();
        }
    }

    function bindSeriesItems() {
        var trigger = document.getElementById('series-season-trigger');
        var cards = Array.prototype.slice.call(
            document.querySelectorAll('#episodes-list .vod-card, #episodes-list .channel')
        );
        var header = [];
        if (trigger && seriesSeasonSelectEnabled()) {
            header.push(trigger);
        }
        focusableItems = header.concat(cards);
        channels = cards;
        lastFocusedEl = null;
        seriesSeasonMenuOpen = false;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.series = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                syncSeriesSeasonSticky(item);
                scheduleHydrateNearbyVodImages(index);
            };

            item.onclick = function () {
                activateItem(item);
            };
        });

        hydrateNearbyVodImages(viewFocus.series || 0);
    }

    function populateSeriesSeasonSelect(seasonNumbers) {
        var trigger = document.getElementById('series-season-trigger');
        var wrap = document.getElementById('series-season-wrap');
        var menu = document.getElementById('series-season-menu');
        var i;
        var opt;
        var value;
        var label;

        seasonNumbers = seasonNumbers || [];
        seriesSeasonOptions = [];

        if (menu) {
            menu.innerHTML = '';
            menu.hidden = true;
        }
        if (wrap) {
            wrap.classList.remove('is-open');
        }
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }
        seriesSeasonMenuOpen = false;

        if (!seasonNumbers.length) {
            seriesSeasonOptions = [{ value: '1', label: 'עונה 1' }];
            seriesSeasonFilter = 1;
            if (wrap) {
                wrap.classList.add('is-disabled');
            }
            if (trigger) {
                trigger.disabled = true;
            }
            syncSeriesSeasonLabel();
            return;
        }

        if (seasonNumbers.length <= 1) {
            value = String(seasonNumbers[0]);
            seriesSeasonOptions = [{
                value: value,
                label: seasonDisplayLabel(seasonNumbers[0], currentSeries)
            }];
            seriesSeasonFilter = seasonNumbers[0];
            if (wrap) {
                wrap.classList.add('is-disabled');
            }
            if (trigger) {
                trigger.disabled = true;
            }
            syncSeriesSeasonLabel();
            return;
        }

        seriesSeasonOptions.push({ value: 'all', label: 'הכל' });
        for (i = 0; i < seasonNumbers.length; i++) {
            seriesSeasonOptions.push({
                value: String(seasonNumbers[i]),
                label: seasonDisplayLabel(seasonNumbers[i], currentSeries)
            });
        }

        if (
            seriesSeasonFilter !== 'all' &&
            seasonNumbers.indexOf(seriesSeasonFilter) === -1
        ) {
            seriesSeasonFilter = 'all';
        }

        if (menu) {
            for (i = 0; i < seriesSeasonOptions.length; i++) {
                opt = document.createElement('button');
                opt.type = 'button';
                opt.className = 'vod-season-option';
                opt.setAttribute('role', 'option');
                opt.setAttribute('data-action', 'series-season-option');
                opt.setAttribute('data-season-value', seriesSeasonOptions[i].value);
                opt.textContent = seriesSeasonOptions[i].label;
                if (String(seriesSeasonFilter) === seriesSeasonOptions[i].value) {
                    opt.classList.add('is-active');
                }
                menu.appendChild(opt);
            }
        }

        if (wrap) {
            wrap.classList.remove('is-disabled');
        }
        if (trigger) {
            trigger.disabled = false;
        }
        syncSeriesSeasonLabel();
    }

    function bindItems(container) {
        if (!container) {
            focusableItems = [];
            channels = [];
            return;
        }

        focusableItems = Array.prototype.slice.call(container.querySelectorAll('.channel, .vod-card'));
        channels = focusableItems;
        lastFocusedEl = null;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus[currentView] = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                scheduleHydrateNearbyVodImages(index);
                if (currentView === 'live') {
                    schedulePreview(item);
                }
            };

            item.onclick = function () {
                activateItem(item);
            };
        });

        hydrateNearbyVodImages(viewFocus[currentView] || 0);
    }

    function bindHomeItems() {
        var hub = document.getElementById('hub');
        var row = document.getElementById('home-continue-row');
        var items = [];
        if (hub) {
            items = items.concat(Array.prototype.slice.call(hub.querySelectorAll('.channel, .vod-card')));
        }
        if (row) {
            items = items.concat(Array.prototype.slice.call(row.querySelectorAll('.channel, .vod-card')));
        }
        focusableItems = items;
        channels = items;
        lastFocusedEl = null;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.home = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                scheduleHydrateNearbyVodImages(index);
            };
            item.onclick = function () {
                activateItem(item);
            };
        });

        hydrateNearbyVodImages(viewFocus.home || 0);
    }

    function buildEpisodeLookup() {
        var lookup = {};
        var list = window.ISRTV_KANBOX || [];
        var s;
        var e;
        var series;
        var episode;
        for (s = 0; s < list.length; s++) {
            series = list[s];
            if (!series || !series.episodes) {
                continue;
            }
            for (e = 0; e < series.episodes.length; e++) {
                episode = series.episodes[e];
                if (episode && episode.id) {
                    lookup[episode.id] = { series: series, episode: episode };
                }
            }
        }
        return lookup;
    }

    function getContinueWatchingEntries() {
        var map = loadVodProgressMap();
        var lookup = buildEpisodeLookup();
        var ids = Object.keys(map);
        var items = [];
        var i;
        var id;
        var entry;
        var found;
        for (i = 0; i < ids.length; i++) {
            id = ids[i];
            entry = getVodProgress(id);
            if (!entry) {
                continue;
            }
            if (entry.d > 0 && entry.p / entry.d >= HOME_CONTINUE_DONE) {
                continue;
            }
            found = lookup[id];
            if (!found) {
                continue;
            }
            items.push({
                series: found.series,
                episode: found.episode,
                entry: entry
            });
        }
        items.sort(function (a, b) {
            return (b.entry.t || 0) - (a.entry.t || 0);
        });
        return items.slice(0, HOME_CONTINUE_MAX);
    }

    function renderHomeContinueWatching() {
        var section = document.getElementById('home-continue');
        var row = document.getElementById('home-continue-row');
        var entries;
        var i;
        if (!section || !row) {
            return;
        }

        entries = getContinueWatchingEntries();
        row.innerHTML = '';

        if (!entries.length) {
            section.hidden = true;
            return;
        }

        section.hidden = false;

        for (i = 0; i < entries.length; i++) {
            (function (item) {
                var episode = item.episode;
                var series = item.series;
                var button = document.createElement('button');
                var inner;
                var gradient;
                var name;
                var seriesLabel;
                var epLabel;

                button.type = 'button';
                button.className = 'vod-card home-continue-card channel';
                button.setAttribute('data-action', 'continue-play');
                button.setAttribute('data-episode', episode.id || '');
                button.setAttribute('data-series-id', series.id || '');
                button.setAttribute('data-url', episode.streamURL || '');
                if (episode.assetId) {
                    button.setAttribute('data-asset-id', String(episode.assetId));
                }
                if (episode.streamResolve) {
                    button.setAttribute('data-stream-resolve', episode.streamResolve);
                }
                applyVodPlayAttrs(button, episode, series);

                inner = document.createElement('span');
                inner.className = 'vod-card-inner';

                if (episode.imageURL) {
                    inner.appendChild(makeLazyVodImage(episode.imageURL, ''));
                } else if (series.imageURL) {
                    inner.appendChild(makeLazyVodImage(series.imageURL, series.name || ''));
                }

                gradient = document.createElement('span');
                gradient.className = 'vod-card-gradient';
                inner.appendChild(gradient);

                name = document.createElement('span');
                name.className = 'vod-card-name';
                name.setAttribute('dir', 'auto');
                seriesLabel = document.createElement('span');
                seriesLabel.className = 'vod-card-series';
                seriesLabel.textContent = series.name || '';
                epLabel = document.createElement('span');
                epLabel.textContent = episodeDisplayName(episode);
                name.appendChild(seriesLabel);
                name.appendChild(epLabel);
                inner.appendChild(name);

                inner.appendChild(makeEpisodeProgressBar(episode.id));
                button.appendChild(inner);
                row.appendChild(button);
            })(entries[i]);
        }
    }

    function openContinueEpisode(series, episode) {
        if (!series || !episode) {
            return;
        }

        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }
        stopPreview();
        stopRadioPlayback();
        stopSnapshotCapture();

        currentSeries = series;
        isFullscreen = true;
        document.body.classList.add('is-fullscreen');
        if (playerEl) {
            playerEl.hidden = false;
            playerEl.classList.remove('is-playing');
        }
        startVodEpisodePlayback(episode, { resume: true });
    }

    function moveHomeFocus(dx, dy) {
        var items = focusableItems;
        var hubCount = Math.min(HOME_HUB_COUNT, items.length);
        var continueCount = Math.max(0, items.length - hubCount);
        var idx = focusedIndex;
        var next;

        if (!items.length) {
            return;
        }

        if (idx < hubCount) {
            // Hub row
            if (dy > 0 && continueCount > 0) {
                // Drop into continue row — map hub col to a nearby card
                next = hubCount + Math.min(idx, continueCount - 1);
                setFocus(next, true);
                return;
            }
            if (dy < 0) {
                tryFocusProfileChromeFromTop();
                return;
            }
            next = idx + dx;
            if (next < 0 || next >= hubCount) {
                return;
            }
            setFocus(next, false);
            return;
        }

        // Continue row
        if (dy < 0) {
            // Back up to hub — map position along the row to one of 3 tiles
            var contIdx = idx - hubCount;
            var hubTarget = Math.min(
                hubCount - 1,
                Math.floor((contIdx / Math.max(1, continueCount)) * hubCount)
            );
            setFocus(hubTarget, true);
            return;
        }
        if (dy > 0) {
            return;
        }
        next = idx + dx;
        if (next < hubCount || next >= items.length) {
            return;
        }
        setFocus(next, true);
    }

    function getPageScrollY() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    function setPageScrollY(y) {
        y = Math.max(0, y);
        // Single write — triple scrollTop updates force extra layout on TV
        try {
            window.scrollTo(0, y);
        } catch (e) {
            try {
                if (document.documentElement) {
                    document.documentElement.scrollTop = y;
                }
            } catch (e2) {}
        }
    }

    function cancelPendingScroll() {
        if (scrollRaf !== null) {
            try {
                cancelAnimationFrame(scrollRaf);
            } catch (e) {}
            scrollRaf = null;
        }
    }

    function resetPageScroll() {
        cancelPendingScroll();
        setPageScrollY(0);
    }

    var scrollRaf = null;
    var focusFromCode = false;
    var lastFocusedEl = null;

    function applyFocusClass(prevIndex, nextIndex) {
        var items = focusableItems;
        var prev = lastFocusedEl || (items && items[prevIndex]) || null;
        var next = (items && items[nextIndex]) || null;
        if (prev && prev !== next) {
            prev.classList.remove('is-focused');
        }
        if (next) {
            next.classList.add('is-focused');
            lastFocusedEl = next;
        }
    }

    function syncFocusClass() {
        applyFocusClass(focusedIndex, focusedIndex);
    }

    /** Defer poster decode until cards are near focus — eager load of 100+ images freezes Tizen.
     *  Once loaded, keep an in-memory cache so revisiting tiles shows instantly (no wipe animation). */
    function touchVodImageCacheKey(url) {
        var idx = vodImageCacheKeys.indexOf(url);
        if (idx >= 0) {
            vodImageCacheKeys.splice(idx, 1);
        }
        vodImageCacheKeys.push(url);
        while (vodImageCacheKeys.length > VOD_IMAGE_CACHE_MAX) {
            var old = vodImageCacheKeys.shift();
            if (old && old !== url) {
                delete vodImageCache[old];
            }
        }
    }

    function rememberVodImage(url) {
        var im;
        if (!url) {
            return;
        }
        if (vodImageCache[url] && vodImageCache[url].ready) {
            touchVodImageCacheKey(url);
            return;
        }
        im = vodImageCache[url] && vodImageCache[url].img;
        if (!im) {
            im = new Image();
            im.decoding = 'async';
            im.src = url;
        }
        vodImageCache[url] = { img: im, ready: true };
        touchVodImageCacheKey(url);
    }

    function isVodImageCached(url) {
        return !!(url && vodImageCache[url] && vodImageCache[url].ready);
    }

    function clearVodImageCache() {
        vodImageCache = Object.create(null);
        vodImageCacheKeys = [];
    }

    function applyCachedVodImage(wrap, img, url) {
        img.src = url;
        img.classList.add('is-revealed', 'is-cached');
        wrap.classList.add('is-revealed', 'is-cached');
        rememberVodImage(url);
    }

    function makeLazyVodImage(url, alt) {
        var wrap = document.createElement('span');
        var line = document.createElement('span');
        var img = document.createElement('img');
        wrap.className = 'vod-card-img-wrap';
        line.className = 'vod-card-img-line';
        line.setAttribute('aria-hidden', 'true');
        img.className = 'vod-card-img';
        img.alt = alt || '';
        img.decoding = 'async';
        if (url && isVodImageCached(url)) {
            applyCachedVodImage(wrap, img, url);
        } else if (url) {
            img.setAttribute('data-src', url);
        }
        wrap.appendChild(line);
        wrap.appendChild(img);
        return wrap;
    }

    /** Samsung-style reveal: white midline, then open upward and downward. */
    function revealVodImage(img) {
        var wrap;
        if (!img || img.classList.contains('is-revealed') || img.classList.contains('is-cached')) {
            return;
        }
        wrap = img.parentElement;
        function show() {
            img.classList.add('is-revealed');
            if (wrap && wrap.classList && wrap.classList.contains('vod-card-img-wrap')) {
                wrap.classList.add('is-revealed');
            }
        }
        if (img.complete && img.naturalWidth > 0) {
            show();
        } else {
            img.addEventListener('load', show);
            img.addEventListener('error', show);
        }
    }

    function hydrateNearbyVodImages(centerIndex) {
        var items = focusableItems;
        if (!items || !items.length) {
            return;
        }
        var start = Math.max(0, (centerIndex || 0) - 6);
        var end = Math.min(items.length - 1, (centerIndex || 0) + 12);
        var i;
        var img;
        var src;
        var wrap;
        for (i = start; i <= end; i++) {
            if (!items[i] || !items[i].querySelector) {
                continue;
            }
            img = items[i].querySelector('img.vod-card-img[data-src]');
            if (!img) {
                continue;
            }
            src = img.getAttribute('data-src');
            if (!src) {
                continue;
            }
            img.removeAttribute('data-src');
            wrap = img.parentElement;
            if (isVodImageCached(src)) {
                applyCachedVodImage(wrap, img, src);
            } else {
                img.src = src;
                img.addEventListener(
                    'load',
                    (function (cachedUrl) {
                        return function () {
                            rememberVodImage(cachedUrl);
                        };
                    })(src)
                );
                revealVodImage(img);
            }
        }
    }

    /** Delay image decode until navigation settles — decoding mid-move freezes Tizen. */
    function scheduleHydrateNearbyVodImages(centerIndex) {
        if (hydrateNearbyTimer) {
            clearTimeout(hydrateNearbyTimer);
        }
        hydrateNearbyTimer = setTimeout(
            function () {
                hydrateNearbyTimer = null;
                hydrateNearbyVodImages(centerIndex);
            },
            isTizenTv ? 180 : 40
        );
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScrollToY(targetY, durationMs) {
        targetY = Math.max(0, Math.round(targetY));
        var startY = getPageScrollY();
        var delta = targetY - startY;
        if (Math.abs(delta) < 1) {
            setPageScrollY(targetY);
            return;
        }
        // TV: jump (or very short ease). Long RAF scrolls make remote feel late.
        var duration;
        if (isTizenTv && (durationMs == null || durationMs <= 0)) {
            setPageScrollY(targetY);
            return;
        }
        if (durationMs != null) {
            duration = durationMs;
        } else {
            duration = Math.min(360, Math.max(240, 200 + Math.abs(delta) * 0.35));
        }
        if (duration <= 0) {
            setPageScrollY(targetY);
            return;
        }

        if (scrollRaf !== null) {
            cancelPendingScroll();
        }

        var startTime = window.performance && performance.now ? performance.now() : Date.now();
        function step(now) {
            var elapsed = (now || Date.now()) - startTime;
            var t = Math.min(1, elapsed / duration);
            setPageScrollY(startY + delta * easeInOutCubic(t));
            if (t < 1) {
                scrollRaf = requestAnimationFrame(step);
            } else {
                scrollRaf = null;
                setPageScrollY(targetY);
            }
        }
        scrollRaf = requestAnimationFrame(step);
    }

    function ensureFocusedItemVisible(item, allowScroll) {
        if (!item || !allowScroll) {
            return;
        }
        if (
            item.classList && (
                item.classList.contains('vod-tab') ||
                item.classList.contains('vod-search-input') ||
                item.classList.contains('vod-search-clear') ||
                item.classList.contains('vod-season-trigger')
            )
        ) {
            if (currentView === 'series') {
                var seriesListTop = document.getElementById('episodes-list');
                if (seriesListTop) {
                    try {
                        seriesListTop.scrollTop = 0;
                    } catch (eTop) {}
                }
            } else if (currentView === 'vod') {
                var vodListTop = document.getElementById('series-list');
                if (vodListTop) {
                    try {
                        vodListTop.scrollTop = 0;
                    } catch (eVodTop) {}
                }
                setPageScrollY(0);
            } else if (currentView === 'live') {
                var liveListTop = document.getElementById('channels');
                if (liveListTop) {
                    try {
                        liveListTop.scrollTop = 0;
                    } catch (eLiveTop) {}
                }
                setPageScrollY(0);
            } else {
                smoothScrollToY(0, isTizenTv ? 0 : 280);
            }
            return;
        }

        if (currentView === 'home') {
            if (item.classList && item.classList.contains('home-continue-card')) {
                try {
                    item.scrollIntoView({ behavior: isTizenTv ? 'auto' : 'smooth', inline: 'nearest', block: 'nearest' });
                } catch (e) {
                    try {
                        item.scrollIntoView(false);
                    } catch (e2) {}
                }
                // Keep page from drifting too far when focusing the continue row
                var vhHome = window.innerHeight || 1080;
                var rectHome = item.getBoundingClientRect();
                if (rectHome.bottom > vhHome - 40) {
                    smoothScrollToY(getPageScrollY() + (rectHome.bottom - (vhHome - 40)), isTizenTv ? 0 : 220);
                }
            } else {
                smoothScrollToY(0, isTizenTv ? 0 : 280);
            }
            return;
        }

        // Episodes: only the tiles container scrolls under the fixed header.
        if (currentView === 'series') {
            var seriesList = document.getElementById('episodes-list');
            if (!seriesList) {
                return;
            }
            var vhSeries = seriesList.clientHeight || window.innerHeight || 1080;
            var itemRect = item.getBoundingClientRect();
            var seriesRect = seriesList.getBoundingClientRect();
            var topLimitS = Math.round(vhSeries * 0.22);
            var bottomLimitS = Math.round(vhSeries * 0.78);
            var relTop = itemRect.top - seriesRect.top;
            var relBottom = itemRect.bottom - seriesRect.top;
            var nextTop = seriesList.scrollTop;
            if (relTop < topLimitS) {
                nextTop = seriesList.scrollTop - (topLimitS - relTop);
            } else if (relBottom > bottomLimitS) {
                nextTop = seriesList.scrollTop + (relBottom - bottomLimitS);
            }
            if (nextTop !== seriesList.scrollTop) {
                try {
                    seriesList.scrollTop = Math.max(0, nextTop);
                } catch (eSeriesScroll) {}
            }
            return;
        }

        // VOD / LIVE: only the tiles container scrolls under the fixed header/divider.
        if (currentView === 'vod' || currentView === 'live') {
            var tileList = document.getElementById(currentView === 'vod' ? 'series-list' : 'channels');
            if (!tileList) {
                return;
            }
            var vhTiles = tileList.clientHeight || window.innerHeight || 1080;
            var itemRectV = item.getBoundingClientRect();
            var listRect = tileList.getBoundingClientRect();
            var topLimitV = Math.round(vhTiles * 0.22);
            var bottomLimitV = Math.round(vhTiles * 0.78);
            var relTopV = itemRectV.top - listRect.top;
            var relBottomV = itemRectV.bottom - listRect.top;
            var nextTopV = tileList.scrollTop;
            if (relTopV < topLimitV) {
                nextTopV = tileList.scrollTop - (topLimitV - relTopV);
            } else if (relBottomV > bottomLimitV) {
                nextTopV = tileList.scrollTop + (relBottomV - bottomLimitV);
            }
            if (nextTopV !== tileList.scrollTop) {
                try {
                    tileList.scrollTop = Math.max(0, nextTopV);
                } catch (eTileScroll) {}
            }
            return;
        }

        var vh = window.innerHeight || 1080;
        var rect = item.getBoundingClientRect();
        // Scroll when the card leaves a comfortable band
        var topLimit = Math.round(vh * 0.22);
        var bottomLimit = Math.round(vh * 0.78);
        var scrollY = getPageScrollY();
        var nextY = scrollY;

        if (rect.top < topLimit) {
            nextY = scrollY - (topLimit - rect.top);
        } else if (rect.bottom > bottomLimit) {
            nextY = scrollY + (rect.bottom - bottomLimit);
        }

        if (Math.abs(nextY - scrollY) > 2) {
            smoothScrollToY(Math.max(0, nextY));
        }
    }

    function applyThumbImage(thumb, imageURL) {
        if (!thumb || !imageURL) {
            return;
        }
        var img = document.createElement('img');
        img.className = 'channel-poster';
        img.src = imageURL;
        img.alt = '';
        thumb.appendChild(img);
        thumb.classList.add('has-image');
    }

    function findVodFocusIndex(seriesId, fallbackIndex) {
        var i;
        var header = vodHeaderFocusCount();
        if (seriesId) {
            for (i = 0; i < focusableItems.length; i++) {
                if (focusableItems[i].getAttribute('data-series') === seriesId) {
                    return i;
                }
            }
        }
        if (typeof fallbackIndex === 'number' && fallbackIndex >= header && fallbackIndex < focusableItems.length) {
            return fallbackIndex;
        }
        // Prefer first series card — never fall back onto a tab (that switches provider)
        if (focusableItems.length > header) {
            return header;
        }
        return Math.min(vodTabIndex(vodProviderTab), Math.max(0, focusableItems.length - 1));
    }

    function seriesMatchesVodTab(series, tab) {
        var source = (series && series.source) || 'kan';
        if (tab === 'mylist') {
            return isInMyList(series && series.id);
        }
        if (tab === 'n12') {
            return source === 'mako' || source === 'n12';
        }
        if (tab === 'r13') {
            return source === 'reshet' || source === 'r13';
        }
        if (tab === 'sweden') {
            return source === 'sweden' || source === 'tv4';
        }
        // כאן 11 — everything that is not N12/Mako, Reshet 13, or Sweden/TV4
        return source !== 'mako' && source !== 'n12' && source !== 'reshet' && source !== 'r13' &&
            source !== 'sweden' && source !== 'tv4';
    }

    function vodTabIndex(tab) {
        var tabs = document.querySelectorAll('#vod-tabs .vod-tab');
        var i;
        for (i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute('data-vod-tab') === tab) {
                return i;
            }
        }
        return 0;
    }

    function syncVodTabUi() {
        var tabs = document.querySelectorAll('#vod-tabs .vod-tab');
        Array.prototype.forEach.call(tabs, function (tab) {
            var id = tab.getAttribute('data-vod-tab');
            // Search is its own view — no provider tab stays selected while searching
            var active = !vodSearchMode && id === vodProviderTab;
            if (active) {
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        var searchWrap = document.getElementById('vod-search');
        if (searchWrap) {
            if (vodSearchMode) {
                searchWrap.classList.add('is-search-active');
            } else {
                searchWrap.classList.remove('is-search-active');
            }
        }
    }

    function setVodProviderTab(tab, keepFocusOnTab) {
        if (tab !== 'kan' && tab !== 'n12' && tab !== 'r13' && tab !== 'sweden' && tab !== 'mylist') {
            return;
        }
        if (vodRestoreLock) {
            return;
        }
        var changed = vodProviderTab !== tab || vodSearchMode;
        vodProviderTab = tab;
        // Tabs always show the full provider grid — leave search mode
        vodSearchMode = false;
        if (changed) {
            vodReturnSeriesId = null;
            vodReturnTab = null;
        }
        syncVodTabUi();
        renderKanboxSeries();
        bindVodItems();
        if (changed) {
            var vodGrid = document.getElementById('series-list');
            if (vodGrid) {
                try {
                    vodGrid.scrollTop = 0;
                } catch (eGrid) {}
            }
        }
        if (keepFocusOnTab) {
            setFocus(vodTabIndex(tab), false);
        } else if (changed) {
            var firstCard = vodHeaderFocusCount();
            if (focusableItems.length > firstCard) {
                setFocus(firstCard, true);
            } else {
                setFocus(vodTabIndex(tab), false);
            }
        }
    }

    function vodTabCount() {
        var tabs = document.querySelectorAll('#vod-tabs .vod-tab');
        return tabs ? tabs.length : 0;
    }

    function vodHeaderFocusCount() {
        // tabs + search input + clear button
        return vodTabCount() + 2;
    }

    function syncVodSearchClearUi() {
        var clearBtn = document.getElementById('vod-search-clear');
        if (!clearBtn) {
            return;
        }
        if (vodSearchQuery) {
            clearBtn.classList.add('is-visible');
            clearBtn.removeAttribute('aria-disabled');
        } else {
            clearBtn.classList.remove('is-visible');
            clearBtn.setAttribute('aria-disabled', 'true');
        }
    }

    function normalizeVodSearch(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    }

    function seriesMatchesSearch(series, query) {
        if (!query) {
            return true;
        }
        return normalizeVodSearch(series && series.name).indexOf(query) !== -1;
    }

    function updateVodImePreview() {
        var preview = document.getElementById('vod-ime-preview');
        var input = document.getElementById('vod-search-input');
        if (!preview) {
            return;
        }
        if (profileImeTarget) {
            preview.textContent = (profileEditDraft && profileEditDraft.name) || '';
            return;
        }
        preview.textContent = input ? input.value : '';
    }

    function enterVodSearchMode() {
        if (vodSearchMode) {
            syncVodTabUi();
            return;
        }
        vodSearchMode = true;
        renderKanboxSeries();
        bindVodItems();
        try {
            var searchGrid = document.getElementById('series-list');
            if (searchGrid) {
                searchGrid.scrollTop = 0;
            }
        } catch (eSearchEnter) {}
    }

    function showVodSearchMessage(text) {
        var container = document.getElementById('series-list');
        var msg;
        if (!container) {
            return;
        }
        container.innerHTML = '';
        msg = document.createElement('p');
        msg.className = 'vod-search-message';
        msg.setAttribute('dir', 'rtl');
        msg.textContent = text;
        container.appendChild(msg);
    }

    function refreshVodSearchResults(keepImeFocus) {
        var input = document.getElementById('vod-search-input');
        vodSearchQuery = normalizeVodSearch(input ? input.value : '');
        vodSearchMode = true;
        syncVodSearchClearUi();
        updateVodImePreview();
        renderKanboxSeries();
        try {
            var searchResultsGrid = document.getElementById('series-list');
            if (searchResultsGrid) {
                searchResultsGrid.scrollTop = 0;
            }
        } catch (eSearchResults) {}

        if (vodImeOpen || keepImeFocus) {
            // Keep custom keyboard focus; only refresh the series grid under it
            return;
        }

        bindVodItems();
        focusedIndex = vodTabCount();
        viewFocus.vod = focusedIndex;
        setFocus(focusedIndex, false);
    }

    function clearVodSearch(keepFocusOnSearch) {
        var input = document.getElementById('vod-search-input');
        if (input) {
            input.value = '';
        }
        vodSearchQuery = '';
        // Stay in search view with the tip if focus remains on search
        vodSearchMode = keepFocusOnSearch !== false;
        syncVodSearchClearUi();
        updateVodImePreview();
        renderKanboxSeries();
        if (vodImeOpen) {
            return;
        }
        bindVodItems();
        if (keepFocusOnSearch !== false) {
            setFocus(vodTabCount(), false);
        }
    }

    function appendVodSearchChar(ch) {
        if (profileImeTarget) {
            if (!profileEditDraft) {
                return;
            }
            profileEditDraft.name = String((profileEditDraft.name || '') + ch).slice(0, 24);
            syncProfileNameField();
            updateVodImePreview();
            return;
        }
        var input = document.getElementById('vod-search-input');
        if (!input) {
            return;
        }
        input.value = (input.value || '') + ch;
        refreshVodSearchResults(true);
    }

    function backspaceVodSearch() {
        if (profileImeTarget) {
            if (!profileEditDraft) {
                return;
            }
            profileEditDraft.name = String(profileEditDraft.name || '').slice(0, -1);
            syncProfileNameField();
            updateVodImePreview();
            return;
        }
        var input = document.getElementById('vod-search-input');
        if (!input || !input.value) {
            return;
        }
        input.value = input.value.slice(0, -1);
        refreshVodSearchResults(true);
    }

    function getVodImeLayouts() {
        return {
            he: [
                ['פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק'],
                ['ף', 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש'],
                ['ץ', 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז']
            ],
            en: [
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
            ]
        };
    }

    function renderVodImeKeys() {
        var container = document.getElementById('vod-ime-keys');
        var layouts = getVodImeLayouts();
        var rows = layouts[vodImeLayout] || layouts.he;
        var rowIndex;
        var colIndex;
        var rowEl;
        var key;
        var specialRow;
        var actions;

        if (!container) {
            return;
        }
        container.innerHTML = '';

        for (rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            rowEl = document.createElement('div');
            rowEl.className = 'vod-ime-row';
            rowEl.style.direction = vodImeLayout === 'he' ? 'rtl' : 'ltr';
            for (colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
                key = document.createElement('button');
                key.type = 'button';
                key.className = 'vod-ime-key';
                key.textContent = rows[rowIndex][colIndex];
                key.setAttribute('data-action', 'vod-ime-char');
                key.setAttribute('data-char', rows[rowIndex][colIndex]);
                key.setAttribute('data-ime-row', String(rowIndex));
                key.setAttribute('data-ime-col', String(colIndex));
                rowEl.appendChild(key);
            }
            container.appendChild(rowEl);
        }

        specialRow = document.createElement('div');
        specialRow.className = 'vod-ime-row';
        specialRow.style.direction = 'rtl';
        actions = [
            {
                label: vodImeLayout === 'he' ? 'EN' : 'עברית',
                action: 'vod-ime-layout',
                wide: true,
                isAction: true
            },
            { label: 'רווח', action: 'vod-ime-space', space: true },
            { label: 'מחק', action: 'vod-ime-backspace', wide: true, isAction: true },
            { label: 'סיום', action: 'vod-ime-done', wide: true, isAction: true }
        ];
        for (colIndex = 0; colIndex < actions.length; colIndex++) {
            key = document.createElement('button');
            key.type = 'button';
            key.className = 'vod-ime-key' +
                (actions[colIndex].wide ? ' is-wide' : '') +
                (actions[colIndex].space ? ' is-space' : '') +
                (actions[colIndex].isAction ? ' is-action' : '');
            key.textContent = actions[colIndex].label;
            key.setAttribute('data-action', actions[colIndex].action);
            key.setAttribute('data-ime-row', String(rows.length));
            key.setAttribute('data-ime-col', String(colIndex));
            specialRow.appendChild(key);
        }
        container.appendChild(specialRow);
    }

    function bindVodImeKeys() {
        var keys = Array.prototype.slice.call(document.querySelectorAll('#vod-ime-keys .vod-ime-key'));
        var actions = [];
        var items;
        if (profileImeTarget) {
            actions = Array.prototype.slice.call(
                document.querySelectorAll(
                    '#profile-edit-view .profile-action-btn:not([hidden]):not([disabled]):not(.is-disabled)'
                )
            );
            actions.forEach(function (btn, index) {
                btn.setAttribute('data-profile-ime-action', '1');
                btn.setAttribute('data-ime-row', '-1');
                btn.setAttribute('data-ime-col', String(index));
            });
        }
        items = keys.concat(actions);
        focusableItems = items;
        channels = [];
        lastFocusedEl = null;

        items.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                applyFocusClass(prev, index);
            };
            item.onclick = function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                if (item.disabled || item.classList.contains('is-disabled')) {
                    return;
                }
                activateItem(item);
            };
        });
    }

    function findVodImeKeyIndex(row, col) {
        var items = focusableItems;
        var i;
        var r;
        var c;
        for (i = 0; i < items.length; i++) {
            r = parseInt(items[i].getAttribute('data-ime-row'), 10);
            c = parseInt(items[i].getAttribute('data-ime-col'), 10);
            if (r === row && c === col) {
                return i;
            }
        }
        return -1;
    }

    function findVodImeClosest(row, col, preferRow) {
        var items = focusableItems;
        var best = -1;
        var bestDist = Infinity;
        var i;
        var r;
        var c;
        var dist;
        for (i = 0; i < items.length; i++) {
            r = parseInt(items[i].getAttribute('data-ime-row'), 10);
            c = parseInt(items[i].getAttribute('data-ime-col'), 10);
            if (preferRow != null && r !== preferRow) {
                continue;
            }
            dist = Math.abs(r - row) * 100 + Math.abs(c - col);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        }
        return best;
    }

    function moveVodImeFocus(dx, dy) {
        var current = focusableItems[focusedIndex];
        var row;
        var col;
        var nextIndex = -1;
        var curRow;
        var letterRows;
        if (!current) {
            return;
        }
        // Hebrew rows are direction:rtl — flip left/right to match on-screen order
        if (dx && vodImeLayout === 'he') {
            dx = -dx;
        } else if (dx) {
            // Special action row / profile edit buttons are rtl
            curRow = parseInt(current.getAttribute('data-ime-row'), 10) || 0;
            letterRows = (getVodImeLayouts()[vodImeLayout] || []).length;
            if (curRow >= letterRows || curRow < 0) {
                dx = -dx;
            }
        }
        row = parseInt(current.getAttribute('data-ime-row'), 10) || 0;
        col = parseInt(current.getAttribute('data-ime-col'), 10) || 0;

        if (dx !== 0 && dy === 0) {
            nextIndex = findVodImeKeyIndex(row, col + dx);
            if (nextIndex < 0) {
                return;
            }
            setFocus(nextIndex, false);
            return;
        }

        if (dy !== 0) {
            nextIndex = findVodImeClosest(row + dy, col, row + dy);
            if (nextIndex < 0) {
                return;
            }
            setFocus(nextIndex, false);
        }
    }

    function openVodIme() {
        var ime = document.getElementById('vod-ime');
        if (!ime) {
            return;
        }
        profileImeTarget = false;
        vodImeFocusBefore = viewFocus.vod || vodTabCount();
        enterVodSearchMode();
        vodImeOpen = true;
        ime.hidden = false;
        document.body.classList.add('is-vod-ime-open');
        renderVodImeKeys();
        bindVodImeKeys();
        updateVodImePreview();
        setFocus(0, false);
    }

    function closeVodIme(restoreSearchFocus) {
        var ime = document.getElementById('vod-ime');
        var wasOpen = vodImeOpen;
        if (profileImeTarget) {
            closeProfileNameIme();
            return;
        }
        vodImeOpen = false;
        document.body.classList.remove('is-vod-ime-open');
        if (ime) {
            ime.hidden = true;
        }
        // If IME was never open, do not touch focus — callers like opening a series
        // were accidentally setFocus(0) → first tab → wipe provider + return state.
        if (!wasOpen) {
            return;
        }
        if (currentView !== 'vod') {
            return;
        }
        bindVodItems();
        if (restoreSearchFocus !== false) {
            setFocus(vodTabCount(), false);
        } else {
            setFocus(Math.min(vodImeFocusBefore, Math.max(0, focusableItems.length - 1)), true);
        }
    }

    function toggleVodImeLayout() {
        vodImeLayout = vodImeLayout === 'he' ? 'en' : 'he';
        renderVodImeKeys();
        bindVodImeKeys();
        setFocus(0, false);
    }

    function bindVodSearch() {
        var input = document.getElementById('vod-search-input');
        var clearBtn = document.getElementById('vod-search-clear');
        if (input) {
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('inputmode', 'none');
        }
        if (clearBtn && !clearBtn.getAttribute('data-bound')) {
            clearBtn.setAttribute('data-bound', '1');
            clearBtn.addEventListener('click', function (e) {
                e.preventDefault();
                clearVodSearch(true);
            });
        }
        syncVodSearchClearUi();
    }

    function bindVodItems() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('#vod-tabs .vod-tab'));
        var searchInput = document.getElementById('vod-search-input');
        var clearBtn = document.getElementById('vod-search-clear');
        var headerExtras = [];
        if (searchInput) {
            headerExtras.push(searchInput);
        }
        if (clearBtn) {
            headerExtras.push(clearBtn);
        }
        var cards = Array.prototype.slice.call(
            document.querySelectorAll('#series-list .vod-card, #series-list .channel')
        );
        focusableItems = tabs.concat(headerExtras, cards);
        channels = cards;
        lastFocusedEl = null;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (vodRestoreLock) {
                    // Bounce off tabs/search if the browser steals focus during restore
                    if (
                        vodRestoreTargetIndex >= 0 &&
                        focusableItems[vodRestoreTargetIndex] &&
                        focusableItems[vodRestoreTargetIndex] !== item
                    ) {
                        focusFromCode = true;
                        try {
                            focusableItems[vodRestoreTargetIndex].focus();
                        } catch (eFocus) {}
                        focusFromCode = false;
                        focusedIndex = vodRestoreTargetIndex;
                        viewFocus.vod = vodRestoreTargetIndex;
                        applyFocusClass(index, vodRestoreTargetIndex);
                    }
                    return;
                }
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.vod = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                scheduleHydrateNearbyVodImages(index);
                // Tab content switches only via setFocus (arrow nav) / activateItem (OK/click).
                // Never switch here — browser autofocus on tab 0 would wipe restore state.
            };

            item.onclick = function (evt) {
                if (isVodSeriesCard(item) && okHoldFired) {
                    if (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                    return;
                }
                if (isVodSeriesCard(item)) {
                    clearOkHold();
                }
                activateItem(item);
            };
        });

        hydrateNearbyVodImages(viewFocus.vod || 0);
    }

    function renderRadioStations() {
        var container = document.getElementById('radio-list');
        var list = window.ISRTV_RADIO || [];

        if (!container) {
            return;
        }

        container.innerHTML = '';

        list.forEach(function (station) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'radio-card channel';
            button.setAttribute('data-action', 'radio-play');
            button.setAttribute('data-radio-id', station.id);
            button.setAttribute('data-url', station.streamURL || '');
            button.style.setProperty('--radio-accent', station.accent || '#6bb3ff');

            if (station.imageURL) {
                var bg = document.createElement('span');
                bg.className = 'radio-card-bg';
                bg.setAttribute('aria-hidden', 'true');
                bg.style.backgroundImage = 'url("' + station.imageURL + '")';
                button.appendChild(bg);
                button.classList.add('has-bg');
            }

            var miniEq = document.createElement('span');
            miniEq.className = 'radio-card-eq';
            miniEq.setAttribute('aria-hidden', 'true');
            for (var i = 0; i < 5; i++) {
                miniEq.appendChild(document.createElement('i'));
            }
            button.appendChild(miniEq);

            var name = document.createElement('span');
            name.className = 'radio-card-name';
            name.textContent = station.name;
            name.setAttribute('dir', 'auto');
            button.appendChild(name);

            if (currentRadioId && currentRadioId === station.id) {
                button.classList.add('is-playing');
            }

            container.appendChild(button);
        });
    }

    function bindRadioItems() {
        var list = document.getElementById('radio-list');
        focusableItems = list
            ? Array.prototype.slice.call(list.querySelectorAll('.radio-card'))
            : [];
        channels = focusableItems;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.radio = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                if (item.getAttribute('data-action') === 'radio-play') {
                    scheduleRadioPlay(item);
                }
            };

            item.onclick = function () {
                activateItem(item);
            };
        });
    }

    function clearRadioFocusTimer() {
        if (radioFocusTimer) {
            clearTimeout(radioFocusTimer);
            radioFocusTimer = null;
        }
    }

    function scheduleRadioPlay(item) {
        clearRadioFocusTimer();
        if (!item) {
            return;
        }
        radioFocusTimer = setTimeout(function () {
            radioFocusTimer = null;
            playRadioStation(item);
        }, 280);
    }

    function setRadioNowPlaying(station, statusText, isPlaying) {
        var now = document.getElementById('radio-now');
        var visual = document.getElementById('radio-now-visual');
        var eq = document.getElementById('radio-eq');
        var accent = (station && station.accent) || '#6bb3ff';
        var hasStation = !!station;

        if (now) {
            now.classList.toggle('is-idle', !hasStation);
            now.classList.toggle('has-station', hasStation);
        }
        if (visual) {
            visual.style.setProperty('--radio-accent', accent);
            if (hasStation) {
                visual.removeAttribute('hidden');
            } else {
                visual.setAttribute('hidden', '');
            }
        }
        if (eq) {
            eq.classList.toggle('is-playing', !!isPlaying);
            eq.classList.toggle('is-idle', !isPlaying);
        }
    }

    function syncRadioPlayingCards(activeId) {
        var cards = document.querySelectorAll('#radio-list .radio-card');
        Array.prototype.forEach.call(cards, function (card) {
            var id = card.getAttribute('data-radio-id');
            card.classList.toggle('is-playing', !!activeId && id === activeId);
        });
    }

    function findRadioStationById(id) {
        var list = window.ISRTV_RADIO || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                return list[i];
            }
        }
        return null;
    }

    function stopRadioPlayback() {
        clearRadioFocusTimer();
        radioPlayToken += 1;
        currentRadioId = null;
        syncRadioPlayingCards(null);
        setRadioNowPlaying(null, '', false);

        if (!radioAudio) {
            return;
        }

        try {
            radioAudio.pause();
        } catch (e) {}
        try {
            radioAudio.removeAttribute('src');
            radioAudio.load();
        } catch (e2) {}
    }

    function playRadioStation(item) {
        if (!item || !radioAudio) {
            return;
        }

        var id = item.getAttribute('data-radio-id');
        var url = item.getAttribute('data-url') || '';
        var station = findRadioStationById(id) || {
            id: id,
            name: (item.querySelector('.radio-card-name') || {}).textContent || 'Radio',
            accent: item.style.getPropertyValue('--radio-accent') || '#6bb3ff',
            streamURL: url
        };

        if (!url) {
            setRadioNowPlaying(station, 'אין שידור זמין', false);
            syncRadioPlayingCards(null);
            return;
        }

        if (currentRadioId === id && !radioAudio.paused) {
            syncRadioPlayingCards(id);
            setRadioNowPlaying(station, 'מתנגן בשידור חי', true);
            return;
        }

        var token = ++radioPlayToken;
        currentRadioId = id;
        syncRadioPlayingCards(id);
        setRadioNowPlaying(station, 'מתחבר…', false);

        try {
            radioAudio.pause();
        } catch (e) {}

        radioAudio.onplaying = function () {
            if (token !== radioPlayToken) {
                return;
            }
            setRadioNowPlaying(station, 'מתנגן בשידור חי', true);
            syncRadioPlayingCards(id);
        };

        radioAudio.onerror = function () {
            if (token !== radioPlayToken) {
                return;
            }
            setRadioNowPlaying(station, 'שגיאה בנגינה', false);
            syncRadioPlayingCards(null);
            currentRadioId = null;
        };

        radioAudio.onwaiting = function () {
            if (token !== radioPlayToken) {
                return;
            }
            setRadioNowPlaying(station, 'טוען שידור…', true);
        };

        try {
            radioAudio.src = url;
            radioAudio.load();
            var playPromise = radioAudio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(function () {
                    if (token !== radioPlayToken) {
                        return;
                    }
                    setRadioNowPlaying(station, 'לא ניתן לנגן', false);
                    syncRadioPlayingCards(null);
                    currentRadioId = null;
                });
            }
        } catch (err) {
            setRadioNowPlaying(station, 'לא ניתן לנגן', false);
            syncRadioPlayingCards(null);
            currentRadioId = null;
        }
    }

    function renderKanboxSeries() {
        var container = document.getElementById('series-list');
        var query = vodSearchQuery;
        var myListIds = loadMyListIds();
        var list;

        if (!container) {
            return;
        }

        syncVodTabUi();
        syncVodSearchClearUi();

        if (vodSearchMode) {
            container.innerHTML = '';
            if (!query) {
                showVodSearchMessage(
                    'החיפוש מציג תוצאות מכל הערוצים'
                );
                return;
            }
            list = (window.ISRTV_KANBOX || []).filter(function (series) {
                return seriesMatchesSearch(series, query);
            });
            if (list.length === 0) {
                showVodSearchMessage('לא נמצאו תוצאות');
                return;
            }
        } else if (vodProviderTab === 'mylist') {
            list = myListIds
                .map(function (id) {
                    return findSeriesById(id);
                })
                .filter(Boolean);
        } else {
            list = (window.ISRTV_KANBOX || []).filter(function (series) {
                return seriesMatchesVodTab(series, vodProviderTab);
            });
        }

        container.innerHTML = '';
        container.classList.remove('is-empty-mylist');

        if (!vodSearchMode && vodProviderTab === 'mylist' && myListIds.length === 0) {
            var empty = document.createElement('p');
            empty.className = 'vod-mylist-empty';
            empty.id = 'vod-mylist-empty';
            empty.setAttribute('dir', 'rtl');
            var emptyTitle = document.createElement('span');
            emptyTitle.className = 'vod-mylist-empty-title';
            emptyTitle.textContent = 'הרשימה שלך ריקה';
            var emptyHint = document.createElement('span');
            emptyHint.className = 'vod-mylist-empty-hint';
            emptyHint.textContent = 'החזק ok על סדרה כדי להוסיף אותה לרשימה';
            empty.appendChild(emptyTitle);
            empty.appendChild(emptyHint);
            container.classList.add('is-empty-mylist');
            container.appendChild(empty);
            return;
        }

        list.forEach(function (series) {
            var tile = document.createElement('div');
            tile.className = 'vod-series-tile';

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'vod-card';
            button.setAttribute('data-series', series.id);
            button.setAttribute('data-action', 'series');

            var inner = document.createElement('span');
            inner.className = 'vod-card-inner';

            if (series.imageURL) {
                inner.appendChild(makeLazyVodImage(series.imageURL, series.name || ''));
            }

            var gradient = document.createElement('span');
            gradient.className = 'vod-card-gradient';
            inner.appendChild(gradient);

            var name = document.createElement('span');
            name.className = 'vod-card-name';
            name.textContent = series.name;
            name.setAttribute('dir', 'auto');
            inner.appendChild(name);

            inner.appendChild(makeSeriesProgressBar(series));

            button.appendChild(inner);
            tile.appendChild(button);
            tile.appendChild(makeMyListHeartButton(series.id));
            container.appendChild(tile);
        });
    }

    function episodeDisplayName(episode) {
        var season = episode.season || 1;
        var chapter = episode.ep || episode.chapter || 0;
        var name = episode && episode.name ? String(episode.name).trim() : '';
        if (name && !/^עונה\s+\d+\s+פרק\s+\d+$/.test(name)) {
            return name;
        }
        if (chapter) {
            return 'עונה ' + season + ' פרק ' + chapter;
        }
        return name || ('עונה ' + season);
    }

    function episodeSubtitle(episode) {
        return episode && episode.subtitle ? String(episode.subtitle).trim() : '';
    }

    function appendEpisodeCaption(inner, episode) {
        var wrap = document.createElement('span');
        var name;
        var sub;
        var subText;
        wrap.className = 'vod-card-caption';
        wrap.setAttribute('dir', 'auto');
        name = document.createElement('span');
        name.className = 'vod-card-name';
        name.textContent = episodeDisplayName(episode);
        wrap.appendChild(name);
        subText = episodeSubtitle(episode);
        if (subText) {
            sub = document.createElement('span');
            sub.className = 'vod-card-sub';
            sub.textContent = subText;
            wrap.appendChild(sub);
        }
        inner.appendChild(wrap);
    }

    function applyVodPlayAttrs(button, episode, series) {
        var preferHls;
        var subs;
        if (!button || !episode) {
            return;
        }
        preferHls = episode.preferHlsJs || (series && series.preferHlsJs);
        if (preferHls) {
            button.setAttribute('data-prefer-hlsjs', '1');
        }
        subs = episode.defaultSubtitles || (series && series.defaultSubtitles) || '';
        if (subs) {
            button.setAttribute('data-subtitles', String(subs));
        }
    }

    function renderSeriesEpisodes(series) {
        var container = document.getElementById('episodes-list');
        var title = document.getElementById('series-title');
        var episodes;
        var seasonsMap;
        var seasonNumbers;
        var filtered;
        var i;

        if (!container || !series) {
            return;
        }

        currentSeries = series;
        if (title) {
            title.textContent = series.name;
        }

        container.innerHTML = '';
        try {
            container.scrollTop = 0;
        } catch (eEpsReset) {}

        episodes = (series.episodes || []).slice().sort(function (a, b) {
            var sa = a.season || 1;
            var sb = b.season || 1;
            if (sa !== sb) {
                return compareSeasonNumbers(sa, sb, series);
            }
            return (a.ep || 0) - (b.ep || 0);
        });

        seasonsMap = {};
        episodes.forEach(function (episode) {
            var season = episode.season || 1;
            if (!seasonsMap[season]) {
                seasonsMap[season] = [];
            }
            seasonsMap[season].push(episode);
        });
        seasonNumbers = Object.keys(seasonsMap)
            .map(Number)
            .sort(function (a, b) {
                return compareSeasonNumbers(a, b, series);
            });
        seriesSeasonNumbers = seasonNumbers.slice();

        populateSeriesSeasonSelect(seasonNumbers);

        if (seriesSeasonFilter === 'all') {
            filtered = episodes;
        } else {
            filtered = episodes.filter(function (episode) {
                return (episode.season || 1) === seriesSeasonFilter;
            });
        }

        var lastSeason = null;
        var seasonOrdinal = -1;
        var seasonEpIndex = 0;
        var showSeasonDividers = seriesSeasonFilter === 'all' && seasonNumbers.length > 1;

        for (i = 0; i < filtered.length; i++) {
            (function (episode) {
                var season = episode.season || 1;
                var divider;
                var button;
                var epRow;
                var epCol;

                if (season !== lastSeason) {
                    lastSeason = season;
                    seasonOrdinal += 1;
                    seasonEpIndex = 0;
                    if (showSeasonDividers && seasonOrdinal > 0) {
                        divider = document.createElement('div');
                        divider.className = 'season-divider';
                        divider.setAttribute('aria-hidden', 'true');
                        container.appendChild(divider);
                    }
                }
                epRow = Math.floor(seasonEpIndex / columns);
                epCol = seasonEpIndex % columns;
                seasonEpIndex += 1;

                button = document.createElement('button');
                button.type = 'button';
                button.className = 'vod-card';
                button.setAttribute('data-url', episode.streamURL || '');
                button.setAttribute('data-episode', episode.id);
                button.setAttribute('data-action', 'play');
                button.setAttribute('data-season-ord', String(seasonOrdinal));
                button.setAttribute('data-season-num', String(season));
                button.setAttribute('data-ep-row', String(epRow));
                button.setAttribute('data-ep-col', String(epCol));
                if (episode.assetId) {
                    button.setAttribute('data-asset-id', String(episode.assetId));
                }
                if (episode.streamResolve) {
                    button.setAttribute('data-stream-resolve', episode.streamResolve);
                }
                applyVodPlayAttrs(button, episode, currentSeries);

                var inner = document.createElement('span');
                inner.className = 'vod-card-inner';

                if (episode.imageURL) {
                    inner.appendChild(makeLazyVodImage(episode.imageURL, ''));
                }

                var gradient = document.createElement('span');
                gradient.className = 'vod-card-gradient';
                inner.appendChild(gradient);

                appendEpisodeCaption(inner, episode);

                inner.appendChild(makeEpisodeProgressBar(episode.id));

                button.appendChild(inner);
                container.appendChild(button);
            })(filtered[i]);
        }

        syncSeriesSeasonSticky();
    }

    function findSeriesById(id) {
        var list = window.ISRTV_KANBOX || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                return list[i];
            }
        }
        return null;
    }

    function activateItem(item) {
        if (!item) {
            return;
        }

        var action = item.getAttribute('data-action');

        if (action === 'profile-open' || action === 'profile-menu-toggle') {
            toggleProfileMenu();
            return;
        }

        if (action === 'profile-menu-select') {
            switchProfile(item.getAttribute('data-profile-id'));
            return;
        }

        if (action === 'profile-menu-edit') {
            openProfileDialog(true);
            return;
        }

        if (action === 'profile-close') {
            closeProfileDialog();
            return;
        }

        if (action === 'profile-add') {
            openProfileEdit(null);
            return;
        }

        if (action === 'profile-manage') {
            toggleProfileManaging();
            return;
        }

        if (action === 'profile-edit') {
            openProfileEdit(item.getAttribute('data-profile-id'));
            return;
        }

        if (action === 'profile-select') {
            switchProfile(item.getAttribute('data-profile-id'));
            return;
        }

        if (action === 'profile-icon') {
            if (profileEditDraft) {
                profileEditDraft.icon = item.getAttribute('data-icon') || null;
                renderProfileEditView();
                rebindProfileEditFocus(item);
            }
            return;
        }

        if (action === 'profile-name') {
            openProfileNameIme();
            return;
        }

        if (action === 'profile-save') {
            if (!isProfileDraftValid()) {
                return;
            }
            saveProfileEdit();
            return;
        }

        if (action === 'profile-edit-cancel') {
            requestCloseProfileEdit();
            return;
        }

        if (action === 'profile-delete') {
            if (profileImeTarget) {
                closeProfileNameIme();
            }
            openProfileDeleteConfirm();
            return;
        }

        if (action === 'profile-confirm-yes') {
            if (profileConfirmKind === 'delete') {
                hideProfileDeleteConfirm();
                deleteProfileEdit();
                return;
            }
            if (profileConfirmKind === 'unsaved') {
                hideProfileDeleteConfirm();
                if (isProfileDraftValid()) {
                    saveProfileEdit();
                } else {
                    // Can't save yet — stay in editor
                    bindProfileDialogItems();
                    setFocus(0, false);
                }
                return;
            }
            closeProfileDeleteConfirm();
            return;
        }

        if (action === 'profile-confirm-no') {
            if (profileConfirmKind === 'unsaved') {
                discardProfileEdit();
                return;
            }
            closeProfileDeleteConfirm();
            return;
        }

        // legacy aliases (if any remain)
        if (action === 'profile-delete-confirm') {
            hideProfileDeleteConfirm();
            deleteProfileEdit();
            return;
        }

        if (action === 'profile-delete-cancel') {
            closeProfileDeleteConfirm();
            return;
        }

        if (action === 'home') {
            showView('home');
            return;
        }

        if (action === 'live') {
            viewFocus.home = focusedIndex;
            viewFocus.live = liveTabCount();
            showView('live');
            return;
        }

        if (action === 'continue-play') {
            viewFocus.home = focusedIndex;
            var series = findSeriesById(item.getAttribute('data-series-id'));
            var info = series ? findEpisodeInSeries(series, item.getAttribute('data-episode')) : null;
            if (!info || !info.episode) {
                return;
            }
            openContinueEpisode(series, info.episode);
            return;
        }

        if (action === 'vod' || action === 'kanbox') {
            viewFocus.home = focusedIndex;
            // Land on first provider tab (כאן 11)
            vodReturnSeriesId = null;
            vodReturnTab = null;
            viewFocus.vod = 0;
            showView('vod');
            return;
        }

        if (action === 'vod-tab') {
            var tab = item.getAttribute('data-vod-tab');
            setVodProviderTab(tab, true);
            return;
        }

        if (action === 'live-tab') {
            var liveTab = item.getAttribute('data-live-tab');
            setLiveRegionTab(liveTab, true);
            return;
        }

        if (action === 'mylist-toggle') {
            toggleMyListSeries(item.getAttribute('data-series'));
            return;
        }

        if (action === 'vod-search') {
            openVodIme();
            return;
        }

        if (action === 'vod-search-clear') {
            clearVodSearch(true);
            return;
        }

        if (action === 'vod-ime-char') {
            appendVodSearchChar(item.getAttribute('data-char') || '');
            return;
        }

        if (action === 'vod-ime-space') {
            appendVodSearchChar(' ');
            return;
        }

        if (action === 'vod-ime-backspace') {
            backspaceVodSearch();
            return;
        }

        if (action === 'vod-ime-layout') {
            toggleVodImeLayout();
            return;
        }

        if (action === 'vod-ime-done') {
            closeVodIme(true);
            return;
        }

        if (action === 'radio') {
            viewFocus.home = focusedIndex;
            viewFocus.radio = 0;
            showView('radio');
            return;
        }

        if (action === 'radio-play') {
            clearRadioFocusTimer();
            playRadioStation(item);
            return;
        }

        if (action === 'series') {
            var series = findSeriesById(item.getAttribute('data-series'));
            var seriesFocusIdx;
            var fi;
            if (!series) {
                return;
            }
            seriesFocusIdx = focusedIndex;
            for (fi = 0; fi < focusableItems.length; fi++) {
                if (focusableItems[fi].getAttribute('data-series') === series.id) {
                    seriesFocusIdx = fi;
                    break;
                }
            }
            viewFocus.vod = seriesFocusIdx;
            vodReturnSeriesId = series.id;
            vodReturnTab = vodProviderTab;
            closeVodIme(false);
            seriesSeasonFilter = 'all';
            viewFocus.series = 0;
            renderSeriesEpisodes(series);
            // Land on first episode (season select is index 0 when enabled)
            viewFocus.series = seriesHeaderFocusCount();
            showView('series');
            return;
        }

        if (action === 'series-season') {
            if (seriesSeasonMenuOpen) {
                closeSeriesSeasonMenu(true);
            } else {
                openSeriesSeasonMenu();
            }
            return;
        }

        if (action === 'series-season-option') {
            chooseSeriesSeason(item.getAttribute('data-season-value'));
            return;
        }

        openChannel(item);
    }

    function goBack() {
        if (vodImeOpen) {
            closeVodIme(true);
            return;
        }
        if (profileMenuOpen) {
            closeProfileMenu();
            return;
        }
        if (profileDialogOpen) {
            if (profileDeleteConfirmOpen) {
                closeProfileDeleteConfirm();
                return;
            }
            if (profileDialogMode === 'edit') {
                requestCloseProfileEdit();
                return;
            }
            closeProfileDialog();
            return;
        }
        if (profileChromeFocused) {
            clearProfileChromeFocus(true);
            return;
        }
        if (seriesSeasonMenuOpen) {
            closeSeriesSeasonMenu(true);
            return;
        }
        if (currentView === 'series') {
            vodReturningFromSeries = true;
            showView('vod');
            return;
        }
        if (currentView === 'live' || currentView === 'vod' || currentView === 'radio') {
            showView('home');
            return;
        }
        if (typeof tizen !== 'undefined' && tizen.application) {
            clearVodImageCache();
            tizen.application.getCurrentApplication().exit();
        }
    }

    function bindVodControls() {
        if (vodPlayPauseBtn) {
            vodPlayPauseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                revealVodControls();
                toggleVodPlayPause();
            });
        }

        if (vodSeek) {
            vodSeek.addEventListener('input', function () {
                revealVodControls();
                vodSeeking = true;
                var duration = getVodDurationSec();
                if (duration > 0) {
                    var sec = (Number(vodSeek.value) / 1000) * duration;
                    updateVodTimeLabels(sec, duration);
                    setVodSeekVisual(Number(vodSeek.value) / 1000, true);
                }
            });

            vodSeek.addEventListener('change', function () {
                revealVodControls();
                var duration = getVodDurationSec();
                if (duration > 0) {
                    seekVodTo((Number(vodSeek.value) / 1000) * duration);
                }
                vodSeeking = false;
            });
        }

        if (vodControls) {
            vodControls.addEventListener('click', function () {
                revealVodControls();
            });
        }

        if (vodNextBtn) {
            vodNextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                activateVodNextAction();
            });
        }

        if (playerVideo) {
            playerVideo.addEventListener('timeupdate', onHtmlVodTimeUpdate);
            playerVideo.addEventListener('loadedmetadata', onHtmlVodTimeUpdate);
            playerVideo.addEventListener('durationchange', onHtmlVodTimeUpdate);
            playerVideo.addEventListener('play', function () {
                syncVodPlayPauseUi();
                if (isVodMode && isFullscreen) {
                    onVodPlaybackStarted();
                }
            });
            playerVideo.addEventListener('pause', function () {
                if (isVodMode && isFullscreen) {
                    onVodPaused();
                } else {
                    syncVodPlayPauseUi();
                }
            });
            playerVideo.addEventListener('ended', function () {
                if (isVodMode && currentVodEpisodeId) {
                    clearVodProgress(currentVodEpisodeId);
                    // Keep next / end prompt available at the very end
                    var next = getNextVodEpisode();
                    showVodNextPrompt(!next);
                }
            });
        }
    }

    function clearVodHideTimer() {
        if (vodHideTimer) {
            clearTimeout(vodHideTimer);
            vodHideTimer = null;
        }
    }

    function hideVodControls() {
        if (!isVodMode || !vodControls) {
            return;
        }
        // Stay visible while paused or next-episode prompt is up
        if (isVodPaused() || vodNextPromptVisible) {
            return;
        }
        vodControls.classList.add('is-auto-hidden');
    }

    function revealVodControls() {
        if (!isVodMode || !vodControls) {
            return;
        }
        vodControls.hidden = false;
        vodControls.classList.remove('is-auto-hidden');
        scheduleVodControlsHide();
    }

    function scheduleVodControlsHide() {
        clearVodHideTimer();
        if (!isVodMode) {
            return;
        }
        // Don't auto-hide while paused or next prompt is showing
        if (isVodPaused() || vodNextPromptVisible) {
            return;
        }
        vodHideTimer = setTimeout(function () {
            vodHideTimer = null;
            // Keep visible while user is dragging the seek bar
            if (vodSeeking || isVodPaused() || vodNextPromptVisible) {
                if (vodSeeking) {
                    scheduleVodControlsHide();
                }
                return;
            }
            hideVodControls();
        }, VOD_CONTROLS_HIDE_MS);
    }

    function onVodPlaybackStarted() {
        if (!isVodMode) {
            return;
        }
        // Show controls when playback begins, then auto-hide after 3s
        hideVodPauseInfo();
        revealVodControls();
        applyVodResumeIfNeeded();
        updateVodProgress();
        syncVodPlayPauseUi();
        updateVodNextPrompt();
    }

    function showVodPauseInfo() {
        var info = getCurrentVodEpisodeInfo();
        var seriesName = (currentSeries && currentSeries.name) || '';
        var episodeName = info && info.episode ? episodeDisplayName(info.episode) : '';
        if (!vodPauseInfo || !isVodMode || !isFullscreen) {
            return;
        }
        if (vodPauseSeries) {
            vodPauseSeries.textContent = seriesName;
        }
        if (vodPauseEpisode) {
            vodPauseEpisode.textContent = episodeName;
        }
        if (!seriesName && !episodeName) {
            hideVodPauseInfo(true);
            return;
        }
        vodPauseInfo.hidden = false;
        vodPauseInfo.classList.remove('is-visible');
        // Force reflow so the enter transition always runs
        try {
            void vodPauseInfo.offsetWidth;
        } catch (eReflow) {}
        vodPauseInfo.classList.add('is-visible');
    }

    function hideVodPauseInfo(instant) {
        if (!vodPauseInfo) {
            return;
        }
        vodPauseInfo.classList.remove('is-visible');
        if (instant) {
            vodPauseInfo.hidden = true;
            return;
        }
        // Allow a short fade-out, then fully remove from layout
        setTimeout(function () {
            if (vodPauseInfo && !vodPauseInfo.classList.contains('is-visible')) {
                vodPauseInfo.hidden = true;
            }
        }, 420);
    }

    function onVodPaused() {
        if (!isVodMode) {
            return;
        }
        saveCurrentVodProgress(true);
        clearVodHideTimer();
        if (vodControls) {
            vodControls.hidden = false;
            vodControls.classList.remove('is-auto-hidden');
        }
        syncVodPlayPauseUi();
        showVodPauseInfo();
    }

    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) {
            return '00:00';
        }
        var total = Math.floor(sec);
        var h = Math.floor(total / 3600);
        var m = Math.floor((total % 3600) / 60);
        var s = total % 60;
        var mm = (m < 10 ? '0' : '') + m;
        var ss = (s < 10 ? '0' : '') + s;
        if (h > 0) {
            return h + ':' + mm + ':' + ss;
        }
        return mm + ':' + ss;
    }

    function setVodMode(enabled) {
        isVodMode = !!enabled;
        if (!playerEl) {
            return;
        }
        if (isVodMode) {
            playerEl.classList.add('is-vod');
            if (vodControls) {
                vodControls.hidden = false;
                vodControls.classList.remove('is-auto-hidden');
            }
            scheduleVodControlsHide();
        } else {
            playerEl.classList.remove('is-vod');
            clearVodHideTimer();
            resetVodNextUi();
            if (vodControls) {
                vodControls.hidden = true;
                vodControls.classList.remove('is-auto-hidden');
            }
        }
        syncVodPlayPauseUi();
    }

    function sortedSeriesEpisodes(series) {
        return ((series && series.episodes) || []).slice().sort(function (a, b) {
            var sa = a.season || 1;
            var sb = b.season || 1;
            if (sa !== sb) {
                return sa - sb;
            }
            return (a.ep || 0) - (b.ep || 0);
        });
    }

    function findEpisodeInSeries(series, episodeId) {
        var list = sortedSeriesEpisodes(series);
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] && list[i].id === episodeId) {
                return { episode: list[i], index: i, list: list };
            }
        }
        return null;
    }

    function getCurrentVodEpisodeInfo() {
        if (!currentSeries || !currentVodEpisodeId) {
            return null;
        }
        return findEpisodeInSeries(currentSeries, currentVodEpisodeId);
    }

    function getNextVodEpisode() {
        var info = getCurrentVodEpisodeInfo();
        if (!info) {
            return null;
        }
        if (info.index >= info.list.length - 1) {
            return null;
        }
        return info.list[info.index + 1];
    }

    function episodeAsPlayItem(episode) {
        var series = currentSeries;
        return {
            getAttribute: function (name) {
                if (name === 'data-url') {
                    return episode.streamURL || '';
                }
                if (name === 'data-episode') {
                    return episode.id || '';
                }
                if (name === 'data-asset-id') {
                    return episode.assetId ? String(episode.assetId) : '';
                }
                if (name === 'data-stream-resolve') {
                    return episode.streamResolve || '';
                }
                if (name === 'data-prefer-hlsjs') {
                    if (episode.preferHlsJs || (series && series.preferHlsJs)) {
                        return '1';
                    }
                    return '';
                }
                if (name === 'data-subtitles') {
                    return episode.defaultSubtitles || (series && series.defaultSubtitles) || '';
                }
                if (name === 'data-action') {
                    return 'play';
                }
                return '';
            }
        };
    }

    function focusVodNextBtn() {
        if (!vodNextBtn || vodNextBtn.hidden) {
            return;
        }
        try {
            vodNextBtn.focus();
        } catch (e) {}
        vodNextBtn.classList.add('is-focused');
    }

    function setVodNextFillProgress(progress) {
        var p = progress;
        if (p < 0) {
            p = 0;
        }
        if (p > 1) {
            p = 1;
        }
        if (vodNextFill) {
            vodNextFill.style.transform = 'scaleX(' + p + ')';
        }
        if (vodNextBtn) {
            vodNextBtn.setAttribute('data-fill', String(Math.round(p * 100)));
        }
    }

    function hideVodNextPrompt() {
        vodNextPromptVisible = false;
        vodNextIsLast = false;
        vodNextAutoFired = false;
        setVodNextFillProgress(0);
        if (vodNextBtn) {
            vodNextBtn.hidden = true;
            vodNextBtn.classList.remove('is-focused');
            try {
                vodNextBtn.blur();
            } catch (e) {}
        }
    }

    function resetVodNextUi() {
        hideVodNextPrompt();
    }

    function nextEpisodePlayLabel(episode) {
        var season;
        var ep;
        if (!episode) {
            return 'לפרק הבא';
        }
        season = episode.season || 1;
        ep = episode.ep || episode.chapter || 0;
        if (season >= 800) {
            return 'נגן ' + episodeDisplayName(episode);
        }
        if (ep) {
            return 'נגן עונה ' + season + ' פרק ' + ep;
        }
        return 'נגן ' + episodeDisplayName(episode);
    }

    function showVodNextPrompt(isLast) {
        var info;
        var next;
        var label;
        var currentSeason;
        var nextSeason;
        if (!vodNextBtn) {
            return;
        }
        vodNextIsLast = !!isLast;
        vodNextPromptVisible = true;
        vodNextAutoFired = false;
        setVodNextFillProgress(0);
        if (isLast) {
            label = 'העונה הסתיימה';
        } else {
            info = getCurrentVodEpisodeInfo();
            next = info ? info.list[info.index + 1] : null;
            currentSeason = info && info.episode ? info.episode.season || 1 : 1;
            nextSeason = next ? next.season || 1 : currentSeason;
            if (next && nextSeason !== currentSeason) {
                // Last episode of this season — offer starting the next one
                label = 'התחל ' + seasonDisplayLabel(nextSeason, currentSeries);
            } else if (info && info.list.length >= 2 && info.index === info.list.length - 2) {
                label = 'נגן פרק אחרון';
            } else {
                label = nextEpisodePlayLabel(next);
            }
        }
        if (vodNextLabel) {
            vodNextLabel.textContent = label;
        } else {
            vodNextBtn.textContent = label;
        }
        vodNextBtn.hidden = false;
        revealVodControls();
        clearVodHideTimer();
        focusVodNextBtn();
    }

    function updateVodNextAutofill(remaining) {
        var progress;
        if (vodNextIsLast) {
            setVodNextFillProgress(0);
            return;
        }
        if (remaining > VOD_NEXT_AUTOFILL_SEC) {
            setVodNextFillProgress(0);
            return;
        }
        progress = 1 - remaining / VOD_NEXT_AUTOFILL_SEC;
        setVodNextFillProgress(progress);
        if (progress >= 0.995 && !vodNextAutoFired) {
            vodNextAutoFired = true;
            activateVodNextAction();
        }
    }

    function updateVodNextPrompt() {
        if (!isVodMode || !isFullscreen) {
            hideVodNextPrompt();
            return;
        }
        var duration = getVodDurationSec();
        var current = getVodCurrentSec();
        if (!(duration > 0) || duration < VOD_NEXT_PROMPT_SEC + 5) {
            // Too short / unknown — don't flash the prompt
            if (vodNextPromptVisible) {
                hideVodNextPrompt();
                scheduleVodControlsHide();
            }
            return;
        }
        var remaining = duration - current;
        if (remaining <= VOD_NEXT_PROMPT_SEC) {
            var next = getNextVodEpisode();
            if (!vodNextPromptVisible) {
                showVodNextPrompt(!next);
            }
            updateVodNextAutofill(Math.max(0, remaining));
            return;
        }
        if (vodNextPromptVisible) {
            hideVodNextPrompt();
            scheduleVodControlsHide();
        }
    }

    function activateVodNextAction() {
        if (!vodNextPromptVisible) {
            return false;
        }
        if (vodNextIsLast || !getNextVodEpisode()) {
            if (currentVodEpisodeId) {
                clearVodProgress(currentVodEpisodeId);
            }
            closeFullscreen();
            return true;
        }
        playNextVodEpisode();
        return true;
    }

    function playNextVodEpisode() {
        var next = getNextVodEpisode();
        if (!next) {
            closeFullscreen();
            return;
        }
        if (currentVodEpisodeId) {
            clearVodProgress(currentVodEpisodeId);
        }
        startVodEpisodePlayback(next, { resume: false });
    }

    function startVodEpisodePlayback(episode, opts) {
        if (!episode) {
            return;
        }
        opts = opts || {};
        var item = episodeAsPlayItem(episode);
        var url = getChannelUrl(item);
        var assetId = item.getAttribute('data-asset-id');

        stopFullscreenPlayback();
        playerEl.hidden = false;
        playerEl.classList.remove('is-playing');
        setVodMode(true);
        showMessage('');
        resetVodNextUi();

        currentVodEpisodeId = episode.id || '';
        vodResumeTargetSec = 0;
        vodResumeApplied = false;
        vodLastProgressSaveAt = 0;

        if (opts.resume !== false) {
            var saved = getVodProgress(currentVodEpisodeId);
            if (saved && saved.p >= VOD_PROGRESS_MIN_SEC) {
                vodResumeTargetSec = saved.p;
            }
        }

        // Keep series list focus on this episode when user exits
        syncSeriesFocusToEpisode(episode.id);

        if (!url && !assetId) {
            showMessage('No stream URL for this episode yet.');
            return;
        }
        if (url && !isPlayableUrl(url) && !assetId) {
            showMessage('This channel cannot play here yet.');
            return;
        }
        playResolvedFullscreen(url, item);
    }

    function syncSeriesFocusToEpisode(episodeId) {
        if (currentView !== 'series' || !episodeId) {
            return;
        }
        var cards = document.querySelectorAll('#episodes-list .vod-card[data-episode]');
        var i;
        for (i = 0; i < cards.length; i++) {
            if (cards[i].getAttribute('data-episode') === episodeId) {
                viewFocus.series = i + (document.getElementById('series-season-trigger') &&
                    !document.getElementById('series-season-trigger').disabled ? 1 : 0);
                // focusableItems may include season trigger at 0
                for (var j = 0; j < focusableItems.length; j++) {
                    if (focusableItems[j] === cards[i]) {
                        viewFocus.series = j;
    		break;
                    }
                }
    		break;
    	}
        }
    }

    function getVodDurationSec() {
        if (usingAvplayPlayback && hasAvplay()) {
            if (vodDurationMs > 0) {
                return vodDurationMs / 1000;
            }
            try {
                var d = webapis.avplay.getDuration();
                if (d && d > 0) {
                    vodDurationMs = d;
                    return d / 1000;
                }
            } catch (e) {}
            return 0;
        }
        if (playerVideo && isFinite(playerVideo.duration) && playerVideo.duration > 0) {
            return playerVideo.duration;
        }
        return 0;
    }

    function getVodCurrentSec() {
        if (usingAvplayPlayback && hasAvplay()) {
            try {
                return (webapis.avplay.getCurrentTime() || 0) / 1000;
            } catch (e) {
                return 0;
            }
        }
        return playerVideo ? (playerVideo.currentTime || 0) : 0;
    }

    function updateVodTimeLabels(currentSec, durationSec) {
        if (vodTimeCurrent) {
            vodTimeCurrent.textContent = formatTime(currentSec);
        }
        if (vodTimeDuration) {
            vodTimeDuration.textContent = formatTime(durationSec);
        }
    }

    function applyVodSeekVisual() {
        var pct = Math.max(0, Math.min(1, vodSeekVisualPct));
        var pctCss = (pct * 100).toFixed(3) + '%';
        if (vodSeekFill) {
            vodSeekFill.style.width = pctCss;
        }
        if (vodSeekThumb) {
            vodSeekThumb.style.left = pctCss;
        }
    }

    function stopVodSeekAnim() {
        if (vodSeekAnimRaf) {
            try {
                cancelAnimationFrame(vodSeekAnimRaf);
            } catch (eCancel) {}
            vodSeekAnimRaf = null;
        }
    }

    function tickVodSeekAnim() {
        var diff = vodSeekTargetPct - vodSeekVisualPct;
        var ease;
        vodSeekAnimRaf = null;
        if (Math.abs(diff) < 0.0004) {
            vodSeekVisualPct = vodSeekTargetPct;
            applyVodSeekVisual();
            return;
        }
        // Catch up faster while hold-seeking so big jumps still feel fluid
        ease = vodSeekHoldTimer ? 0.32 : 0.2;
        vodSeekVisualPct += diff * ease;
        applyVodSeekVisual();
        if (typeof requestAnimationFrame === 'function') {
            vodSeekAnimRaf = requestAnimationFrame(tickVodSeekAnim);
        } else {
            vodSeekAnimRaf = setTimeout(tickVodSeekAnim, 16);
        }
    }

    function startVodSeekAnim() {
        if (vodSeekAnimRaf) {
            return;
        }
        if (typeof requestAnimationFrame === 'function') {
            vodSeekAnimRaf = requestAnimationFrame(tickVodSeekAnim);
        } else {
            vodSeekAnimRaf = setTimeout(tickVodSeekAnim, 16);
        }
    }

    /** @param {number} pct 0–1 @param {boolean=} instant */
    function setVodSeekVisual(pct, instant) {
        pct = Math.max(0, Math.min(1, pct));
        vodSeekTargetPct = pct;
        if (vodSeek) {
            vodSeek.value = String(Math.round(pct * 1000));
        }
        if (instant) {
            stopVodSeekAnim();
            vodSeekVisualPct = pct;
            applyVodSeekVisual();
            return;
        }
        startVodSeekAnim();
    }

    function updateVodProgress(currentSec, durationSec) {
        if (!isVodMode) {
            return;
        }
        durationSec = durationSec || getVodDurationSec();
        currentSec = typeof currentSec === 'number' ? currentSec : getVodCurrentSec();
        updateVodTimeLabels(currentSec, durationSec);
        if (!vodSeeking && durationSec > 0) {
            setVodSeekVisual(currentSec / durationSec, !vodSeekHoldTimer);
        }
        if (durationSec > 0) {
            applyVodResumeIfNeeded();
        }
        saveCurrentVodProgress(false);
        updateVodNextPrompt();
    }

    function onHtmlVodTimeUpdate() {
        if (!isVodMode || usingAvplayPlayback) {
            return;
        }
        updateVodProgress();
    }

    function syncVodPlayPauseUi() {
        if (!vodPlayPauseBtn) {
            return;
        }
        var paused = isVodPaused();
        if (paused) {
            vodPlayPauseBtn.classList.add('is-paused');
            vodPlayPauseBtn.setAttribute('aria-label', 'Play');
        } else {
            vodPlayPauseBtn.classList.remove('is-paused');
            vodPlayPauseBtn.setAttribute('aria-label', 'Pause');
        }
    }

    function isVodPaused() {
        if (usingAvplayPlayback && hasAvplay()) {
            try {
                return webapis.avplay.getState() === 'PAUSED';
            } catch (e) {
                return false;
            }
        }
        return !!(playerVideo && playerVideo.paused);
    }

    function toggleVodPlayPause() {
        if (!isVodMode) {
            return;
        }
        if (isVodPaused()) {
            resumeVod();
            syncVodPlayPauseUi();
            // Resuming — show briefly, then auto-hide after 3s
            revealVodControls();
        } else {
            pauseVod();
            onVodPaused();
        }
    }

    function pauseVod() {
        if (usingAvplayPlayback && hasAvplay()) {
            try {
                webapis.avplay.pause();
            } catch (e) {}
            return;
        }
        if (playerVideo) {
            playerVideo.pause();
        }
    }

    function resumeVod() {
        hideVodPauseInfo();
        if (usingAvplayPlayback && hasAvplay()) {
            try {
                webapis.avplay.play();
            } catch (e) {}
            return;
        }
        if (playerVideo) {
            var p = playerVideo.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () {});
            }
        }
    }

    function seekVodTo(sec) {
        var duration = getVodDurationSec();
        if (duration > 0) {
            sec = Math.max(0, Math.min(duration, sec));
        } else {
            sec = Math.max(0, sec);
        }

        if (usingAvplayPlayback && hasAvplay()) {
            try {
                webapis.avplay.seekTo(Math.floor(sec * 1000));
            } catch (e) {
                console.warn('AVPlay seek failed:', e);
            }
            updateVodProgress(sec, duration);
            saveCurrentVodProgress(true);
            return;
        }

        if (playerVideo) {
            playerVideo.currentTime = sec;
            updateVodProgress(sec, duration);
        }
        saveCurrentVodProgress(true);
    }

    function seekVodBy(deltaSec) {
        seekVodTo(getVodCurrentSec() + deltaSec);
    }

    function clearVodSeekHold() {
        if (vodSeekHoldTimer) {
            clearInterval(vodSeekHoldTimer);
            vodSeekHoldTimer = null;
        }
        vodSeekHoldKey = 0;
        vodSeekHoldStartedAt = 0;
        vodSeekHoldLastKeyAt = 0;
    }

    function vodSeekStepForHold(heldMs) {
        if (heldMs >= VOD_SEEK_FASTER_AFTER_MS) {
            return VOD_SEEK_FASTER_STEP_SEC;
        }
        if (heldMs >= VOD_SEEK_FAST_AFTER_MS) {
            return VOD_SEEK_FAST_STEP_SEC;
        }
        return VOD_SEEK_STEP_SEC;
    }

    function tickVodSeekHold() {
        var now = Date.now();
        var held;
        var step;
        var dir;
        if (!vodSeekHoldStartedAt || !vodSeekHoldKey || !isFullscreen || !isVodMode) {
            clearVodSeekHold();
            return;
        }
        // Tizen often never delivers keyup for arrows. While held it keeps sending
        // keydowns — when those stop, end the seek hold.
        if (now - vodSeekHoldLastKeyAt > VOD_SEEK_HOLD_IDLE_MS) {
            clearVodSeekHold();
            return;
        }
        held = now - vodSeekHoldStartedAt;
        step = vodSeekStepForHold(held);
        dir = vodSeekHoldKey === 37 ? -1 : 1;
        revealVodControls();
        seekVodBy(dir * step);
    }

    /**
     * Own timer while Left/Right is held. Keepalive via repeated keydowns
     * (Tizen rarely sets KeyboardEvent.repeat / keyup reliably).
     */
    function startVodSeekHold(keyCode) {
        var now = Date.now();
        if (vodSeekHoldKey === keyCode && vodSeekHoldTimer) {
            vodSeekHoldLastKeyAt = now;
            return;
        }
        clearVodSeekHold();
        vodSeekHoldKey = keyCode;
        vodSeekHoldStartedAt = now;
        vodSeekHoldLastKeyAt = now;
        tickVodSeekHold();
        vodSeekHoldTimer = setInterval(tickVodSeekHold, VOD_SEEK_HOLD_TICK_MS);
    }

    function ensureSnapshotVideo() {
        if (snapshotVideo) {
            return snapshotVideo;
        }

        snapshotVideo = document.createElement('video');
        snapshotVideo.id = 'snapshot-capture';
        snapshotVideo.muted = true;
        snapshotVideo.playsInline = true;
        snapshotVideo.setAttribute('playsinline', '');
        snapshotVideo.preload = 'auto';
        document.body.appendChild(snapshotVideo);
        return snapshotVideo;
    }

    function resolveSnapshotPlayUrl(url, callback) {
        // On TV, route through LAN CORS proxy so hls.js can load and we can capture a frame.
        // Simulator usually has working CDN CORS, so go direct.
        if (!hasAvplay()) {
            callback(url, false);
            return;
        }

        var now = Date.now();
        if (snapshotProxyAvailable !== null && now - snapshotProxyCheckedAt < 30000) {
            callback(snapshotProxyAvailable ? vodProxyUrl(url) : url, snapshotProxyAvailable);
            return;
        }

        checkVodProxy(function (ok) {
            snapshotProxyAvailable = ok;
            snapshotProxyCheckedAt = Date.now();
            callback(ok ? vodProxyUrl(url) : url, ok);
        });
    }

    function channelKey(channel) {
        return (channel && (channel.getAttribute('data-channel') || channel.getAttribute('data-url'))) || '';
    }

    function destroyFrozenHls(key) {
        if (!key || !frozenHlsByChannel[key]) {
            return;
        }
        destroyHls(frozenHlsByChannel[key]);
        delete frozenHlsByChannel[key];
    }

    function trimFrozenPreviews(keepKey) {
        var keys = Object.keys(frozenHlsByChannel);
        if (keys.length <= MAX_FROZEN_PREVIEWS) {
            return;
        }
        keys.forEach(function (key) {
            if (key === keepKey) {
                return;
            }
            if (Object.keys(frozenHlsByChannel).length <= MAX_FROZEN_PREVIEWS) {
                return;
            }
            var ch = null;
            channels.forEach(function (c) {
                if (channelKey(c) === key) {
                    ch = c;
                }
            });
            destroyFrozenHls(key);
            if (ch) {
                var thumb = ch.querySelector('.channel-thumb');
                var video = ch.querySelector('.channel-preview');
                if (video) {
                    video.pause();
                    video.removeAttribute('src');
                    try {
                        video.load();
                    } catch (e) {}
                }
                if (thumb && !thumb.classList.contains('has-snapshot')) {
                    thumb.classList.remove('is-frozen');
                }
            }
        });
    }

    function clearAllFrozenPreviews() {
        Object.keys(frozenHlsByChannel).forEach(function (key) {
            destroyFrozenHls(key);
        });
        channels.forEach(function (channel) {
            var thumb = channel.querySelector('.channel-thumb');
            var video = channel.querySelector('.channel-preview');
            if (video) {
                video.pause();
                video.removeAttribute('src');
                try {
                    video.load();
                } catch (e) {}
            }
            if (thumb) {
                thumb.classList.remove('is-frozen', 'is-live');
            }
        });
    }

    // Fetch a still frame from every live channel stream (on enter + every minute).
    // Uses Mac proxy /frame (ffmpeg) — reliable on TV where canvas/hls snapshots fail.
    function refreshAllLiveSnapshots() {
        if (currentView !== 'live' || isFullscreen) {
            return;
        }

        var list = document.querySelectorAll('#channels .channel[data-url]');
        if (!list.length) {
            return;
        }

        checkVodProxy(function (ok) {
            if (currentView !== 'live' || isFullscreen) {
                return;
            }
            if (!ok) {
                console.warn('Live thumbnails need the media proxy. Run: node scripts/vod-cors-proxy.js');
                return;
            }

            Array.prototype.forEach.call(list, function (channel) {
                var streamUrl = getChannelUrl(channel);
                if (!streamUrl || !isPlayableUrl(streamUrl) || !isHlsUrl(streamUrl)) {
                    return;
                }
                if (isMakoVodUrl(streamUrl)) {
                    resolveMakoPlayUrl(streamUrl, function (err, playUrl) {
                        if (err || !playUrl) {
                            console.warn('Live frame Mako resolve failed:', err);
                            return;
                        }
                        applyRemoteFrameToChannel(channel, playUrl);
                    });
                    return;
                }
                applyRemoteFrameToChannel(channel, streamUrl);
            });
        });
    }

    function applyRemoteFrameToChannel(channel, streamUrl) {
        var thumb = channel.querySelector('.channel-thumb');
        var img = channel.querySelector('.channel-snapshot');
        if (!thumb || !img || !streamUrl) {
            return;
        }

        // Download fully first, then swap — keeps the previous still visible (no black flash)
        var frameSrc = VOD_PROXY_BASE + '/frame?url=' + encodeURIComponent(streamUrl) +
            '&t=' + Date.now();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', frameSrc, true);
        xhr.responseType = 'blob';
        xhr.timeout = 25000;
        xhr.onload = function () {
            if (xhr.status < 200 || xhr.status >= 300 || !xhr.response || !xhr.response.size) {
                return;
            }
            var blobUrl = URL.createObjectURL(xhr.response);
            var previousBlob = img.getAttribute('data-blob-url') || '';
            var probe = new Image();
            probe.onload = function () {
                // Only replace once the new frame is decoded
                img.src = blobUrl;
                img.setAttribute('data-blob-url', blobUrl);
                thumb.classList.add('has-snapshot');
                // Don't cover a good still with a frozen/black decoder
                if (previewChannel !== channel) {
                    thumb.classList.remove('is-frozen', 'is-live');
                    destroyFrozenHls(channelKey(channel));
                    var video = channel.querySelector('.channel-preview');
                    if (video) {
                        video.muted = true;
                        video.pause();
                        video.removeAttribute('src');
                        try {
                            video.load();
                        } catch (e) {}
                    }
                }
                channel.setAttribute('data-hero', blobUrl);
                if (previousBlob && previousBlob !== blobUrl) {
                    setTimeout(function () {
                        try {
                            URL.revokeObjectURL(previousBlob);
                        } catch (e) {}
                    }, 1500);
                }
            };
            probe.onerror = function () {
                try {
                    URL.revokeObjectURL(blobUrl);
                } catch (e) {}
            };
            probe.src = blobUrl;
        };
        xhr.onerror = function () {
            console.warn('Live frame failed:', streamUrl);
        };
        xhr.ontimeout = function () {
            console.warn('Live frame timeout:', streamUrl);
        };
        xhr.send();
    }

    function startSnapshotRefresh() {
        refreshAllLiveSnapshots();
        if (snapshotRefreshTimer) {
            clearInterval(snapshotRefreshTimer);
        }
        snapshotRefreshTimer = setInterval(function () {
            if (currentView === 'live' && !isFullscreen) {
                refreshAllLiveSnapshots();
            }
        }, SNAPSHOT_REFRESH_MS);
    }

    function processSnapshotQueue() {
        // Legacy sequential canvas capture disabled — frames come from /frame proxy.
    }

    function stopSnapshotCapture() {
        snapshotBusy = false;
        snapshotQueue = [];
        if (snapshotRefreshTimer) {
            clearInterval(snapshotRefreshTimer);
            snapshotRefreshTimer = null;
        }
        destroyHls(snapshotHls);
        snapshotHls = null;
        if (snapshotVideo) {
            snapshotVideo.pause();
            snapshotVideo.removeAttribute('src');
            try {
                snapshotVideo.load();
            } catch (e) {}
        }
    }

    function applySnapshotToChannel(channel, dataUrl, opts) {
        if (!channel || !dataUrl) {
            return false;
        }
        var thumb = channel.querySelector('.channel-thumb');
        var img = channel.querySelector('.channel-snapshot');
        var video = channel.querySelector('.channel-preview');
        var key = channelKey(channel);
        var keepPreview = opts && opts.keepPreview;
        if (!thumb || !img) {
            return false;
        }
        img.src = dataUrl;
        thumb.classList.add('has-snapshot');
        // While previewing, only refresh the still under the video.
        if (keepPreview || previewChannel === channel) {
            return true;
        }
        destroyFrozenHls(key);
        thumb.classList.remove('is-frozen', 'is-live');
        if (video) {
            video.muted = true;
            video.pause();
            video.removeAttribute('src');
            try {
                video.load();
            } catch (e) {}
        }
        return true;
    }

    function frameLooksBlack(ctx, width, height) {
        try {
            var sw = Math.min(48, width);
            var sh = Math.min(48, height);
            var sample = ctx.getImageData(0, 0, sw, sh).data;
            var bright = 0;
            var i;
            for (i = 0; i < sample.length; i += 16) {
                if (sample[i] + sample[i + 1] + sample[i + 2] > 40) {
                    bright += 1;
                }
            }
            return bright < 4;
        } catch (e) {
            // Tainted canvas (no CORS) — caller should use freeze-frame instead
            return true;
        }
    }

    function frameToDataUrl(video) {
        if (!video || !video.videoWidth || !video.videoHeight) {
            return '';
        }

        var canvas = document.createElement('canvas');
        var maxWidth = 640;
        var scale = Math.min(1, maxWidth / video.videoWidth);
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

        try {
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            if (frameLooksBlack(ctx, canvas.width, canvas.height)) {
                return '';
            }
            return canvas.toDataURL('image/jpeg', 0.72);
        } catch (err) {
            console.warn('Snapshot canvas failed:', err);
            return '';
        }
    }

    function waitForVideoFrame(video, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var done = false;
            var timer = setTimeout(function () {
                if (done) {
                    return;
                }
                done = true;
                cleanup();
                reject(new Error('snapshot timeout'));
            }, timeoutMs || SNAPSHOT_CAPTURE_TIMEOUT_MS);

            function cleanup() {
                video.removeEventListener('playing', onReady);
                video.removeEventListener('loadeddata', onReady);
                video.removeEventListener('timeupdate', onReady);
                video.removeEventListener('error', onError);
            }

            function onReady() {
                if (done) {
                    return;
                }
                if (!video.videoWidth) {
                    return;
                }
                done = true;
                clearTimeout(timer);
                cleanup();
                // Give decoder a moment for a real frame
                setTimeout(function () {
                    resolve();
                }, 600);
            }

            function onError() {
                if (done) {
                    return;
                }
                done = true;
                clearTimeout(timer);
                cleanup();
                reject(new Error('snapshot video error'));
            }

            video.addEventListener('playing', onReady);
            video.addEventListener('loadeddata', onReady);
            video.addEventListener('timeupdate', onReady);
            video.addEventListener('error', onError);

            if (video.readyState >= 2 && video.videoWidth) {
                onReady();
            }
        });
    }

    function captureChannelSnapshot(channel) {
        snapshotBusy = true;

        return new Promise(function (resolve) {
            var url = getChannelUrl(channel);
            if (!url || !isPlayableUrl(url) || isFullscreen || currentView !== 'live') {
                resolve();
                return;
            }

            // Don't fight the live preview on the same channel — grab its current frame
            if (previewChannel === channel) {
                var liveVideo = channel.querySelector('.channel-preview');
                var liveShot = frameToDataUrl(liveVideo);
                if (liveShot) {
                    applySnapshotToChannel(channel, liveShot);
                }
                resolve();
                return;
            }

            resolveSnapshotPlayUrl(url, function (resolvedUrl, usedProxy) {
                if (isFullscreen || currentView !== 'live') {
                    resolve();
                    return;
                }

                function startCapture(playUrl) {
                    var video = ensureSnapshotVideo();
                    destroyHls(snapshotHls);
                    snapshotHls = null;
                    video.pause();
                    video.removeAttribute('src');

                    // Proxy answers CORS; set crossorigin so canvas export is allowed
                    if (usedProxy || !hasAvplay()) {
                        video.setAttribute('crossorigin', 'anonymous');
                    } else {
                        video.removeAttribute('crossorigin');
                    }

                    snapshotHls = attachStream(video, playUrl, function () {
                        cleanupAndResolve();
                    });

                    var settled = false;
                    function cleanupAndResolve() {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        destroyHls(snapshotHls);
                        snapshotHls = null;
                        video.pause();
                        video.removeAttribute('src');
                        try {
                            video.load();
                        } catch (e) {}
                        resolve();
                    }

                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(function () {});
                    }

                    waitForVideoFrame(video, SNAPSHOT_CAPTURE_TIMEOUT_MS).then(function () {
                        var dataUrl = frameToDataUrl(video);
                        if (dataUrl) {
                            applySnapshotToChannel(channel, dataUrl);
                        }
                        cleanupAndResolve();
                    }, function () {
                        cleanupAndResolve();
                    });
                }

                if (isMakoVodUrl(url)) {
                    resolveMakoPlayUrl(url, function (err, playUrl) {
                        if (err || !playUrl) {
                            console.warn('Snapshot Mako resolve failed:', err);
                            resolve();
                            return;
                        }
                        startCapture(playUrl);
                    });
                    return;
                }
                startCapture(resolvedUrl);
            });
        });
    }

    function updateSnapshotFromPreview(channel, opts) {
        if (!channel) {
            return false;
        }
        var video = channel.querySelector('.channel-preview');
        var dataUrl = frameToDataUrl(video);
        if (dataUrl) {
            return applySnapshotToChannel(channel, dataUrl, opts);
        }
        return false;
    }

    function teardownPreviewVideo(channel, hlsInstance) {
        var thumb = channel && channel.querySelector('.channel-thumb');
        var video = channel && channel.querySelector('.channel-preview');
        var key = channelKey(channel);
        destroyHls(hlsInstance);
        destroyFrozenHls(key);
        if (thumb) {
            thumb.classList.remove('is-live', 'is-frozen');
        }
        if (video) {
            video.onplaying = null;
            video.ontimeupdate = null;
            video.muted = true;
            video.pause();
            video.removeAttribute('src');
            try {
                video.load();
            } catch (e) {}
        }
    }

    function freezePreviewChannel(channel, hlsInstance) {
        if (!channel) {
            return;
        }
        var thumb = channel.querySelector('.channel-thumb');
        var video = channel.querySelector('.channel-preview');
        if (!thumb || !video) {
            destroyHls(hlsInstance);
            return;
        }

        video.muted = true;

        // Capture the current frame BEFORE pause — Tizen often clears the
        // decoder to black as soon as pause() runs.
        var captured = updateSnapshotFromPreview(channel, { keepPreview: true });
        video.pause();
        if (!captured) {
            captured = updateSnapshotFromPreview(channel, { keepPreview: true });
        }

        // Always hide the video. Never leave a paused/black decoder on top of
        // the still — the snapshot (just captured, or last /frame) stays until
        // the normal 1-minute refresh replaces it.
        teardownPreviewVideo(channel, hlsInstance);
    }

    function renderChannels() {
        var container = document.getElementById('channels');
        var list = window.ISRTV_CHANNELS || [];
        var region = liveRegionTab === 'world' || liveRegionTab === 'kids'
            ? liveRegionTab
            : 'israel';

        if (!container) {
            return;
        }

        clearAllFrozenPreviews();
        container.innerHTML = '';

        list.forEach(function (item) {
            var itemRegion = item.region || 'israel';
            if (itemRegion !== region) {
                return;
            }

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'vod-card live-card channel';
            button.setAttribute('data-channel', item.id);
            button.setAttribute('data-url', item.streamURL || '');
            button.setAttribute('data-image', item.imageName || '');
            if (item.preferHlsJs) {
                button.setAttribute('data-prefer-hlsjs', '1');
            }
            if (item.defaultSubtitles) {
                button.setAttribute('data-subtitles', item.defaultSubtitles);
            }
            if (item.imageURL) {
                button.setAttribute('data-hero', item.imageURL);
            }
            if (item.action) {
                button.setAttribute('data-action', item.action);
            }

            var inner = document.createElement('span');
            inner.className = 'vod-card-inner channel-thumb';
            inner.setAttribute('data-placeholder', item.placeholder || item.name);

            if (item.imageURL) {
                applyThumbImage(inner, item.imageURL);
            }

            var snapshot = document.createElement('img');
            snapshot.className = 'channel-snapshot';
            snapshot.alt = '';
            inner.appendChild(snapshot);

            var video = document.createElement('video');
            video.className = 'channel-preview';
            video.muted = true;
            video.setAttribute('playsinline', '');
            video.preload = 'none';
            inner.appendChild(video);

            var gradient = document.createElement('span');
            gradient.className = 'vod-card-gradient';
            inner.appendChild(gradient);

            var name = document.createElement('span');
            name.className = 'vod-card-name';
            name.textContent = item.name;
            name.setAttribute('dir', 'auto');
            inner.appendChild(name);

            button.appendChild(inner);
            container.appendChild(button);
        });
    }

    function liveTabCount() {
        var tabs = document.querySelectorAll('#live-tabs .vod-tab');
        return tabs ? tabs.length : 0;
    }

    function liveTabIndex(tab) {
        var tabs = document.querySelectorAll('#live-tabs .vod-tab');
        var i;
        for (i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute('data-live-tab') === tab) {
                return i;
            }
        }
        return 0;
    }

    function syncLiveTabUi() {
        var tabs = document.querySelectorAll('#live-tabs .vod-tab');
        Array.prototype.forEach.call(tabs, function (tab) {
            var id = tab.getAttribute('data-live-tab');
            var active = id === liveRegionTab;
            if (active) {
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function setLiveRegionTab(tab, keepFocusOnTab) {
        if (tab !== 'israel' && tab !== 'world' && tab !== 'kids') {
            return;
        }
        var changed = liveRegionTab !== tab;
        liveRegionTab = tab;
        syncLiveTabUi();
        stopPreview();
        clearAllFrozenPreviews();
        renderChannels();
        bindLiveItems();
        if (changed) {
            var liveGrid = document.getElementById('channels');
            if (liveGrid) {
                try {
                    liveGrid.scrollTop = 0;
                } catch (eGrid) {}
            }
            startSnapshotRefresh();
        }
        if (keepFocusOnTab) {
            setFocus(liveTabIndex(tab), false);
        } else if (changed) {
            var firstCard = liveTabCount();
            if (focusableItems.length > firstCard) {
                setFocus(firstCard, true);
            } else {
                setFocus(liveTabIndex(tab), false);
            }
        }
    }

    function bindLiveItems() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('#live-tabs .vod-tab'));
        var cards = Array.prototype.slice.call(
            document.querySelectorAll('#channels .channel, #channels .vod-card')
        );
        focusableItems = tabs.concat(cards);
        channels = cards;
        lastFocusedEl = null;

        focusableItems.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.live = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                if (item.classList.contains('channel') || item.classList.contains('live-card')) {
                    schedulePreview(item);
                }
            };

            item.onclick = function () {
                activateItem(item);
            };
        });
    }

    function moveLiveFocus(dx, dy) {
        var items = focusableItems;
        var tabs = liveTabCount();
        var cols = getColumns();
        var shouldScroll = dy !== 0;
        var activeTabIndex = liveTabIndex(liveRegionTab);

        if (focusedIndex < tabs) {
            if (dy > 0) {
                if (items.length > tabs) {
                    setFocus(tabs, true);
                }
                return;
            }
            if (dy < 0) {
                tryFocusProfileChromeFromTop();
                return;
            }
            var nextTab = focusedIndex + dx;
            if (nextTab >= 0 && nextTab < tabs) {
                setFocus(nextTab, false);
            }
            return;
        }

        var cardIndex = focusedIndex - tabs;
        var cardCount = items.length - tabs;
        if (cardCount <= 0) {
            if (dy < 0 || dx !== 0) {
                setFocus(activeTabIndex, true);
            }
            return;
        }

        var row = Math.floor(cardIndex / cols);
        var col = cardIndex % cols;
        var nextRow = row + dy;
        var nextCol = col + dx;
        var maxRow = Math.floor((cardCount - 1) / cols);

        if (nextCol < 0 || nextCol >= cols) {
            return;
        }
        if (nextRow < 0) {
            setFocus(activeTabIndex, true);
            return;
        }
        if (nextRow > maxRow) {
            return;
        }

        var nextCard = nextRow * cols + nextCol;
        if (nextCard >= cardCount) {
            return;
        }
        setFocus(tabs + nextCard, shouldScroll);
    }

    function onKeyDown(e) {
        if (isFullscreen) {
            if (e.keyCode === 10009 || e.keyCode === 27) {
                clearVodSeekHold();
                closeFullscreen();
                e.preventDefault();
                return;
            }

            if (isVodMode) {
                switch (e.keyCode) {
                    case 13: // OK
                        clearVodSeekHold();
                        if (activateVodNextAction()) {
                            e.preventDefault();
                            break;
                        }
                        revealVodControls();
                        toggleVodPlayPause();
                        e.preventDefault();
                        break;
                    case 415: // MediaPlay
                    case 19: // MediaPause
                    case 10252: // MediaPlayPause
                        clearVodSeekHold();
                        revealVodControls();
                        toggleVodPlayPause();
                        e.preventDefault();
                        break;
                    case 37: // LEFT seek back
                        startVodSeekHold(37);
                        e.preventDefault();
                        break;
                    case 39: // RIGHT seek forward
                        startVodSeekHold(39);
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
            return;
        }

        if (profileChromeFocused) {
            switch (e.keyCode) {
                case 37: // LEFT → My List on VOD
                    if (currentView === 'vod') {
                        clearProfileChromeFocus(false);
                        setFocus(vodTabIndex('mylist'), false);
                    }
                    e.preventDefault();
                    break;
                case 39:
                    e.preventDefault();
                    break;
                case 38:
                    e.preventDefault();
                    break;
                case 40: // DOWN → main chrome/content below (not My List)
                    leaveProfileChromeDown();
                    e.preventDefault();
                    break;
                case 13: // OK — expand profile list
                case 29443:
                    openProfileMenu();
                    e.preventDefault();
                    break;
                case 27:
                case 10009:
                    clearProfileChromeFocus(true);
                    e.preventDefault();
                    break;
                default:
                    break;
            }
            return;
        }

        switch (e.keyCode) {
            case 37:
                clearOkHold();
                moveFocus(-1, 0);
                e.preventDefault();
                break;
            case 38:
                clearOkHold();
                moveFocus(0, -1);
                e.preventDefault();
                break;
            case 39:
                clearOkHold();
                moveFocus(1, 0);
                e.preventDefault();
                break;
            case 40:
                clearOkHold();
                moveFocus(0, 1);
                e.preventDefault();
                break;
            case 13:
            case 29443:
                if (e.repeat) {
                    if (okHoldItem) {
                        okHoldSawRepeat = true;
                        if (okShortTimer) {
                            clearTimeout(okShortTimer);
                            okShortTimer = null;
                        }
                        if (!okHoldFired && okHoldDownAt && Date.now() - okHoldDownAt >= OK_HOLD_MYLIST_MS) {
                            fireOkMyList(okHoldItem);
                        }
                    }
                    e.preventDefault();
                    break;
                }
                if (isVodSeriesCard(focusableItems[focusedIndex])) {
                    startOkHoldForMyList(focusableItems[focusedIndex]);
                    e.preventDefault();
                    break;
                }
                clearOkHold();
                activateItem(focusableItems[focusedIndex]);
                e.preventDefault();
                break;
            case 403: // Color Red — toggle My List on focused series
                if (currentView === 'vod' && !profileDialogOpen && focusableItems[focusedIndex]) {
                    var seriesId = focusableItems[focusedIndex].getAttribute('data-series');
                    if (seriesId) {
                        toggleMyListSeries(seriesId);
                        flashMyListHeart(seriesId);
                        e.preventDefault();
                        break;
                    }
                }
                break;
            case 27:
            case 10009:
                goBack();
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    function getColumns() {
        if (currentView === 'radio') {
            return RADIO_COLUMNS;
        }
        return columns;
    }

    function moveFocus(dx, dy) {
        var items = focusableItems;
        if (!items.length) {
            return;
        }

        if (vodImeOpen) {
            moveVodImeFocus(dx, dy);
            return;
        }

        if (profileMenuOpen) {
            moveProfileMenuFocus(dx, dy);
            return;
        }

        if (profileDialogOpen) {
            moveProfileDialogFocus(dx, dy);
            return;
        }

        if (seriesSeasonMenuOpen) {
            var next = focusedIndex + dy;
            if (next < 0 || next >= items.length) {
                return;
            }
            setFocus(next, true);
            return;
        }

        if (currentView === 'vod') {
            moveVodFocus(dx, dy);
            return;
        }

        if (currentView === 'live') {
            moveLiveFocus(dx, dy);
            return;
        }

        if (currentView === 'series') {
            moveSeriesFocus(dx, dy);
            return;
        }

        if (currentView === 'home') {
            moveHomeFocus(dx, dy);
            return;
        }

        var cols = getColumns();
        var row = Math.floor(focusedIndex / cols);
        var col = focusedIndex % cols;
        var nextRow = row + dy;
        var nextCol = col + dx;
        var maxRow = Math.floor((items.length - 1) / cols);

        if (nextCol < 0 || nextCol >= cols) {
            return;
        }
        if (nextRow < 0) {
            tryFocusProfileChromeFromTop();
            return;
        }
        if (nextRow > maxRow) {
            return;
        }

        var nextIndex = nextRow * cols + nextCol;
        if (nextIndex >= items.length) {
            return;
        }

        setFocus(nextIndex, dy !== 0);
    }

    function episodeGridPos(item) {
        if (!item || !item.getAttribute || !item.getAttribute('data-episode')) {
            return null;
        }
        return {
            season: parseInt(item.getAttribute('data-season-ord') || '0', 10) || 0,
            row: parseInt(item.getAttribute('data-ep-row') || '0', 10) || 0,
            col: parseInt(item.getAttribute('data-ep-col') || '0', 10) || 0
        };
    }

    function findEpisodeAt(seasonOrd, row, col) {
        var items = focusableItems;
        var i;
        var pos;
        for (i = 0; i < items.length; i++) {
            pos = episodeGridPos(items[i]);
            if (pos && pos.season === seasonOrd && pos.row === row && pos.col === col) {
                return i;
            }
        }
        return -1;
    }

    function findEpisodeClosestCol(seasonOrd, row, preferredCol) {
        var items = focusableItems;
        var best = -1;
        var bestDist = Infinity;
        var i;
        var pos;
        var dist;
        for (i = 0; i < items.length; i++) {
            pos = episodeGridPos(items[i]);
            if (!pos || pos.season !== seasonOrd || pos.row !== row) {
                continue;
            }
            dist = Math.abs(pos.col - preferredCol);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        }
        return best;
    }

    function seasonMaxRow(seasonOrd) {
        var items = focusableItems;
        var maxRow = -1;
        var i;
        var pos;
        for (i = 0; i < items.length; i++) {
            pos = episodeGridPos(items[i]);
            if (pos && pos.season === seasonOrd && pos.row > maxRow) {
                maxRow = pos.row;
            }
        }
        return maxRow;
    }

    function moveSeriesFocus(dx, dy) {
        var items = focusableItems;
        var header = seriesHeaderFocusCount();
        var current = items[focusedIndex];
        var pos;
        var cols = columns;
        var nextIndex = -1;
        var targetSeason;
        var targetRow;

        if (!items.length) {
            return;
        }

        if (header && focusedIndex < header) {
            if (dy > 0 && items.length > header) {
                setFocus(header, true);
            } else if (dy < 0) {
                tryFocusProfileChromeFromTop();
            }
            return;
        }

        pos = episodeGridPos(current);
        if (!pos) {
            return;
        }

        // Episodes grid is direction:rtl — flip left/right so remote matches on-screen order
        if (dx) {
            dx = -dx;
        }

        if (dx !== 0 && dy === 0) {
            if (pos.col + dx < 0 || pos.col + dx >= cols) {
                return;
            }
            nextIndex = findEpisodeAt(pos.season, pos.row, pos.col + dx);
            if (nextIndex < 0) {
                return;
            }
            setFocus(nextIndex, false);
            return;
        }

        if (dy === 0) {
            return;
        }

        targetSeason = pos.season;
        targetRow = pos.row + dy;
        nextIndex = findEpisodeClosestCol(targetSeason, targetRow, pos.col);

        if (nextIndex < 0) {
            targetSeason = pos.season + dy;
            if (dy > 0) {
                targetRow = 0;
            } else {
                targetRow = seasonMaxRow(targetSeason);
            }
            if (targetRow < 0) {
                if (dy < 0 && header) {
                    setFocus(0, true);
                    return;
                }
                if (dy < 0) {
                    tryFocusProfileChromeFromTop();
                }
                return;
            }
            nextIndex = findEpisodeClosestCol(targetSeason, targetRow, pos.col);
        }

        if (nextIndex < 0) {
            if (dy < 0) {
                tryFocusProfileChromeFromTop();
            }
            return;
        }
        setFocus(nextIndex, true);
    }

    function moveVodFocus(dx, dy) {
        var items = focusableItems;
        var tabs = vodTabCount();
        var header = vodHeaderFocusCount();
        var cols = getColumns();
        var shouldScroll = dy !== 0;
        var searchIndex = tabs;
        var clearIndex = tabs + 1;

        var mylistIndex = vodTabIndex('mylist');
        var lastProvider = mylistIndex > 0 ? mylistIndex - 1 : Math.max(0, tabs - 1);

        if (focusedIndex === mylistIndex) {
            // Down → first series tile (same as other tabs), not back onto provider tabs
            if (dy > 0) {
                if (items.length > header) {
                    setFocus(header, true);
                }
                return;
            }
            if (dx > 0) {
                tryFocusProfileChromeFromTop();
            }
            return;
        }

        if (focusedIndex < tabs) {
            if (dy > 0) {
                if (items.length > header) {
                    setFocus(header, true);
                }
                return;
            }
            if (dy < 0) {
                setFocus(mylistIndex, false);
                return;
            }
            var nextTab = focusedIndex + dx;
            if (nextTab >= 0 && nextTab <= lastProvider) {
                setFocus(nextTab, false);
            } else if (dx > 0 && nextTab > lastProvider) {
                setFocus(searchIndex, false);
            } else if (dx < 0 && focusedIndex === 0) {
                setFocus(mylistIndex, false);
            }
            return;
        }

        if (focusedIndex === searchIndex || focusedIndex === clearIndex) {
            if (dy > 0) {
                if (items.length > header) {
                    setFocus(header, true);
                }
                return;
            }
            if (dy < 0) {
                setFocus(mylistIndex, false);
                return;
            }
            if (focusedIndex === searchIndex && dx < 0) {
                if (vodSearchQuery) {
                    setFocus(clearIndex, false);
                } else {
                    setFocus(lastProvider, false);
                }
                return;
            }
            if (focusedIndex === clearIndex && dx > 0) {
                setFocus(searchIndex, false);
                return;
            }
            if (focusedIndex === clearIndex && dx < 0) {
                setFocus(lastProvider, false);
            }
            return;
        }

        var cardIndex = focusedIndex - header;
        var cardCount = items.length - header;
        var activeTabIndex = vodTabIndex(vodProviderTab);
        if (cardCount <= 0) {
            if (dy < 0 || dx !== 0) {
                setFocus(activeTabIndex, true);
            }
            return;
        }

        var row = Math.floor(cardIndex / cols);
        var col = cardIndex % cols;
        var nextRow = row + dy;
        var nextCol = col + dx;
        var maxRow = Math.floor((cardCount - 1) / cols);

        if (nextCol < 0 || nextCol >= cols) {
            return;
        }
        if (nextRow < 0) {
            // From My List tiles, Up returns to the provider tabs — not the My List chip
            if (vodProviderTab === 'mylist') {
                setFocus(0, true);
                return;
            }
            setFocus(activeTabIndex, true);
            return;
        }
        if (nextRow > maxRow) {
            return;
        }

        var nextCard = nextRow * cols + nextCol;
        if (nextCard >= cardCount) {
            return;
        }
        setFocus(header + nextCard, shouldScroll);
    }

    function needsNativeFocus(el) {
        if (!el) {
            return false;
        }
        // Inputs / tabs / IME need real DOM focus. Media tiles use .is-focused only on TV.
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            return true;
        }
        if (
            el.classList.contains('vod-tab') ||
            el.classList.contains('vod-search-clear') ||
            el.classList.contains('vod-season-trigger') ||
            el.classList.contains('vod-season-option') ||
            el.classList.contains('vod-ime-key') ||
            el.classList.contains('vod-next-btn') ||
            el.classList.contains('profile-btn') ||
            el.classList.contains('profile-dropdown-item') ||
            el.classList.contains('profile-card') ||
            el.classList.contains('profile-manage-btn') ||
            el.classList.contains('profile-edit-close') ||
            el.classList.contains('profile-action-btn') ||
            el.classList.contains('profile-icon-btn') ||
            el.classList.contains('profile-name-field')
        ) {
            return true;
        }
        if (!isTizenTv) {
            return true;
        }
        return false;
    }

    function setFocus(index, allowScroll) {
        var items = focusableItems;
        var prev;
        var tabId;
        var el;
        if (!items.length) {
            return;
        }
        if (index < 0 || index >= items.length) {
            // During restore, never snap to tab 0 (that switches provider content)
            if (vodRestoreLock && currentView === 'vod') {
                index = Math.min(vodHeaderFocusCount(), Math.max(0, items.length - 1));
            } else {
                index = 0;
            }
        }

        // VOD: focusing a tab is enough to show its content (no need to press OK)
        if (currentView === 'vod' && items[index] && !vodRestoreLock) {
            tabId = items[index].getAttribute('data-vod-tab');
            if (tabId && tabId !== vodProviderTab) {
                setVodProviderTab(tabId, true);
                return;
            }
        }

        // LIVE: focusing a region tab switches its channel grid
        if (currentView === 'live' && items[index]) {
            tabId = items[index].getAttribute('data-live-tab');
            if (tabId && tabId !== liveRegionTab) {
                setLiveRegionTab(tabId, true);
                return;
            }
        }

        prev = focusedIndex;
        focusedIndex = index;
        viewFocus[currentView] = index;
        applyFocusClass(prev, index);

        el = items[index];
        focusFromCode = true;
        try {
            if (needsNativeFocus(el)) {
                try {
                    el.focus({ preventScroll: true });
                } catch (eFocusOpts) {
                    el.focus();
                }
            } else if (document.activeElement && document.activeElement.blur) {
                // Drop native :focus so only .is-focused drives the ring (cheaper on Tizen).
                document.activeElement.blur();
            }
        } catch (e) {}
        focusFromCode = false;

        // Focusing search enters the dedicated search view (not the previous tab grid)
        if (
            currentView === 'vod' &&
            !vodRestoreLock &&
            el &&
            (el.id === 'vod-search-input' || el.id === 'vod-search-clear')
        ) {
            enterVodSearchMode();
            // bindVodItems() resets focus classes — restore onto search
            focusedIndex = el.id === 'vod-search-clear' ? vodTabCount() + 1 : vodTabCount();
            viewFocus.vod = focusedIndex;
            applyFocusClass(-1, focusedIndex);
            el = focusableItems[focusedIndex] || el;
        }

        ensureFocusedItemVisible(el, !!allowScroll);
        if (currentView === 'series') {
            syncSeriesSeasonSticky(el);
        }
        if (currentView === 'vod' || currentView === 'series' || currentView === 'home') {
            scheduleHydrateNearbyVodImages(index);
        }
        if (currentView === 'live') {
            if (items[index] && (items[index].classList.contains('channel') || items[index].classList.contains('live-card'))) {
                schedulePreview(items[index]);
            } else {
                stopPreview();
            }
        }
    }

    function getChannelUrl(channel) {
        return (channel && channel.getAttribute('data-url')) || '';
    }

    function isMakoVodUrl(url) {
        var lower = (url || '').toLowerCase();
        return lower.indexOf('mako-vod.akamaized.net') !== -1 ||
            lower.indexOf('mako-streaming.akamaized.net') !== -1 ||
            (lower.indexOf('cloudfront.net') !== -1 && lower.indexOf('/vod/keshet/') !== -1);
    }

    // Mako/Keshet CDN requires a short-lived entitlements ticket (CORS: *).
    function normalizeMakoBaseUrl(url) {
        if (!url) {
            return url;
        }
        // Prefer Akamai twin of CloudFront MediaPackage URLs
        if (/cloudfront\.net\/hls\/VOD\/KESHET/i.test(url)) {
            url = url.replace(/https:\/\/[^/]+\/hls\//i, 'https://mako-vod.akamaized.net/i/');
            url = url.replace(/\/index\.m3u8(\?|$)/i, '/master.m3u8$1');
        }
        return url;
    }

    function resolveMakoPlayUrl(url, callback) {
        var base = normalizeMakoBaseUrl(url);
        if (!isMakoVodUrl(base)) {
            callback(null, url);
            return;
        }
        if (/[?&](hdnea|hdntl|token)=/i.test(base)) {
            callback(null, base);
            return;
        }

        var api = 'https://mass.mako.co.il/ClicksStatistics/entitlementsServicesV2.jsp?et=gt&lp=' +
            encodeURIComponent(base) + '&rv=AKAMAI';
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', api, true);
            xhr.timeout = 8000;
            xhr.onload = function () {
                if (xhr.status < 200 || xhr.status >= 300) {
                    callback('Mako ticket HTTP ' + xhr.status, null);
                    return;
                }
                try {
                    var data = JSON.parse(xhr.responseText);
                    var ticket = data && data.tickets && data.tickets[0] && data.tickets[0].ticket;
                    if (!ticket) {
                        callback('Mako ticket missing', null);
                        return;
                    }
                    var playUrl = base + (base.indexOf('?') >= 0 ? '&' : '?') + ticket;
                    callback(null, playUrl);
                } catch (e) {
                    callback('Mako ticket parse failed', null);
                }
            };
            xhr.onerror = function () {
                callback('Mako ticket network error', null);
            };
            xhr.ontimeout = function () {
                callback('Mako ticket timeout', null);
            };
            xhr.send();
        } catch (e) {
            callback((e && e.message) || 'Mako ticket failed', null);
        }
    }

    function playResolvedFullscreen(url, item) {
        showMessage(playLoadingLabel());
        pendingDrm = null;
        pendingSubtitleLang = (item && item.getAttribute('data-subtitles')) || null;
        pendingPreferHlsJs = !!(item && item.getAttribute('data-prefer-hlsjs') === '1');

        var resolveKind = item && item.getAttribute('data-stream-resolve');
        var assetId = item && item.getAttribute('data-asset-id');
        if (resolveKind === 'reshet' && assetId) {
            resolveReshetPlay(assetId, function (err, play) {
                if (err || !play || !play.url) {
                    console.warn('Reshet resolve failed:', err);
                    showMessage(playFailLabel(err || 'Reshet resolve failed'));
                    return;
                }
                pendingDrm = play.drm || null;
                playFullscreen(play.url);
            });
            return;
        }
        if (resolveKind === 'tv4' && assetId) {
            resolveTv4Play(assetId, function (err, playUrl) {
                if (err || !playUrl) {
                    console.warn('TV4 resolve failed:', err);
                    showMessage(playFailLabel(err || 'TV4 resolve failed'));
                    return;
                }
                playFullscreen(playUrl);
            });
            return;
        }

        resolveMakoPlayUrl(url, function (err, playUrl) {
            if (err) {
                console.warn('Mako resolve failed:', err);
                showMessage(playFailLabel(err));
                return;
            }
            playFullscreen(playUrl || url);
        });
    }

    // TV4 Play session (obfuscated; XOR+base64 — not plaintext in source)
    var TV4_AUTH_URL = 'https://auth.tv4.a2d.tv/v2/auth';
    var TV4_CLIENT = 'tv4-web';
    var TV4_LS_RT = 'isrtv_tv4_rt';
    var TV4_LS_DEVICE = 'isrtv_tv4_device';
    var TV4_SEED = {
        u: 'Py0hOHAsNCw+PCA/Hzs3OjE1cDwzNw==',
        p: 'EjQ0ODA7NS4bNTYybg==',
        r: 'PyISMTwYPzMUMRMYCiYTahYwFywVNAltOh0WahMwKAEIHBUpEjUtLgUfE20RNAw0Bg4wawM0GTYWDxo0ERsVLhUfEG8SJWszFg02NhAOEiIANAU0FDEZaxALCjECIRNncTkjEWg8Bh0wEzE3MD0yCjc4NQ8kPh8TKBE3EDM/aRUoO2xqOjsMCTARNhYgAQAXJD4LYy4AawtqEg0eIBRsETQWDBVoExs7LhUcFGwRNWsyFR4LahANCiAXGRorFA8ZIREbBjYVGxAtFjIMKwIaF2kVMAoiFBo3MQAPFWsSCBYxFQ8IKhEYADIVGm82ETAZMhUJFTYUIQ4xBBsaMxQfDzcFNRMoETQQLD0NDS09GGYsABgRbxc1O2kVMgMXBgQTITk3Hyk9Hw0MFW4RBg4cNyA8FwoyOSIbLDwUFB8VNRwqDgkvIDo0MwgIHiAhDW4ZYxIxLjcGCwgwOQEMLz5objA7GGY3AwMKMRc1LC8/DyEtEx8QMzwODzYTMxFoPTQONRYYEjU7Fx0zFDIcahIIOWsWMwsnETACKxAzMzQ+GBFvEws/bhUMMicQCB8iFjApNj0CFSIQNDA1OxMKaT0XEWwXIWA2OwQINBQ3DG0SGW4wFDMOKT4TATASHBYrPx8yNxA1EDEBMx8lETACaAMdb2gAHzQyEgsONgI1ECoQCDkiFTBubhIwGmoDGQZsFB8SMxMLPzMXGxMrBjEDMhczG2wTHg5tFDQ0JBcxAmBwCDIPdjkQBhM4PwoJABYZOzE+NRE3bxA0CC4RKAUeCD8QaDs5MhghIgEWCyR3KRsoCSwILRcsFRMyLxEiIm43KAktKwwSCDwWEzUvFQQxBR0DPhYvJg0='
    };
    var tv4AccessCache = { token: null, expiry: 0 };

    function tv4Reveal(blob) {
        var raw;
        var out = '';
        var i;
        var k = 0x5a;
        try {
            raw = atob(blob);
        } catch (e) {
            return '';
        }
        for (i = 0; i < raw.length; i++) {
            out += String.fromCharCode(raw.charCodeAt(i) ^ k ^ (i % 7));
        }
        return out;
    }

    function tv4DeviceId() {
        var id = null;
        try {
            id = localStorage.getItem(TV4_LS_DEVICE);
        } catch (e) {}
        if (id) {
            return id;
        }
        id = 'isrtv-' + String(Date.now()) + '-' + String(Math.floor(Math.random() * 1e9));
        try {
            localStorage.setItem(TV4_LS_DEVICE, id);
        } catch (e2) {}
        return id;
    }

    function tv4GetStoredRefresh() {
        try {
            return localStorage.getItem(TV4_LS_RT) || tv4Reveal(TV4_SEED.r) || '';
        } catch (e) {
            return tv4Reveal(TV4_SEED.r) || '';
        }
    }

    function tv4SetStoredRefresh(token) {
        if (!token) {
            return;
        }
        try {
            localStorage.setItem(TV4_LS_RT, token);
        } catch (e) {}
    }

    function tv4XhrJson(method, url, body, headers, callback) {
        try {
            var xhr = new XMLHttpRequest();
            var key;
            xhr.open(method, url, true);
            xhr.timeout = 15000;
            xhr.setRequestHeader('Accept', 'application/json');
            if (headers) {
                for (key in headers) {
                    if (Object.prototype.hasOwnProperty.call(headers, key) && headers[key]) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                }
            }
            xhr.onload = function () {
                var data = null;
                try {
                    data = JSON.parse(xhr.responseText || '{}');
                } catch (eParse) {
                    data = null;
                }
                callback(null, xhr.status, data, xhr.responseText);
            };
            xhr.onerror = function () {
                callback('TV4 network error', 0, null, '');
            };
            xhr.ontimeout = function () {
                callback('TV4 timeout', 0, null, '');
            };
            xhr.send(body ? JSON.stringify(body) : null);
        } catch (e) {
            callback((e && e.message) || 'TV4 request failed', 0, null, '');
        }
    }

    function tv4LoginPassword(callback) {
        var email = tv4Reveal(TV4_SEED.u);
        var password = tv4Reveal(TV4_SEED.p);
        if (!email || !password) {
            callback('TV4 credentials missing', null);
            return;
        }
        tv4XhrJson('POST', TV4_AUTH_URL + '/login', {
            email: email,
            password: password,
            device_id: tv4DeviceId()
        }, {
            'Content-Type': 'application/json',
            'Client-name': TV4_CLIENT,
            'Origin': 'https://www.tv4play.se',
            'Referer': 'https://www.tv4play.se/'
        }, function (err, status, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (status === 202) {
                callback('TV4 login blocked (WAF)', null);
                return;
            }
            if (status < 200 || status >= 300 || !data || !data.access_token) {
                callback((data && (data.message || data.code)) || ('TV4 login HTTP ' + status), null);
                return;
            }
            if (data.refresh_token) {
                tv4SetStoredRefresh(data.refresh_token);
            }
            callback(null, data);
        });
    }

    function tv4RefreshAccess(refreshToken, callback) {
        tv4XhrJson('POST', TV4_AUTH_URL + '/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            profile_id: 'default',
            is_child: false
        }, {
            'Content-Type': 'application/json',
            'client-name': TV4_CLIENT,
            'Origin': 'https://www.tv4play.se',
            'Referer': 'https://www.tv4play.se/'
        }, function (err, status, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (status < 200 || status >= 300 || !data || !data.access_token) {
                callback((data && (data.message || data.code)) || ('TV4 token HTTP ' + status), null);
                return;
            }
            if (data.refresh_token) {
                tv4SetStoredRefresh(data.refresh_token);
            }
            callback(null, data);
        });
    }

    function getTv4AccessToken(callback) {
        var now = Date.now() / 1000;
        var refresh;
        if (tv4AccessCache.token && tv4AccessCache.expiry > now + 60) {
            callback(null, tv4AccessCache.token);
            return;
        }
        refresh = tv4GetStoredRefresh();
        function storeAndReturn(data) {
            var ttl = parseInt(data.expires_in, 10) || 3600;
            tv4AccessCache.token = data.access_token;
            tv4AccessCache.expiry = now + ttl;
            callback(null, data.access_token);
        }
        function afterRefreshFail() {
            tv4LoginPassword(function (err2, data2) {
                if (err2 || !data2) {
                    callback(err2 || 'TV4 auth failed', null);
                    return;
                }
                storeAndReturn(data2);
            });
        }
        if (refresh) {
            tv4RefreshAccess(refresh, function (err, data) {
                if (!err && data && data.access_token) {
                    storeAndReturn(data);
                    return;
                }
                afterRefreshFail();
            });
            return;
        }
        afterRefreshFail();
    }

    function resolveTv4Play(assetId, callback) {
        if (!assetId) {
            callback('TV4 asset missing', null);
            return;
        }
        getTv4AccessToken(function (authErr, accessToken) {
            if (authErr || !accessToken) {
                callback(authErr || 'TV4 auth failed', null);
                return;
            }
            var url = 'https://playback2.a2d.tv/play/' + encodeURIComponent(String(assetId)) +
                '?service=tv4&device=browser&protocol=hls&browser=chrome&capabilities=vod-hls';
            tv4XhrJson('GET', url, null, {
                'Authorization': 'Bearer ' + accessToken,
                'Origin': 'https://www.tv4play.se',
                'Referer': 'https://www.tv4play.se/'
            }, function (err, status, data) {
                var playUrl;
                var errMsg;
                if (err) {
                    callback(err, null);
                    return;
                }
                if (status === 401 || (data && data.errorCode === 'LOGIN_REQUIRED')) {
                    tv4AccessCache.token = null;
                    tv4AccessCache.expiry = 0;
                    callback('נדרשת התחברות ל-TV4 Play', null);
                    return;
                }
                if (status < 200 || status >= 300) {
                    errMsg = (data && (data.message || data.errorCode)) || ('TV4 HTTP ' + status);
                    callback(errMsg, null);
                    return;
                }
                playUrl = data && (
                    (data.playbackItem && (data.playbackItem.manifestUrl || data.playbackItem.mediaUri)) ||
                    data.manifestUrl ||
                    data.mediaUri ||
                    data.url
                );
                if (!playUrl) {
                    callback('TV4 stream missing', null);
                    return;
                }
                callback(null, playUrl);
            });
        });
    }

    function reshetPost(action, payload, callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', RESHET_KALTURA + action, true);
            xhr.timeout = 12000;
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onload = function () {
                if (xhr.status < 200 || xhr.status >= 300) {
                    callback('Reshet HTTP ' + xhr.status, null);
                    return;
                }
                try {
                    callback(null, JSON.parse(xhr.responseText));
                } catch (e) {
                    callback('Reshet parse failed', null);
                }
            };
            xhr.onerror = function () {
                callback('Reshet network error', null);
            };
            xhr.ontimeout = function () {
                callback('Reshet timeout', null);
            };
            xhr.send(JSON.stringify(payload));
        } catch (e) {
            callback((e && e.message) || 'Reshet request failed', null);
        }
    }

    function getReshetKs(callback) {
        var now = Date.now() / 1000;
        if (reshetKsCache && reshetKsExpiry > now + 60) {
            callback(null, reshetKsCache);
            return;
        }
        reshetPost('ottuser/action/anonymouslogin', {
            partnerId: 5031,
            udid: RESHET_UDID,
            apiVersion: '5.4.0'
        }, function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            var ks = data && data.result && data.result.ks;
            var expiry = data && data.result && data.result.expiry;
            if (!ks) {
                callback('Reshet KS missing', null);
                return;
            }
            reshetKsCache = ks;
            reshetKsExpiry = typeof expiry === 'number' ? expiry : (now + 3600);
            callback(null, ks);
        });
    }

    function pickReshetWidevineSource(sources) {
        var i;
        var src;
        var drm;
        var d;
        var license = null;
        if (!sources || !sources.length) {
            return null;
        }
        for (i = 0; i < sources.length; i++) {
            src = sources[i];
            if (!src || !src.url) {
                continue;
            }
            if (src.type !== 'dash_widevine' && String(src.type || '').indexOf('widevine') === -1) {
                continue;
            }
            drm = src.drm || [];
            for (d = 0; d < drm.length; d++) {
                if (drm[d] && drm[d].scheme === 'WIDEVINE_CENC' && drm[d].licenseURL) {
                    license = drm[d].licenseURL;
                    break;
                }
            }
            if (!license) {
                for (d = 0; d < drm.length; d++) {
                    if (drm[d] && /widevine/i.test(drm[d].scheme || '') && drm[d].licenseURL) {
                        license = drm[d].licenseURL;
                        break;
                    }
                }
            }
            return {
                url: src.url,
                drm: license ? { widevineLicense: license } : null
            };
        }
        // Fallback: first DASH source with any Widevine license
        for (i = 0; i < sources.length; i++) {
            src = sources[i];
            if (!src || !src.url || !/\.mpd(\?|$)/i.test(src.url)) {
                continue;
            }
            drm = src.drm || [];
            for (d = 0; d < drm.length; d++) {
                if (drm[d] && /widevine/i.test(drm[d].scheme || '') && drm[d].licenseURL) {
                    return {
                        url: src.url,
                        drm: { widevineLicense: drm[d].licenseURL }
                    };
                }
            }
        }
        return null;
    }

    function resolveReshetPlay(assetId, callback) {
        getReshetKs(function (err, ks) {
            if (err) {
                callback(err, null);
                return;
            }
            reshetPost('asset/action/getplaybackcontext', {
                apiVersion: '5.4.0',
                ks: ks,
                assetId: String(assetId),
                assetType: 'media',
                contextDataParams: {
                    objectType: 'KalturaPlaybackContextOptions',
                    context: 'PLAYBACK',
                    urlType: 'DIRECT'
                }
            }, function (err2, data) {
                if (err2) {
                    callback(err2, null);
                    return;
                }
                var sources = data && data.result && data.result.sources;
                var picked = pickReshetWidevineSource(sources);
                if (!picked) {
                    callback('Reshet stream missing', null);
                    return;
                }
                callback(null, picked);
            });
        });
    }

    // Kan VOD geo host (r.il.cdn-redge.media) 302s to n-121-*. Cross-origin redirects
    // break hls.js XHR on Tizen → fatal networkError. Hit an edge host directly.
    var REDGE_EDGE_HOSTS = [
        'n-121-11.il.cdn-redge.media',
        'n-121-5.il.cdn-redge.media',
        'n-121-4.il.cdn-redge.media',
        'n-121-12.il.cdn-redge.media',
        'n-121-13.il.cdn-redge.media'
    ];
    var redgeEdgeIndex = 0;
    var avplayWatchdog = null;
    var AVPLAY_TIMEOUT_MS = 8000;
    // Mac LAN proxy — required for Kan fMP4 VOD on TV (CDN CORS blocks hls.js; AVPlay can't play CMAF)
    var VOD_PROXY_BASE = 'http://192.168.1.107:8791';

    function normalizeCdnUrl(url) {
        if (!url) {
            return url;
        }
        if (url.indexOf(VOD_PROXY_BASE) === 0) {
            return url;
        }
        var host = REDGE_EDGE_HOSTS[redgeEdgeIndex % REDGE_EDGE_HOSTS.length];
        // Bezeq webcache front → direct redge edge (avoids sticky/bad nodes)
        url = url.replace(
            /https?:\/\/r\.cdn\.avcom-bezeq\.tv\/webcache\/redge-il\//ig,
            'https://' + host + '/'
        );
        url = url.replace(/https?:\/\/kancdn\.medonecdn\.net\//ig, 'https://' + host + '/');
        return url.replace(/https?:\/\/r\.il\.cdn-redge\.media/ig, 'https://' + host);
    }

    function isProxiedUrl(url) {
        return !!(url && url.indexOf(VOD_PROXY_BASE) === 0);
    }

    function vodProxyUrl(targetUrl) {
        return VOD_PROXY_BASE + '/proxy?url=' + encodeURIComponent(targetUrl);
    }

    function checkVodProxy(callback) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', VOD_PROXY_BASE + '/health', true);
            xhr.timeout = 3500;
            xhr.onload = function () {
                callback(xhr.status >= 200 && xhr.status < 300);
            };
            xhr.onerror = function () {
                callback(false);
            };
            xhr.ontimeout = function () {
                callback(false);
            };
            xhr.send();
        } catch (e) {
            callback(false);
        }
    }

    function playKanVodOnDevice(url, generation) {
        showMessage('Connecting to VOD proxy…');
        checkVodProxy(function (ok) {
            if (generation !== playGeneration) {
                return;
            }
            usingAvplayPlayback = false;
            setAvplayOverlay(false);
            if (ok) {
                // Use original geo URL — proxy follows redirects and rewrites playlists
                playWithHtmlVideo(vodProxyUrl(url), generation);
                return;
            }
            // Proxy down: still try hls.js directly (Mako often allows CORS; native demux does not).
            playWithHtmlVideo(url, generation);
        });
    }

    // Live HLS that AVPlay/native can't demux (SCTE, odd masters) → hls.js via LAN proxy
    function playLiveViaProxy(url, generation, onProxyUnavailable) {
        if (isProxiedUrl(url)) {
            if (typeof onProxyUnavailable === 'function') {
                onProxyUnavailable();
            }
            return;
        }
        showMessage(playLoadingLabel());
        checkVodProxy(function (ok) {
            if (generation !== playGeneration) {
                return;
            }
            if (!ok) {
                if (typeof onProxyUnavailable === 'function') {
                    onProxyUnavailable();
                }
                return;
            }
            usingAvplayPlayback = false;
            setAvplayOverlay(false);
            playWithHtmlVideo(vodProxyUrl(url), generation);
        });
    }

    function nextRedgeEdge() {
        redgeEdgeIndex = (redgeEdgeIndex + 1) % REDGE_EDGE_HOSTS.length;
    }

    function clearAvplayWatchdog() {
        if (avplayWatchdog) {
            clearTimeout(avplayWatchdog);
            avplayWatchdog = null;
        }
    }

    function armAvplayWatchdog(url, generation, candidateIndex) {
        clearAvplayWatchdog();
        avplayWatchdog = setTimeout(function () {
            avplayWatchdog = null;
            if (generation !== playGeneration) {
                return;
            }
            console.warn('AVPlay watchdog timeout at candidate', candidateIndex);
            failAvplayOrFallback(url, generation, candidateIndex, 'timeout');
        }, AVPLAY_TIMEOUT_MS);
    }

    // Keep this short — AVPlay can hang forever on unsupported Kan fMP4 masters
    function buildAvplayUrlCandidates(url) {
        var list = [];
        var seen = {};
        function add(u) {
            if (u && !seen[u]) {
                seen[u] = true;
                list.push(u);
            }
        }

        var edge = normalizeCdnUrl(url);

        if (isFmp4HlsUrl(url)) {
            // Prefer media playlists first — Kan masters (demuxed audio) often hang in AVPlay prepare
            add(edge.replace(/playlist\.m3u8\?fmp4$/i, 'playlist.m3u8?id=5&bitrate=2800000&fmp4'));
            add(edge.replace(/playlist\.m3u8\?fmp4$/i, 'playlist.m3u8?id=9&bitrate=1800000&fmp4'));
            add(edge);
            add(url);
            return list;
        }

        // Live redge masters: open a single-bitrate media playlist (AVPlay demux fails on some masters)
        if (/\/live\.livx\/playlist\.m3u8(\?|$)/i.test(edge)) {
            add(edge.replace(/playlist\.m3u8(\?.*)?$/i, 'playlist.m3u8?bitrate=1992000&audioId=1&videoId=8'));
            add(edge.replace(/playlist\.m3u8(\?.*)?$/i, 'playlist.m3u8?bitrate=992000&audioId=1&videoId=12'));
            add(edge.replace(/playlist\.m3u8(\?.*)?$/i, 'playlist.m3u8?bitrate=3692000&audioId=1&videoId=4'));
        }

        // CloudFront MediaPackage masters → prefer a mid-tier media playlist
        if (/\/index\.m3u8(\?|$)/i.test(edge)) {
            add(edge.replace(/\/index\.m3u8/i, '/index_2.m3u8'));
            add(edge.replace(/\/index\.m3u8/i, '/index_1.m3u8'));
        }

        // i24 master → mid quality media playlist
        if (/\/master\.m3u8(\?|$)/i.test(edge) && /immergo\.tv/i.test(edge)) {
            add(edge.replace(/\/master\.m3u8/i, '/1/streamPlaylist.m3u8'));
        }

        add(edge);
        add(url);
        return list;
    }

    function isHlsUrl(url) {
        return (url || '').toLowerCase().indexOf('.m3u8') !== -1;
    }

    // KanBox VOD: CMAF/fMP4 HLS with demuxed audio.
    // Mako/Keshet uses .mp4.csmil masters (TS variants) that AVPlay also can't demux.
    function isFmp4HlsUrl(url) {
        var lower = (url || '').toLowerCase();
        return lower.indexOf('fmp4') !== -1 ||
            lower.indexOf('/manifest.ism/playlist') !== -1 ||
            lower.indexOf('fragment.mp4') !== -1 ||
            lower.indexOf('.mp4.csmil') !== -1;
    }

    function needsHlsJsVod(url) {
        return isFmp4HlsUrl(url) || isMakoVodUrl(url);
    }

    function isDashUrl(url) {
        var lower = (url || '').toLowerCase();
        // Kan VOD HLS looks like: .../Manifest.ism/playlist.m3u8?fmp4 — treat as HLS
        if (isHlsUrl(lower)) {
            return false;
        }
        return lower.indexOf('.mpd') !== -1 || lower.indexOf('.ism') !== -1;
    }

    function isSmoothStreaming(url) {
        return isDashUrl(url);
    }

    function isPlayableUrl(url) {
        if (!url) {
            return false;
        }
        var lower = url.toLowerCase();
        if (lower.indexOf('youtube.com') !== -1 || lower.indexOf('youtu.be') !== -1) {
            return false;
        }
        if (lower.indexOf('blob:') === 0) {
            return false;
        }
        return true;
    }

    function isPlayerLoadingText(text) {
        if (!text) {
            return false;
        }
        var t = String(text).toLowerCase();
        return t.indexOf('loading') !== -1 ||
            t.indexOf('connecting') !== -1 ||
            /\d+\s*%/.test(t);
    }

    function showMessage(text) {
        var loading = isPlayerLoadingText(text);
        if (playerSpinner) {
            playerSpinner.hidden = !loading;
            playerSpinner.setAttribute('aria-hidden', loading ? 'false' : 'true');
        }
        if (!playerMessage) {
            return;
        }
        if (loading) {
            playerMessage.textContent = '';
            playerMessage.hidden = true;
            return;
        }
        playerMessage.textContent = text || '';
        playerMessage.hidden = !text;
    }

    function destroyHls(instance) {
        if (!instance) {
            return;
        }
        try {
            instance.destroy();
        } catch (e) {}
    }

    function enablePreferredSubtitles(hls, video) {
        var lang = pendingSubtitleLang;
        var i;
        var track;
        var langLower = lang ? String(lang).toLowerCase() : '';

        if (hls && typeof hls.subtitleTrack === 'number') {
            try {
                hls.subtitleDisplay = true;
                var tracks = hls.subtitleTracks || [];
                var idx = -1;
                for (i = 0; i < tracks.length; i++) {
                    track = tracks[i] || {};
                    var tLang = String(track.lang || track.language || '').toLowerCase();
                    if (langLower && (tLang === langLower || tLang.indexOf(langLower) === 0)) {
                        idx = i;
                        break;
                    }
                    if (idx < 0 && (track.default || track.autoselect)) {
                        idx = i;
                    }
                }
                if (idx < 0 && tracks.length) {
                    idx = 0;
                }
                if (idx >= 0) {
                    hls.subtitleTrack = idx;
                }
            } catch (eHlsSub) {
                console.warn('hls subtitle select failed:', eHlsSub);
            }
        }

        if (video && video.textTracks && video.textTracks.length) {
            try {
                for (i = 0; i < video.textTracks.length; i++) {
                    track = video.textTracks[i];
                    if (!track) {
                        continue;
                    }
                    var vLang = String(track.language || '').toLowerCase();
                    var matchLang = !langLower || vLang === langLower || vLang.indexOf(langLower) === 0;
                    var isSub = !track.kind || track.kind === 'subtitles' || track.kind === 'captions';
                    if (isSub && matchLang) {
                        track.mode = 'showing';
                    } else if (isSub) {
                        track.mode = 'disabled';
                    }
                }
            } catch (eText) {
                console.warn('textTrack subtitle select failed:', eText);
            }
        }
    }

    function attachStream(video, url, onError) {
        if (!video || !url) {
            return null;
        }

        var playUrl = normalizeCdnUrl(url);

        // Prefer hls.js first. Tizen often reports canPlayType(HLS) but then fails with
        // "no supported source was found" for fMP4 / demuxed Kan VOD playlists.
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: false,
                lowLatencyMode: false,
                xhrSetup: function (xhr) {
                    try {
                        xhr.withCredentials = false;
                    } catch (e) {}
                }
            });
            hls.loadSource(playUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                enablePreferredSubtitles(hls, video);
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            });
            if (Hls.Events && Hls.Events.SUBTITLE_TRACKS_UPDATED) {
                hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, function () {
                    enablePreferredSubtitles(hls, video);
                });
            }
            hls.on(Hls.Events.ERROR, function (event, data) {
                console.warn('HLS error:', data && data.type, data && data.details, data);
                if (data && data.fatal && typeof onError === 'function') {
                    onError(data);
                }
            });
            return hls;
        }

        // Safari / environments without MSE: native HLS
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = playUrl;
            video.addEventListener('loadedmetadata', function onMeta() {
                video.removeEventListener('loadedmetadata', onMeta);
                enablePreferredSubtitles(null, video);
            });
            return null;
        }

        // Last resort
        video.src = playUrl;
        return null;
    }

    function schedulePreview(channel) {
        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }

        previewTimer = setTimeout(function () {
            previewTimer = null;
            if (!isFullscreen && focusableItems[focusedIndex] === channel) {
                startPreview(channel);
            }
        }, 200);
    }

    function stopPreview() {
        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }

        if (!previewChannel) {
            return;
        }

        var channel = previewChannel;
        var hlsInstance = previewHls;
        previewChannel = null;
        previewHls = null;
        freezePreviewChannel(channel, hlsInstance);
    }

    function startPreview(channel) {
        if (isFullscreen || !channel) {
            return;
        }

        if (previewChannel === channel) {
            return;
        }

        var url = getChannelUrl(channel);
        var thumb = channel.querySelector('.channel-thumb');
        var video = channel.querySelector('.channel-preview');
        var key = channelKey(channel);

        if (!url || !thumb || !video || !isPlayableUrl(url) || isSmoothStreaming(url) || !isHlsUrl(url)) {
            return;
        }

        stopPreview();

        // Resume a frozen tile instead of reconnecting (frame already on screen)
        if (frozenHlsByChannel[key]) {
            previewHls = frozenHlsByChannel[key];
            delete frozenHlsByChannel[key];
            previewChannel = channel;
            thumb.classList.remove('is-frozen');
            thumb.classList.add('is-live');
            video.muted = false;
            try {
                video.volume = 1;
            } catch (eVol) {}
            var resumePromise = video.play();
            if (resumePromise && typeof resumePromise.catch === 'function') {
                resumePromise.catch(function (err) {
                    console.warn('Preview resume failed:', err);
                });
            }
            return;
        }

        previewChannel = channel;
        // Keep poster/snapshot visible until the stream actually paints a frame
        thumb.classList.remove('is-frozen', 'is-live');
        video.muted = false;
        try {
            video.volume = 1;
        } catch (eVol2) {}
        // Needed so canvas can snapshot the last frame on unfocus (CORS)
        try {
            video.crossOrigin = 'anonymous';
        } catch (eCors) {}

        var lastSnapAt = 0;

        function revealPreviewVideo() {
            if (previewChannel !== channel || isFullscreen) {
                return;
            }
            thumb.classList.add('is-live');
            updateSnapshotFromPreview(channel, { keepPreview: true });
        }

        function onPreviewTimeUpdate() {
            if (previewChannel !== channel || isFullscreen) {
                return;
            }
            var now = Date.now();
            if (now - lastSnapAt < 1500) {
                return;
            }
            lastSnapAt = now;
            updateSnapshotFromPreview(channel, { keepPreview: true });
        }

        function attachPreview(playUrl) {
            if (previewChannel !== channel || isFullscreen) {
                return;
            }
            previewHls = attachStream(video, playUrl, function () {
                thumb.classList.remove('is-live');
            });

            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function (err) {
                    console.warn('Preview play failed:', err);
                });
            }

            video.onplaying = revealPreviewVideo;
            video.ontimeupdate = onPreviewTimeUpdate;
        }

        function startWithUrl(playUrl) {
            // On TV, prefer CORS proxy so unfocus canvas capture works
            if (hasAvplay()) {
                checkVodProxy(function (ok) {
                    if (previewChannel !== channel || isFullscreen) {
                        return;
                    }
                    attachPreview(ok ? vodProxyUrl(playUrl) : playUrl);
                });
                return;
            }
            attachPreview(playUrl);
        }

        if (isMakoVodUrl(url)) {
            resolveMakoPlayUrl(url, function (err, playUrl) {
                if (err || !playUrl) {
                    console.warn('Preview Mako resolve failed:', err);
                    thumb.classList.remove('is-live');
                    if (previewChannel === channel) {
                        previewChannel = null;
                    }
                    return;
                }
                startWithUrl(playUrl);
            });
            return;
        }

        startWithUrl(url);
    }

    function stopAvplay() {
        clearAvplayWatchdog();
        if (!hasAvplay()) {
            return;
        }
        try {
            var state = webapis.avplay.getState();
            if (state === 'PLAYING' || state === 'PAUSED' || state === 'READY') {
                webapis.avplay.stop();
            }
        } catch (e) {}
        try {
            webapis.avplay.close();
        } catch (e) {}
    }

    function setAvplayOverlay(enabled) {
        if (playerEl) {
            if (enabled) {
                playerEl.classList.add('is-avplay');
            } else {
                playerEl.classList.remove('is-avplay');
            }
        }
    }

    function stopFullscreenPlayback() {
        playGeneration += 1;
        usingAvplayPlayback = false;
        pendingDrm = null;
        setAvplayOverlay(false);
        vodDurationMs = 0;
        vodSeeking = false;
        clearVodSeekHold();
        stopVodSeekAnim();
        clearVodHideTimer();
        hideVodPauseInfo(true);
        stopAvplay();
        destroyHls(fullscreenHls);
        fullscreenHls = null;

        if (fullscreenDash) {
            try {
                fullscreenDash.reset();
            } catch (e) {}
            try {
                fullscreenDash.destroy();
            } catch (e) {}
            fullscreenDash = null;
        }

        if (playerVideo) {
            playerVideo.pause();
            playerVideo.removeAttribute('src');
            try {
                playerVideo.load();
            } catch (e) {}
            playerVideo.style.display = 'none';
        }

        if (vodSeek) {
            setVodSeekVisual(0, true);
        }
        updateVodTimeLabels(0, 0);
        syncVodPlayPauseUi();
    }

    function playWithDash(url, generation) {
        if (!playerVideo) {
            showMessage('Video element missing.');
            return;
        }

        if (typeof dashjs === 'undefined' || !dashjs.MediaPlayer) {
            showMessage('DASH player is missing.');
            return;
        }

        playerVideo.style.display = 'block';
        showMessage(playLoadingLabel());

        try {
            fullscreenDash = dashjs.MediaPlayer().create();
            fullscreenDash.updateSettings({
                streaming: {
                    buffer: {
                        fastSwitchEnabled: true
                    }
                }
            });
            if (pendingDrm && pendingDrm.widevineLicense) {
                fullscreenDash.setProtectionData({
                    'com.widevine.alpha': {
                        serverURL: pendingDrm.widevineLicense
                    }
                });
            }
            fullscreenDash.initialize(playerVideo, url, true);
            fullscreenDash.on(dashjs.MediaPlayer.events.ERROR, function (e) {
                console.warn('DASH error:', e);
                if (generation === playGeneration) {
                    showMessage(playFailLabel());
                }
            });
            fullscreenDash.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, function () {
                if (generation !== playGeneration) {
                    return;
                }
                showMessage('');
                if (playerEl) {
                    playerEl.classList.add('is-playing');
                }
                if (isVodMode) {
                    onVodPlaybackStarted();
                }
            });
            fullscreenDash.on(dashjs.MediaPlayer.events.PLAYBACK_PAUSED, function () {
                if (isVodMode) {
                    onVodPaused();
                }
            });
            fullscreenDash.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, function () {
                if (isVodMode && generation === playGeneration) {
                    updateVodProgress();
                }
            });
        } catch (err) {
            console.warn('DASH init failed:', err);
            showMessage('Could not start DASH playback.');
        }
    }

    function playWithHtmlVideo(url, generation, edgeRetriesLeft) {
        if (typeof edgeRetriesLeft !== 'number') {
            edgeRetriesLeft = REDGE_EDGE_HOSTS.length - 1;
        }

        if (isDashUrl(url)) {
            playWithDash(url, generation);
            return;
        }

        if (!playerVideo) {
            showMessage('Video element missing.');
            return;
        }

        playerVideo.style.display = 'block';
        showMessage(playLoadingLabel());

        fullscreenHls = attachStream(playerVideo, url, function (data) {
            if (generation !== playGeneration) {
                return;
            }
            var detail = data && data.details ? data.details : '';
            var isNetwork = data && data.type === 'networkError';
            // Mako/Kan VOD: if direct hls.js is blocked (CORS / widget origin), retry via LAN proxy.
            if (isNetwork && !isProxiedUrl(url) && needsHlsJsVod(url)) {
                destroyHls(fullscreenHls);
                fullscreenHls = null;
                playLiveViaProxy(url, generation, function () {
                    showMessage('VOD proxy is not running on your PC. On the Mac run: node scripts/vod-cors-proxy.js');
                });
                return;
            }
            // Rotate CDN edge and retry on network failures (bad/stale edge node)
            if (edgeRetriesLeft > 0 && isNetwork && !needsHlsJsVod(url)) {
                nextRedgeEdge();
                destroyHls(fullscreenHls);
                fullscreenHls = null;
                playWithHtmlVideo(url, generation, edgeRetriesLeft - 1);
                return;
            }
            showMessage('Stream error: ' + (data && data.type ? data.type : 'playback failed') +
                (detail ? ' (' + detail + ')' : ''));
        });

        var playPromise = playerVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(function () {
                if (generation !== playGeneration) {
                    return;
                }
                showMessage('');
                if (playerEl) {
                    playerEl.classList.add('is-playing');
                }
            }).catch(function (err) {
                console.warn('HTML play failed:', err);
                if (generation === playGeneration) {
                    showMessage('Could not play stream. ' + (err && err.message ? err.message : ''));
                }
            });
        }

        playerVideo.onplaying = function () {
            if (generation !== playGeneration) {
                return;
            }
            showMessage('');
            if (playerEl) {
                playerEl.classList.add('is-playing');
            }
            if (isVodMode) {
                onVodPlaybackStarted();
            }
        };
    }

    function playLoadingLabel() {
        return isVodMode ? 'Loading episode…' : 'Loading channel…';
    }

    function playFailLabel(detail) {
        var base = isVodMode ? 'Could not play this episode' : 'Could not play this channel';
        if (detail) {
            return base + ' (' + detail + ').';
        }
        return base + '.';
    }

    function playWithNativeVideo(url, generation) {
        if (!playerVideo) {
            showMessage('Video element missing.');
            return;
        }

        usingAvplayPlayback = false;
        setAvplayOverlay(false);
        playerVideo.style.display = 'block';
        try {
            playerVideo.removeAttribute('crossorigin');
        } catch (e) {}

        var playUrl = normalizeCdnUrl(url);
        showMessage(playLoadingLabel());

        var settled = false;
        function succeed() {
            if (settled || generation !== playGeneration) {
                return;
            }
            settled = true;
            clearAvplayWatchdog();
            showMessage('');
            if (playerEl) {
                playerEl.classList.add('is-playing');
            }
            if (isVodMode) {
                onVodPlaybackStarted();
            }
        }
        function fail(msg) {
            if (settled || generation !== playGeneration) {
                return;
            }
            // Native demux often fails with DEMUXER_ERROR_DETECTED_HLS — retry via proxy+hls.js
            if (!isProxiedUrl(url) && isHlsUrl(url) && (!isVodMode || needsHlsJsVod(url))) {
                settled = true;
                clearAvplayWatchdog();
                console.warn('Native video failed, trying proxy/hls.js:', msg);
                playLiveViaProxy(url, generation, function () {
                    if (needsHlsJsVod(url)) {
                        playWithHtmlVideo(url, generation);
                        return;
                    }
                    showMessage(msg || playFailLabel());
                });
                return;
            }
            settled = true;
            clearAvplayWatchdog();
            showMessage(msg || playFailLabel());
        }

        playerVideo.onerror = function () {
            var err = playerVideo.error;
            fail(playFailLabel(err && err.message ? err.message : ''));
        };
        playerVideo.onplaying = succeed;
        playerVideo.onloadeddata = function () {
            if (isVodMode) {
                updateVodProgress();
            }
        };

        playerVideo.src = playUrl;
        try {
            playerVideo.load();
        } catch (e) {}

        var playPromise = playerVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(succeed).catch(function (err) {
                fail(playFailLabel(err && err.message ? err.message : ''));
            });
        }

        clearAvplayWatchdog();
        avplayWatchdog = setTimeout(function () {
            avplayWatchdog = null;
            if (!settled && generation === playGeneration) {
                fail(isVodMode ? 'Episode load timed out.' : 'Channel load timed out.');
            }
        }, AVPLAY_TIMEOUT_MS);
    }

    function failAvplayOrFallback(url, generation, candidateIndex, reason) {
        clearAvplayWatchdog();
        stopAvplay();
        usingAvplayPlayback = false;

        if (isDashUrl(url)) {
            setAvplayOverlay(false);
            playWithDash(url, generation);
            return;
        }

        var candidates = buildAvplayUrlCandidates(url);
        var next = (typeof candidateIndex === 'number' ? candidateIndex : 0) + 1;
        if (next < candidates.length) {
            console.warn('AVPlay failed (' + reason + '), trying next URL…', next);
            playWithAvplay(url, generation, next);
            return;
        }

        // After AVPlay: try hls.js via LAN proxy (handles SCTE / odd demux / Mako), then native <video>
        console.warn('AVPlay exhausted (' + reason + '), trying proxy/hls.js then native');
        setAvplayOverlay(false);
        if (isHlsUrl(url) && !isProxiedUrl(url) && (!isVodMode || needsHlsJsVod(url))) {
            playLiveViaProxy(url, generation, function () {
                if (needsHlsJsVod(url)) {
                    playWithHtmlVideo(url, generation);
                    return;
                }
                playWithNativeVideo(url, generation);
            });
            return;
        }
        playWithNativeVideo(url, generation);
    }

    function playWithAvplay(url, generation, candidateIndex) {
        if (typeof candidateIndex !== 'number') {
            candidateIndex = 0;
        }

        var candidates = buildAvplayUrlCandidates(url);
        var openUrl = candidates[candidateIndex] || url;

        usingAvplayPlayback = true;
        setAvplayOverlay(true);
        if (playerVideo) {
            playerVideo.style.display = 'none';
        }

        try {
            stopAvplay();
            clearAvplayWatchdog();
            webapis.avplay.open(openUrl);
            try {
                webapis.avplay.setStreamingProperty(
                    'USER_AGENT',
                    'Mozilla/5.0 (SMART-TV; Linux; Tizen 9.0) AppleWebKit/537.36'
                );
            } catch (e) {}
            try {
                webapis.avplay.setStreamingProperty('ADAPTIVE_INFO', 'STARTBITRATE=AVERAGE');
            } catch (e) {}
            if (pendingDrm && pendingDrm.widevineLicense) {
                try {
                    webapis.avplay.setDrm(
                        'WIDEVINE_CDM',
                        'SetProperties',
                        JSON.stringify({
                            LicenseServer: pendingDrm.widevineLicense,
                            DeleteLicenseAfterUse: true
                        })
                    );
                } catch (drmErr) {
                    console.warn('AVPlay setDrm failed:', drmErr);
                }
            }
            webapis.avplay.setListener({
                onbufferingstart: function () {
                    if (generation === playGeneration) {
                        showMessage(playLoadingLabel());
                    }
                },
                onbufferingprogress: function (percent) {
                    if (generation === playGeneration) {
                        showMessage(playLoadingLabel().replace('…', '') + ' ' + percent + '%');
                    }
                },
                onbufferingcomplete: function () {
                    if (generation === playGeneration) {
                        clearAvplayWatchdog();
                        showMessage('');
                        if (playerEl) {
                            playerEl.classList.add('is-playing');
                        }
                        if (isVodMode) {
                            try {
                                vodDurationMs = webapis.avplay.getDuration() || 0;
                            } catch (e) {}
                            onVodPlaybackStarted();
                        }
                    }
                },
                oncurrentplaytime: function (timeMs) {
                    if (generation !== playGeneration) {
                        return;
                    }
                    if (timeMs > 0) {
                        clearAvplayWatchdog();
                    }
                    if (!isVodMode) {
                        return;
                    }
                    updateVodProgress((timeMs || 0) / 1000, getVodDurationSec());
                },
                onevent: function () {},
                onerror: function (eventType) {
                    console.warn('AVPlay error:', eventType, openUrl);
                    if (generation !== playGeneration) {
                        return;
                    }
                    failAvplayOrFallback(url, generation, candidateIndex, String(eventType || 'error'));
                },
                onstreamcompleted: function () {
                    try {
                        webapis.avplay.stop();
                    } catch (e) {}
                    if (isVodMode) {
                        if (currentVodEpisodeId) {
                            clearVodProgress(currentVodEpisodeId);
                        }
                        syncVodPlayPauseUi();
                        var nextEp = getNextVodEpisode();
                        showVodNextPrompt(!nextEp);
                    }
                }
            });

            webapis.avplay.setDisplayRect(0, 0, 1920, 1080);
            try {
                webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
            } catch (e) {}

            showMessage(playLoadingLabel());
            armAvplayWatchdog(url, generation, candidateIndex);

            webapis.avplay.prepareAsync(
                function () {
                    if (generation !== playGeneration) {
                        return;
                    }
                    try {
                        vodDurationMs = webapis.avplay.getDuration() || 0;
                    } catch (e) {}
                    if (isVodMode && !vodResumeApplied && vodResumeTargetSec > 0) {
                        var resumeMs = Math.floor(vodResumeTargetSec * 1000);
                        var durationMs = vodDurationMs || 0;
                        if (!(durationMs > 0) || resumeMs < durationMs * VOD_PROGRESS_COMPLETE) {
                            try {
                                webapis.avplay.seekTo(resumeMs);
                                vodResumeApplied = true;
                                vodResumeTargetSec = 0;
                            } catch (e) {
                                console.warn('AVPlay resume seek failed:', e);
                            }
                        } else {
                            vodResumeApplied = true;
                            vodResumeTargetSec = 0;
                        }
                    }
                    try {
                        webapis.avplay.play();
                    } catch (e) {
                        failAvplayOrFallback(url, generation, candidateIndex, 'play failed');
                        return;
                    }
                    // Keep watchdog until buffering completes / first playhead move
                    if (playerEl) {
                        playerEl.classList.add('is-playing');
                    }
                    if (isVodMode) {
                        onVodPlaybackStarted();
                    }
                },
                function (error) {
                    console.warn('AVPlay prepare failed:', error, openUrl);
                    if (generation !== playGeneration) {
                        return;
                    }
                    failAvplayOrFallback(
                        url,
                        generation,
                        candidateIndex,
                        (error && (error.message || error.name)) || 'prepare failed'
                    );
                }
            );
        } catch (err) {
            console.warn('AVPlay open failed:', err, openUrl);
            failAvplayOrFallback(url, generation, candidateIndex, (err && err.message) || 'open failed');
        }
    }

    function playFullscreen(url) {
        stopFullscreenPlayback();
        var generation = playGeneration;

        // Demuxed CMAF live (e.g. SVT) — prefer hls.js; AVPlay often can't demux separate A/V
        if (pendingPreferHlsJs && isHlsUrl(url)) {
            usingAvplayPlayback = false;
            setAvplayOverlay(false);
            playWithHtmlVideo(url, generation);
            return;
        }

        // Live TS → AVPlay. Kan fMP4 / Mako .csmil VOD on TV → hls.js (proxy when needed).
        if (isHlsUrl(url)) {
            if (hasAvplay() && needsHlsJsVod(url)) {
                playKanVodOnDevice(url, generation);
                return;
            }
            if (hasAvplay()) {
                playWithAvplay(url, generation, 0);
                return;
            }
            usingAvplayPlayback = false;
            setAvplayOverlay(false);
            playWithHtmlVideo(url, generation);
            return;
        }

        if (isDashUrl(url)) {
            if (hasAvplay()) {
                if (playerVideo) {
                    playerVideo.style.display = 'none';
                }
                playWithAvplay(url, generation);
                return;
            }
            usingAvplayPlayback = false;
            playWithDash(url, generation);
            return;
        }

        if (hasAvplay()) {
            if (playerVideo) {
                playerVideo.style.display = 'none';
            }
            playWithAvplay(url, generation);
            return;
        }

        usingAvplayPlayback = false;
        playWithHtmlVideo(url, generation);
    }

    function openChannel(channel) {
        if (!channel) {
            return;
        }

        var action = channel.getAttribute('data-action');
        if (action === 'live' || action === 'vod' || action === 'kanbox' || action === 'radio' ||
            action === 'radio-play' || action === 'series' || action === 'home' || action === 'vod-tab' ||
            action === 'live-tab' ||
            action === 'vod-search' || action === 'vod-search-clear' || action === 'series-season' ||
            action === 'series-season-option' || action === 'vod-ime-char' || action === 'vod-ime-space' ||
            action === 'vod-ime-backspace' || action === 'vod-ime-layout' || action === 'vod-ime-done' ||
            action === 'continue-play' || action === 'mylist-toggle' ||
            action === 'profile-open' || action === 'profile-close' || action === 'profile-add' ||
            action === 'profile-edit' || action === 'profile-select' || action === 'profile-icon' ||
            action === 'profile-name' || action === 'profile-save' || action === 'profile-edit-cancel' ||
            action === 'profile-delete' || action === 'profile-manage' ||
            action === 'profile-confirm-yes' || action === 'profile-confirm-no' ||
            action === 'profile-delete-confirm' || action === 'profile-delete-cancel' ||
            action === 'profile-menu-toggle' || action === 'profile-menu-select' ||
            action === 'profile-menu-edit') {
            activateItem(channel);
            return;
        }

        var url = getChannelUrl(channel);
        var assetId = channel.getAttribute('data-asset-id');
        var vod = currentView === 'series' || action === 'play';

        if (previewTimer) {
            clearTimeout(previewTimer);
            previewTimer = null;
        }
        stopPreview();
        stopRadioPlayback();
        stopSnapshotCapture();

        isFullscreen = true;
        document.body.classList.add('is-fullscreen');
        playerEl.hidden = false;
        playerEl.classList.remove('is-playing');
        setVodMode(vod);
        showMessage('');

        currentVodEpisodeId = null;
        vodResumeTargetSec = 0;
        vodResumeApplied = false;
        vodLastProgressSaveAt = 0;
        if (vod) {
            currentVodEpisodeId = channel.getAttribute('data-episode') || '';
            var saved = getVodProgress(currentVodEpisodeId);
            if (saved && saved.p >= VOD_PROGRESS_MIN_SEC) {
                vodResumeTargetSec = saved.p;
            }
        }

        if (!url && !assetId) {
            showMessage(isVodMode ? 'No stream URL for this episode yet.' : 'No stream URL for this channel.');
            return;
        }

        if (url && !isPlayableUrl(url) && !assetId) {
            showMessage('This channel cannot play here yet.');
            return;
        }

        playResolvedFullscreen(url, channel);
    }

    function closeFullscreen() {
        if (!isFullscreen) {
            return;
        }

        if (isVodMode) {
            saveCurrentVodProgress(true);
        }

        isFullscreen = false;
        document.body.classList.remove('is-fullscreen');
        stopFullscreenPlayback();
        setVodMode(false);
        currentVodEpisodeId = null;
        vodResumeTargetSec = 0;
        vodResumeApplied = false;
        pendingSubtitleLang = null;
        pendingPreferHlsJs = false;
        resetVodNextUi();

        showMessage('');
        if (playerEl) {
            playerEl.hidden = true;
            playerEl.classList.remove('is-playing');
        }

        setFocus(viewFocus[currentView] || 0, false);
        if (currentView === 'series') {
            refreshEpisodeProgressBars();
        }
        if (currentView === 'vod') {
            refreshSeriesProgressBars();
        }
        if (currentView === 'home') {
            renderHomeContinueWatching();
            bindHomeItems();
            setFocus(Math.min(viewFocus.home || 0, focusableItems.length - 1), false);
        }
        if (currentView === 'live') {
            startSnapshotRefresh();
        }
    }

    window.onload = init;
}());
