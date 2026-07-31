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
    var vodProviderTab = 'kan';
    var vodSearchQuery = '';
    var vodImeOpen = false;
    var vodImeLayout = 'he';
    var vodImeFocusBefore = 0;
    var focusableItems = [];
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
    var vodTimeCurrent = null;
    var vodTimeDuration = null;
    var vodEpisodeLabel = null;
    var vodNextBtn = null;
    var vodSeeking = false;
    var vodDurationMs = 0;
    var vodHideTimer = null;
    var vodEpisodeLabelTimer = null;
    var vodNextPromptVisible = false;
    var vodNextIsLast = false;
    var VOD_SEEK_STEP_SEC = 10;
    var VOD_CONTROLS_HIDE_MS = 3000;
    var VOD_NEXT_PROMPT_SEC = 20;
    var VOD_EPISODE_LABEL_MS = 5000;
    var VOD_PROGRESS_KEY = 'isrtv_vod_progress';
    var VOD_PROGRESS_MIN_SEC = 15;
    var VOD_PROGRESS_COMPLETE = 0.92;
    var VOD_PROGRESS_SAVE_MS = 10000;
    var VOD_PROGRESS_MAX = 400;
    var HOME_HUB_COUNT = 3;
    var HOME_CONTINUE_MAX = 20;
    var HOME_CONTINUE_DONE = 0.9;
    var vodProgressCache = null;
    var currentVodEpisodeId = null;
    var vodLastProgressSaveAt = 0;
    var vodResumeTargetSec = 0;
    var vodResumeApplied = false;

    function loadVodProgressMap() {
        if (vodProgressCache) {
            return vodProgressCache;
        }
        try {
            var raw = localStorage.getItem(VOD_PROGRESS_KEY);
            vodProgressCache = raw ? JSON.parse(raw) : {};
            if (!vodProgressCache || typeof vodProgressCache !== 'object') {
                vodProgressCache = {};
            }
        } catch (e) {
            vodProgressCache = {};
        }
        return vodProgressCache;
    }

    function persistVodProgressMap() {
        try {
            localStorage.setItem(VOD_PROGRESS_KEY, JSON.stringify(vodProgressCache || {}));
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
        vodTimeCurrent = document.getElementById('vod-time-current');
        vodTimeDuration = document.getElementById('vod-time-duration');
        vodEpisodeLabel = document.getElementById('vod-episode-label');
        vodNextBtn = document.getElementById('vod-next-btn');
        bindVodControls();
        bindVodSearch();

        showView('home');

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                stopPreview();
                stopFullscreenPlayback();
                stopRadioPlayback();
                stopSnapshotCapture();
            } else if (!isFullscreen) {
                setFocus(viewFocus[currentView] || 0, false);
                if (currentView === 'live') {
                    startSnapshotRefresh();
                }
            }
        });

        document.addEventListener('keydown', onKeyDown);
    }

    function showView(viewName) {
        var views = document.querySelectorAll('.view');
        currentView = viewName;

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
            bindItems(document.getElementById('channels'));
            startSnapshotRefresh();
        } else if (viewName === 'vod') {
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            closeVodIme(false);
            bindVodSearch();
            renderKanboxSeries();
            bindVodItems();
        } else if (viewName === 'radio') {
            stopPreview();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            stopHubVodRotation();
            renderRadioStations();
            bindRadioItems();
        } else if (viewName === 'series') {
            stopPreview();
            stopRadioPlayback();
            stopSnapshotCapture();
            clearAllFrozenPreviews();
            closeSeriesSeasonMenu(false);
            bindSeriesItems();
            // VOD list scroll position otherwise carries over into episodes
            resetPageScroll();
            setFocus(viewFocus.series || 0, false);
            resetPageScroll();
            return;
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

    function seasonFilterLabel(value) {
        if (value === 'all') {
            return 'הכל';
        }
        return 'עונה ' + value;
    }

    function syncSeriesSeasonLabel() {
        var label = document.getElementById('series-season-label');
        if (label) {
            label.textContent = seasonFilterLabel(seriesSeasonFilter);
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
                hydrateNearbyVodImages(index);
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
            seriesSeasonOptions = [{ value: value, label: 'עונה ' + seasonNumbers[0] }];
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
                label: 'עונה ' + seasonNumbers[i]
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
                hydrateNearbyVodImages(index);
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
                hydrateNearbyVodImages(index);
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

    /** Defer poster decode until cards are near focus — eager load of 100+ images freezes Tizen. */
    function makeLazyVodImage(url, alt) {
        var img = document.createElement('img');
        img.className = 'vod-card-img';
        img.alt = alt || '';
        img.setAttribute('data-src', url);
        img.decoding = 'async';
        return img;
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
            img.src = src;
        }
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
        // Smooth glide for row changes — still short enough to stay responsive
        var duration =
            durationMs != null
                ? durationMs
                : Math.min(360, Math.max(240, 200 + Math.abs(delta) * 0.35));

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
            smoothScrollToY(0, 280);
            return;
        }

        if (currentView === 'home') {
            if (item.classList && item.classList.contains('home-continue-card')) {
                try {
                    item.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
                } catch (e) {
                    try {
                        item.scrollIntoView(false);
                    } catch (e2) {}
                }
                // Keep page from drifting too far when focusing the continue row
                var vh = window.innerHeight || 1080;
                var rect = item.getBoundingClientRect();
                if (rect.bottom > vh - 40) {
                    smoothScrollToY(getPageScrollY() + (rect.bottom - (vh - 40)), 220);
                }
            } else {
                smoothScrollToY(0, 280);
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

    function seriesMatchesVodTab(series, tab) {
        var source = (series && series.source) || 'kan';
        if (tab === 'n12') {
            return source === 'mako' || source === 'n12';
        }
        if (tab === 'r13') {
            return source === 'reshet' || source === 'r13';
        }
        // כאן 11 — everything that is not N12/Mako or Reshet 13
        return source !== 'mako' && source !== 'n12' && source !== 'reshet' && source !== 'r13';
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
        var tabs = document.querySelectorAll('.vod-tab');
        Array.prototype.forEach.call(tabs, function (tab) {
            var id = tab.getAttribute('data-vod-tab');
            var active = id === vodProviderTab;
            if (active) {
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
            tab.setAttribute('aria-selected', active ? 'true' : 'false');
        });
    }

    function setVodProviderTab(tab, keepFocusOnTab) {
        if (tab !== 'kan' && tab !== 'n12' && tab !== 'r13') {
            return;
        }
        var changed = vodProviderTab !== tab;
        vodProviderTab = tab;
        syncVodTabUi();
        renderKanboxSeries();
        bindVodItems();
        if (keepFocusOnTab) {
            setFocus(vodTabIndex(tab), false);
        } else if (changed) {
            setFocus(vodHeaderFocusCount(), true);
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
        if (preview) {
            preview.textContent = input ? input.value : '';
        }
    }

    function refreshVodSearchResults(keepImeFocus) {
        var input = document.getElementById('vod-search-input');
        vodSearchQuery = normalizeVodSearch(input ? input.value : '');
        syncVodSearchClearUi();
        updateVodImePreview();
        renderKanboxSeries();

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
        var input = document.getElementById('vod-search-input');
        if (!input) {
            return;
        }
        input.value = (input.value || '') + ch;
        refreshVodSearchResults(true);
    }

    function backspaceVodSearch() {
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
        focusableItems = keys;
        channels = [];
        lastFocusedEl = null;

        keys.forEach(function (item, index) {
            item.onfocus = function () {
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                applyFocusClass(prev, index);
            };
            item.onclick = function () {
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
        if (!current) {
            return;
        }
        // Hebrew rows are direction:rtl — flip left/right to match on-screen order
        if (dx && vodImeLayout === 'he') {
            dx = -dx;
        } else if (dx) {
            // Special action row is always rtl
            var curRow = parseInt(current.getAttribute('data-ime-row'), 10) || 0;
            var letterRows = (getVodImeLayouts()[vodImeLayout] || []).length;
            if (curRow >= letterRows) {
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
        vodImeFocusBefore = viewFocus.vod || vodTabCount();
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
        vodImeOpen = false;
        document.body.classList.remove('is-vod-ime-open');
        if (ime) {
            ime.hidden = true;
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
                if (focusFromCode) {
                    return;
                }
                var prev = focusedIndex;
                focusedIndex = index;
                viewFocus.vod = index;
                applyFocusClass(prev, index);
                ensureFocusedItemVisible(item, true);
                hydrateNearbyVodImages(index);

                var tabId = item.getAttribute('data-vod-tab');
                if (tabId && tabId !== vodProviderTab) {
                    setVodProviderTab(tabId, true);
                    return;
                }
            };

            item.onclick = function () {
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
        var title = document.getElementById('radio-now-title');
        var status = document.getElementById('radio-now-status');
        var visual = document.getElementById('radio-now-visual');
        var eq = document.getElementById('radio-eq');
        var accent = (station && station.accent) || '#6bb3ff';

        if (visual) {
            visual.style.setProperty('--radio-accent', accent);
        }
        if (title) {
            title.textContent = station ? ('עכשיו מתנגן - ' + station.name) : 'Choose station';
        }
        if (status) {
            status.textContent = station ? (statusText || '') : '';
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
        var list = (window.ISRTV_KANBOX || []).filter(function (series) {
            return seriesMatchesVodTab(series, vodProviderTab) && seriesMatchesSearch(series, query);
        });

        if (!container) {
            return;
        }

        syncVodTabUi();
        syncVodSearchClearUi();
        container.innerHTML = '';

        list.forEach(function (series) {
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
            container.appendChild(button);
        });
    }

    function episodeDisplayName(episode) {
        var season = episode.season || 1;
        var chapter = episode.ep || episode.chapter || 0;
        if (chapter) {
            return 'עונה ' + season + ' פרק ' + chapter;
        }
        return episode.name || ('עונה ' + season);
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

        episodes = (series.episodes || []).slice().sort(function (a, b) {
            var sa = a.season || 1;
            var sb = b.season || 1;
            if (sa !== sb) {
                return sb - sa; // newest season first
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
                return b - a;
            });

        populateSeriesSeasonSelect(seasonNumbers);

        if (seriesSeasonFilter === 'all') {
            filtered = episodes;
        } else {
            filtered = episodes.filter(function (episode) {
                return (episode.season || 1) === seriesSeasonFilter;
            });
        }

        var showDividers = true;
        var lastSeason = null;
        var seasonOrdinal = -1;
        var seasonEpIndex = 0;

        for (i = 0; i < filtered.length; i++) {
            (function (episode) {
                var season = episode.season || 1;
                var divider;
                var button;
                var name;
                var epRow;
                var epCol;

                if (season !== lastSeason) {
                    lastSeason = season;
                    seasonOrdinal += 1;
                    seasonEpIndex = 0;
                    if (showDividers) {
                        divider = document.createElement('div');
                        divider.className = 'season-divider';
                        divider.setAttribute('aria-hidden', 'true');
                        divider.textContent = 'עונה ' + season;
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
                button.setAttribute('data-ep-row', String(epRow));
                button.setAttribute('data-ep-col', String(epCol));
                if (episode.assetId) {
                    button.setAttribute('data-asset-id', String(episode.assetId));
                }
                if (episode.streamResolve) {
                    button.setAttribute('data-stream-resolve', episode.streamResolve);
                }

                var inner = document.createElement('span');
                inner.className = 'vod-card-inner';

                if (episode.imageURL) {
                    inner.appendChild(makeLazyVodImage(episode.imageURL, ''));
                }

                var gradient = document.createElement('span');
                gradient.className = 'vod-card-gradient';
                inner.appendChild(gradient);

                name = document.createElement('span');
                name.className = 'vod-card-name';
                name.textContent = episodeDisplayName(episode);
                name.setAttribute('dir', 'auto');
                inner.appendChild(name);

                inner.appendChild(makeEpisodeProgressBar(episode.id));

                button.appendChild(inner);
                container.appendChild(button);
            })(filtered[i]);
        }
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

        if (action === 'home') {
            showView('home');
            return;
        }

        if (action === 'live') {
            viewFocus.home = focusedIndex;
            viewFocus.live = 0;
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
            // Land on first series card (tabs + search are above)
            viewFocus.vod = vodHeaderFocusCount();
            showView('vod');
            return;
        }

        if (action === 'vod-tab') {
            var tab = item.getAttribute('data-vod-tab');
            setVodProviderTab(tab, true);
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
            if (!series) {
                return;
            }
            viewFocus.vod = focusedIndex;
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
        if (seriesSeasonMenuOpen) {
            closeSeriesSeasonMenu(true);
            return;
        }
        if (currentView === 'series') {
            showView('vod');
            return;
        }
        if (currentView === 'live' || currentView === 'vod' || currentView === 'radio') {
            showView('home');
            return;
        }
        if (typeof tizen !== 'undefined' && tizen.application) {
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
                    updateVodTimeLabels((Number(vodSeek.value) / 1000) * duration, duration);
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
        revealVodControls();
        showVodEpisodeLabel();
        applyVodResumeIfNeeded();
        updateVodProgress();
        syncVodPlayPauseUi();
        updateVodNextPrompt();
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
                if (name === 'data-action') {
                    return 'play';
                }
                return '';
            }
        };
    }

    function clearVodEpisodeLabelTimer() {
        if (vodEpisodeLabelTimer) {
            clearTimeout(vodEpisodeLabelTimer);
            vodEpisodeLabelTimer = null;
        }
    }

    function showVodEpisodeLabel() {
        var info = getCurrentVodEpisodeInfo();
        if (!vodEpisodeLabel || !info || !info.episode) {
            if (vodEpisodeLabel) {
                vodEpisodeLabel.hidden = true;
                vodEpisodeLabel.textContent = '';
            }
            return;
        }
        vodEpisodeLabel.textContent = episodeDisplayName(info.episode);
        vodEpisodeLabel.hidden = false;
        clearVodEpisodeLabelTimer();
        vodEpisodeLabelTimer = setTimeout(function () {
            vodEpisodeLabelTimer = null;
            // Keep label if next prompt is up; otherwise hide with normal controls flow
            if (!vodNextPromptVisible && vodEpisodeLabel) {
                vodEpisodeLabel.hidden = true;
            }
        }, VOD_EPISODE_LABEL_MS);
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

    function hideVodNextPrompt() {
        vodNextPromptVisible = false;
        vodNextIsLast = false;
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
        clearVodEpisodeLabelTimer();
        if (vodEpisodeLabel) {
            vodEpisodeLabel.hidden = true;
            vodEpisodeLabel.textContent = '';
        }
    }

    function showVodNextPrompt(isLast) {
        if (!vodNextBtn) {
            return;
        }
        vodNextIsLast = !!isLast;
        vodNextPromptVisible = true;
        vodNextBtn.textContent = isLast ? 'סיום העונה' : 'לפרק הבא';
        vodNextBtn.hidden = false;
        if (vodEpisodeLabel && !vodEpisodeLabel.hidden) {
            // keep episode label on the left while next prompt shows
        }
        revealVodControls();
        clearVodHideTimer();
        focusVodNextBtn();
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
        if (remaining <= VOD_NEXT_PROMPT_SEC && remaining >= 0) {
            var next = getNextVodEpisode();
            showVodNextPrompt(!next);
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

    function updateVodProgress(currentSec, durationSec) {
        if (!isVodMode) {
            return;
        }
        durationSec = durationSec || getVodDurationSec();
        currentSec = typeof currentSec === 'number' ? currentSec : getVodCurrentSec();
        updateVodTimeLabels(currentSec, durationSec);
        if (vodSeek && !vodSeeking && durationSec > 0) {
            vodSeek.value = String(Math.round((currentSec / durationSec) * 1000));
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

        if (!container) {
            return;
        }

        clearAllFrozenPreviews();
        container.innerHTML = '';

        list.forEach(function (item, idx) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'vod-card live-card channel';
            button.setAttribute('data-channel', item.id);
            button.setAttribute('data-url', item.streamURL || '');
            button.setAttribute('data-image', item.imageName || '');
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

    function onKeyDown(e) {
        if (isFullscreen) {
            if (e.keyCode === 10009 || e.keyCode === 27) {
                closeFullscreen();
                e.preventDefault();
                return;
            }

            if (isVodMode) {
                switch (e.keyCode) {
                    case 13: // OK
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
                        revealVodControls();
                        toggleVodPlayPause();
                        e.preventDefault();
                        break;
                    case 37: // LEFT seek back
                        revealVodControls();
                        seekVodBy(-VOD_SEEK_STEP_SEC);
                        e.preventDefault();
                        break;
                    case 39: // RIGHT seek forward
                        revealVodControls();
                        seekVodBy(VOD_SEEK_STEP_SEC);
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            }
            return;
        }

        switch (e.keyCode) {
            case 37:
                moveFocus(-1, 0);
                e.preventDefault();
                break;
            case 38:
                moveFocus(0, -1);
                e.preventDefault();
                break;
            case 39:
                moveFocus(1, 0);
                e.preventDefault();
                break;
            case 40:
                moveFocus(0, 1);
                e.preventDefault();
                break;
            case 13:
                activateItem(focusableItems[focusedIndex]);
                e.preventDefault();
                break;
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
        if (nextRow < 0 || nextRow > maxRow) {
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
            if (dy < 0 && header) {
                setFocus(0, true);
                return;
            }
            targetSeason = pos.season + dy;
            if (dy > 0) {
                targetRow = 0;
            } else {
                targetRow = seasonMaxRow(targetSeason);
            }
            if (targetRow < 0) {
                return;
            }
            nextIndex = findEpisodeClosestCol(targetSeason, targetRow, pos.col);
        }

        if (nextIndex < 0) {
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

        if (focusedIndex < tabs) {
            if (dy > 0) {
                setFocus(searchIndex, true);
                return;
            }
            if (dy < 0) {
                return;
            }
            var nextTab = focusedIndex + dx;
            if (nextTab >= 0 && nextTab < tabs) {
                setFocus(nextTab, false);
            }
            return;
        }

        if (focusedIndex === searchIndex || focusedIndex === clearIndex) {
            if (dy < 0) {
                setFocus(vodTabIndex(vodProviderTab), true);
                return;
            }
            if (dy > 0) {
                if (items.length > header) {
                    setFocus(header, true);
                }
                return;
            }
            if (focusedIndex === searchIndex && dx < 0) {
                if (vodSearchQuery) {
                    setFocus(clearIndex, false);
                }
                return;
            }
            if (focusedIndex === clearIndex && dx > 0) {
                setFocus(searchIndex, false);
            }
            return;
        }

        var cardIndex = focusedIndex - header;
        var cardCount = items.length - header;
        if (cardCount <= 0) {
            if (dy < 0 || dx !== 0) {
                setFocus(searchIndex, true);
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
            setFocus(searchIndex, true);
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

    function setFocus(index, allowScroll) {
        var items = focusableItems;
        var prev;
        if (!items.length) {
            return;
        }
        if (index < 0 || index >= items.length) {
            index = 0;
        }
        prev = focusedIndex;
        focusedIndex = index;
        viewFocus[currentView] = index;
        applyFocusClass(prev, index);

        focusFromCode = true;
        try {
            items[index].focus();
        } catch (e) {}
        focusFromCode = false;

        ensureFocusedItemVisible(items[index], !!allowScroll);
        if (currentView === 'vod' || currentView === 'series' || currentView === 'home') {
            hydrateNearbyVodImages(index);
        }
        if (currentView === 'live') {
            schedulePreview(items[index]);
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

        resolveMakoPlayUrl(url, function (err, playUrl) {
            if (err) {
                console.warn('Mako resolve failed:', err);
                showMessage(playFailLabel(err));
                return;
            }
            playFullscreen(playUrl || url);
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
            if (!ok) {
                showMessage('VOD proxy is not running on your PC. On the Mac run: node scripts/vod-cors-proxy.js');
                return;
            }
            usingAvplayPlayback = false;
            setAvplayOverlay(false);
            // Use original geo URL — proxy follows redirects and rewrites playlists
            playWithHtmlVideo(vodProxyUrl(url), generation);
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

    // KanBox VOD: CMAF/fMP4 HLS with demuxed audio
    function isFmp4HlsUrl(url) {
        var lower = (url || '').toLowerCase();
        return lower.indexOf('fmp4') !== -1 ||
            lower.indexOf('/manifest.ism/playlist') !== -1 ||
            lower.indexOf('fragment.mp4') !== -1;
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
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            });
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
        clearVodHideTimer();
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
            vodSeek.value = '0';
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
            // Rotate CDN edge and retry on network failures (bad/stale edge node)
            if (edgeRetriesLeft > 0 && data && data.type === 'networkError') {
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
            if (!isProxiedUrl(url) && isHlsUrl(url) && !isVodMode) {
                settled = true;
                clearAvplayWatchdog();
                console.warn('Native video failed, trying proxy/hls.js:', msg);
                playLiveViaProxy(url, generation, function () {
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
        if (isHlsUrl(url) && !isProxiedUrl(url) && (!isVodMode || isMakoVodUrl(url))) {
            playLiveViaProxy(url, generation, function () {
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

        // Live TS → AVPlay. Kan fMP4 VOD on TV → hls.js via LAN CORS proxy.
        if (isHlsUrl(url)) {
            if (hasAvplay() && isFmp4HlsUrl(url)) {
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
            action === 'vod-search' || action === 'vod-search-clear' || action === 'series-season' ||
            action === 'series-season-option' || action === 'vod-ime-char' || action === 'vod-ime-space' ||
            action === 'vod-ime-backspace' || action === 'vod-ime-layout' || action === 'vod-ime-done') {
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
