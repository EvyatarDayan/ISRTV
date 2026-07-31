/* Radio stations mirrored from TVTime RadioView.swift */
window.ISRTV_RADIO = [
    {
        id: 'galgalatz',
        name: 'גלגלצ',
        streamURL: 'https://glzwizzlv.bynetcdn.com/glglz_mp3',
        imageName: 'galgalatz',
        imageURL: 'images/radio/galgalatz.png',
        accent: '#5b2c8a'
    },
    {
        id: 'galey-tzahal',
        name: 'גלי צה"ל',
        streamURL: 'https://glzwizzlv.bynetcdn.com/glz_mp3?awCollectionId=misc&awEpisodeId=glz',
        imageName: 'galey_tzahal',
        imageURL: 'images/radio/galey_tzahal.jpg',
        accent: '#1a2a6c'
    },
    {
        id: 'radio88',
        name: 'רדיו 88',
        streamURL: 'https://29073.live.streamtheworld.com/KAN_88.mp3',
        imageName: 'radio88',
        imageURL: 'images/radio/radio88.jpg',
        accent: '#9b2d8e'
    },
    {
        id: 'radio-tel-aviv',
        name: 'רדיו תל אביב',
        streamURL: 'https://102.livecdn.biz/102fm_aac',
        imageName: 'radio_tel_aviv',
        imageURL: 'images/radio/radio_tel_aviv.png',
        accent: '#e10600'
    },
    {
        id: 'radio103',
        name: 'רדיו 103',
        streamURL: 'https://cdn.cybercdn.live/103FM/Live/icecast.audio',
        imageName: 'radio103',
        imageURL: 'images/radio/radio103.png',
        accent: '#c1121f'
    },
    {
        id: 'radius',
        name: 'רדיוס 100',
        streamURL: 'https://cdn.cybercdn.live/Radios_100FM/Audio/icecast.audio',
        imageName: 'radius',
        imageURL: 'images/radio/radius.png',
        accent: '#1e6fd9'
    },
    {
        id: 'gimel',
        name: 'רשת גימל',
        streamURL: 'https://27873.live.streamtheworld.com/KAN_GIMMEL.mp3?dist=radio2net',
        imageName: 'gimel',
        imageURL: 'images/radio/gimel.jpg',
        accent: '#f25c05'
    },
    {
        id: 'eco99',
        name: 'אקו 99',
        streamURL: 'https://eco01.livecdn.biz/ecolive/99fm_aac/icecast.audio',
        imageName: 'eco99',
        imageURL: 'images/radio/eco99.jpg',
        accent: '#5b2c8a'
    }
];

/* Channel list mirrored from TVTime IsraelView.swift */
window.ISRTV_CHANNELS = [
    {
        id: 'kan11',
        name: 'כאן 11',
        streamURL: 'https://r.cdn.avcom-bezeq.tv/webcache/redge-il/livehls/oil/kancdn-live/live/kan11/live.livx/playlist.m3u8',
        imageName: 'kan11',
        placeholder: 'כאן 11'
    },
    {
        id: 'reshet13',
        name: 'רשת 13',
        streamURL: 'https://d2xg1g9o5vns8m.cloudfront.net/out/v1/0855d703f7d5436fae6a9c7ce8ca5075/index.m3u8',
        imageName: 'reshet13',
        placeholder: 'רשת 13'
    },
    {
        id: 'now14',
        name: 'עכשיו 14',
        streamURL: 'https://n-121-5.il.cdn-redge.media/livehls/oil/ch14/live/ch14/live.livx/playlist.m3u8',
        imageName: 'C14',
        placeholder: 'עכשיו 14'
    },
    {
        id: 'reshet-comedy',
        name: 'רשת קומדיות',
        // MediaPackage master — not profileManifest (huge sliding window + SCTE breaks AVPlay/native demux)
        streamURL: 'https://d15ds134q59udk.cloudfront.net/out/v1/fbba879221d045598540ee783b140fe2/index.m3u8',
        imageName: 'reshet13',
        placeholder: 'רשת קומדיות'
    },
    {
        id: 'reshet-reality',
        name: 'רשת ראליטי',
        streamURL: 'https://d2dffl3588mvfk.cloudfront.net/out/v1/d8e15050ca4148aab0ee387a5e2eb46b/index.m3u8',
        imageName: 'reshet13',
        placeholder: 'רשת ראליטי'
    },
    {
        id: 'chinuchit',
        name: 'חינוכית',
        streamURL: 'https://r.il.cdn-redge.media/livehls/oil/kancdn-live/live/kan_edu/live.livx/playlist.m3u8?renditions&fmp4',
        imageName: 'check1',
        placeholder: 'חינוכית'
    },
    {
        id: 'kneset',
        name: 'ערוץ הכנסת',
        streamURL: 'https://kneset.gostreaming.tv/p2-kneset/_definst_/myStream/chunklist.m3u8',
        imageName: 'kneset',
        placeholder: 'ערוץ הכנסת'
    },
    {
        id: 'i24',
        name: 'i24 NEWS',
        streamURL: 'https://i24newshebrew-cdn.encoders.immergo.tv/master.m3u8',
        imageName: 'I24NEWS',
        placeholder: 'i24 NEWS'
    },
    {
        id: 'channel24',
        name: 'ערוץ 24',
        streamURL: 'https://mako-streaming.akamaized.net/evrideo/hls/live/20001278/ch24live/index.m3u8',
        imageURL: 'images/live/channel24.png',
        imageName: 'channel24',
        placeholder: 'ערוץ 24'
    }
];

/* KanBox VOD catalog */
window.ISRTV_KANBOX = [
    {
        id: 'haramon',
        name: 'הרמון',
        placeholder: 'הרמון',
        imageURL: 'images/kanbox/haramon/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'haramon-ep1',
                season: 1,
                ep: 1,
                name: 'הרמון, עונה 1, פרק 1: בכורה',
                streamURL: '',
                assetId: '2025619',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'haramon-ep2',
                season: 1,
                ep: 2,
                name: 'הרמון, עונה 1, פרק 2: משפחה חדשה',
                streamURL: '',
                assetId: '2025618',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'haramon-ep3',
                season: 1,
                ep: 3,
                name: 'הרמון, עונה 1, פרק 3: התקשורת מתגייסת',
                streamURL: '',
                assetId: '2025620',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'haramon-ep4',
                season: 1,
                ep: 4,
                name: 'הרמון, עונה 1, פרק 4: המצלמה חושפת את ההרמון',
                streamURL: '',
                assetId: '2025622',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'haramon-ep5',
                season: 1,
                ep: 5,
                name: 'הרמון, עונה 1, פרק 5: בחירה גורלית',
                streamURL: '',
                assetId: '2025617',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'haramon-ep6',
                season: 1,
                ep: 6,
                name: 'הרמון, עונה 1, פרק 6: ההרמון מתחיל להתפורר?',
                streamURL: '',
                assetId: '2015396',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'haramon-ep7',
                season: 1,
                ep: 7,
                name: 'הרמון, עונה 1, פרק 7: אויבת מבפנים',
                streamURL: '',
                assetId: '2015414',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'haramon-ep8',
                season: 1,
                ep: 8,
                name: 'הרמון, עונה 1, פרק 8: כל החלקים מתחברים, פרק סיום העונה',
                streamURL: '',
                assetId: '2015410',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'haramon-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — ההרמון נחשף: מאחורי הקלעים של סדרת הדרמה',
                streamURL: '',
                assetId: '2015402',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haramon/s1-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
    {
        id: 'ha-maabara',
        name: 'המעברה',
        placeholder: 'המעברה',
        imageURL: 'images/kanbox/ha-maabara/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'ha-maabara-ep1',
                season: 1,
                ep: 1,
                name: 'המעברה, עונה 1, פרק 1: ארץ חדשה',
                streamURL: '',
                assetId: '4315562',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'ha-maabara-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — המעברה, עונה 1: מאחורי הקלעים של הסדרה',
                streamURL: '',
                assetId: '4314033',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'ha-maabara-ep3',
                season: 1,
                ep: 3,
                name: 'המעברה, עונה 1, פרק 2: הכול סוכר',
                streamURL: '',
                assetId: '4324183',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'ha-maabara-ep4',
                season: 1,
                ep: 4,
                name: 'המעברה, עונה 1, פרק 3: סרט קולנוע',
                streamURL: '',
                assetId: '4332392',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'ha-maabara-ep5',
                season: 1,
                ep: 5,
                name: 'המעברה, עונה 1, פרק 4: ברוך רופא חולים',
                streamURL: '',
                assetId: '4349097',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'ha-maabara-ep6',
                season: 1,
                ep: 6,
                name: 'המעברה, עונה 1, פרק 5: רחמים המציל',
                streamURL: '',
                assetId: '4356875',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'ha-maabara-ep7',
                season: 1,
                ep: 7,
                name: 'המעברה, עונה 1, פרק 6: הולך בתל"ם',
                streamURL: '',
                assetId: '4369559',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'ha-maabara-ep8',
                season: 1,
                ep: 8,
                name: 'המעברה, עונה 1, פרק 7: בינגו',
                streamURL: '',
                assetId: '4381208',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'ha-maabara-ep9',
                season: 1,
                ep: 9,
                name: 'המעברה, עונה 1, פרק 8: תחרות תחפושות',
                streamURL: '',
                assetId: '4386697',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'ha-maabara-ep10',
                season: 1,
                ep: 10,
                name: 'המעברה, עונה 1, פרק 9: בחירתה של סופי',
                streamURL: '',
                assetId: '4389919',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'ha-maabara-ep11',
                season: 1,
                ep: 11,
                name: 'המעברה, עונה 1, פרק 10: ספיישל סצנות אהובות',
                streamURL: '',
                assetId: '4408252',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ha-maabara/s1-ep11.jpg',
                placeholder: '11'
            }
        ]
    },
    {
        id: 'wart',
        name: 'ווארט',
        placeholder: 'ווארט',
        imageURL: 'images/kanbox/wart/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'wart-s1-ep1',
                season: 1,
                ep: 1,
                name: 'ווארט, עונה 1, פרק 1: פרק הבכורה',
                streamURL: '',
                assetId: '3011083',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'wart-s1-ep2',
                season: 1,
                ep: 2,
                name: 'ווארט, עונה 1, פרק 2: פגישה חלומית',
                streamURL: '',
                assetId: '3021883',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'wart-s1-ep3',
                season: 1,
                ep: 3,
                name: 'ווארט, עונה 1, פרק 3: האם יש ווארט?',
                streamURL: '',
                assetId: '3036177',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'wart-s1-ep4',
                season: 1,
                ep: 4,
                name: 'ווארט, עונה 1, פרק 4: נשמה',
                streamURL: '',
                assetId: '3037823',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'wart-s1-ep5',
                season: 1,
                ep: 5,
                name: 'ווארט, עונה 1, פרק 5: ההחלטה של גיל וליאת',
                streamURL: '',
                assetId: '3046328',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'wart-s1-ep6',
                season: 1,
                ep: 6,
                name: 'ווארט, עונה 1, פרק 6: ההחלטה הגורלית',
                streamURL: '',
                assetId: '3080255',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'wart-s1-ep7',
                season: 1,
                ep: 7,
                name: 'ווארט, עונה 1, פרק 7: אתגר חסידות גור',
                streamURL: '',
                assetId: '3090723',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'wart-s1-ep8',
                season: 1,
                ep: 8,
                name: 'ווארט, עונה 1, פרק 8: עולמות הפוכים נפגשים',
                streamURL: '',
                assetId: '3107778',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'wart-s1-ep9',
                season: 1,
                ep: 9,
                name: 'ווארט, עונה 1, פרק 9: רגע לפני החתונה',
                streamURL: '',
                assetId: '3122216',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'wart-s1-ep10',
                season: 1,
                ep: 10,
                name: 'ווארט, עונה 1, פרק 10: החתונה, פרק הסיום',
                streamURL: '',
                assetId: '3138865',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'wart-s1-ep11',
                season: 1,
                ep: 11,
                name: 'ווארט, עונה 1, פרק 11: היום שאחרי',
                streamURL: '',
                assetId: '3314462',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'wart-s2-ep1',
                season: 2,
                ep: 1,
                name: 'ווארט, עונה 2, פרק 1: פרק הבכורה',
                streamURL: '',
                assetId: '4103494',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'wart-s2-ep2',
                season: 2,
                ep: 2,
                name: 'ווארט, עונה 2, פרק 2: הזדמנות נוספת לאהבה',
                streamURL: '',
                assetId: '4106696',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'wart-s2-ep3',
                season: 2,
                ep: 3,
                name: 'ווארט, עונה 2, פרק 3: הסוד של הלל',
                streamURL: '',
                assetId: '4108229',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'wart-s2-ep4',
                season: 2,
                ep: 4,
                name: 'ווארט, עונה 2, פרק 4: אהבה בסכנה',
                streamURL: '',
                assetId: '4113119',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'wart-s2-ep5',
                season: 2,
                ep: 5,
                name: 'ווארט, עונה 2, פרק 5: שידוך לתאומות',
                streamURL: '',
                assetId: '4115104',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'wart-s2-ep6',
                season: 2,
                ep: 6,
                name: 'ווארט, עונה 2, פרק 6: דייט עם אימא',
                streamURL: '',
                assetId: '4118534',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'wart-s2-ep7',
                season: 2,
                ep: 7,
                name: 'ווארט, עונה 2, פרק 7: האם ייסגר ווארט?',
                streamURL: '',
                assetId: '4124949',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'wart-s2-ep8',
                season: 2,
                ep: 8,
                name: 'ווארט, עונה 2, פרק 8: הדייט שיצא משליטה',
                streamURL: '',
                assetId: '4147071',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'wart-s2-ep9',
                season: 2,
                ep: 9,
                name: 'ווארט, עונה 2, פרק 9: השידוך שהסתבך',
                streamURL: '',
                assetId: '4154418',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'wart-s2-ep10',
                season: 2,
                ep: 10,
                name: 'ווארט, עונה 2, פרק 10: מכשול אחרון לווארט',
                streamURL: '',
                assetId: '4159573',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'wart-s2-ep11',
                season: 2,
                ep: 11,
                name: 'ווארט, עונה 2, פרק 11: הסוף של הלל ויעקב?',
                streamURL: '',
                assetId: '4165894',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'wart-s2-ep12',
                season: 2,
                ep: 12,
                name: 'ווארט, עונה 2, פרק 12: השידוך שכולם ידברו עליו',
                streamURL: '',
                assetId: '4168248',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'wart-s2-ep13',
                season: 2,
                ep: 13,
                name: 'ווארט, עונה 2, פרק 13: המפגש שהסעיר את אסתר',
                streamURL: '',
                assetId: '4174161',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'wart-s2-ep14',
                season: 2,
                ep: 14,
                name: 'ווארט, עונה 2, פרק 14: האמבוש שנגמר בדרמה',
                streamURL: '',
                assetId: '4178278',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'wart-s2-ep15',
                season: 2,
                ep: 15,
                name: 'ווארט, עונה 2, פרק 15: הצעת הנישואים של אריאל',
                streamURL: '',
                assetId: '4185763',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'wart-s2-ep16',
                season: 2,
                ep: 16,
                name: 'ווארט, עונה 2, פרק 16: ההחלטה של אביגיל ומשה',
                streamURL: '',
                assetId: '4188827',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'wart-s2-ep17',
                season: 2,
                ep: 17,
                name: 'ווארט, עונה 2, פרק 17: הצעת נישואים מפתיעה',
                streamURL: '',
                assetId: '4197188',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'wart-s2-ep18',
                season: 2,
                ep: 18,
                name: 'ווארט, עונה 2, פרק 18: החתונה של שימי ואדל',
                streamURL: '',
                assetId: '4199940',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'wart-s2-ep19',
                season: 2,
                ep: 19,
                name: 'ווארט, עונה 2, פרק 19: הטעות של משה',
                streamURL: '',
                assetId: '4205634',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'wart-s2-ep20',
                season: 2,
                ep: 20,
                name: 'ווארט, עונה 2, פרק 20: האם יצילו את הווארט?',
                streamURL: '',
                assetId: '4209927',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'wart-s2-ep21',
                season: 2,
                ep: 21,
                name: 'ווארט, עונה 2, פרק 21: החתונה של אסתר ואריאל',
                streamURL: '',
                assetId: '4215307',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'wart-s2-ep22',
                season: 2,
                ep: 22,
                name: 'ווארט, עונה 2, פרק 22: פרק סיום העונה',
                streamURL: '',
                assetId: '4217991',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/wart/s2-ep22.jpg',
                placeholder: '22'
            }
        ]
    },
    {
        id: 'shnot-ha-80',
        name: 'שנות ה-80',
        placeholder: 'שנות ה-80',
        imageURL: 'images/kanbox/shnot-ha-80/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'shnot-ha-80-s1-ep1',
                season: 1,
                ep: 1,
                name: 'שנות ה-80, עונה 1, פרק 1: חלום ילדות',
                streamURL: '',
                assetId: '2025529',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shnot-ha-80-s1-ep2',
                season: 1,
                ep: 2,
                name: 'שנות ה-80, עונה 1, פרק 2: מירוץ הטלויזיות הגדול',
                streamURL: '',
                assetId: '2025531',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shnot-ha-80-s1-ep3',
                season: 1,
                ep: 3,
                name: 'שנות ה-80, עונה 1, פרק 3: סיפור אהבה בלתי נשכח',
                streamURL: '',
                assetId: '2025535',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shnot-ha-80-s1-ep4',
                season: 1,
                ep: 4,
                name: 'שנות ה-80, עונה 1, פרק 4: קוביות מזל',
                streamURL: '',
                assetId: '2015551',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shnot-ha-80-s1-ep5',
                season: 1,
                ep: 5,
                name: 'שנות ה-80, עונה 1, פרק 5: ליכוד או מערך',
                streamURL: '',
                assetId: '2025532',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shnot-ha-80-s1-ep6',
                season: 1,
                ep: 6,
                name: 'שנות ה-80, עונה 1, פרק 6: לו הייתי רוטשילד',
                streamURL: '',
                assetId: '2025536',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shnot-ha-80-s1-ep7',
                season: 1,
                ep: 7,
                name: 'שנות ה-80, עונה 1, פרק 7: חוסר אחריות',
                streamURL: '',
                assetId: '2025537',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shnot-ha-80-s1-ep8',
                season: 1,
                ep: 8,
                name: 'שנות ה-80, עונה 1, פרק 8: צרות בגן עדן',
                streamURL: '',
                assetId: '2025533',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'shnot-ha-80-s1-ep9',
                season: 1,
                ep: 9,
                name: 'שנות ה-80, עונה 1, פרק 9: צו ראשון',
                streamURL: '',
                assetId: '2025534',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'shnot-ha-80-s1-ep10',
                season: 1,
                ep: 10,
                name: 'שנות ה-80, עונה 1, פרק 10: תרנגול כפרות',
                streamURL: '',
                assetId: '2025541',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'shnot-ha-80-s1-ep11',
                season: 1,
                ep: 11,
                name: 'שנות ה-80, עונה 1, פרק 11: המשחק שיצא משליטה',
                streamURL: '',
                assetId: '2025539',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'shnot-ha-80-s1-ep12',
                season: 1,
                ep: 12,
                name: 'שנות ה-80, עונה 1, פרק 12: על קוצים',
                streamURL: '',
                assetId: '2025540',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'shnot-ha-80-s1-ep13',
                season: 1,
                ep: 13,
                name: 'שנות ה-80, עונה 1, פרק 13: מי שמחבק - משלם',
                streamURL: '',
                assetId: '2025544',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'shnot-ha-80-s2-ep1',
                season: 2,
                ep: 1,
                name: 'שנות ה-80, עונה 2, פרק 1: האורגן',
                streamURL: '',
                assetId: '2025518',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shnot-ha-80-s2-ep2',
                season: 2,
                ep: 2,
                name: 'שנות ה-80, עונה 2, פרק 2: בלאגן בסוכה',
                streamURL: '',
                assetId: '2025519',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shnot-ha-80-s2-ep3',
                season: 2,
                ep: 3,
                name: 'שנות ה-80, עונה 2, פרק 3: בלי עין הרע',
                streamURL: '',
                assetId: '2025517',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shnot-ha-80-s2-ep4',
                season: 2,
                ep: 4,
                name: 'שנות ה-80, עונה 2, פרק 4: משולש רומנטי',
                streamURL: '',
                assetId: '2025524',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shnot-ha-80-s2-ep5',
                season: 2,
                ep: 5,
                name: 'שנות ה-80, עונה 2, פרק 5: מלחמת הכוכבות',
                streamURL: '',
                assetId: '2025523',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shnot-ha-80-s2-ep6',
                season: 2,
                ep: 6,
                name: 'שנות ה-80, עונה 2, פרק 6: המורה הפרטי',
                streamURL: '',
                assetId: '2025521',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shnot-ha-80-s2-ep7',
                season: 2,
                ep: 7,
                name: 'שנות ה-80, עונה 2, פרק 7: רפורט',
                streamURL: '',
                assetId: '2015546',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shnot-ha-80-s2-ep8',
                season: 2,
                ep: 8,
                name: 'שנות ה-80, עונה 2, פרק 8: פורים שמח',
                streamURL: '',
                assetId: '2025526',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'shnot-ha-80-s2-ep9',
                season: 2,
                ep: 9,
                name: 'שנות ה-80, עונה 2, פרק 9: המורה לספורט',
                streamURL: '',
                assetId: '2025525',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'shnot-ha-80-s2-ep10',
                season: 2,
                ep: 10,
                name: 'שנות ה-80, עונה 2, פרק 10: המתיחה הגדולה',
                streamURL: '',
                assetId: '2025527',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'shnot-ha-80-s2-ep11',
                season: 2,
                ep: 11,
                name: 'שנות ה-80, עונה 2, פרק 11: הקש בדלת',
                streamURL: '',
                assetId: '2025528',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'shnot-ha-80-s2-ep12',
                season: 2,
                ep: 12,
                name: 'שנות ה-80, עונה 2, פרק 12: חוגגים בר מצווה',
                streamURL: '',
                assetId: '2015804',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'shnot-ha-80-s2-ep13',
                season: 2,
                ep: 13,
                name: 'שנות ה-80, עונה 2, פרק 13: ליל הסדר',
                streamURL: '',
                assetId: '2025530',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'shnot-ha-80-s3-ep1',
                season: 3,
                ep: 1,
                name: 'שנות ה-80, עונה 3, פרק 1: האם שלום יחזור בתשובה?',
                streamURL: '',
                assetId: '2025474',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shnot-ha-80-s3-ep2',
                season: 3,
                ep: 2,
                name: 'שנות ה-80, עונה 3, פרק 2: תצא בחוץ',
                streamURL: '',
                assetId: '2025471',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shnot-ha-80-s3-ep3',
                season: 3,
                ep: 3,
                name: 'שנות ה-80, עונה 3, פרק 3: מבצע משה',
                streamURL: '',
                assetId: '2025481',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shnot-ha-80-s3-ep4',
                season: 3,
                ep: 4,
                name: 'שנות ה-80, עונה 3, פרק 4: מלחמת כבלים',
                streamURL: '',
                assetId: '2025472',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shnot-ha-80-s3-ep5',
                season: 3,
                ep: 5,
                name: 'שנות ה-80, עונה 3, פרק 5: כי תבוא',
                streamURL: '',
                assetId: '2025478',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shnot-ha-80-s3-ep6',
                season: 3,
                ep: 6,
                name: 'שנות ה-80, עונה 3, פרק 6: נעולים',
                streamURL: '',
                assetId: '2025482',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shnot-ha-80-s3-ep7',
                season: 3,
                ep: 7,
                name: 'שנות ה-80, עונה 3, פרק 7: חמסין',
                streamURL: '',
                assetId: '2025479',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shnot-ha-80-s3-ep8',
                season: 3,
                ep: 8,
                name: 'שנות ה-80, עונה 3, פרק 8: השבעה',
                streamURL: '',
                assetId: '2025486',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'shnot-ha-80-s3-ep9',
                season: 3,
                ep: 9,
                name: 'שנות ה-80, עונה 3, פרק 9: מיס טירת הכרמל',
                streamURL: '',
                assetId: '2015608',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'shnot-ha-80-s3-ep10',
                season: 3,
                ep: 10,
                name: 'שנות ה-80, עונה 3, פרק 10: עכבר בית',
                streamURL: '',
                assetId: '2025483',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'shnot-ha-80-s3-ep11',
                season: 3,
                ep: 11,
                name: 'שנות ה-80, עונה 3, פרק 11: ריסוס בשכונה',
                streamURL: '',
                assetId: '2025484',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'shnot-ha-80-s3-ep12',
                season: 3,
                ep: 12,
                name: 'שנות ה-80, עונה 3, פרק 12: שבועות',
                streamURL: '',
                assetId: '2015738',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'shnot-ha-80-s3-ep13',
                season: 3,
                ep: 13,
                name: 'שנות ה-80, עונה 3, פרק 13: רצים לדירה',
                streamURL: '',
                assetId: '2025490',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'shnot-ha-80-s3-ep14',
                season: 3,
                ep: 14,
                name: 'שנות ה-80, עונה 3, פרק 14: שנות ה-80 "נעים להזכיר"',
                streamURL: '',
                assetId: '2015631',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s3-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'shnot-ha-80-s4-ep1',
                season: 4,
                ep: 1,
                name: 'שנות ה-80, עונה 4, פרק 1: אהבה ממבט שני',
                streamURL: '',
                assetId: '2025447',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shnot-ha-80-s4-ep2',
                season: 4,
                ep: 2,
                name: 'שנות ה-80, עונה 4, פרק 2: הדשא של השכן',
                streamURL: '',
                assetId: '2025448',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shnot-ha-80-s4-ep3',
                season: 4,
                ep: 3,
                name: 'שנות ה-80, עונה 4, פרק 3: עיתוניש',
                streamURL: '',
                assetId: '2025452',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shnot-ha-80-s4-ep4',
                season: 4,
                ep: 4,
                name: 'שנות ה-80, עונה 4, פרק 4: עבודת שורשים',
                streamURL: '',
                assetId: '2025454',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shnot-ha-80-s4-ep5',
                season: 4,
                ep: 5,
                name: 'שנות ה-80, עונה 4, פרק 5: שערי ועד טוב',
                streamURL: '',
                assetId: '2025450',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shnot-ha-80-s4-ep6',
                season: 4,
                ep: 6,
                name: 'שנות ה-80, עונה 4, פרק 6: התק"ם להניח תפילין?',
                streamURL: '',
                assetId: '2025453',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shnot-ha-80-s4-ep7',
                season: 4,
                ep: 7,
                name: 'שנות ה-80, עונה 4, פרק 7: הקשר הצרפתי',
                streamURL: '',
                assetId: '2025457',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shnot-ha-80-s4-ep8',
                season: 4,
                ep: 8,
                name: 'שנות ה-80, עונה 4, פרק 8: חגורה שחורה',
                streamURL: '',
                assetId: '2015639',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'shnot-ha-80-s4-ep9',
                season: 4,
                ep: 9,
                name: 'שנות ה-80, עונה 4, פרק 9: הצוואה',
                streamURL: '',
                assetId: '2015680',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'shnot-ha-80-s4-ep10',
                season: 4,
                ep: 10,
                name: 'שנות ה-80, עונה 4, פרק 10: צנזורה',
                streamURL: '',
                assetId: '2025461',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'shnot-ha-80-s4-ep11',
                season: 4,
                ep: 11,
                name: 'שנות ה-80, עונה 4, פרק 11: בדיקת ינשוף',
                streamURL: '',
                assetId: '2025459',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'shnot-ha-80-s4-ep12',
                season: 4,
                ep: 12,
                name: 'שנות ה-80, עונה 4, פרק 12: הימור מסוכן',
                streamURL: '',
                assetId: '2025455',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'shnot-ha-80-s4-ep13',
                season: 4,
                ep: 13,
                name: 'שנות ה-80, עונה 4, פרק 13: זוהר המלך',
                streamURL: '',
                assetId: '2025458',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'shnot-ha-80-s4-ep14',
                season: 4,
                ep: 14,
                name: 'שנות ה-80, עונה 4, פרק 14: אזעקת שווא',
                streamURL: '',
                assetId: '2025286',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'shnot-ha-80-s4-ep16',
                season: 4,
                ep: 16,
                name: 'שנות ה-80, עונה 4, פרק 16: היפה והחיה',
                streamURL: '',
                assetId: '2025265',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'shnot-ha-80-s4-ep17',
                season: 4,
                ep: 17,
                name: 'שנות ה-80, עונה 4, פרק 17: מכת פלולות',
                streamURL: '',
                assetId: '2015540',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'shnot-ha-80-s4-ep18',
                season: 4,
                ep: 18,
                name: 'שנות ה-80, עונה 4, פרק 18: איוואן האיום',
                streamURL: '',
                assetId: '2015529',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'shnot-ha-80-s4-ep19',
                season: 4,
                ep: 19,
                name: 'שנות ה-80, עונה 4, פרק 19: עיניים שלי',
                streamURL: '',
                assetId: '2015655',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'shnot-ha-80-s4-ep20',
                season: 4,
                ep: 20,
                name: 'שנות ה-80, עונה 4, פרק 20: שירת הסירנה',
                streamURL: '',
                assetId: '2025464',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'shnot-ha-80-s4-ep21',
                season: 4,
                ep: 21,
                name: 'שנות ה-80, עונה 4, פרק 21: פרק סיום העונה',
                streamURL: '',
                assetId: '2025462',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'shnot-ha-80-s4-ep22',
                season: 4,
                ep: 22,
                name: 'שנות ה-80, עונה 4, פרק 22: פרק פספוסים ללא צנזורה',
                streamURL: '',
                assetId: '2025159',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s4-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'shnot-ha-80-s5-ep1',
                season: 5,
                ep: 1,
                name: 'שנות ה-80, עונה 5, פרק 1: לא בלי ויצ\'ליקו',
                streamURL: '',
                assetId: '2025552',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shnot-ha-80-s5-ep2',
                season: 5,
                ep: 2,
                name: 'שנות ה-80, עונה 5, פרק 2: טירונות',
                streamURL: '',
                assetId: '2025549',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shnot-ha-80-s5-ep3',
                season: 5,
                ep: 3,
                name: 'שנות ה-80, עונה 5, פרק 3: משפחה מיוחדת',
                streamURL: '',
                assetId: '2015664',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shnot-ha-80-s5-ep4',
                season: 5,
                ep: 4,
                name: 'שנות ה-80, עונה 5, פרק 4: עוגמת נופש',
                streamURL: '',
                assetId: '2015660',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shnot-ha-80-s5-ep5',
                season: 5,
                ep: 5,
                name: 'שנות ה-80, עונה 5, פרק 5: המועדונית של מורדי',
                streamURL: '',
                assetId: '2015647',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shnot-ha-80-s5-ep6',
                season: 5,
                ep: 6,
                name: 'שנות ה-80, עונה 5, פרק 6: שלום מתקלט במועדון',
                streamURL: '',
                assetId: '2025013',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shnot-ha-80-s5-ep7',
                season: 5,
                ep: 7,
                name: 'שנות ה-80, עונה 5, פרק 7: ספר השיאים',
                streamURL: '',
                assetId: '2025012',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shnot-ha-80-s5-ep8',
                season: 5,
                ep: 8,
                name: 'שנות ה-80, עונה 5, פרק 8: טלפון שבור',
                streamURL: '',
                assetId: '2025014',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'shnot-ha-80-s5-ep9',
                season: 5,
                ep: 9,
                name: 'שנות ה-80, עונה 5, פרק 9: עסק משותף',
                streamURL: '',
                assetId: '2025023',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'shnot-ha-80-s5-ep10',
                season: 5,
                ep: 10,
                name: 'שנות ה-80, עונה 5, פרק 10: כך הולכים השותלים',
                streamURL: '',
                assetId: '2024991',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'shnot-ha-80-s5-ep11',
                season: 5,
                ep: 11,
                name: 'שנות ה-80, עונה 5, פרק 11: עלילות בית הקשיש',
                streamURL: '',
                assetId: '2024989',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'shnot-ha-80-s5-ep12',
                season: 5,
                ep: 12,
                name: 'שנות ה-80, עונה 5, פרק 12: הדיאטה של פריזר',
                streamURL: '',
                assetId: '2024960',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'shnot-ha-80-s5-ep13',
                season: 5,
                ep: 13,
                name: 'שנות ה80, עונה 5, פרק 13: המימונה',
                streamURL: '',
                assetId: '2024971',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'shnot-ha-80-s5-ep14',
                season: 5,
                ep: 14,
                name: 'שנות ה-80, עונה 5, פרק 14: מלאת אהבה',
                streamURL: '',
                assetId: '2024981',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'shnot-ha-80-s5-ep15',
                season: 5,
                ep: 15,
                name: 'שנות ה-80, עונה 5, פרק 15: אוטו זבל',
                streamURL: '',
                assetId: '2024961',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'shnot-ha-80-s5-ep16',
                season: 5,
                ep: 16,
                name: 'שנות ה-80, עונה 5, פרק 16: מוצא המינים',
                streamURL: '',
                assetId: '2024934',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'shnot-ha-80-s5-ep17',
                season: 5,
                ep: 17,
                name: 'שנות ה-80, עונה 5, פרק 17: מחיר הערק',
                streamURL: '',
                assetId: '2015693',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'shnot-ha-80-s5-ep18',
                season: 5,
                ep: 18,
                name: 'שנות ה-80, עונה 5, פרק 18: שערות סבתא',
                streamURL: '',
                assetId: '2024794',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'shnot-ha-80-s5-ep19',
                season: 5,
                ep: 19,
                name: 'שנות ה-80, עונה 5, פרק 19: הסנדק',
                streamURL: '',
                assetId: '2024786',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'shnot-ha-80-s5-ep20',
                season: 5,
                ep: 20,
                name: 'שנות ה-80, עונה 5, פרק 20: ל"ג בעומר',
                streamURL: '',
                assetId: '2025334',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'shnot-ha-80-s5-ep21',
                season: 5,
                ep: 21,
                name: 'שנות ה-80, עונה 5, פרק 21: הכנסת הספר',
                streamURL: '',
                assetId: '2025317',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'shnot-ha-80-s5-ep22',
                season: 5,
                ep: 22,
                name: 'שנות ה-80, עונה 5, פרק 22: פספוסים',
                streamURL: '',
                assetId: '2025312',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'shnot-ha-80-s5-ep23',
                season: 5,
                ep: 23,
                name: 'שנות ה-80, עונה 5, פרק לקט: מסיבה בשכונה',
                streamURL: '',
                assetId: '2024916',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'shnot-ha-80-s5-ep24',
                season: 5,
                ep: 24,
                name: 'שנות ה-80, עונה 5, פרק 23: ספיישל שחקנים',
                streamURL: '',
                assetId: '2025309',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'shnot-ha-80-s5-ep25',
                season: 5,
                ep: 25,
                name: 'שנות ה-80, עונה 5, פרק 24: המופע של מורדי',
                streamURL: '',
                assetId: '2024912',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'shnot-ha-80-s5-ep26',
                season: 5,
                ep: 26,
                name: 'שנות ה-80, עונה 5, פרק 25: ספיישל משפחת יושבייב',
                streamURL: '',
                assetId: '2025323',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep26.jpg',
                placeholder: '26'
            },
            {
                id: 'shnot-ha-80-s5-ep27',
                season: 5,
                ep: 27,
                name: 'שנות ה-80, עונה 5, פרק 26: ספיישל משפחת עובדיה',
                streamURL: '',
                assetId: '2025311',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/shnot-ha-80/s5-ep27.jpg',
                placeholder: '27'
            }
        ]
    },
    {
        id: 'blackspace',
        name: 'בלקספייס',
        placeholder: 'בלקספייס',
        imageURL: 'images/kanbox/blackspace/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'blackspace-ep1',
                season: 1,
                ep: 1,
                name: 'בלקספייס, עונה 1, פרק 1: פרק הבכורה',
                streamURL: '',
                assetId: '2026815',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'blackspace-ep2',
                season: 1,
                ep: 2,
                name: 'בלקספייס, עונה 1, פרק 2: החקירה מתחילה',
                streamURL: '',
                assetId: '2026818',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'blackspace-ep3',
                season: 1,
                ep: 3,
                name: 'בלקספייס, עונה 1, פרק 3: הבלקספייס נחשף',
                streamURL: '',
                assetId: '2026821',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'blackspace-ep4',
                season: 1,
                ep: 4,
                name: 'בלקספייס, עונה 1, פרק 4: המעצרים מתחילים',
                streamURL: '',
                assetId: '2026824',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'blackspace-ep5',
                season: 1,
                ep: 5,
                name: 'בלקספייס, עונה 1, פרק 5: המתיחות בתיכון גוברת ודוידי מאבד שליטה',
                streamURL: '',
                assetId: '2026832',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'blackspace-ep6',
                season: 1,
                ep: 6,
                name: 'בלקספייס, עונה 1, פרק 6: אסון נוסף נופל על התיכון ומשנה את התמונה',
                streamURL: '',
                assetId: '2015820',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'blackspace-ep7',
                season: 1,
                ep: 7,
                name: 'בלקספייס, עונה 1, פרק 7: המעשה ששפך אור על הפרשה',
                streamURL: '',
                assetId: '2015778',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'blackspace-ep8',
                season: 1,
                ep: 8,
                name: 'בלקספייס, עונה 1, פרק 8: פרק סיום עוצר נשימה',
                streamURL: '',
                assetId: '2026860',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/blackspace/s1-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
    {
        id: 'ehad-haam-1',
        name: 'אחד העם 1',
        placeholder: 'אחד העם 1',
        imageURL: 'images/kanbox/ehad-haam-1/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'ehad-haam-1-s1-ep1',
                season: 1,
                ep: 1,
                name: 'אחד העם 1, עונה 1, פרק 1: יום הבוחר',
                streamURL: '',
                assetId: '2163199',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'ehad-haam-1-s1-ep2',
                season: 1,
                ep: 2,
                name: 'אחד העם 1, עונה 1, פרק 2: דייר חדש',
                streamURL: '',
                assetId: '2163205',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'ehad-haam-1-s1-ep3',
                season: 1,
                ep: 3,
                name: 'אחד העם 1, עונה 1,  פרק 3: החתול',
                streamURL: '',
                assetId: '2163201',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'ehad-haam-1-s1-ep4',
                season: 1,
                ep: 4,
                name: 'אחד העם 1, עונה 1, פרק 4: שקט בבקשה',
                streamURL: '',
                assetId: '2163202',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'ehad-haam-1-s1-ep5',
                season: 1,
                ep: 5,
                name: 'אחד העם 1, עונה 1, פרק 5: הביוב עולה',
                streamURL: '',
                assetId: '2163203',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'ehad-haam-1-s1-ep6',
                season: 1,
                ep: 6,
                name: 'אחד העם 1, עונה 1, פרק 6: המעלית',
                streamURL: '',
                assetId: '2163208',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'ehad-haam-1-s1-ep7',
                season: 1,
                ep: 7,
                name: 'אחד העם 1, עונה 1, פרק 7, יחד בגאווה',
                streamURL: '',
                assetId: '2308276',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'ehad-haam-1-s2-ep1',
                season: 2,
                ep: 1,
                name: 'אחד העם 1, עונה 2, פרק 1: יום הולדת לראובן',
                streamURL: '',
                assetId: '2176063',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'ehad-haam-1-s2-ep2',
                season: 2,
                ep: 2,
                name: 'אחד העם 1, עונה 2, פרק 2: סופשבוע רגוע',
                streamURL: '',
                assetId: '2218549',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'ehad-haam-1-s2-ep3',
                season: 2,
                ep: 3,
                name: 'אחד העם 1, עונה 2, פרק 3: ככה לא נוהגים',
                streamURL: '',
                assetId: '2218550',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'ehad-haam-1-s2-ep4',
                season: 2,
                ep: 4,
                name: 'אחד העם 1, עונה 2, פרק 4: חוצלארץ',
                streamURL: '',
                assetId: '2218551',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'ehad-haam-1-s2-ep5',
                season: 2,
                ep: 5,
                name: 'אחד העם 1, עונה 2, פרק 5: סיבה למסיבה',
                streamURL: '',
                assetId: '2218552',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'ehad-haam-1-s2-ep6',
                season: 2,
                ep: 6,
                name: 'אחד העם 1, עונה 2, פרק 6: למה מי מת?',
                streamURL: '',
                assetId: '2218553',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'ehad-haam-1-s2-ep7',
                season: 2,
                ep: 7,
                name: 'אחד העם 1, עונה 2, פרק 7: רצח באחד העם',
                streamURL: '',
                assetId: '2183441',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-1/s2-ep7.jpg',
                placeholder: '7'
            }
        ]
    },
    {
        id: 'ehad-haam-101',
        name: 'אחד העם 101',
        placeholder: 'אחד העם 101',
        imageURL: 'images/kanbox/ehad-haam-101/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'ehad-haam-101-ep1',
                season: 1,
                ep: 1,
                name: 'אחד העם 101, עונה 1, פרק 1: מירי פסקל מצטרפת לעשירון העליון',
                streamURL: '',
                assetId: '2028684',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'ehad-haam-101-ep2',
                season: 1,
                ep: 2,
                name: 'אחד העם 101, עונה 1, פרק 2: הדייט עם מייק',
                streamURL: '',
                assetId: '2028686',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'ehad-haam-101-ep3',
                season: 1,
                ep: 3,
                name: 'אחד העם 101, עונה 1, פרק 3: חנוכת בית',
                streamURL: '',
                assetId: '2028689',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'ehad-haam-101-ep4',
                season: 1,
                ep: 4,
                name: 'אחד העם 101, עונה 1, פרק 4: סקס ומירי הגדולה',
                streamURL: '',
                assetId: '2028690',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'ehad-haam-101-ep5',
                season: 1,
                ep: 5,
                name: 'אחד העם 101, עונה 1, פרק 5: החלום השחור של מירי',
                streamURL: '',
                assetId: '2028692',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'ehad-haam-101-ep6',
                season: 1,
                ep: 6,
                name: 'אחד העם 101, עונה 1, פרק 6: קופצים לאילת',
                streamURL: '',
                assetId: '2028695',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'ehad-haam-101-ep7',
                season: 1,
                ep: 7,
                name: 'אחד העם 101, עונה 1, פרק 7: פנטום האופרה',
                streamURL: '',
                assetId: '2028696',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'ehad-haam-101-ep8',
                season: 1,
                ep: 8,
                name: 'אחד העם 101, עונה 1, פרק 8: יש חשמל באוויר',
                streamURL: '',
                assetId: '2028698',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'ehad-haam-101-ep9',
                season: 1,
                ep: 9,
                name: 'אחד העם 101, עונה 1, פרק 9: חוזרים לאחד העם 1',
                streamURL: '',
                assetId: '2028700',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'ehad-haam-101-ep10',
                season: 1,
                ep: 10,
                name: 'אחד העם 101, עונה 1, פרק 10: תלמה ולואיז - פרק אחרון',
                streamURL: '',
                assetId: '2028705',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'ehad-haam-101-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — מאחורי הקלעים של אחד העם 101',
                streamURL: '',
                assetId: '2028683',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/ehad-haam-101/s1-ep11.jpg',
                placeholder: '11'
            }
        ]
    },
    {
        id: 'zot-vezoti',
        name: 'זאת וזאתי',
        placeholder: 'זאת וזאתי',
        imageURL: 'images/kanbox/zot-vezoti/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'zot-vezoti-ep1',
                season: 1,
                ep: 1,
                name: 'זאת וזאתי, פרק 1, הדודה מג\'רוז',
                streamURL: '',
                assetId: '2025040',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'zot-vezoti-ep2',
                season: 1,
                ep: 2,
                name: 'זאת וזאתי, פרק 2, טירונות',
                streamURL: '',
                assetId: '2025545',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'zot-vezoti-ep3',
                season: 1,
                ep: 3,
                name: 'זאת וזאתי, פרק 3, שוברים דיסטנס',
                streamURL: '',
                assetId: '2015440',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'zot-vezoti-ep4',
                season: 1,
                ep: 4,
                name: 'זאת וזאתי, פרק 4, תותית ומילעל בריטריט',
                streamURL: '',
                assetId: '2025542',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'zot-vezoti-ep5',
                season: 1,
                ep: 5,
                name: 'זאת וזאתי, פרק 5, תותית ומילעל עושות חיים בבית החולים',
                streamURL: '',
                assetId: '2015409',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'zot-vezoti-ep6',
                season: 1,
                ep: 6,
                name: 'זאת וזאתי, פרק 6, קמפינג',
                streamURL: '',
                assetId: '2025034',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'zot-vezoti-ep7',
                season: 1,
                ep: 7,
                name: 'זאת וזאתי, פרק 7, הקמפינג ממשיך',
                streamURL: '',
                assetId: '2015367',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'zot-vezoti-ep8',
                season: 1,
                ep: 8,
                name: 'זאת וזאתי, פרק 8, תותית ומילעל מקימות מפלגה',
                streamURL: '',
                assetId: '2015355',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'zot-vezoti-ep9',
                season: 1,
                ep: 9,
                name: 'זאת וזאתי, פרק 9, בחזרה לתיכון',
                streamURL: '',
                assetId: '2015344',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'zot-vezoti-ep10',
                season: 1,
                ep: 10,
                name: 'זאת וזאתי, פרק 10, החתונה',
                streamURL: '',
                assetId: '2015386',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/zot-vezoti/s1-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
    {
        id: 'yaniv',
        name: 'יניב',
        placeholder: 'יניב',
        imageURL: 'images/kanbox/yaniv/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'yaniv-ep1',
                season: 1,
                ep: 1,
                name: 'יניב, עונה 1, פרק 1: הקרב על הוועד',
                streamURL: '',
                assetId: '2309345',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'yaniv-ep2',
                season: 1,
                ep: 2,
                name: 'יניב, עונה 1, פרק 2: האקדח',
                streamURL: '',
                assetId: '2307120',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'yaniv-ep3',
                season: 1,
                ep: 3,
                name: 'יניב, עונה 1, פרק 3: סיפורה של כליה',
                streamURL: '',
                assetId: '2307119',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'yaniv-ep4',
                season: 1,
                ep: 4,
                name: 'יניב, עונה 1, פרק 4: לאכול עם האויב',
                streamURL: '',
                assetId: '2317843',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'yaniv-ep5',
                season: 1,
                ep: 5,
                name: 'יניב, עונה 1, פרק 5: הסעודה האחרונה',
                streamURL: '',
                assetId: '2317846',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'yaniv-ep6',
                season: 1,
                ep: 6,
                name: 'יניב, עונה 1, פרק 6: ההומלסית',
                streamURL: '',
                assetId: '2329059',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'yaniv-ep7',
                season: 1,
                ep: 7,
                name: 'יניב, עונה 1, פרק 7: הסדנה של יניב',
                streamURL: '',
                assetId: '2329061',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'yaniv-ep8',
                season: 1,
                ep: 8,
                name: 'יניב, עונה 1, פרק 8: שקרן שקרן',
                streamURL: '',
                assetId: '2343721',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'yaniv-ep9',
                season: 1,
                ep: 9,
                name: 'יניב, עונה 1, פרק 9: הארנונה',
                streamURL: '',
                assetId: '2343732',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'yaniv-ep10',
                season: 1,
                ep: 10,
                name: 'יניב, עונה 1, פרק 10: המתכון של סבתא',
                streamURL: '',
                assetId: '2354614',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'yaniv-ep11',
                season: 1,
                ep: 11,
                name: 'יניב, עונה 1, פרק 11: לפטר את הילד',
                streamURL: '',
                assetId: '2354619',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'yaniv-ep12',
                season: 1,
                ep: 12,
                name: 'יניב, עונה 1, פרק 12: גט בייבי',
                streamURL: '',
                assetId: '2367811',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'yaniv-ep13',
                season: 1,
                ep: 13,
                name: 'יניב, עונה 1, פרק 13: הלילה הזה כולו מרור',
                streamURL: '',
                assetId: '2367812',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'yaniv-ep14',
                season: 1,
                ep: 14,
                name: 'יניב, עונה 1, פרק 14: אבא גנוב, אמא מגניבה',
                streamURL: '',
                assetId: '2380570',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'yaniv-ep15',
                season: 1,
                ep: 15,
                name: 'יניב, עונה 1, פרק 15: בת הטוחן',
                streamURL: '',
                assetId: '2380574',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'yaniv-ep16',
                season: 1,
                ep: 16,
                name: 'יניב, עונה 1, פרק 16: השף ההודי',
                streamURL: '',
                assetId: '2389508',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'yaniv-ep17',
                season: 1,
                ep: 17,
                name: 'יניב, עונה 1, פרק 17: הקרקסן',
                streamURL: '',
                assetId: '2389525',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'yaniv-ep18',
                season: 1,
                ep: 18,
                name: 'יניב, עונה 1, פרק 18: האקס של דבי',
                streamURL: '',
                assetId: '4486603',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'yaniv-ep19',
                season: 1,
                ep: 19,
                name: 'יניב, עונה 1, פרק 19: מחוות גדולות',
                streamURL: '',
                assetId: '4474510',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'yaniv-ep20',
                season: 1,
                ep: 20,
                name: 'יניב, עונה 1, פרק 20: להיות או לא להיות',
                streamURL: '',
                assetId: '4485299',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/yaniv/s1-ep20.jpg',
                placeholder: '20'
            }
        ]
    },
    {
        id: 'litzvi-yesh-beaya',
        name: 'לצבי יש בעיה',
        placeholder: 'לצבי יש בעיה',
        imageURL: 'images/kanbox/litzvi-yesh-beaya/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'litzvi-yesh-beaya-s1-ep1',
                season: 1,
                ep: 1,
                name: 'לצבי יש בעיה, עונה 1, פרק 1: הז בין',
                streamURL: '',
                assetId: '2026156',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep2',
                season: 1,
                ep: 2,
                name: 'לצבי יש בעיה, עונה 1, פרק 2: החבר',
                streamURL: '',
                assetId: '2015633',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep3',
                season: 1,
                ep: 3,
                name: 'לצבי יש בעיה, עונה 1, פרק 3: אוי זכריה',
                streamURL: '',
                assetId: '2026147',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep4',
                season: 1,
                ep: 4,
                name: 'לצבי יש בעיה, עונה 1, פרק 4: זה היה בחנוכה',
                streamURL: '',
                assetId: '2026144',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep5',
                season: 1,
                ep: 5,
                name: 'לצבי יש בעיה, עונה 1, פרק 5: תחתום פה',
                streamURL: '',
                assetId: '2026148',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep6',
                season: 1,
                ep: 6,
                name: 'לצבי יש בעיה, עונה 1, פרק 6: הארנבת',
                streamURL: '',
                assetId: '2026145',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep7',
                season: 1,
                ep: 7,
                name: 'לצבי יש בעיה, עונה 1, פרק 7: ארזנו לבד',
                streamURL: '',
                assetId: '2015462',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'litzvi-yesh-beaya-s1-ep8',
                season: 1,
                ep: 8,
                name: 'לצבי יש בעיה, עונה 1, פרק 8: שבת שלום לכם',
                streamURL: '',
                assetId: '2026153',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep1',
                season: 2,
                ep: 1,
                name: 'לצבי יש בעיה, עונה 2, פרק 1: אסי עזר',
                streamURL: '',
                assetId: '2026143',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep2',
                season: 2,
                ep: 2,
                name: 'לצבי יש בעיה, עונה 2, פרק 2: סדנת כעסים',
                streamURL: '',
                assetId: '2026146',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep3',
                season: 2,
                ep: 3,
                name: 'לצבי יש בעיה, עונה 2, פרק 3: אורלי שריקי',
                streamURL: '',
                assetId: '2015758',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep4',
                season: 2,
                ep: 4,
                name: 'לצבי יש בעיה, עונה 2, פרק 4: הכרזת מלחמה',
                streamURL: '',
                assetId: '2015721',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep5',
                season: 2,
                ep: 5,
                name: 'לצבי יש בעיה, עונה 2, פרק 5: יום השואה',
                streamURL: '',
                assetId: '2025267',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep6',
                season: 2,
                ep: 6,
                name: 'לצבי יש בעיה, עונה 2, פרק 6: בוביבאס',
                streamURL: '',
                assetId: '2025255',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep7',
                season: 2,
                ep: 7,
                name: 'לצבי יש בעיה, עונה 2, פרק 7: שיר מתגייסת',
                streamURL: '',
                assetId: '2025253',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep8',
                season: 2,
                ep: 8,
                name: 'לצבי יש בעיה, עונה 2, פרק 8: הסוס',
                streamURL: '',
                assetId: '2025247',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep9',
                season: 2,
                ep: 9,
                name: 'לצבי יש בעיה, עונה 2, פרק 9: בוטוקס',
                streamURL: '',
                assetId: '2025244',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'litzvi-yesh-beaya-s2-ep10',
                season: 2,
                ep: 10,
                name: 'לצבי יש בעיה, עונה 2, פרק 10: לידה',
                streamURL: '',
                assetId: '2025225',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/litzvi-yesh-beaya/s2-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
    {
        id: 'amammiot',
        name: 'עממיות',
        placeholder: 'עממיות',
        imageURL: 'images/kanbox/amammiot/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'amammiot-ep1',
                season: 1,
                ep: 1,
                name: 'עממיות, עונה 1, פרק 1: שונטל מאחורייך',
                streamURL: '',
                assetId: '2026328',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'amammiot-ep2',
                season: 1,
                ep: 2,
                name: 'עממיות, עונה 1, פרק 2: המוכרת מאדריאן נטורל',
                streamURL: '',
                assetId: '2026329',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'amammiot-ep3',
                season: 1,
                ep: 3,
                name: 'עממיות, עונה 1, פרק 3: Hello',
                streamURL: '',
                assetId: '2026327',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'amammiot-ep4',
                season: 1,
                ep: 4,
                name: 'עממיות, פרק 4 : אילת זה אילת',
                streamURL: '',
                assetId: '2026331',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'amammiot-ep5',
                season: 1,
                ep: 5,
                name: 'עממיות, עונה 1, פרק 5: האח של שונטל',
                streamURL: '',
                assetId: '2026337',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'amammiot-ep6',
                season: 1,
                ep: 6,
                name: 'עממיות, עונה 1, פרק 6: העוזרת',
                streamURL: '',
                assetId: '2026321',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'amammiot-ep7',
                season: 1,
                ep: 7,
                name: 'עממיות, עונה 1, פרק 7: יום האהבה',
                streamURL: '',
                assetId: '2026319',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'amammiot-ep8',
                season: 1,
                ep: 8,
                name: 'עממיות, עונה 1, פרק 8: הפרנסאווית',
                streamURL: '',
                assetId: '2026322',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'amammiot-ep9',
                season: 1,
                ep: 9,
                name: 'עממיות, עונה 1, פרק 9: אשכנזי סופג',
                streamURL: '',
                assetId: '2026323',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'amammiot-ep10',
                season: 1,
                ep: 10,
                name: 'עממיות, עונה 1, פרק 10: מודעת מדי',
                streamURL: '',
                assetId: '2026326',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'amammiot-ep11',
                season: 1,
                ep: 11,
                name: 'עממיות, עונה 1, פרק 11: הפסיכולוגית',
                streamURL: '',
                assetId: '2026325',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'amammiot-ep12',
                season: 1,
                ep: 12,
                name: 'עממיות, עונה 1, פרק 12: Federer',
                streamURL: '',
                assetId: '2026324',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/amammiot/s1-ep12.jpg',
                placeholder: '12'
            }
        ]
    },
    {
        id: 'haisraelim',
        name: 'הישראלים',
        placeholder: 'הישראלים',
        imageURL: 'images/kanbox/haisraelim/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'haisraelim-ep1',
                season: 1,
                ep: 1,
                name: 'הישראלים, עונה 1, פרק 1',
                streamURL: '',
                assetId: '4154414',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'haisraelim-ep2',
                season: 1,
                ep: 2,
                name: 'הישראלים, עונה 1, פרק 2',
                streamURL: '',
                assetId: '2293814',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'haisraelim-ep3',
                season: 1,
                ep: 3,
                name: 'הישראלים, עונה 1, פרק 3',
                streamURL: '',
                assetId: '2095172',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'haisraelim-ep4',
                season: 1,
                ep: 4,
                name: 'הישראלים, עונה 1, פרק 4',
                streamURL: '',
                assetId: '2015395',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'haisraelim-ep5',
                season: 1,
                ep: 5,
                name: 'הישראלים, עונה 1, פרק 5',
                streamURL: '',
                assetId: '2095191',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'haisraelim-ep6',
                season: 1,
                ep: 6,
                name: 'הישראלים, עונה 1, פרק 6',
                streamURL: '',
                assetId: '2095211',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'haisraelim-ep7',
                season: 1,
                ep: 7,
                name: 'הישראלים, עונה 1, פרק 7',
                streamURL: '',
                assetId: '2015366',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'haisraelim-ep8',
                season: 1,
                ep: 8,
                name: 'הישראלים, עונה 1, פרק 8',
                streamURL: '',
                assetId: '2015325',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'haisraelim-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — הישראלים: לקט כדורגל',
                streamURL: '',
                assetId: '2293815',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haisraelim/s1-ep11.jpg',
                placeholder: '11'
            }
        ]
    },
    {
        id: 'hamitnachel',
        name: 'המתנחל עם חנוך דאום',
        placeholder: 'המתנחל עם חנוך דאום',
        imageURL: 'images/kanbox/hamitnachel/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'hamitnachel-s1-ep1',
                season: 1,
                ep: 1,
                name: 'המתנחל, פרק 1: יורם שפטל',
                streamURL: '',
                assetId: '2266189',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamitnachel-s1-ep2',
                season: 1,
                ep: 2,
                name: 'המתנחל, עונה 1, פרק 2: פליקס חלפון',
                streamURL: '',
                assetId: '2266188',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamitnachel-s1-ep3',
                season: 1,
                ep: 3,
                name: 'המתנחל, עונה 1, פרק 3: ליהיא גרינר',
                streamURL: '',
                assetId: '2266193',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamitnachel-s1-ep4',
                season: 1,
                ep: 4,
                name: 'המתנחל, עונה 1, פרק 4: ארי שמאי',
                streamURL: '',
                assetId: '2266194',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamitnachel-s1-ep5',
                season: 1,
                ep: 5,
                name: 'המתנחל, עונה 1, פרק 5: דנה רון',
                streamURL: '',
                assetId: '2266195',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hamitnachel-s1-ep6',
                season: 1,
                ep: 6,
                name: 'המתנחל, עונה 1, פרק 6: איתי שגב',
                streamURL: '',
                assetId: '2266196',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hamitnachel-s1-ep7',
                season: 1,
                ep: 7,
                name: 'המתנחל, עונה 1, פרק 7: רינת גבאי',
                streamURL: '',
                assetId: '2266197',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hamitnachel-s1-ep8',
                season: 1,
                ep: 8,
                name: 'המתנחל, עונה 1, פרק 8: חן אריזונה',
                streamURL: '',
                assetId: '2266198',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hamitnachel-s1-ep9',
                season: 1,
                ep: 9,
                name: 'המתנחל, עונה 1, פרק 9: אבי ביטר',
                streamURL: '',
                assetId: '2266200',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hamitnachel-s1-ep10',
                season: 1,
                ep: 10,
                name: 'המתנחל, עונה 1, פרק 10: מירי רגב',
                streamURL: '',
                assetId: '2266201',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'hamitnachel-s1-ep11',
                season: 1,
                ep: 11,
                name: 'המתנחל, עונה 1, פרק 11: איתמר בן גביר',
                streamURL: '',
                assetId: '2266202',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'hamitnachel-s2-ep1',
                season: 2,
                ep: 1,
                name: 'המתנחל, עונה 2, פרק 1: זהבה גלאון',
                streamURL: '',
                assetId: '2266203',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamitnachel-s2-ep3',
                season: 2,
                ep: 3,
                name: 'המתנחל, עונה 2, פרק 3: נפתלי בנט',
                streamURL: '',
                assetId: '2266204',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamitnachel-s2-ep4',
                season: 2,
                ep: 4,
                name: 'המתנחל, עונה 2, פרק 4: יאיר לפיד',
                streamURL: '',
                assetId: '2266205',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamitnachel-s2-ep5',
                season: 2,
                ep: 5,
                name: 'המתנחל, עונה 2, פרק 5: חנוך לכנסת',
                streamURL: '',
                assetId: '2266206',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hamitnachel-s2-ep6',
                season: 2,
                ep: 6,
                name: 'המתנחל, עונה 2, פרק 6: רביב דרוקר',
                streamURL: '',
                assetId: '2266207',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hamitnachel-s3-ep1',
                season: 3,
                ep: 1,
                name: 'המתנחל, עונה 3, פרק 1: איילת שקד',
                streamURL: '',
                assetId: '2329930',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamitnachel-s3-ep2',
                season: 3,
                ep: 2,
                name: 'המתנחל, עונה 3, פרק 2: אבי גבאי',
                streamURL: '',
                assetId: '2329931',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamitnachel-s3-ep3',
                season: 3,
                ep: 3,
                name: 'המתנחל, עונה 3, פרק 3: מירי רגב',
                streamURL: '',
                assetId: '2329932',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamitnachel-s3-ep4',
                season: 3,
                ep: 4,
                name: 'המתנחל, עונה 3, פרק 4: תמר זנדברג',
                streamURL: '',
                assetId: '2329933',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamitnachel-s3-ep5',
                season: 3,
                ep: 5,
                name: 'המתנחל, עונה 3, פרק 5: יאיר לפיד',
                streamURL: '',
                assetId: '2329934',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/hamitnachel/s3-ep5.jpg',
                placeholder: '5'
            }
        ]
    },
    {
        id: 'lo-lifnei-hayeladim',
        name: 'לא לפני הילדים',
        placeholder: 'לא לפני הילדים',
        imageURL: 'images/kanbox/lo-lifnei-hayeladim/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'lo-lifnei-hayeladim-s1-ep1',
                season: 1,
                ep: 1,
                name: 'לא לפני הילדים, עונה 1, פרק 1',
                streamURL: '',
                assetId: '2147881',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep2',
                season: 1,
                ep: 2,
                name: 'לא לפני הילדים, עונה 1, פרק 1',
                streamURL: '',
                assetId: '2147829',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep3',
                season: 1,
                ep: 3,
                name: 'לא לפני הילדים, עונה 1, פרק 2',
                streamURL: '',
                assetId: '2147882',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep4',
                season: 1,
                ep: 4,
                name: 'לא לפני הילדים, עונה 1, פרק 2',
                streamURL: '',
                assetId: '2147828',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep5',
                season: 1,
                ep: 5,
                name: 'לא לפני הילדים, עונה 1, פרק 3',
                streamURL: '',
                assetId: '2147827',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep6',
                season: 1,
                ep: 6,
                name: 'לא לפני הילדים, עונה 1, פרק 4',
                streamURL: '',
                assetId: '2147830',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep7',
                season: 1,
                ep: 7,
                name: 'לא לפני הילדים, עונה 1, פרק 5',
                streamURL: '',
                assetId: '2147837',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep8',
                season: 1,
                ep: 8,
                name: 'לא לפני הילדים, עונה 1, פרק 6',
                streamURL: '',
                assetId: '2147835',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep9',
                season: 1,
                ep: 9,
                name: 'לא לפני הילדים, עונה 1, פרק 7',
                streamURL: '',
                assetId: '2147836',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep10',
                season: 1,
                ep: 10,
                name: 'לא לפני הילדים, עונה 1, פרק 8',
                streamURL: '',
                assetId: '2147841',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep11',
                season: 1,
                ep: 11,
                name: 'לא לפני הילדים, עונה 1, פרק 9',
                streamURL: '',
                assetId: '2147843',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep12',
                season: 1,
                ep: 12,
                name: 'לא לפני הילדים, עונה 1, פרק 10',
                streamURL: '',
                assetId: '2148662',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep13',
                season: 1,
                ep: 13,
                name: 'לא לפני הילדים, עונה 1, פרק 11',
                streamURL: '',
                assetId: '2163247',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep14',
                season: 1,
                ep: 14,
                name: 'לא לפני הילדים, עונה 1, פרק 11',
                streamURL: '',
                assetId: '2148663',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep15',
                season: 1,
                ep: 15,
                name: 'לא לפני הילדים, עונה 1, פרק 12',
                streamURL: '',
                assetId: '2155473',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep16',
                season: 1,
                ep: 16,
                name: 'לא לפני הילדים, עונה 1, פרק 12',
                streamURL: '',
                assetId: '2148665',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep17',
                season: 1,
                ep: 17,
                name: 'לא לפני הילדים, עונה 1, פרק 13',
                streamURL: '',
                assetId: '2163248',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep18',
                season: 1,
                ep: 18,
                name: 'לא לפני הילדים, עונה 1, פרק 13',
                streamURL: '',
                assetId: '2148664',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep19',
                season: 1,
                ep: 19,
                name: 'לא לפני הילדים, עונה 1, פרק 14',
                streamURL: '',
                assetId: '2148666',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep20',
                season: 1,
                ep: 20,
                name: 'לא לפני הילדים, עונה 1, פרק 15',
                streamURL: '',
                assetId: '2148667',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep21',
                season: 1,
                ep: 21,
                name: 'לא לפני הילדים, עונה 1, פרק 16',
                streamURL: '',
                assetId: '2150275',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep22',
                season: 1,
                ep: 22,
                name: 'לא לפני הילדים, עונה 1, פרק 17',
                streamURL: '',
                assetId: '2155469',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'lo-lifnei-hayeladim-s1-ep23',
                season: 1,
                ep: 23,
                name: 'לא לפני הילדים, עונה 1, פרק 17',
                streamURL: '',
                assetId: '2150279',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s1-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep1',
                season: 2,
                ep: 1,
                name: 'לא לפני הילדים, עונה 2, פרק 1',
                streamURL: '',
                assetId: '2156241',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep2',
                season: 2,
                ep: 2,
                name: 'לא לפני הילדים, עונה 2, פרק 2',
                streamURL: '',
                assetId: '2156244',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep3',
                season: 2,
                ep: 3,
                name: 'לא לפני הילדים, עונה 2, פרק 3',
                streamURL: '',
                assetId: '2156242',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep4',
                season: 2,
                ep: 4,
                name: 'לא לפני הילדים, עונה 2, פרק 4',
                streamURL: '',
                assetId: '2156246',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep5',
                season: 2,
                ep: 5,
                name: 'לא לפני הילדים, עונה 2, פרק 5',
                streamURL: '',
                assetId: '2156245',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep6',
                season: 2,
                ep: 6,
                name: 'לא לפני הילדים, עונה 2, פרק 6',
                streamURL: '',
                assetId: '2156243',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep7',
                season: 2,
                ep: 7,
                name: 'לא לפני הילדים, עונה 2, פרק 7',
                streamURL: '',
                assetId: '2156247',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep8',
                season: 2,
                ep: 8,
                name: 'לא לפני הילדים, עונה 2, פרק 8',
                streamURL: '',
                assetId: '2156248',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep9',
                season: 2,
                ep: 9,
                name: 'לא לפני הילדים, עונה 2, פרק 9',
                streamURL: '',
                assetId: '2156252',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep10',
                season: 2,
                ep: 10,
                name: 'לא לפני הילדים, עונה 2, פרק 10',
                streamURL: '',
                assetId: '2156249',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep11',
                season: 2,
                ep: 11,
                name: 'לא לפני הילדים, עונה 2, פרק 11',
                streamURL: '',
                assetId: '2156251',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep12',
                season: 2,
                ep: 12,
                name: 'לא לפני הילדים, עונה 2, פרק 12',
                streamURL: '',
                assetId: '2156250',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'lo-lifnei-hayeladim-s2-ep13',
                season: 2,
                ep: 13,
                name: 'לא לפני הילדים, עונה 2, פרק 13',
                streamURL: '',
                assetId: '2156253',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/lo-lifnei-hayeladim/s2-ep13.jpg',
                placeholder: '13'
            }
        ]
    },
    {
        id: 'haerev-etzel-ben',
        name: 'הערב אצל בן בן ברוך',
        placeholder: 'הערב אצל בן בן ברוך',
        imageURL: 'images/kanbox/haerev-etzel-ben/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'haerev-etzel-ben-ep1',
                season: 1,
                ep: 1,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 1: נסרין קדרי',
                streamURL: '',
                assetId: '2290561',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'haerev-etzel-ben-ep2',
                season: 1,
                ep: 2,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 2: אוראל צברי',
                streamURL: '',
                assetId: '2303603',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'haerev-etzel-ben-ep3',
                season: 1,
                ep: 3,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 3: מיכל הקטנה',
                streamURL: '',
                assetId: '2317841',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'haerev-etzel-ben-ep4',
                season: 1,
                ep: 4,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 4: רשף לוי',
                streamURL: '',
                assetId: '2324485',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'haerev-etzel-ben-ep5',
                season: 1,
                ep: 5,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 5: קובי מימון',
                streamURL: '',
                assetId: '2339424',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'haerev-etzel-ben-ep6',
                season: 1,
                ep: 6,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 6: לירון ויצמן',
                streamURL: '',
                assetId: '2352410',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'haerev-etzel-ben-ep7',
                season: 1,
                ep: 7,
                name: 'הערב אצל בן בן ברוך, עונה 1, פרק 7: אודיה',
                streamURL: '',
                assetId: '2375836',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/haerev-etzel-ben/s1-ep7.jpg',
                placeholder: '7'
            }
        ]
    },
    {
        id: 'magen-david-darom',
        name: 'מגן דוד דרום',
        placeholder: 'מגן דוד דרום',
        imageURL: 'images/kanbox/magen-david-darom/series.jpg',
        source: 'reshet',
        episodes: [
            {
                id: 'magen-david-darom-ep1',
                season: 1,
                ep: 1,
                name: 'מגן דוד דרום, עונה 1, פרק 1: בחור חדש בתחנה',
                streamURL: '',
                assetId: '2025125',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'magen-david-darom-ep2',
                season: 1,
                ep: 2,
                name: 'מגן דוד דרום, עונה 1, פרק 2: איפה הכליה?',
                streamURL: '',
                assetId: '2025105',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'magen-david-darom-ep3',
                season: 1,
                ep: 3,
                name: 'מגן דוד דרום, עונה 1, פרק 3: ילדים זה שמחה',
                streamURL: '',
                assetId: '2025101',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'magen-david-darom-ep4',
                season: 1,
                ep: 4,
                name: 'מגן דוד דרום, עונה 1, פרק 4: מחאת הנכים',
                streamURL: '',
                assetId: '2025080',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'magen-david-darom-ep5',
                season: 1,
                ep: 5,
                name: 'מגן דוד דרום, עונה 1, פרק 5: טיול שנתי',
                streamURL: '',
                assetId: '2025072',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'magen-david-darom-ep6',
                season: 1,
                ep: 6,
                name: 'מגן דוד דרום, עונה 1, פרק 6: תחרות דם',
                streamURL: '',
                assetId: '2025075',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'magen-david-darom-ep7',
                season: 1,
                ep: 7,
                name: 'מגן דוד דרום, עונה 1, פרק 7: הגרמנים באים',
                streamURL: '',
                assetId: '2025065',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'magen-david-darom-ep8',
                season: 1,
                ep: 8,
                name: 'מגן דוד דרום, עונה 1, פרק 8: הטרדה מינית',
                streamURL: '',
                assetId: '3918448',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'magen-david-darom-ep9',
                season: 1,
                ep: 9,
                name: 'מגן דוד דרום, עונה 1, פרק 9: הפצצה',
                streamURL: '',
                assetId: '2025062',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'magen-david-darom-ep10',
                season: 1,
                ep: 10,
                name: 'מגן דוד דרום, עונה 1, פרק 10: מלי לוי בעיר',
                streamURL: '',
                assetId: '2025063',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'magen-david-darom-ep11',
                season: 1,
                ep: 11,
                name: 'מגן דוד דרום, עונה 1, פרק 11: יום בחירות',
                streamURL: '',
                assetId: '2025061',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'magen-david-darom-ep12',
                season: 1,
                ep: 12,
                name: 'מגן דוד דרום, עונה 1, פרק 12: יום גיבוש',
                streamURL: '',
                assetId: '2025060',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'magen-david-darom-ep13',
                season: 1,
                ep: 13,
                name: 'מגן דוד דרום, עונה 1, פרק 13: טורניר הכדורגל',
                streamURL: '',
                assetId: '2025055',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'magen-david-darom-ep14',
                season: 1,
                ep: 14,
                name: 'מגן דוד דרום, עונה 1, פרק 14: עידו עוזב את התחנה',
                streamURL: '',
                assetId: '2025059',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'magen-david-darom-ep15',
                season: 1,
                ep: 15,
                name: 'מגן דוד דרום, עונה 1, פרק 15: השביתה',
                streamURL: '',
                assetId: '2025053',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'magen-david-darom-ep16',
                season: 1,
                ep: 16,
                name: 'מגן דוד דרום, עונה 1, פרק 16: משחק השקט',
                streamURL: '',
                assetId: '2025052',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'magen-david-darom-ep17',
                season: 1,
                ep: 17,
                name: 'מגן דוד דרום, עונה 1, פרק 17: התורם מטקסס',
                streamURL: '',
                assetId: '2025048',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'magen-david-darom-ep18',
                season: 1,
                ep: 18,
                name: 'מגן דוד דרום, עונה 1, פרק 18: התחנה מופרטת',
                streamURL: '',
                assetId: '2015413',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'magen-david-darom-ep19',
                season: 1,
                ep: 19,
                name: 'מגן דוד דרום, עונה 1, פרק 19: התחנה מופרטת ב\'',
                streamURL: '',
                assetId: '2015422',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'magen-david-darom-ep20',
                season: 1,
                ep: 20,
                name: 'מגן דוד דרום, עונה 1, פרק 20: סיום העונה',
                streamURL: '',
                assetId: '2015363',
                streamResolve: 'reshet',
                imageURL: 'images/kanbox/magen-david-darom/s1-ep20.jpg',
                placeholder: '20'
            }
        ]
    },
{
        id: 'reset',
        name: 'ריסט',
        placeholder: 'ריסט',
        imageURL: 'images/kanbox/reset/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'reset-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — פרק הבכורה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_01_100226_VOD_drn007/Reset_01_100226_VOD_drn007_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'reset-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — כשגידי פגש את נויה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_02_170226_VOD_hig89/Reset_02_170226_VOD_hig89_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'reset-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — החיים החדשים של גידי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_03_230226_VOD_edx582/Reset_03_230226_VOD_edx582_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'reset-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — הקואצ\'ר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_04_050326_VOD_edc283/Reset_04_050326_VOD_edc283_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'reset-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — גידי נגד קרני',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_05_090326_VOD_jef624/Reset_05_090326_VOD_jef624_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'reset-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — האקסית המיתולוגית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_06_160326_VOD_nn82/Reset_06_160326_VOD_nn82_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'reset-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — עבודת החלומות של גידי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_07_230326_VOD_nnx341/Reset_07_230326_VOD_nnx341_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'reset-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — פרק הסיום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Reset/S01/EP/Reset_08_300326_VOD_nn27/Reset_08_300326_VOD_nn27_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/reset/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'mashiah',
        name: 'משיח',
        placeholder: 'משיח',
        imageURL: 'images/kanbox/mashiah/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'mashiah-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — ברת המצווה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_01_VOD_194psn/mashiah_01_VOD_194psn_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mashiah-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — ריגול תעשייתי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_02_VOD_752tbe/mashiah_02_VOD_752tbe_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mashiah-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — שיר לכל מצב רוח',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_03_VOD_jfghhf5754/mashiah_03_VOD_jfghhf5754_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mashiah-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — הלו אפריקה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_04_VOD_edr133/mashiah_04_VOD_edr133_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mashiah-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — פוליסוד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_05_VOD_segj2/mashiah_05_VOD_segj2_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mashiah-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — יועצת ארגונים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_06_VOD_eutue85832/mashiah_06_VOD_eutue85832_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mashiah-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — הגנה עצמית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_07_VOD_758gbn/mashiah_07_VOD_758gbn_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mashiah-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — ולנטינה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_08_VOD_vcmx8583/mashiah_08_VOD_vcmx8583_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'mashiah-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — תשוקה מרירה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_09_VOD_vncnx8543/mashiah_09_VOD_vncnx8543_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'mashiah-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — אחת באפריל',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/masiah_10_VOD_rjkt744/masiah_10_VOD_rjkt744_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'mashiah-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — הנדר: חלק א\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/mashiah_11_VOD_183utg/mashiah_11_VOD_183utg_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'mashiah-s1-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12 — הנדר: חלק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/masiah_12_VOD_vnnc8532/masiah_12_VOD_vnnc8532_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'mashiah-s1-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13 — מאחורי הקלעים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S01/masiah_13_VOD_turu853/masiah_13_VOD_turu853_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'mashiah-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1 — התיירים באים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_01_VOD_u8s6c1/mashiah2_01_VOD_u8s6c1_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mashiah-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2 — לימונדה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_02VOD_nyd572/mashiah2_02VOD_nyd572_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mashiah-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3 — אורחן קומדי קלאב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_03_VOD_vsk436/mashiah2_03_VOD_vsk436_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mashiah-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4 — חומות של אורחן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_04_VOD_djo083/mashiah2_04_VOD_djo083_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mashiah-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5 — אורחן על גלגלים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_05_VOD_FIX_d45hee/mashiah2_05_VOD_FIX_d45hee_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mashiah-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6 — קפה עולה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_06_VOD_q7z8c12x/mashiah2_06_VOD_q7z8c12x_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mashiah-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7 — תהילה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_07_VOD_f3x31z/mashiah2_07_VOD_f3x31z_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mashiah-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8 — BFF',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_08_VOD_3a9z6x/mashiah2_08_VOD_3a9z6x_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'mashiah-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9 — משגיח לא בא',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_09_VOD_kiid275/mashiah2_09_VOD_kiid275_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'mashiah-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10 — פגישת מחזור',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_10_VOD_Faasm21/mashiah2_10_VOD_Faasm21_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'mashiah-s2-ep11',
                season: 2,
                ep: 11,
                name: 'עונה 2 פרק 11 — משיח לא בר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_11_VOD_gh477/mashiah2_11_VOD_gh477_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'mashiah-s2-ep12',
                season: 2,
                ep: 12,
                name: 'עונה 2 פרק 12 — קומבה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_12_VOD_kcu1248/mashiah2_12_VOD_kcu1248_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'mashiah-s2-ep13',
                season: 2,
                ep: 13,
                name: 'עונה 2 פרק 13 — צרות גדולות בדרום העיר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_13_VOD_f6z5z1/mashiah2_13_VOD_f6z5z1_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'mashiah-s2-ep14',
                season: 2,
                ep: 14,
                name: 'עונה 2 פרק 14 — מאחורי הקלעים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/mashiah/S02/mashiah2_14_VOD_xcv414/mashiah2_14_VOD_xcv414_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mashiah/s2-ep14.jpg',
                placeholder: '14'
            }
        ]
    },
{
        id: 'the-property',
        name: 'הנחלה',
        placeholder: 'הנחלה',
        imageURL: 'images/kanbox/the-property/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'the-property-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — חומוס ארז',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_01_VOD_rt2tn/hanahala_01_VOD_rt2tn_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'the-property-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 —  אחד מהחבר\'ה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_02_VOD_s8fye/hanahala_02_VOD_s8fye_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'the-property-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — מה רוצה התועלת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_03_VOD_45hf4ds/hanahala_03_VOD_45hf4ds_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'the-property-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — פרוטקשן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala1_04_VOD_056ftw/hanahala1_04_VOD_056ftw_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'the-property-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — סיירת מטכ"ל',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_05_VOD_4443ff/hanahala_05_VOD_4443ff_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'the-property-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — סיפור שנגמר בלוויה של נחש',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_06_VOD_ejh52/hanahala_06_VOD_ejh52_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'the-property-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — ואז הגיעה תמי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_09_VOD_n7ebvfd/hanahala_09_VOD_n7ebvfd_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'the-property-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — דוד גבע',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_11_VOD_6svz4d/hanahala_11_VOD_6svz4d_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'the-property-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — נחת הולך לאיבוד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_17_VOD_jrl25/hanahala_17_VOD_jrl25_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'the-property-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — מעלה השלושה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_14_VOD_yi3ar/hanahala_14_VOD_yi3ar_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'the-property-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — אהבה אסורה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahla1_11_VOD_483mnr/hanahla1_11_VOD_483mnr_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'the-property-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12 — הקרב הגדול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahal1_12_VOD_789mrt/hanahal1_12_VOD_789mrt_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'the-property-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13 — החרם',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_13_VOD_ekj24/hanahala_13_VOD_ekj24_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'the-property-ep14',
                season: 1,
                ep: 14,
                name: 'עונה 1 פרק 14 — השומר הזקן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_14_VOD_rmt2n4/hanahala_14_VOD_rmt2n4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'the-property-ep15',
                season: 1,
                ep: 15,
                name: 'עונה 1 פרק 15 — הרב פיילוט חלק א\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahla1_15_VOD_x6v7ts/hanahla1_15_VOD_x6v7ts_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'the-property-ep16',
                season: 1,
                ep: 16,
                name: 'עונה 1 פרק 16 — הרב פיילוט חלק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahla1_16_VOD_yx78yx/hanahla1_16_VOD_yx78yx_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'the-property-ep17',
                season: 1,
                ep: 17,
                name: 'עונה 1 פרק 17 — השבעה של אריק',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_17_VOD_987tuy/hanahala_17_VOD_987tuy_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'the-property-ep18',
                season: 1,
                ep: 18,
                name: 'עונה 1 פרק 18 — בלדה לעוזב המושב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_18_VOD_asd199/hanahala_18_VOD_asd199_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'the-property-ep19',
                season: 1,
                ep: 19,
                name: 'עונה 1 פרק 19 — מגרשים את ויקי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hanahala/S01/hanahala_19_VOD_f78e/hanahala_19_VOD_f78e_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-property/s1-ep19.jpg',
                placeholder: '19'
            }
        ]
    },
{
        id: 'arabic-work',
        name: 'עבודה ערבית',
        placeholder: 'עבודה ערבית',
        imageURL: 'images/kanbox/arabic-work/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'arabic-work-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — המכונית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_1_vod/avoda_aravit1_1_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'arabic-work-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — הכבשה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_2_vod_fix/avoda_aravit1_2_vod_fix_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'arabic-work-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — גן ילדים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_3_vod/avoda_aravit1_3_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'arabic-work-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — חטיפה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_4_vod/avoda_aravit1_4_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'arabic-work-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — ארוחות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_5_vod/avoda_aravit1_5_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'arabic-work-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — מילואים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_6_vod/avoda_aravit1_6_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'arabic-work-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — נאמנות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_7_vod/avoda_aravit1_7_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'arabic-work-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — פשע גבולי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_8_vod/avoda_aravit1_8_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'arabic-work-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — ביקור הורים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_9_vod/avoda_aravit1_9_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'arabic-work-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — סייד קשוע מדבר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_10_vod/avoda_aravit1_10_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'arabic-work-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — סיום העונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S01/avoda_aravit1_11_vod/avoda_aravit1_11_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'arabic-work-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1 — המקלחת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_1_vod/avoda_aravit2_1_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'arabic-work-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2 — מעבר דירה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_2_vod/avoda_aravit2_2_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'arabic-work-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3 — כלב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_3_vod/avoda_aravit2_3_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'arabic-work-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4 — כותונת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_4_vod/avoda_aravit2_4_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'arabic-work-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5 — ועד בית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_5_vod/avoda_aravit2_5_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'arabic-work-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6 — פורים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_6_vod/avoda_aravit2_6_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'arabic-work-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7 — מוסיקה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_7_vod/avoda_aravit2_7_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'arabic-work-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8 — זיכרון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_8_vod/avoda_aravit2_8_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'arabic-work-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9 — משמר השכונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_9_vod/avoda_aravit2_9_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'arabic-work-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10 — אמג\'ד חושד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_10_vod/avoda_aravit2_10_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'arabic-work-s2-ep11',
                season: 2,
                ep: 11,
                name: 'עונה 2 פרק 11 — מתח בדרום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_11_vod/avoda_aravit2_11_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'arabic-work-s2-ep12',
                season: 2,
                ep: 12,
                name: 'עונה 2 פרק 12 — שחייה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_12_vod/avoda_aravit2_12_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'arabic-work-s2-ep13',
                season: 2,
                ep: 13,
                name: 'עונה 2 פרק 13 — אמג\'ד כוכב עליון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S02/avoda_aravit2_13_vod/avoda_aravit2_13_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'arabic-work-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1 — ריאליטי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_1_vod/avoda_aravit3_1_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'arabic-work-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2 — השלפוחית הפוליטית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_2_vod/avoda_aravit3_2_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'arabic-work-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3 — תולעים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_3_vod/avoda_aravit3_3_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'arabic-work-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4 — התחרדות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_arvit3_04_vod/avoda_arvit3_04_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'arabic-work-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5 — כבוד המשפחה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_5_fixx/avoda_aravit3_5_fixx_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'arabic-work-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6 — כתב זר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_06_vod/avoda_aravit3_06_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'arabic-work-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7 — ערבי צמחוני',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_7_vod/avoda_aravit3_7_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'arabic-work-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8 — מדברים בקול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_8_vod/avoda_aravit3_8_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'arabic-work-s3-ep9',
                season: 3,
                ep: 9,
                name: 'עונה 3 פרק 9 — עיתונאי ערבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_9_vod/avoda_aravit3_9_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'arabic-work-s3-ep10',
                season: 3,
                ep: 10,
                name: 'עונה 3 פרק 10 — מקלט',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S03/avoda_aravit3_10_vod/avoda_aravit3_10_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s3-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'arabic-work-s4-ep1',
                season: 4,
                ep: 1,
                name: 'עונה 4 פרק 1 — הריון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_1_vod_fix/avoda_aravit4_1_vod_fix_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'arabic-work-s4-ep2',
                season: 4,
                ep: 2,
                name: 'עונה 4 פרק 2 — כבוד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_2_vod/avoda_aravit4_2_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'arabic-work-s4-ep3',
                season: 4,
                ep: 3,
                name: 'עונה 4 פרק 3 — זהות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_3_vod/avoda_aravit4_3_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'arabic-work-s4-ep4',
                season: 4,
                ep: 4,
                name: 'עונה 4 פרק 4 — בית מאיר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_4_vod/avoda_aravit4_4_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'arabic-work-s4-ep5',
                season: 4,
                ep: 5,
                name: 'עונה 4 פרק 5 — לוטו',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_5_vod/avoda_aravit4_5_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'arabic-work-s4-ep6',
                season: 4,
                ep: 6,
                name: 'עונה 4 פרק 6 — שורף היערות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_6_vod/avoda_aravit4_6_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'arabic-work-s4-ep7',
                season: 4,
                ep: 7,
                name: 'עונה 4 פרק 7 — טעם ערבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_7_vod/avoda_aravit4_7_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'arabic-work-s4-ep8',
                season: 4,
                ep: 8,
                name: 'עונה 4 פרק 8 — ספורט לאומי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_8_vod/avoda_aravit4_8_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'arabic-work-s4-ep9',
                season: 4,
                ep: 9,
                name: 'עונה 4 פרק 9 — פייסבוק',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_9_vod/avoda_aravit4_9_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'arabic-work-s4-ep10',
                season: 4,
                ep: 10,
                name: 'עונה 4 פרק 10 — לידה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/avoda_aravit/S04/avoda_aravit4_10_vod/avoda_aravit4_10_vod_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/arabic-work/s4-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'the-head',
        name: 'הראש',
        placeholder: 'הראש',
        imageURL: 'images/kanbox/the-head/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'the-head-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — ההדלפה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_01_170325_VOD_n6ca65a/Harosh_01_170325_VOD_n6ca65a_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'the-head-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — על מי אפשר לסמוך?',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_02_230325_VOD_n3df519/Harosh_02_230325_VOD_n3df519_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'the-head-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — איתמר חוצה את הקווים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_03_300325_VOD_n36fy80b/Harosh_03_300325_VOD_n36fy80b_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'the-head-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — מבצע חילוץ',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_04_060425_VOD_n33ku5o/Harosh_04_060425_VOD_n33ku5o_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'the-head-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — נקודת המפנה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_05_150425_VOD_rtc3g5n/Harosh_05_150425_VOD_rtc3g5n_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'the-head-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — המלכודת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_06_200425_VOD_n45fs6f/Harosh_06_200425_VOD_n45fs6f_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'the-head-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — מבצע מבריק או טעות מסוכנת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_07_170425_VOD_n6r1u4/Harosh_07_170425_VOD_n6r1u4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'the-head-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — חשודה בבית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_08_040525_VOD_67nu7t2/Harosh_08_040525_VOD_67nu7t2_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'the-head-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — פרק סיום העונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Harosh/EP/Harosh_09_110525_VOD_5n67ho/Harosh_09_110525_VOD_5n67ho_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-head/s1-ep9.jpg',
                placeholder: '9'
            }
        ]
    },
{
        id: 'the-cops',
        name: 'השוטרים',
        placeholder: 'השוטרים',
        imageURL: 'images/kanbox/the-cops/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'the-cops-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — נהריה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_01_250121_vod_had49v/hashotrim_01_250121_vod_had49v_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'the-cops-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — חוקי המשחק',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/Hashotrim_02_260121_VOD_h6a6d49/Hashotrim_02_260121_VOD_h6a6d49_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'the-cops-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — אל תוך הלילה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_03_010221_vod_haew432/hashotrim_03_010221_vod_haew432_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'the-cops-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — אש',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_04_080221_vod_sns374/hashotrim_04_080221_vod_sns374_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'the-cops-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — הכי רחוק',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_05_150221_vod_had49v/hashotrim_05_150221_vod_had49v_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'the-cops-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — ניקוי אורוות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_06_220221_vod_dnu392/hashotrim_06_220221_vod_dnu392_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'the-cops-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — חג הקציר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_07_010321_vod_dks382/hashotrim_07_010321_vod_dks382_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'the-cops-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — האמת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S01/EP/hashotrim_08_080321_vod_mdj372/hashotrim_08_080321_vod_mdj372_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'the-cops-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1 — בחזרה לנהריה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_01_130623_vod_ndsh49v/hashotrim2_01_130623_vod_ndsh49v_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'the-cops-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2 — ההחלטה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_02_200623_vod_n323c/hashotrim2_02_200623_vod_n323c_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'the-cops-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3 — הבחירה של מיקי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_03_270623_vod_hads59n/hashotrim2_03_270623_vod_hads59n_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'the-cops-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4 — האולטימטום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_04_040723_vod_nfhg45/hashotrim2_04_040723_vod_nfhg45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'the-cops-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5 — הרומן מסתבך',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_05_110723_vod_21g45/hashotrim2_05_110723_vod_21g45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'the-cops-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6 — השוטרים נחשפים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_06_180723_vod_nkdfg54/hashotrim2_06_180723_vod_nkdfg54_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'the-cops-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7 — הפגישה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_07_010823_vod_arc43j4/hashotrim2_07_010823_vod_arc43j4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'the-cops-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8 — סוף הסיפור',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hashotrim/S02/EP/hashotrim2_08_070823_vod_sja330/hashotrim2_08_070823_vod_sja330_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-cops/s2-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'a-body-that-works',
        name: 'גוף שלישי',
        placeholder: 'גוף שלישי',
        imageURL: 'images/kanbox/a-body-that-works/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'a-body-that-works-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — המפגש הראשון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_01_130223_VOD_h2j79nb/Guf_Shlishi_01_130223_VOD_h2j79nb_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'a-body-that-works-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — הסיפור רק מתחיל',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_02_200323_VOD_nd3sh24b/Guf_Shlishi_02_200323_VOD_nd3sh24b_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'a-body-that-works-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — סדקים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_03_270223_VOD_n3kr4v5/Guf_Shlishi_03_270223_VOD_n3kr4v5_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'a-body-that-works-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — אין דרך חזרה?',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_04_060323_VOD_n31a0bk/Guf_Shlishi_04_060323_VOD_n31a0bk_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'a-body-that-works-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — הסודות מתגלים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_05_130323_VOD_nk51bgf4/Guf_Shlishi_05_130323_VOD_nk51bgf4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'a-body-that-works-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — הלילה שבו הכל מתהפך',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_06_200323_VOD_n3piuy78/Guf_Shlishi_06_200323_VOD_n3piuy78_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'a-body-that-works-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — הכל מסתחרר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_07_260323_VOD_n92lcm9/Guf_Shlishi_07_260323_VOD_n92lcm9_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'a-body-that-works-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — פרק הסיום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Guf_Shlishi/S01/EP/Guf_Shlishi_08_280323_VOD_na33dsh7/Guf_Shlishi_08_280323_VOD_na33dsh7_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/a-body-that-works/s1-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'she-is-with-me',
        name: 'להיות איתה',
        placeholder: 'להיות איתה',
        imageURL: 'images/kanbox/she-is-with-me/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'she-is-with-me-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — מרק ארטישוק',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_01_211113_VOD_gh45/Lehiyot_Ita_01_211113_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'she-is-with-me-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — סופרמן הישראלי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_02_251113_VOD_gh45/Lehiyot_Ita_02_251113_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'she-is-with-me-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — ביג בן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_03_021213_VOD_gh45/Lehiyot_Ita_03_021213_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'she-is-with-me-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — המעריץ של נועה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_04_161213_VOD_gh45/Lehiyot_Ita_04_161213_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'she-is-with-me-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — ארוחת שישי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_05_221213_VOD_gh45/Lehiyot_Ita_05_221213_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'she-is-with-me-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — הלילה המאושר בחייה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_06_291213_VOD_gh45/Lehiyot_Ita_06_291213_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'she-is-with-me-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — תכירו את עמוס',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_07_040114_VOD_gh45S/Lehiyot_Ita_07_040114_VOD_gh45S_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'she-is-with-me-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — הלך היום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_08_180114_VOD_gh45/Lehiyot_Ita_08_180114_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'she-is-with-me-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — בואי לאילת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_09_250114_VOD_gh45/Lehiyot_Ita_09_250114_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'she-is-with-me-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — פיט או עמוס',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S01/EP_HD/Lehiyot_Ita_10_010214_VOD_gh45/Lehiyot_Ita_10_010214_VOD_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'she-is-with-me-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1 — אבא בא',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_01_040517_vod_dses214/Lehiyot_Ita2_01_040517_vod_dses214_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'she-is-with-me-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2 — היום השחור בחייה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_02_090517_vod_dses214/Lehiyot_Ita2_02_090517_vod_dses214_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'she-is-with-me-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3 — יאיר מפעם',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_03_160517_vod_fad43/Lehiyot_Ita2_03_160517_vod_fad43_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'she-is-with-me-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4 — בשמלת כלה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_04_230517_vod_drd46/Lehiyot_Ita2_04_230517_vod_drd46_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'she-is-with-me-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5 — גנגסטר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_05_060617_vod_guk7453/Lehiyot_Ita2_05_060617_vod_guk7453_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'she-is-with-me-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6 — מה שקורה בבולגריה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_06_130617_vod_hjfm254/Lehiyot_Ita2_06_130617_vod_hjfm254_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'she-is-with-me-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7 — לא היה כלום - כי אין כלום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_07_200617_vod_fdv145/Lehiyot_Ita2_07_200617_vod_fdv145_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'she-is-with-me-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8 — Red Wedding',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_08_270617_vod_jihn543/Lehiyot_Ita2_08_270617_vod_jihn543_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'she-is-with-me-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9 — חדשות רעות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_09_040717_vod_kjfd241/Lehiyot_Ita2_09_040717_vod_kjfd241_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'she-is-with-me-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10 — גן עדן - סיום העונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S02/EP/Lehiyot_Ita2_10_110717_vod_gulds523/Lehiyot_Ita2_10_110717_vod_gulds523_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'she-is-with-me-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1 — Save the date',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S03/EP/Lehiyot_Ita3_01_121021_vod_gh45/Lehiyot_Ita3_01_121021_vod_gh45_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'she-is-with-me-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2 — ואז הגיע אביתר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S03/EP/Lehiyot_Ita3_02_191021_vod_fsv442/Lehiyot_Ita3_02_191021_vod_fsv442_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'she-is-with-me-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3 — תינוקה של ונסה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S03/EP/Lehiyot_Ita3_03_271021_vod_kug423/Lehiyot_Ita3_03_271021_vod_kug423_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'she-is-with-me-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4 — תגיד לי שאתה אוהב אותי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Lehiyot_Ita/S03/EP/Lehiyot_Ita3_04_031121_vod_hjv442/Lehiyot_Ita3_04_031121_vod_hjv442_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/she-is-with-me/s3-ep4.jpg',
                placeholder: '4'
            }
        ]
    },
{
        id: 'ismach-chatani',
        name: 'ישמח חתני',
        placeholder: 'ישמח חתני',
        imageURL: 'images/kanbox/ismach-chatani/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'ismach-chatani-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — אלף פעמים ח"י',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_01_060421_VOD_k3flg34/Ismach_Hatani_01_060421_VOD_k3flg34_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'ismach-chatani-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — גם אני שועלה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_02_060421_VOD_d2f8mk4/Ismach_Hatani_02_060421_VOD_d2f8mk4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'ismach-chatani-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — דילמת המעמול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_03_110421_VOD_ff2g34g/Ismach_Hatani_03_110421_VOD_ff2g34g_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'ismach-chatani-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — השכלה רבנית',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_04_120421_VOD_jv57kf6e/Ismach_Hatani_04_120421_VOD_jv57kf6e_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'ismach-chatani-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — בוא נתערב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_05_180421_VOD_dk3fl54/Ismach_Hatani_05_180421_VOD_dk3fl54_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'ismach-chatani-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — נקודת תורפה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_06_260421_VOD_fg2h55d/Ismach_Hatani_06_260421_VOD_fg2h55d_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'ismach-chatani-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — מילים קשות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_07_020521_VOD_fg2y56r/Ismach_Hatani_07_020521_VOD_fg2y56r_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'ismach-chatani-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — מה שטוב לך',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Ismach_Hatani/S01/EP/Ismach_Hatani_08_090521_VOD_mgj7h32/Ismach_Hatani_08_090521_VOD_mgj7h32_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ismach-chatani/s1-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'waking-bears',
        name: 'להעיר את הדב',
        placeholder: 'להעיר את הדב',
        imageURL: 'images/kanbox/waking-bears/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'waking-bears-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — יומנים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_01_120218_VOD_g2kf30f/Leheir_Et_Hadov_01_120218_VOD_g2kf30f_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'waking-bears-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — אזעקת אמת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_02_190218_VOD_s2kd39t/Leheir_Et_Hadov_02_190218_VOD_s2kd39t_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'waking-bears-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — להעיר דובים משנתם',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_03_010318_VOD_8hz64cz/Leheir_Et_Hadov_03_010318_VOD_8hz64cz_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'waking-bears-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — דומינו',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_04_080318_VOD_s5d7fjk99/Leheir_Et_Hadov_04_080318_VOD_s5d7fjk99_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'waking-bears-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — עורבים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_05_150318_VOD_fn8y3a2/Leheir_Et_Hadov_05_150318_VOD_fn8y3a2_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'waking-bears-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — גשר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_06_220318_VOD_b1tv24tr/Leheir_Et_Hadov_06_220318_VOD_b1tv24tr_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'waking-bears-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — פחד מוות או רצון טוב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_07_290318_VOD_4k49kmn/Leheir_Et_Hadov_07_290318_VOD_4k49kmn_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'waking-bears-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — גן חיות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_08_090418_VOD_t85bv3g/Leheir_Et_Hadov_08_090418_VOD_t85bv3g_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'waking-bears-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — שבת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_09_160418_VOD_6tzx6c7z/Leheir_Et_Hadov_09_160418_VOD_6tzx6c7z_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'waking-bears-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — פגיעות הדף - פרק סיום העונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Leheir_Et_Hadov/S01/Leheir_Et_Hadov_10_230418_VOD_r3fg96a/Leheir_Et_Hadov_10_230418_VOD_r3fg96a_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/waking-bears/s1-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'mommy',
        name: 'אמא\'לה',
        placeholder: 'אמא\'לה',
        imageURL: 'images/kanbox/mommy/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'mommy-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — שני פסים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_01_211205_VOD_v14sd1/Imale_01_211205_VOD_v14sd1_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mommy-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — אמא כן או לא',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_02_281205_VOD_v158gs/Imale_02_281205_VOD_v158gs_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mommy-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — אוי ואבוי מה עשיתי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_03_040106_VOD_mns9265/Imale_03_040106_VOD_mns9265_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mommy-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — אני יולדת!',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_04_180106_VOD_cmnlkj43/Imale_04_180106_VOD_cmnlkj43_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mommy-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — השיבה הביתה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_05_250106_VOD_vciw658/Imale_05_250106_VOD_vciw658_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mommy-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — טוב לי או רע לי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_06_010206_VOD_xcrtoij56/Imale_06_010206_VOD_xcrtoij56_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mommy-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — בחזרה לחיים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_07_080206_VOD_vckjn436/Imale_07_080206_VOD_vckjn436_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mommy-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — כל הטובים הם הומואים...',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_08_150206_VOD_fdgkj43/Imale_08_150206_VOD_fdgkj43_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'mommy-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — משפחתי וחיות אחרות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_09_010306_VOD_vkje6875/Imale_09_010306_VOD_vkje6875_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'mommy-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — סיום העונה: מי האבא?',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S01/Imale_10_080306_VOD_ruc297/Imale_10_080306_VOD_ruc297_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'mommy-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1 — בדיקת אבהות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_01_140307_VOD_1sv32f/Imale2_01_140307_VOD_1sv32f_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mommy-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2 — תפקיד האב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_02_210307_VOD_v15w6d/Imale2_02_210307_VOD_v15w6d_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mommy-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3 — הפעם הראשונה עם יואב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_03_280307_VOD_1dg3c2/Imale2_03_280307_VOD_1dg3c2_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mommy-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4 — היום הראשון בגן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_04_110407_VOD_1bs5f6/Imale2_04_110407_VOD_1bs5f6_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mommy-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5 — הכירו את דורון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_05_180407_VOD_v1d13d/Imale2_05_180407_VOD_v1d13d_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mommy-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6 — לילה עם יואב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_06_250407_VOD_4n56gf/Imale2_06_250407_VOD_4n56gf_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mommy-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7 — הסוד של פרנקו',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_07_020507_VOD_1vs56f/Imale2_07_020507_VOD_1vs56f_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mommy-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8 — צימר רומנטי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_08_090507_VOD_g156ds/Imale2_08_090507_VOD_g156ds_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'mommy-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9 — פרק סיום העונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/EP/Imale2_09_230507_VOD_bd121c/Imale2_09_230507_VOD_bd121c_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'mommy-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10 — הבלוג של אמא\'לה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S02/Specials/Imale2_Blog_Efrat_VOD_yzx7c6/Imale2_Blog_Efrat_VOD_yzx7c6_,500,850,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'mommy-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1 — חיים חדשים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_01_VOD_091108_tew6532/Imale3_01_VOD_091108_tew6532_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mommy-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2 — האיחוד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_02_VOD_101108_ew287/Imale3_02_VOD_101108_ew287_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mommy-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3 — חיים שכאלה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_03_VOD_171108_ety4598/Imale3_03_VOD_171108_ety4598_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mommy-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4 — תאילנד',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_04_VOD_241108_eyt27/Imale3_04_VOD_241108_eyt27_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mommy-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5 — יום הולדת ליואב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_05_VOD_011208_fdjh438/Imale3_05_VOD_011208_fdjh438_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mommy-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6 — היריון שני',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_06_VOD_081208_ytiu43/Imale3_06_VOD_081208_ytiu43_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mommy-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7 — האולטימטום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_07_VOD_151208_dfj47/Imale3_07_VOD_151208_dfj47_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mommy-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8 — החתונה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Imale/S03/Imale3_08_VOD_211208_gdsh65/Imale3_08_VOD_211208_gdsh65_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/mommy/s3-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'nutuk-drama',
        name: 'נוטוק',
        placeholder: 'נוטוק',
        imageURL: 'images/kanbox/nutuk-drama/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'nutuk-drama-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — המפגש ששינה הכול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_01_271025_VOD_vce413/Nutuk_01_271025_VOD_vce413_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'nutuk-drama-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — הכול הולך להשתנות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_02_041125_VOD_nol637/Nutuk_02_041125_VOD_nol637_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'nutuk-drama-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — הסודות שישנו הכול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_03_101125_VOD_bvf654/Nutuk_03_101125_VOD_bvf654_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'nutuk-drama-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — זיכרון מסוכן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_04_171125_VOD_nml731/Nutuk_04_171125_VOD_nml731_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'nutuk-drama-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — המפגש עם השב"כ',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_05_241125_VOD_qwa792/Nutuk_05_241125_VOD_qwa792_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'nutuk-drama-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — הסוד הגדול של עלי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_06_011225_VOD_gha456y/Nutuk_06_011225_VOD_gha456y_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'nutuk-drama-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — הסרטון שחושף את הסוד של עלי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_07_081225_VOD_kjh070/Nutuk_07_081225_VOD_kjh070_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'nutuk-drama-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — הסוף שאף אחד לא דמיין',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Nutuk_Clean/S01/EP/Nutuk_08_151225_VOD_pto421/Nutuk_08_151225_VOD_pto421_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nutuk-drama/s1-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'bufor',
        name: 'בופור',
        placeholder: 'בופור',
        imageURL: 'images/kanbox/bufor/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'bufor-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — מאחורי הקלעים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Bufor/Bufor_BTS_011009_VOD_u8zxc7e/Bufor_BTS_011009_VOD_u8zxc7e_,500,850,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/bufor/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bufor-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — פרק 1',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Bufor/Bufor_01_041009_VOD_5j6g7d5/Bufor_01_041009_VOD_5j6g7d5_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/bufor/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bufor-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — פרק 2',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Bufor/Bufor_02_111009_VOD_iu7t65r/Bufor_02_111009_VOD_iu7t65r_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/bufor/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bufor-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — פרק 3',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Bufor/Bufor_03_251009_VOD_ta1sc57/Bufor_03_251009_VOD_ta1sc57_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/bufor/s1-ep4.jpg',
                placeholder: '4'
            }
        ]
    },
{
        id: 'the-new-rich',
        name: 'העשירים החדשים',
        placeholder: 'העשירים החדשים',
        imageURL: 'images/kanbox/the-new-rich/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'the-new-rich-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — העשירים החדשים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Doco_Keshet/2022/April/Doco_keshet_250422_haashirim_VOD_gsk752/Doco_keshet_250422_haashirim_VOD_gsk752_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/the-new-rich/s1-ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'etti-alon',
        name: 'אתי אלון',
        placeholder: 'אתי אלון',
        imageURL: 'images/kanbox/etti-alon/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'etti-alon-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — אתי אלון | חלק א\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Doco_Keshet/eti_alon_01_VOD_prot532/eti_alon_01_VOD_prot532_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/etti-alon/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'etti-alon-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — אתי אלון | חלק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Doco_Keshet/doco_eti_alon_02_VOD_erh5b2/doco_eti_alon_02_VOD_erh5b2_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/etti-alon/s1-ep2.jpg',
                placeholder: '2'
            }
        ]
    },
{
        id: 'nicol-raidman',
        name: 'החיים החדשים של ניקול ראידמן',
        placeholder: 'החיים החדשים של ניקול ראידמן',
        imageURL: 'images/kanbox/nicol-raidman/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'nicol-raidman-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — חייה החדשים של ניקול ראידמן',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Doco_Keshet/ahaim_ahadashim_shel_nicole_raidman_doco_031019_VOD_183UGS/ahaim_ahadashim_shel_nicole_raidman_doco_031019_VOD_183UGS_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/nicol-raidman/s1-ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'likudnikim',
        name: 'הליכודניקים',
        placeholder: 'הליכודניקים',
        imageURL: 'images/kanbox/likudnikim/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'likudnikim-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — המטרה: שלטון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/uvda/Halikudnikim/uvda2019_halikudnikim_01_VOD_5jl14/uvda2019_halikudnikim_01_VOD_5jl14_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/likudnikim/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'likudnikim-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — מזימות בצמרת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/uvda/Halikudnikim/uvda2019_halikudnikim_02_VOD_rjl241/uvda2019_halikudnikim_02_VOD_rjl241_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/likudnikim/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'likudnikim-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — תאוות השלטון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/uvda/Halikudnikim/uvda2019_halikudnikim_03_VOD_kjh958/uvda2019_halikudnikim_03_VOD_kjh958_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/likudnikim/s1-ep3.jpg',
                placeholder: '3'
            }
        ]
    },
{
        id: 'dudu-topaz-case',
        name: 'תיק דודו טופז',
        placeholder: 'תיק דודו טופז',
        imageURL: 'images/kanbox/dudu-topaz-case/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'dudu-topaz-case-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — חקירה באפלה - פרק א\' ',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hassifa/Tik_Dudu_Topaz/Hassifa_Dudu_Topaz_01_160220_VOD_fi3k5g/Hassifa_Dudu_Topaz_01_160220_VOD_fi3k5g_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/dudu-topaz-case/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'dudu-topaz-case-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — תרגיל החקירה - פרק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hassifa/Tik_Dudu_Topaz/Hassifa_Dudu_Topaz_02_190220_VOD_i9as14/Hassifa_Dudu_Topaz_02_190220_VOD_i9as14_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/dudu-topaz-case/s1-ep2.jpg',
                placeholder: '2'
            }
        ]
    },
{
        id: 'life-is-difficult',
        name: 'החיים הם תקופה קשה',
        placeholder: 'החיים הם תקופה קשה',
        imageURL: 'images/kanbox/life-is-difficult/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'life-is-difficult-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — כיתת כוננות ביישוב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_01_230924_vod_arc6h6/Hachaim_Hem_Tkufa_Kasha_01_230924_vod_arc6h6_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'life-is-difficult-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — חנוך מקבל את השבת',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_02_300924_VOD_arc1212/Hachaim_Hem_Tkufa_Kasha_02_300924_VOD_arc1212_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'life-is-difficult-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — חנוך מתגייס לצה"ל',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_03_051024_VOD_arc6753/Hachaim_Hem_Tkufa_Kasha_03_051024_VOD_arc6753_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'life-is-difficult-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — ההתנחלות החדשה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_04_211024_VOD_arc3215/Hachaim_Hem_Tkufa_Kasha_04_211024_VOD_arc3215_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'life-is-difficult-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — מה לי ולפוליטיקה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_05_281024_VOD_arc653/Hachaim_Hem_Tkufa_Kasha_05_281024_VOD_arc653_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'life-is-difficult-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — הסיבוך עם האמריקאים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_06_041124_VOD_fds52d3/Hachaim_Hem_Tkufa_Kasha_06_041124_VOD_fds52d3_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'life-is-difficult-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — הטיול',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_07_181124_VOD_nu4yt11/Hachaim_Hem_Tkufa_Kasha_07_181124_VOD_nu4yt11_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'life-is-difficult-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — בחזרה לישיבה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Hachaim_Hem_Tkufa_Kasha/S01/EP/Hachaim_Hem_Tkufa_Kasha_08_181124_VOD_arc432/Hachaim_Hem_Tkufa_Kasha_08_181124_VOD_arc432_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/life-is-difficult/s1-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hanoch-daum-standup',
        name: 'חנוך דאום - ההופעה',
        placeholder: 'חנוך דאום - ההופעה',
        imageURL: 'images/kanbox/hanoch-daum-standup/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'hanoch-daum-standup-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — חנוך דאום - ההופעה',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Standup_Shows/Hanoch_Daum/Hanoch_Daum_Hofa_211019_VOD_as45gb/Hanoch_Daum_Hofa_211019_VOD_as45gb_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/hanoch-daum-standup/s1-ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'avi-nussbaum-standup',
        name: 'אבי נוסבאום - סטנדאפ',
        placeholder: 'אבי נוסבאום - סטנדאפ',
        imageURL: 'images/kanbox/avi-nussbaum-standup/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'avi-nussbaum-standup-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — אבי נוסבאום - סטנד אפ ראשון',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Standup_Shows/Avi_Nusbaum/Avi_Nusbaum_01_021019_VOD_bgt96f4/Avi_Nusbaum_01_021019_VOD_bgt96f4_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-nussbaum-standup/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'avi-nussbaum-standup-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — אבי נוסבאום - סטנד אפ שני',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Standup_Shows/Avi_Nusbaum/Avi_Nusbaum_02_090921_VOD_ohs23d2/Avi_Nusbaum_02_090921_VOD_ohs23d2_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-nussbaum-standup/s1-ep2.jpg',
                placeholder: '2'
            }
        ]
    },
{
        id: 'ori-hizkiah',
        name: 'אורי חזקיה – הופה לא קרה כלום',
        placeholder: 'אורי חזקיה – הופה לא קרה כלום',
        imageURL: 'images/kanbox/ori-hizkiah/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'ori-hizkiah-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — הופה לא קרה כלום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Standup_Shows/Ori_Hizkiah/Ori_Hizkiah_Lo_Kara_Klum_101022_VOD_wjcnes27/Ori_Hizkiah_Lo_Kara_Klum_101022_VOD_wjcnes27_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/ori-hizkiah/s1-ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'hundred-percent-ashkenazi',
        name: 'עדי אשכנזי - מאה אחוז סטנדאפ',
        placeholder: 'עדי אשכנזי - מאה אחוז סטנדאפ',
        imageURL: 'images/kanbox/hundred-percent-ashkenazi/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'hundred-percent-ashkenazi-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — עדי אשכנזי - מאה אחוז סטנדאפ',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/KESHET/Standup_Shows/Adi_Ashkenazi/Adi_Ashkenazi_100_Ahuz_Standup_130518_VOD_j76zx9a1/Adi_Ashkenazi_100_Ahuz_Standup_130518_VOD_j76zx9a1_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/hundred-percent-ashkenazi/s1-ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'avi-bitter',
        name: 'אבי ביטר חי בסרט',
        placeholder: 'אבי ביטר חי בסרט',
        imageURL: 'images/kanbox/avi-bitter/series.jpg',
        source: 'mako',
        episodes: [
            {
                id: 'avi-bitter-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1 — הכל אודות אבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_01_290411_VOD_c67v6c/Avi_Biter_Hai_Beseret_01_290411_VOD_c67v6c_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'avi-bitter-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2 — שעת הכוזרים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_02_060511_VOD_gas76c7/Avi_Biter_Hai_Beseret_02_060511_VOD_gas76c7_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'avi-bitter-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3 — שחק אותה אבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_03_130511_VOD_ha7sc62/Avi_Biter_Hai_Beseret_03_130511_VOD_ha7sc62_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'avi-bitter-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4 — אבי הולך בשדות',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_04_210511_VOD_i9zx7c7/Avi_Biter_Hai_Beseret_04_210511_VOD_i9zx7c7_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'avi-bitter-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5 — מי הפליל את אבי ביטר?',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_05_220711_VOD_98zx5cv/Avi_Biter_Hai_Beseret_05_220711_VOD_98zx5cv_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'avi-bitter-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6 — מליון דולר, אבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_06_290711_VOD_8as7ca2/Avi_Biter_Hai_Beseret_06_290711_VOD_8as7ca2_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'avi-bitter-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7 — אבי גנוב',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_07_050811_VOD_9zx7cq2/Avi_Biter_Hai_Beseret_07_050811_VOD_9zx7cq2_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'avi-bitter-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8 — הכוכבים של אבי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_08_120811_VOD_ka7c8a9/Avi_Biter_Hai_Beseret_08_120811_VOD_ka7c8a9_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'avi-bitter-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9 — רשימת אבי חלק א\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_09_190811_VOD_nz8xc78z/Avi_Biter_Hai_Beseret_09_190811_VOD_nz8xc78z_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'avi-bitter-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10 — רשימת אבי חלק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_10_260811_VOD_bz76xc6/Avi_Biter_Hai_Beseret_10_260811_VOD_bz76xc6_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'avi-bitter-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11 — כשאבי פגש את גילי',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_11_020911_VOD_iz87xc2/Avi_Biter_Hai_Beseret_11_020911_VOD_iz87xc2_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'avi-bitter-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12 — אבי מלך ירושלים',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_12_090911_VOD_n4zx5ca/Avi_Biter_Hai_Beseret_12_090911_VOD_n4zx5ca_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'avi-bitter-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13 — הטוב, הרע והביטר חלק א\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_13_160911_VOD_as65c7a/Avi_Biter_Hai_Beseret_13_160911_VOD_as65c7a_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'avi-bitter-ep14',
                season: 1,
                ep: 14,
                name: 'עונה 1 פרק 14 — הטוב, הרע והביטר חלק ב\'',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_14_230911_VOD_k9as7c/Avi_Biter_Hai_Beseret_14_230911_VOD_k9as7c_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'avi-bitter-ep15',
                season: 1,
                ep: 15,
                name: 'עונה 1 פרק 15 — ראיון עם ביטר',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_15_300911_VOD_7zc86zx/Avi_Biter_Hai_Beseret_15_300911_VOD_7zc86zx_,550,850,1400,2200,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'avi-bitter-ep16',
                season: 1,
                ep: 16,
                name: 'עונה 1 פרק 16 — פרק הסיום',
                streamURL: 'https://mako-vod.akamaized.net/i/VOD/BIP/Avi_Biter_Hai_Beseret/S01/Avi_Biter_Hai_Beseret_16_141011_VOD_a67sc5a/Avi_Biter_Hai_Beseret_16_141011_VOD_a67sc5a_,500,850,1200,2000,.mp4.csmil/master.m3u8',
                imageURL: 'images/kanbox/avi-bitter/s1-ep16.jpg',
                placeholder: '16'
            }
        ]
    },
{
        id: 'lo-lariv',
        name: 'לא לריב',
        placeholder: 'לא לריב',
        imageURL: 'images/kanbox/lo-lariv/series.jpg',
        episodes: [
            {
                id: 'lo-lariv-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194031/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'lo-lariv-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194032/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'lo-lariv-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194041/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'lo-lariv-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194042/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep4.png',
                placeholder: '4'
            },
            {
                id: 'lo-lariv-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194044/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'lo-lariv-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194045/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'lo-lariv-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194078/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'lo-lariv-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2194852/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/lo-lariv/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'kol-haimahot',
        name: 'כל האימהות משקרות',
        placeholder: 'כל האימהות משקרות',
        imageURL: 'images/kanbox/kol-haimahot/series.jpg',
        episodes: [
            {
                id: 'kol-haimahot-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2104131/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kol-haimahot-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2104178/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kol-haimahot-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2163874/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kol-haimahot-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2163875/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kol-haimahot-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2165518/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kol-haimahot-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2165519/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kol-haimahot-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2168318/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kol-haimahot-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2170554/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kol-haimahot-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2170571/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kol-haimahot/ep9.jpg',
                placeholder: '9'
            }
        ]
    },
{
        id: 'makom-sameach',
        name: 'מקום שמח',
        placeholder: 'מקום שמח',
        imageURL: 'images/kanbox/makom-sameach/series.jpg',
        episodes: [
            {
                id: 'makom-sameach-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1890934/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'makom-sameach-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1890935/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'makom-sameach-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1890937/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'makom-sameach-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1890938/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'makom-sameach-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1913610/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'makom-sameach-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1913611/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'makom-sameach-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1946467/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'makom-sameach-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1913647/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/makom-sameach/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'shisha-afasim',
        name: 'שישה אפסים',
        placeholder: 'שישה אפסים',
        imageURL: 'images/kanbox/shisha-afasim/series.jpg',
        episodes: [
            {
                id: 'shisha-afasim-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_q2ybozkc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shisha-afasim-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_g5llko7f/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shisha-afasim-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zq684ivr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shisha-afasim-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lpk0zvun/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shisha-afasim-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_l30zd0ir/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shisha-afasim-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_83i2k0qs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shisha-afasim-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dsk8tgf5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shisha-afasim-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_v5xmz0jh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shisha-afasim/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'sovietzka',
        name: 'סובייצקה',
        placeholder: 'סובייצקה',
        imageURL: 'images/kanbox/sovietzka/series.jpg',
        episodes: [
            {
                id: 'sovietzka-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j3m0510k/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'sovietzka-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4k7b3o5c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'sovietzka-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2m52trp4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'sovietzka-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ys93oedh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'sovietzka-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ofp29a6g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'sovietzka-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mlf7u2of/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'sovietzka-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_h9hw28j5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'sovietzka-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_afkd332r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/sovietzka/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hazarot',
        name: 'חזרות',
        placeholder: 'חזרות',
        imageURL: 'images/kanbox/hazarot/series.jpg',
        episodes: [
            {
                id: 'hazarot-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_817geznm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hazarot-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9r4v43jo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hazarot-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a4d23hat/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hazarot-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cae13m03/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hazarot-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pawj9j8q/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hazarot-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tdhrfqgf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hazarot-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8fuuygax/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hazarot-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jcbzlusy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hazarot-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_88m2sqqg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hazarot-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7yuptbxr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazarot/ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'shtokholm',
        name: 'שטוקהולם',
        placeholder: 'שטוקהולם',
        imageURL: 'images/kanbox/shtokholm/series.jpg',
        episodes: [
            {
                id: 'shtokholm-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0sygkyt2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shtokholm-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_usjmhtkz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shtokholm-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kyp57enp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shtokholm-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_23f60iwo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shtokholm-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j0yj95ph/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shtokholm-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_134f8w93/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shtokholm-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mh0hw6c2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shtokholm-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gbkrilcx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shtokholm-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5hq91xlh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shtokholm-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8rhb9ozy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shtokholm-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i7nvejit/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shtokholm-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cle4pyah/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shtokholm/s2-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'shaat-neila',
        name: 'שעת נעילה',
        placeholder: 'שעת נעילה',
        imageURL: 'images/kanbox/shaat-neila/series.jpg',
        episodes: [
            {
                id: 'shaat-neila-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fx0k9jpy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shaat-neila-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5ct5o3zt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shaat-neila-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fnfjorco/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shaat-neila-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2ihb33gr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'shaat-neila-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i64grnno/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'shaat-neila-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1lih95oz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-neila/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'carthago',
        name: 'קרתגו',
        placeholder: 'קרתגו',
        imageURL: 'images/kanbox/carthago/series.jpg',
        episodes: [
            {
                id: 'carthago-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_smjq0z1p/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'carthago-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8tlydi8n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'carthago-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jzuysdwa/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'carthago-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_f9tx1y7p/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'carthago-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ewxwehnx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'carthago-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8mjozo25/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'carthago-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_layjrmd6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'carthago-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_v9wvv25x/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'carthago-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_omn0f4db/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'carthago-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fooswayb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'carthago-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_237yl7es/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/carthago/ep11.jpg',
                placeholder: '11'
            }
        ]
    },
{
        id: 'tehran',
        name: 'טהרן',
        placeholder: 'טהרן',
        imageURL: 'images/kanbox/tehran/series.jpg',
        episodes: [
            {
                id: 'tehran-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m6svtndt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'tehran-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_soyoxje0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'tehran-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_67hnsb2y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'tehran-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d1p36pt9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'tehran-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w8a5og3l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'tehran-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qkp5yixn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'tehran-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0ep7d26r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'tehran-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2ww9ui9n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'tehran-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fanlu3fh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'tehran-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_88ds59jp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'tehran-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8ff00dg3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'tehran-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2219499/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'tehran-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8jc56xle/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'tehran-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_urlv5qt6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'tehran-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_g0l5fodi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'tehran-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nxsiduq9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'tehran-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5kuznpwi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'tehran-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xov7asuv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'tehran-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_am337lsk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'tehran-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7g2761vp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'tehran-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oh4gnroy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'tehran-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_l4f97mga/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'tehran-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2215001/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'tehran-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vszyia2l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tehran/s3-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hitnatkut',
        name: 'התנתקות',
        placeholder: 'התנתקות',
        imageURL: 'images/kanbox/hitnatkut/series.jpg',
        episodes: [
            {
                id: 'hitnatkut-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rqrz51v5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hitnatkut/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hitnatkut-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3uzd0uhk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hitnatkut/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hitnatkut-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tyxbny4k/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hitnatkut/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hitnatkut-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gj6kggrg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hitnatkut/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hitnatkut-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wl6qgw13/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hitnatkut/ep5.jpg',
                placeholder: '5'
            }
        ]
    },
{
        id: 'huliganim',
        name: 'חוליגנים',
        placeholder: 'חוליגנים',
        imageURL: 'images/kanbox/huliganim/series.jpg',
        episodes: [
            {
                id: 'huliganim-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gyb847em/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'huliganim-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lwpgomrg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'huliganim-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_udji50fc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'huliganim-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_aq74hhed/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'huliganim-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5zkrxnz1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'huliganim-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5ovgfs6n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'huliganim-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ra11gvgn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'huliganim-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d5yh9w7r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/huliganim/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'bahastora',
        name: 'בהסתורה',
        placeholder: 'בהסתורה',
        imageURL: 'images/kanbox/bahastora/series.jpg',
        episodes: [
            {
                id: 'bahastora-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2067094/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bahastora-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2011277/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bahastora-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2067158/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bahastora-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2011428/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bahastora-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2011472/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bahastora-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2067575/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bahastora-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2067576/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bahastora-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2073571/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bahastora-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2067577/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bahastora/ep9.jpg',
                placeholder: '9'
            }
        ]
    },
{
        id: 'yafa',
        name: 'יאפא',
        placeholder: 'יאפא',
        imageURL: 'images/kanbox/yafa/series.jpg',
        episodes: [
            {
                id: 'yafa-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1996314/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'yafa-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i7pfk7g4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'yafa-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tlsfmrhx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'yafa-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2219514/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'yafa-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lf42j4ai/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'yafa-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gwguo4rt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'yafa-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2215975/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'yafa-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w36nxiuw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/yafa/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hahamam',
        name: 'החמאם',
        placeholder: 'החמאם',
        imageURL: 'images/kanbox/hahamam/series.jpg',
        episodes: [
            {
                id: 'hahamam-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936432/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hahamam-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936433/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hahamam-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936434/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hahamam-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936463/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hahamam-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936464/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hahamam-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1936465/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hahamam/ep6.jpg',
                placeholder: '6'
            }
        ]
    },
{
        id: 'motek-bol',
        name: 'מותק בול באמצע',
        placeholder: 'מותק בול באמצע',
        imageURL: 'images/kanbox/motek-bol/series.jpg',
        episodes: [
            {
                id: 'motek-bol-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hbqqdhmk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'motek-bol-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ze2locd5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'motek-bol-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j8wou84p/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'motek-bol-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nnhij0ha/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'motek-bol-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dbruynrn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'motek-bol-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_chta5vsn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'motek-bol-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s7ofznkg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'motek-bol-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_05rkysal/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'motek-bol-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_btod6nze/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'motek-bol-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ksbqa6fo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'motek-bol-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9ng9c8jp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'motek-bol-s1-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j13xigcb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'motek-bol-s1-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cv7cf2sg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'motek-bol-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zarmqpvs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'motek-bol-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_583eng33/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'motek-bol-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vlu4kw1e/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'motek-bol-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6os4s5p5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'motek-bol-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gafim2ik/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'motek-bol-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qi9mpcw2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'motek-bol-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jceasoj6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'motek-bol-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rxjreqjp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'motek-bol-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dfvjm5r4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'motek-bol-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gwuh5rk5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/motek-bol/s2-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'hamazah',
        name: 'המזח',
        placeholder: 'המזח',
        imageURL: 'images/kanbox/hamazah/series.jpg',
        episodes: [
            {
                id: 'hamazah-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kx1e31tw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamazah/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamazah-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_h3g7trtp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamazah/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamazah-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mhuvabgz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamazah/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamazah-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a7vmyi27/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamazah/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamazah-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gyfpsaky/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamazah/ep5.jpg',
                placeholder: '5'
            }
        ]
    },
{
        id: 'migras-harusim',
        name: 'מגרש הרוסים',
        placeholder: 'מגרש הרוסים',
        imageURL: 'images/kanbox/migras-harusim/series.jpg',
        episodes: [
            {
                id: 'migras-harusim-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_g9r1iy0w/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'migras-harusim-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pn50viki/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'migras-harusim-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vglb2gy5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'migras-harusim-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5l3ykfcl/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'migras-harusim-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a51pyeui/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'migras-harusim-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5uua6li1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'migras-harusim-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kl18jeau/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'migras-harusim-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ux13c834/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/migras-harusim/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hamifkadet',
        name: 'המפקדת',
        placeholder: 'המפקדת',
        imageURL: 'images/kanbox/hamifkadet/series.jpg',
        episodes: [
            {
                id: 'hamifkadet-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hjkpi0ws/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamifkadet-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7y3xyo70/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamifkadet-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ft95bem9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamifkadet-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_frhxqfqs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamifkadet-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xlbw3son/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hamifkadet-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0skh2szn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hamifkadet-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mweq6d53/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hamifkadet-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d11lyylr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hamifkadet-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oukb7xm0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hamifkadet-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0mngkesx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'hamifkadet-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_b5qgipfs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamifkadet-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rw8wcwmn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamifkadet-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_phc92zcu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamifkadet-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6abyeeoy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamifkadet-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_byun7c99/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hamifkadet-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_eonygkg7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hamifkadet-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9p9rdcm9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hamifkadet-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1sf90ktm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hamifkadet-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lwmeesoz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hamifkadet-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rclbzzw3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'hamifkadet-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2216527/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hamifkadet-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7poovgt4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hamifkadet-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9yl7d297/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hamifkadet-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fy4x26np/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hamifkadet-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ew6rztg7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hamifkadet-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i1idr3if/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hamifkadet-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r9mpnanp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hamifkadet-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lekkvqvw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hamifkadet-s3-ep9',
                season: 3,
                ep: 9,
                name: 'עונה 3 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vq8jmv42/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hamifkadet-s3-ep10',
                season: 3,
                ep: 10,
                name: 'עונה 3 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hhqmvjqw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hamifkadet/s3-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'haemet',
        name: 'האמת',
        placeholder: 'האמת',
        imageURL: 'images/kanbox/haemet/series.jpg',
        episodes: [
            {
                id: 'haemet-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mniu8l17/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'haemet-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u437uzw6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'haemet-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3yd5xr4a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'haemet-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_eessqnd3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'haemet-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yc0rd2r9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'haemet-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_y6gn5pqw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'haemet-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_h9uhi6oo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'haemet-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8cbc27br/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haemet/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'haish-sheratza',
        name: 'האיש שרצה לדעת הכול',
        placeholder: 'האיש שרצה לדעת הכול',
        imageURL: 'images/kanbox/haish-sheratza/series.jpg',
        episodes: [
            {
                id: 'haish-sheratza-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6ee94am7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'haish-sheratza-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_59336558/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'haish-sheratza-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_b3rs7xhx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'haish-sheratza-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_f8vt085r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'haish-sheratza-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_y8dyyn1u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'haish-sheratza-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jpvyv06c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'haish-sheratza-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nni6we8d/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'haish-sheratza-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bcdksgxy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-sheratza/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hazvi',
        name: 'הצבי',
        placeholder: 'הצבי',
        imageURL: 'images/kanbox/hazvi/series.jpg',
        episodes: [
            {
                id: 'hazvi-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jxo65s0a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hazvi-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7whutnys/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hazvi-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1w7rhabb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hazvi-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jpfjwwyx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hazvi-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tnh20omj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hazvi-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2wn2j0dd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hazvi/ep6.jpg',
                placeholder: '6'
            }
        ]
    },
{
        id: 'menayek',
        name: 'מנאייכ',
        placeholder: 'מנאייכ',
        imageURL: 'images/kanbox/menayek/series.jpg',
        episodes: [
            {
                id: 'menayek-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_txt1zt6g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'menayek-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_27z9qlnw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'menayek-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j7sxj6k8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'menayek-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nscwudjb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'menayek-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ele82fol/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'menayek-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ypiaz9m7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'menayek-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rzuwbp72/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'menayek-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oovnojg0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'menayek-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_e8rulap6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'menayek-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rnc9b6hn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'menayek-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8j349kh7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'menayek-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qnmt6aqc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'menayek-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0bfzlxl0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'menayek-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_njbfku1j/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'menayek-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5lhx0si6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'menayek-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qxnjwcs0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'menayek-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qkr07pqs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'menayek-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_upky445w/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'menayek-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6rpy460k/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'menayek-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7k4nt7u8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'menayek-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4a6kir7n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'menayek-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tsgj6ml2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'menayek-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u03397eb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'menayek-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_si83kkaa/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'menayek-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bghfulgx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'menayek-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_f27osj0m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'menayek-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0mppw3wa/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'menayek-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8787h75d/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'menayek-s3-ep9',
                season: 3,
                ep: 9,
                name: 'עונה 3 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1zxap76o/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'menayek-s3-ep10',
                season: 3,
                ep: 10,
                name: 'עונה 3 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_52mtat4f/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/menayek/s3-ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'malach-mashchit',
        name: 'מלאך משחית',
        placeholder: 'מלאך משחית',
        imageURL: 'images/kanbox/malach-mashchit/series.jpg',
        episodes: [
            {
                id: 'malach-mashchit-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891552/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'malach-mashchit-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891554/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'malach-mashchit-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891555/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'malach-mashchit-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891557/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'malach-mashchit-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891556/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'malach-mashchit-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891560/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'malach-mashchit-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891562/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'malach-mashchit-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1891558/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/malach-mashchit/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'east-side',
        name: 'איסט סייד',
        placeholder: 'איסט סייד',
        imageURL: 'images/kanbox/east-side/series.jpg',
        episodes: [
            {
                id: 'east-side-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2bwu4ljw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'east-side-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_csproann/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'east-side-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2g2z2pzm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'east-side-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0z74cmxu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'east-side-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r67ltzcd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'east-side-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w76du5zr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'east-side-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jpnary4v/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'east-side-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_106mwb84/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'east-side-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m398kqj1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'east-side-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gr5vy24v/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/east-side/ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'aviram-katz',
        name: 'אבירם כץ',
        placeholder: 'אבירם כץ',
        imageURL: 'images/kanbox/aviram-katz/series.jpg',
        episodes: [
            {
                id: 'aviram-katz-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c2frjc2y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'aviram-katz-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qtit680g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'aviram-katz-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_q6v06kpy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'aviram-katz-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ua29nyhu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'aviram-katz-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qlt2g02i/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'aviram-katz-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5dve46d8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'aviram-katz-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_20p2rwbv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'aviram-katz-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_76sornrg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/aviram-katz/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'shaat-efes',
        name: 'שעת אפס',
        placeholder: 'שעת אפס',
        imageURL: 'images/kanbox/shaat-efes/series.jpg',
        episodes: [
            {
                id: 'shaat-efes-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jki5w0f8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'shaat-efes-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hkv2p7k8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'shaat-efes-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pvnnaka9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'shaat-efes-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gpkb34jq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'shaat-efes-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_buadolvt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'shaat-efes-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_17c19sbc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/shaat-efes/ep6.jpg',
                placeholder: '6'
            }
        ]
    },
{
        id: 'pamta',
        name: 'פמת"א',
        placeholder: 'פמת"א',
        imageURL: 'images/kanbox/pamta/series.jpg',
        episodes: [
            {
                id: 'pamta-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ln0gprb4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'pamta-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_o7tbqvmh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'pamta-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_04swx9mc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'pamta-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rxu6colh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'pamta-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w59praer/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'pamta-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_10gau56m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'pamta-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7lyak9ij/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'pamta-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i7n3g25q/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'pamta-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_081s6na3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'pamta-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vp32wt6y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'pamta-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c5cs9nws/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'pamta-s1-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wwyulmyk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'pamta-s1-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8iaxz5ih/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'pamta-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8jl7bngv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'pamta-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_olxxhudk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'pamta-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nlfhunvf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'pamta-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wymfqggj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'pamta-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lipuglgt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'pamta-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ipumyi3e/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'pamta-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_uo22i0ev/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'pamta-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ehdxhvbl/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/pamta/s2-ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'matir-agunot',
        name: 'מתיר עגונות',
        placeholder: 'מתיר עגונות',
        imageURL: 'images/kanbox/matir-agunot/series.jpg',
        episodes: [
            {
                id: 'matir-agunot-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5jv6cnyt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'matir-agunot-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nv4qz7or/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'matir-agunot-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ry0dmwo7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'matir-agunot-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_reorzb0e/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'matir-agunot-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c1o7dm89/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'matir-agunot-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7em6s6gp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'matir-agunot-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qazlamcp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'matir-agunot-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3vj6sxzd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'matir-agunot-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zcgtga0z/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'matir-agunot-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bo8hvupy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'matir-agunot-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lhhsmo2h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'matir-agunot-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0vs4zs72/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/matir-agunot/ep12.jpg',
                placeholder: '12'
            }
        ]
    },
{
        id: 'tik-needar',
        name: 'תיק נעדר',
        placeholder: 'תיק נעדר',
        imageURL: 'images/kanbox/tik-needar/series.jpg',
        episodes: [
            {
                id: 'tik-needar-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yqmgqpz1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'tik-needar-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_x1c9cs99/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'tik-needar-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dgauc2bl/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'tik-needar-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pulfmm2u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'tik-needar-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ikmd3r9g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'tik-needar-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_us6bunm8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'tik-needar-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xtm9bdgh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'tik-needar-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2by3d4jb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tik-needar/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'hed-kolech',
        name: 'הד קולך',
        placeholder: 'הד קולך',
        imageURL: 'images/kanbox/hed-kolech/series.jpg',
        episodes: [
            {
                id: 'hed-kolech-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m0gbfydv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hed-kolech-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ws0juznc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hed-kolech-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oskx3p6q/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hed-kolech-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9qr1tsix/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hed-kolech-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bxpzhofa/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hed-kolech-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j3i3roj2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hed-kolech-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qhdkblxb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hed-kolech-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qjnnfgcr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hed-kolech-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_en24tmqi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hed-kolech-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wn98hpeo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hed-kolech/ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'hadavar-hagadol',
        name: 'הדבר הגדול המיוחד',
        placeholder: 'הדבר הגדול המיוחד',
        imageURL: 'images/kanbox/hadavar-hagadol/series.jpg',
        episodes: [
            {
                id: 'hadavar-hagadol-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_p01v0gzy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hadavar-hagadol-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_18jz48km/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hadavar-hagadol-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9y4b7u39/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hadavar-hagadol-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pajul3kq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hadavar-hagadol-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_z01nc9dn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hadavar-hagadol-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_51yuxggu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hadavar-hagadol-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wgnn0hy1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hadavar-hagadol-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0luul0jo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hadavar-hagadol/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'mona',
        name: 'מונא',
        placeholder: 'מונא',
        imageURL: 'images/kanbox/mona/series.jpg',
        episodes: [
            {
                id: 'mona-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jgq2c4qo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'mona-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5hempk6u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'mona-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_y7274y7z/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'mona-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kipju3m1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'mona-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3mwmrd9o/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'mona-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_580t2j5h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'mona-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qdtvdgic/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'mona-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7a9j6yb1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/mona/ep8.jpg',
                placeholder: '8'
            }
        ]
    },
{
        id: 'echad-al-echad',
        name: 'אחד על אחד',
        placeholder: 'אחד על אחד',
        imageURL: 'images/kanbox/echad-al-echad/series.jpg',
        episodes: [
            {
                id: 'echad-al-echad-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dgokcsm7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'echad-al-echad-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3vrmw4lj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'echad-al-echad-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fc00ifzm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'echad-al-echad-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qmi1rxs9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'echad-al-echad-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m83i66wn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'echad-al-echad-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ib8jy5oi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'echad-al-echad-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cl0l0buj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'echad-al-echad-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_03y49m17/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'echad-al-echad-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r1ehsfy8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'echad-al-echad-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_quuf7z64/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/echad-al-echad/ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'haish-shemenaa',
        name: 'האיש שניסה למנוע מלחמה',
        placeholder: 'האיש שניסה למנוע מלחמה',
        imageURL: 'images/kanbox/haish-shemenaa/series.jpg',
        episodes: [
            {
                id: 'haish-shemenaa-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pcofar6l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/haish-shemenaa/ep1.jpg',
                placeholder: '1'
            }
        ]
    },
{
        id: 'halayla-haaroch',
        name: 'הלילה הארוך ביותר',
        placeholder: 'הלילה הארוך ביותר',
        imageURL: 'images/kanbox/halayla-haaroch/series.jpg',
        episodes: [
            {
                id: 'halayla-haaroch-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w2ja5hy1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/halayla-haaroch/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'halayla-haaroch-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_k73ws06t/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/halayla-haaroch/ep2.jpg',
                placeholder: '2'
            }
        ]
    },
{
        id: 'hatasritai',
        name: 'התסריטאי',
        placeholder: 'התסריטאי',
        imageURL: 'images/kanbox/hatasritai/series.jpg',
        episodes: [
            {
                id: 'hatasritai-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_p3y1xy2g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'hatasritai-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1oo0a145/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'hatasritai-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_i0ozt56h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'hatasritai-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r60znafz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'hatasritai-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qbhx0and/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'hatasritai-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2j36si5d/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'hatasritai-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u35wm3u1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'hatasritai-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_46by27nw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'hatasritai-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nwkmf59o/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'hatasritai-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_odhz69tx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/hatasritai/ep10.jpg',
                placeholder: '10'
            }
        ]
    },
{
        id: 'alumim',
        name: 'עלומים',
        placeholder: 'עלומים',
        imageURL: 'images/kanbox/alumim/series.jpg',
        episodes: [
            {
                id: 'alumim-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_avpzqwxi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'alumim-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1z78mwkr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'alumim-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2lx0iese/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'alumim-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cdd61q7l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'alumim-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a9a9fl0s/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'alumim-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7hz3fjv3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'alumim-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_prmxhte9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'alumim-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ya9vktsc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'alumim-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_52hvhhlg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/alumim/ep9.jpg',
                placeholder: '9'
            }
        ]
    },
{
        id: 'tapuchim-midbar',
        name: 'תפוחים מן המדבר',
        placeholder: 'תפוחים מן המדבר',
        imageURL: 'images/kanbox/tapuchim-midbar/series.jpg',
        episodes: [
            {
                id: 'tapuchim-midbar-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_twen8deu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tapuchim-midbar/ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'tapuchim-midbar-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ru4diuns/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tapuchim-midbar/ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'tapuchim-midbar-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_txr3tnvs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/tapuchim-midbar/ep3.jpg',
                placeholder: '3'
            }
        ]
    },
    {
        id: 'bou-leechol-iti',
        name: 'בואו לאכול איתי',
        placeholder: 'בואו לאכול איתי',
        imageURL: 'images/kanbox/bou-leechol-iti/series.jpg',
        source: 'kan',
        episodes: [
            {
                id: 'bou-leechol-iti-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mmctgjv9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ccyr13s3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_og4qc40r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ji81gky4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kr16fb4a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6wtcuks7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_083wjo8q/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_exmvghri/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_632vua1b/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cte9w33n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3q01tfp3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s1-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gx8dajj2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s1-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_l9ajk5xp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s1-ep14',
                season: 1,
                ep: 14,
                name: 'עונה 1 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tz22asxs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s1-ep15',
                season: 1,
                ep: 15,
                name: 'עונה 1 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yj3791jf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s1-ep16',
                season: 1,
                ep: 16,
                name: 'עונה 1 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9trgp95j/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s1-ep17',
                season: 1,
                ep: 17,
                name: 'עונה 1 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_emjef7c4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s1-ep18',
                season: 1,
                ep: 18,
                name: 'עונה 1 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_uxmar41w/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s1-ep19',
                season: 1,
                ep: 19,
                name: 'עונה 1 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gcws7zy4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s1-ep20',
                season: 1,
                ep: 20,
                name: 'עונה 1 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ooy4jk3s/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s1-ep21',
                season: 1,
                ep: 21,
                name: 'עונה 1 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_56oqmbqo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s1-ep22',
                season: 1,
                ep: 22,
                name: 'עונה 1 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zyzbt3uf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s1-ep23',
                season: 1,
                ep: 23,
                name: 'עונה 1 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1ronh1b4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s1-ep24',
                season: 1,
                ep: 24,
                name: 'עונה 1 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_67s8ve2h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s1-ep25',
                season: 1,
                ep: 25,
                name: 'עונה 1 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_toeadf3n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s1-ep26',
                season: 1,
                ep: 26,
                name: 'עונה 1 פרק 26',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_p7qudjkk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep26.jpg',
                placeholder: '26'
            },
            {
                id: 'bou-leechol-iti-s1-ep27',
                season: 1,
                ep: 27,
                name: 'עונה 1 פרק 27',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lkpv4tw3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep27.jpg',
                placeholder: '27'
            },
            {
                id: 'bou-leechol-iti-s1-ep28',
                season: 1,
                ep: 28,
                name: 'עונה 1 פרק 28',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bu0phj87/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep28.jpg',
                placeholder: '28'
            },
            {
                id: 'bou-leechol-iti-s1-ep29',
                season: 1,
                ep: 29,
                name: 'עונה 1 פרק 29',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s8nrfpro/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep29.jpg',
                placeholder: '29'
            },
            {
                id: 'bou-leechol-iti-s1-ep30',
                season: 1,
                ep: 30,
                name: 'עונה 1 פרק 30',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5tn286g3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep30.jpg',
                placeholder: '30'
            },
            {
                id: 'bou-leechol-iti-s1-ep31',
                season: 1,
                ep: 31,
                name: 'עונה 1 פרק 31',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_plll6kv2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep31.jpg',
                placeholder: '31'
            },
            {
                id: 'bou-leechol-iti-s1-ep32',
                season: 1,
                ep: 32,
                name: 'עונה 1 פרק 32',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rq9vlfro/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep32.jpg',
                placeholder: '32'
            },
            {
                id: 'bou-leechol-iti-s1-ep33',
                season: 1,
                ep: 33,
                name: 'עונה 1 פרק 33',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9ozgdwfv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep33.jpg',
                placeholder: '33'
            },
            {
                id: 'bou-leechol-iti-s1-ep34',
                season: 1,
                ep: 34,
                name: 'עונה 1 פרק 34',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_092gxgxh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep34.jpg',
                placeholder: '34'
            },
            {
                id: 'bou-leechol-iti-s1-ep35',
                season: 1,
                ep: 35,
                name: 'עונה 1 פרק 35',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tbsr0442/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep35.jpg',
                placeholder: '35'
            },
            {
                id: 'bou-leechol-iti-s1-ep36',
                season: 1,
                ep: 36,
                name: 'עונה 1 פרק 36',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mfvj41si/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep36.jpg',
                placeholder: '36'
            },
            {
                id: 'bou-leechol-iti-s1-ep37',
                season: 1,
                ep: 37,
                name: 'עונה 1 פרק 37',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gy7tl46a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep37.jpg',
                placeholder: '37'
            },
            {
                id: 'bou-leechol-iti-s1-ep38',
                season: 1,
                ep: 38,
                name: 'עונה 1 פרק 38',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ou31bwmu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep38.jpg',
                placeholder: '38'
            },
            {
                id: 'bou-leechol-iti-s1-ep39',
                season: 1,
                ep: 39,
                name: 'עונה 1 פרק 39',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_be2a7jnf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep39.jpg',
                placeholder: '39'
            },
            {
                id: 'bou-leechol-iti-s1-ep40',
                season: 1,
                ep: 40,
                name: 'עונה 1 פרק 40',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dzobvhjm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep40.jpg',
                placeholder: '40'
            },
            {
                id: 'bou-leechol-iti-s1-ep41',
                season: 1,
                ep: 41,
                name: 'עונה 1 פרק 41',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jghrpea8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep41.jpg',
                placeholder: '41'
            },
            {
                id: 'bou-leechol-iti-s1-ep42',
                season: 1,
                ep: 42,
                name: 'עונה 1 פרק 42',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_iw57wmka/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep42.jpg',
                placeholder: '42'
            },
            {
                id: 'bou-leechol-iti-s1-ep43',
                season: 1,
                ep: 43,
                name: 'עונה 1 פרק 43',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bpoexsq6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep43.jpg',
                placeholder: '43'
            },
            {
                id: 'bou-leechol-iti-s1-ep44',
                season: 1,
                ep: 44,
                name: 'עונה 1 פרק 44',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9e34ege2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep44.jpg',
                placeholder: '44'
            },
            {
                id: 'bou-leechol-iti-s1-ep45',
                season: 1,
                ep: 45,
                name: 'עונה 1 פרק 45',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2ltg68lo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep45.jpg',
                placeholder: '45'
            },
            {
                id: 'bou-leechol-iti-s1-ep46',
                season: 1,
                ep: 46,
                name: 'עונה 1 פרק 46',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6sjt2qdp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep46.jpg',
                placeholder: '46'
            },
            {
                id: 'bou-leechol-iti-s1-ep47',
                season: 1,
                ep: 47,
                name: 'עונה 1 פרק 47',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zz5g4wct/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep47.jpg',
                placeholder: '47'
            },
            {
                id: 'bou-leechol-iti-s1-ep48',
                season: 1,
                ep: 48,
                name: 'עונה 1 פרק 48',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_takvrzt1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep48.jpg',
                placeholder: '48'
            },
            {
                id: 'bou-leechol-iti-s1-ep49',
                season: 1,
                ep: 49,
                name: 'עונה 1 פרק 49',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_343bdijt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep49.jpg',
                placeholder: '49'
            },
            {
                id: 'bou-leechol-iti-s1-ep50',
                season: 1,
                ep: 50,
                name: 'עונה 1 פרק 50',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cmr7aqht/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s1-ep50.jpg',
                placeholder: '50'
            },
            {
                id: 'bou-leechol-iti-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nl9ktzkq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5wgai0jd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_si6yg6f9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_sbc46bi2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8lcguw3i/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d1l79dn7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_b9vttv9m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u06tdcto/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cdsvn9di/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ew1cli1l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s2-ep11',
                season: 2,
                ep: 11,
                name: 'עונה 2 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7ubbcu5y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s2-ep12',
                season: 2,
                ep: 12,
                name: 'עונה 2 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zd9b3efz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s2-ep13',
                season: 2,
                ep: 13,
                name: 'עונה 2 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_png09iqh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s2-ep14',
                season: 2,
                ep: 14,
                name: 'עונה 2 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lku3p1ff/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s2-ep15',
                season: 2,
                ep: 15,
                name: 'עונה 2 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u1d9ikh8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s2-ep16',
                season: 2,
                ep: 16,
                name: 'עונה 2 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_t0url48p/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s2-ep17',
                season: 2,
                ep: 17,
                name: 'עונה 2 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8fgqvpdf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s2-ep18',
                season: 2,
                ep: 18,
                name: 'עונה 2 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fdnrcnie/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s2-ep19',
                season: 2,
                ep: 19,
                name: 'עונה 2 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qhyfm4k3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s2-ep20',
                season: 2,
                ep: 20,
                name: 'עונה 2 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_spv8vhl9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s2-ep21',
                season: 2,
                ep: 21,
                name: 'עונה 2 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vmwx3zfk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s2-ep22',
                season: 2,
                ep: 22,
                name: 'עונה 2 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ntnmd8fy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s2-ep23',
                season: 2,
                ep: 23,
                name: 'עונה 2 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a8dg9g5o/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s2-ep24',
                season: 2,
                ep: 24,
                name: 'עונה 2 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bb39gclh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s2-ep25',
                season: 2,
                ep: 25,
                name: 'עונה 2 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ydv27vvf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s2-ep26',
                season: 2,
                ep: 26,
                name: 'עונה 2 פרק 26',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c3jpugzh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep26.jpg',
                placeholder: '26'
            },
            {
                id: 'bou-leechol-iti-s2-ep27',
                season: 2,
                ep: 27,
                name: 'עונה 2 פרק 27',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_h345rpfi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep27.jpg',
                placeholder: '27'
            },
            {
                id: 'bou-leechol-iti-s2-ep28',
                season: 2,
                ep: 28,
                name: 'עונה 2 פרק 28',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2cjxhieu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep28.jpg',
                placeholder: '28'
            },
            {
                id: 'bou-leechol-iti-s2-ep29',
                season: 2,
                ep: 29,
                name: 'עונה 2 פרק 29',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ubv25fcj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep29.jpg',
                placeholder: '29'
            },
            {
                id: 'bou-leechol-iti-s2-ep30',
                season: 2,
                ep: 30,
                name: 'עונה 2 פרק 30',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vxz33o8h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep30.jpg',
                placeholder: '30'
            },
            {
                id: 'bou-leechol-iti-s2-ep31',
                season: 2,
                ep: 31,
                name: 'עונה 2 פרק 31',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_sgls6ecv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep31.jpg',
                placeholder: '31'
            },
            {
                id: 'bou-leechol-iti-s2-ep32',
                season: 2,
                ep: 32,
                name: 'עונה 2 פרק 32',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5dabhxj1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep32.jpg',
                placeholder: '32'
            },
            {
                id: 'bou-leechol-iti-s2-ep33',
                season: 2,
                ep: 33,
                name: 'עונה 2 פרק 33',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5lm8rn1k/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep33.jpg',
                placeholder: '33'
            },
            {
                id: 'bou-leechol-iti-s2-ep34',
                season: 2,
                ep: 34,
                name: 'עונה 2 פרק 34',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_z9qo88tx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep34.jpg',
                placeholder: '34'
            },
            {
                id: 'bou-leechol-iti-s2-ep35',
                season: 2,
                ep: 35,
                name: 'עונה 2 פרק 35',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j7zfvdap/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep35.jpg',
                placeholder: '35'
            },
            {
                id: 'bou-leechol-iti-s2-ep36',
                season: 2,
                ep: 36,
                name: 'עונה 2 פרק 36',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m8l2daov/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep36.jpg',
                placeholder: '36'
            },
            {
                id: 'bou-leechol-iti-s2-ep37',
                season: 2,
                ep: 37,
                name: 'עונה 2 פרק 37',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rh7vzsa3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep37.jpg',
                placeholder: '37'
            },
            {
                id: 'bou-leechol-iti-s2-ep38',
                season: 2,
                ep: 38,
                name: 'עונה 2 פרק 38',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_arxwainn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep38.jpg',
                placeholder: '38'
            },
            {
                id: 'bou-leechol-iti-s2-ep39',
                season: 2,
                ep: 39,
                name: 'עונה 2 פרק 39',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2wfwws4c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep39.jpg',
                placeholder: '39'
            },
            {
                id: 'bou-leechol-iti-s2-ep40',
                season: 2,
                ep: 40,
                name: 'עונה 2 פרק 40',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2g7dc5uw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep40.jpg',
                placeholder: '40'
            },
            {
                id: 'bou-leechol-iti-s2-ep41',
                season: 2,
                ep: 41,
                name: 'עונה 2 פרק 41',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_um3kbdws/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep41.jpg',
                placeholder: '41'
            },
            {
                id: 'bou-leechol-iti-s2-ep42',
                season: 2,
                ep: 42,
                name: 'עונה 2 פרק 42',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_z1bhmzf6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep42.jpg',
                placeholder: '42'
            },
            {
                id: 'bou-leechol-iti-s2-ep43',
                season: 2,
                ep: 43,
                name: 'עונה 2 פרק 43',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cf2vmadk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep43.jpg',
                placeholder: '43'
            },
            {
                id: 'bou-leechol-iti-s2-ep44',
                season: 2,
                ep: 44,
                name: 'עונה 2 פרק 44',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_apmmk32v/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep44.jpg',
                placeholder: '44'
            },
            {
                id: 'bou-leechol-iti-s2-ep45',
                season: 2,
                ep: 45,
                name: 'עונה 2 פרק 45',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_552etxtf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep45.jpg',
                placeholder: '45'
            },
            {
                id: 'bou-leechol-iti-s2-ep46',
                season: 2,
                ep: 46,
                name: 'עונה 2 פרק 46',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8iafmvyi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep46.jpg',
                placeholder: '46'
            },
            {
                id: 'bou-leechol-iti-s2-ep47',
                season: 2,
                ep: 47,
                name: 'עונה 2 פרק 47',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_x8znyoj5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep47.jpg',
                placeholder: '47'
            },
            {
                id: 'bou-leechol-iti-s2-ep48',
                season: 2,
                ep: 48,
                name: 'עונה 2 פרק 48',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ojdseyxh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep48.jpg',
                placeholder: '48'
            },
            {
                id: 'bou-leechol-iti-s2-ep49',
                season: 2,
                ep: 49,
                name: 'עונה 2 פרק 49',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ncgwq11m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep49.jpg',
                placeholder: '49'
            },
            {
                id: 'bou-leechol-iti-s2-ep50',
                season: 2,
                ep: 50,
                name: 'עונה 2 פרק 50',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7ibhrisi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s2-ep50.jpg',
                placeholder: '50'
            },
            {
                id: 'bou-leechol-iti-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cmt5nln5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lx1zbpzw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m22magtc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w2z2bggb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0wu3bh5l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wrpao7hi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_b0nzmxqi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nig386i8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s3-ep9',
                season: 3,
                ep: 9,
                name: 'עונה 3 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_11r1jyq2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s3-ep10',
                season: 3,
                ep: 10,
                name: 'עונה 3 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_omnfugkf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s3-ep11',
                season: 3,
                ep: 11,
                name: 'עונה 3 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4cy9zrez/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s3-ep12',
                season: 3,
                ep: 12,
                name: 'עונה 3 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6txad8ew/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s3-ep13',
                season: 3,
                ep: 13,
                name: 'עונה 3 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1nuh1i64/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s3-ep14',
                season: 3,
                ep: 14,
                name: 'עונה 3 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1tkhp39g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s3-ep15',
                season: 3,
                ep: 15,
                name: 'עונה 3 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_n29bg1cm/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s3-ep16',
                season: 3,
                ep: 16,
                name: 'עונה 3 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c8hxno23/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s3-ep17',
                season: 3,
                ep: 17,
                name: 'עונה 3 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_evc0zrrs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s3-ep18',
                season: 3,
                ep: 18,
                name: 'עונה 3 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4528sucw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s3-ep19',
                season: 3,
                ep: 19,
                name: 'עונה 3 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_l5kow3mw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s3-ep20',
                season: 3,
                ep: 20,
                name: 'עונה 3 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1hagrsnk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s3-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s4-ep1',
                season: 4,
                ep: 1,
                name: 'עונה 4 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nqo3dry4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s4-ep2',
                season: 4,
                ep: 2,
                name: 'עונה 4 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fk5ep4od/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s4-ep3',
                season: 4,
                ep: 3,
                name: 'עונה 4 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fzm19ha7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s4-ep4',
                season: 4,
                ep: 4,
                name: 'עונה 4 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ercrfdnj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s4-ep5',
                season: 4,
                ep: 5,
                name: 'עונה 4 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3cy3yguu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s4-ep6',
                season: 4,
                ep: 6,
                name: 'עונה 4 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8pymh1kv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s4-ep7',
                season: 4,
                ep: 7,
                name: 'עונה 4 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wxtqs9o2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s4-ep8',
                season: 4,
                ep: 8,
                name: 'עונה 4 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s2vp4q76/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s4-ep9',
                season: 4,
                ep: 9,
                name: 'עונה 4 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_l2nsvtf6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s4-ep10',
                season: 4,
                ep: 10,
                name: 'עונה 4 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_43kz2sc6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s4-ep11',
                season: 4,
                ep: 11,
                name: 'עונה 4 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hcsq8qr4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s4-ep12',
                season: 4,
                ep: 12,
                name: 'עונה 4 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xh8yxmli/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s4-ep13',
                season: 4,
                ep: 13,
                name: 'עונה 4 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ak31uo7c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s4-ep14',
                season: 4,
                ep: 14,
                name: 'עונה 4 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_v8lgn1sh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s4-ep15',
                season: 4,
                ep: 15,
                name: 'עונה 4 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_e37lae4y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s4-ep16',
                season: 4,
                ep: 16,
                name: 'עונה 4 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fv1yr23a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s4-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s5-ep1',
                season: 5,
                ep: 1,
                name: 'עונה 5 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ujm3avm0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s5-ep2',
                season: 5,
                ep: 2,
                name: 'עונה 5 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ialxn8dz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s5-ep3',
                season: 5,
                ep: 3,
                name: 'עונה 5 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_teet87ik/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s5-ep4',
                season: 5,
                ep: 4,
                name: 'עונה 5 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pq1hxou5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s5-ep5',
                season: 5,
                ep: 5,
                name: 'עונה 5 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_n49jttzy/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s5-ep6',
                season: 5,
                ep: 6,
                name: 'עונה 5 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pebg971m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s5-ep7',
                season: 5,
                ep: 7,
                name: 'עונה 5 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5huhrraq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s5-ep8',
                season: 5,
                ep: 8,
                name: 'עונה 5 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ped8k6t8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s5-ep9',
                season: 5,
                ep: 9,
                name: 'עונה 5 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s4ud2fhu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s5-ep10',
                season: 5,
                ep: 10,
                name: 'עונה 5 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rhrkhygk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s5-ep11',
                season: 5,
                ep: 11,
                name: 'עונה 5 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yulzx92m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s5-ep12',
                season: 5,
                ep: 12,
                name: 'עונה 5 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cv27ad0n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s5-ep13',
                season: 5,
                ep: 13,
                name: 'עונה 5 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_iv9a9uct/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s5-ep14',
                season: 5,
                ep: 14,
                name: 'עונה 5 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_feza89mb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s5-ep15',
                season: 5,
                ep: 15,
                name: 'עונה 5 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oiskfjrf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s5-ep16',
                season: 5,
                ep: 16,
                name: 'עונה 5 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xzgmk0wf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s5-ep17',
                season: 5,
                ep: 17,
                name: 'עונה 5 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ihyqiowf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s5-ep18',
                season: 5,
                ep: 18,
                name: 'עונה 5 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qduyvd7b/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s5-ep19',
                season: 5,
                ep: 19,
                name: 'עונה 5 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_973bsr1i/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s5-ep20',
                season: 5,
                ep: 20,
                name: 'עונה 5 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8w7yi8fx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s5-ep21',
                season: 5,
                ep: 21,
                name: 'עונה 5 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hej6g43c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s5-ep22',
                season: 5,
                ep: 22,
                name: 'עונה 5 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r5vyhknf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s5-ep23',
                season: 5,
                ep: 23,
                name: 'עונה 5 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yzeyixpr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s5-ep24',
                season: 5,
                ep: 24,
                name: 'עונה 5 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zl8r4i2k/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s5-ep25',
                season: 5,
                ep: 25,
                name: 'עונה 5 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_meiy1rqt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s5-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s6-ep1',
                season: 6,
                ep: 1,
                name: 'עונה 6 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zrnayk92/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s6-ep2',
                season: 6,
                ep: 2,
                name: 'עונה 6 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mgt5o2i7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s6-ep3',
                season: 6,
                ep: 3,
                name: 'עונה 6 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vpcc9x7b/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s6-ep4',
                season: 6,
                ep: 4,
                name: 'עונה 6 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_uob2xny5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s6-ep5',
                season: 6,
                ep: 5,
                name: 'עונה 6 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_uzq1fhpn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s6-ep6',
                season: 6,
                ep: 6,
                name: 'עונה 6 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_migv1q50/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s6-ep7',
                season: 6,
                ep: 7,
                name: 'עונה 6 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4cnyd0z6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s6-ep8',
                season: 6,
                ep: 8,
                name: 'עונה 6 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_a2ecqd2q/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s6-ep9',
                season: 6,
                ep: 9,
                name: 'עונה 6 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ieov6hbv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s6-ep10',
                season: 6,
                ep: 10,
                name: 'עונה 6 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9unc5sho/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s6-ep11',
                season: 6,
                ep: 11,
                name: 'עונה 6 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_y7vcyz4a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s6-ep12',
                season: 6,
                ep: 12,
                name: 'עונה 6 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_muvy2t20/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s6-ep13',
                season: 6,
                ep: 13,
                name: 'עונה 6 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tprg4jg4/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s6-ep14',
                season: 6,
                ep: 14,
                name: 'עונה 6 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u0xqj9zu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s6-ep15',
                season: 6,
                ep: 15,
                name: 'עונה 6 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bzfvlnsi/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s6-ep16',
                season: 6,
                ep: 16,
                name: 'עונה 6 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2dit0dto/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s6-ep17',
                season: 6,
                ep: 17,
                name: 'עונה 6 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_o88cxld1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s6-ep18',
                season: 6,
                ep: 18,
                name: 'עונה 6 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2lx3p9mc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s6-ep19',
                season: 6,
                ep: 19,
                name: 'עונה 6 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8egf2z48/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s6-ep20',
                season: 6,
                ep: 20,
                name: 'עונה 6 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cp2amlni/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s6-ep21',
                season: 6,
                ep: 21,
                name: 'עונה 6 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_glrzojai/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s6-ep22',
                season: 6,
                ep: 22,
                name: 'עונה 6 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qcr6phdk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s6-ep23',
                season: 6,
                ep: 23,
                name: 'עונה 6 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yv7iztxt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s6-ep24',
                season: 6,
                ep: 24,
                name: 'עונה 6 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w5nmf87l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s6-ep25',
                season: 6,
                ep: 25,
                name: 'עונה 6 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gb9gy0j3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s6-ep26',
                season: 6,
                ep: 26,
                name: 'עונה 6 פרק 26',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_24mreiuw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep26.jpg',
                placeholder: '26'
            },
            {
                id: 'bou-leechol-iti-s6-ep27',
                season: 6,
                ep: 27,
                name: 'עונה 6 פרק 27',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xm8em9tq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep27.jpg',
                placeholder: '27'
            },
            {
                id: 'bou-leechol-iti-s6-ep28',
                season: 6,
                ep: 28,
                name: 'עונה 6 פרק 28',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dpuvd0y3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep28.jpg',
                placeholder: '28'
            },
            {
                id: 'bou-leechol-iti-s6-ep29',
                season: 6,
                ep: 29,
                name: 'עונה 6 פרק 29',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9gciezsn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep29.jpg',
                placeholder: '29'
            },
            {
                id: 'bou-leechol-iti-s6-ep30',
                season: 6,
                ep: 30,
                name: 'עונה 6 פרק 30',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bx5untes/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s6-ep30.jpg',
                placeholder: '30'
            },
            {
                id: 'bou-leechol-iti-s7-ep1',
                season: 7,
                ep: 1,
                name: 'עונה 7 פרק 1',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s7-ep2',
                season: 7,
                ep: 2,
                name: 'עונה 7 פרק 2',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s7-ep3',
                season: 7,
                ep: 3,
                name: 'עונה 7 פרק 3',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s7-ep4',
                season: 7,
                ep: 4,
                name: 'עונה 7 פרק 4',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s7-ep5',
                season: 7,
                ep: 5,
                name: 'עונה 7 פרק 5',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s7-ep6',
                season: 7,
                ep: 6,
                name: 'עונה 7 פרק 6',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s7-ep7',
                season: 7,
                ep: 7,
                name: 'עונה 7 פרק 7',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s7-ep8',
                season: 7,
                ep: 8,
                name: 'עונה 7 פרק 8',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s7-ep9',
                season: 7,
                ep: 9,
                name: 'עונה 7 פרק 9',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s7-ep10',
                season: 7,
                ep: 10,
                name: 'עונה 7 פרק 10',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s7-ep11',
                season: 7,
                ep: 11,
                name: 'עונה 7 פרק 11',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s7-ep12',
                season: 7,
                ep: 12,
                name: 'עונה 7 פרק 12',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s7-ep13',
                season: 7,
                ep: 13,
                name: 'עונה 7 פרק 13',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s7-ep14',
                season: 7,
                ep: 14,
                name: 'עונה 7 פרק 14',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s7-ep15',
                season: 7,
                ep: 15,
                name: 'עונה 7 פרק 15',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s7-ep16',
                season: 7,
                ep: 16,
                name: 'עונה 7 פרק 16',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s7-ep17',
                season: 7,
                ep: 17,
                name: 'עונה 7 פרק 17',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s7-ep18',
                season: 7,
                ep: 18,
                name: 'עונה 7 פרק 18',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s7-ep19',
                season: 7,
                ep: 19,
                name: 'עונה 7 פרק 19',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s7-ep20',
                season: 7,
                ep: 20,
                name: 'עונה 7 פרק 20',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s7-ep21',
                season: 7,
                ep: 21,
                name: 'עונה 7 פרק 21',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s7-ep22',
                season: 7,
                ep: 22,
                name: 'עונה 7 פרק 22',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s7-ep23',
                season: 7,
                ep: 23,
                name: 'עונה 7 פרק 23',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s7-ep24',
                season: 7,
                ep: 24,
                name: 'עונה 7 פרק 24',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s7-ep25',
                season: 7,
                ep: 25,
                name: 'עונה 7 פרק 25',
                streamURL: '',
                imageURL: 'images/kanbox/bou-leechol-iti/s7-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s8-ep1',
                season: 8,
                ep: 1,
                name: 'עונה 8 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_bhh22ujv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s8-ep2',
                season: 8,
                ep: 2,
                name: 'עונה 8 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pkd55cik/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s8-ep3',
                season: 8,
                ep: 3,
                name: 'עונה 8 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4z05eubp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s8-ep4',
                season: 8,
                ep: 4,
                name: 'עונה 8 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_b1jzsc4y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s8-ep5',
                season: 8,
                ep: 5,
                name: 'עונה 8 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fcr5wabn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s8-ep6',
                season: 8,
                ep: 6,
                name: 'עונה 8 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3mbogv69/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s8-ep7',
                season: 8,
                ep: 7,
                name: 'עונה 8 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qwys5j3u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s8-ep8',
                season: 8,
                ep: 8,
                name: 'עונה 8 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_96fmr8nq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s8-ep9',
                season: 8,
                ep: 9,
                name: 'עונה 8 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vsop39ew/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s8-ep10',
                season: 8,
                ep: 10,
                name: 'עונה 8 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_hcnd83q6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s8-ep11',
                season: 8,
                ep: 11,
                name: 'עונה 8 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wuu8yb90/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s8-ep12',
                season: 8,
                ep: 12,
                name: 'עונה 8 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u6hpdkm6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s8-ep13',
                season: 8,
                ep: 13,
                name: 'עונה 8 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d3f6veyf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s8-ep14',
                season: 8,
                ep: 14,
                name: 'עונה 8 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_be60t2fd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s8-ep15',
                season: 8,
                ep: 15,
                name: 'עונה 8 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zekfjmbh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s8-ep16',
                season: 8,
                ep: 16,
                name: 'עונה 8 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ziop4g8c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s8-ep17',
                season: 8,
                ep: 17,
                name: 'עונה 8 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_q010f67e/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s8-ep18',
                season: 8,
                ep: 18,
                name: 'עונה 8 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_e3vlqkg3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s8-ep19',
                season: 8,
                ep: 19,
                name: 'עונה 8 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_73to2erv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s8-ep20',
                season: 8,
                ep: 20,
                name: 'עונה 8 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_52e8opip/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s8-ep21',
                season: 8,
                ep: 21,
                name: 'עונה 8 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tqom13ar/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s8-ep22',
                season: 8,
                ep: 22,
                name: 'עונה 8 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_4x4zrwv7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s8-ep23',
                season: 8,
                ep: 23,
                name: 'עונה 8 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_c9iuhtj3/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s8-ep24',
                season: 8,
                ep: 24,
                name: 'עונה 8 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dn867d51/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s8-ep25',
                season: 8,
                ep: 25,
                name: 'עונה 8 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6cmm9uu0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s8-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s9-ep1',
                season: 9,
                ep: 1,
                name: 'עונה 9 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_e7xqikb0/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s9-ep2',
                season: 9,
                ep: 2,
                name: 'עונה 9 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zufe4e5l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s9-ep3',
                season: 9,
                ep: 3,
                name: 'עונה 9 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dsnjx3va/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s9-ep4',
                season: 9,
                ep: 4,
                name: 'עונה 9 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1aunwvwb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s9-ep5',
                season: 9,
                ep: 5,
                name: 'עונה 9 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_q6zzhc1h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'bou-leechol-iti-s9-ep6',
                season: 9,
                ep: 6,
                name: 'עונה 9 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_niw2pf3r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'bou-leechol-iti-s9-ep7',
                season: 9,
                ep: 7,
                name: 'עונה 9 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ylm12pcn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'bou-leechol-iti-s9-ep8',
                season: 9,
                ep: 8,
                name: 'עונה 9 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_nu5taj4v/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'bou-leechol-iti-s9-ep9',
                season: 9,
                ep: 9,
                name: 'עונה 9 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_65l3ursv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'bou-leechol-iti-s9-ep10',
                season: 9,
                ep: 10,
                name: 'עונה 9 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0wen0y1j/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'bou-leechol-iti-s9-ep11',
                season: 9,
                ep: 11,
                name: 'עונה 9 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6j7axklg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'bou-leechol-iti-s9-ep12',
                season: 9,
                ep: 12,
                name: 'עונה 9 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3kha4cqj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'bou-leechol-iti-s9-ep13',
                season: 9,
                ep: 13,
                name: 'עונה 9 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fhtt9cis/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'bou-leechol-iti-s9-ep14',
                season: 9,
                ep: 14,
                name: 'עונה 9 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8vgn5zww/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'bou-leechol-iti-s9-ep15',
                season: 9,
                ep: 15,
                name: 'עונה 9 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3nehm7dk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'bou-leechol-iti-s9-ep16',
                season: 9,
                ep: 16,
                name: 'עונה 9 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zvlfdljb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'bou-leechol-iti-s9-ep17',
                season: 9,
                ep: 17,
                name: 'עונה 9 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kdircrx1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'bou-leechol-iti-s9-ep18',
                season: 9,
                ep: 18,
                name: 'עונה 9 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8myfweto/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'bou-leechol-iti-s9-ep19',
                season: 9,
                ep: 19,
                name: 'עונה 9 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_o0pvvvwj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'bou-leechol-iti-s9-ep20',
                season: 9,
                ep: 20,
                name: 'עונה 9 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xhniczdw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'bou-leechol-iti-s9-ep21',
                season: 9,
                ep: 21,
                name: 'עונה 9 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0hu13r1m/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'bou-leechol-iti-s9-ep22',
                season: 9,
                ep: 22,
                name: 'עונה 9 פרק 22',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xdalfbok/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep22.jpg',
                placeholder: '22'
            },
            {
                id: 'bou-leechol-iti-s9-ep23',
                season: 9,
                ep: 23,
                name: 'עונה 9 פרק 23',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3cn5fjhb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep23.jpg',
                placeholder: '23'
            },
            {
                id: 'bou-leechol-iti-s9-ep24',
                season: 9,
                ep: 24,
                name: 'עונה 9 פרק 24',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_j9qtgjlo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep24.jpg',
                placeholder: '24'
            },
            {
                id: 'bou-leechol-iti-s9-ep25',
                season: 9,
                ep: 25,
                name: 'עונה 9 פרק 25',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_8klffr73/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s9-ep25.jpg',
                placeholder: '25'
            },
            {
                id: 'bou-leechol-iti-s10-ep1',
                season: 10,
                ep: 1,
                name: 'עונה 10 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2184202/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s10-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'bou-leechol-iti-s10-ep2',
                season: 10,
                ep: 2,
                name: 'עונה 10 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2184205/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s10-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'bou-leechol-iti-s10-ep3',
                season: 10,
                ep: 3,
                name: 'עונה 10 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2184209/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s10-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'bou-leechol-iti-s10-ep4',
                season: 10,
                ep: 4,
                name: 'עונה 10 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2184216/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s10-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'bou-leechol-iti-s10-ep5',
                season: 10,
                ep: 5,
                name: 'עונה 10 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/2184249/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/bou-leechol-iti/s10-ep5.jpg',
                placeholder: '5'
            }
        ]
    },
    {
        id: 'kupa-rashit',
        name: 'קופה ראשית',
        placeholder: 'קופה ראשית',
        imageURL: 'images/kanbox/kupa-rashit/series.jpg',
        source: 'kan',
        episodes: [
            {
                id: 'kupa-rashit-s1-ep1',
                season: 1,
                ep: 1,
                name: 'עונה 1 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fb26cqkv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kupa-rashit-s1-ep2',
                season: 1,
                ep: 2,
                name: 'עונה 1 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9fqvzvk6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kupa-rashit-s1-ep3',
                season: 1,
                ep: 3,
                name: 'עונה 1 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_d1xlv7uu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kupa-rashit-s1-ep4',
                season: 1,
                ep: 4,
                name: 'עונה 1 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_iy0id2fh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kupa-rashit-s1-ep5',
                season: 1,
                ep: 5,
                name: 'עונה 1 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3o3uz0b8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kupa-rashit-s1-ep6',
                season: 1,
                ep: 6,
                name: 'עונה 1 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yg6g7s55/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kupa-rashit-s1-ep7',
                season: 1,
                ep: 7,
                name: 'עונה 1 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_sy72fxz1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kupa-rashit-s1-ep8',
                season: 1,
                ep: 8,
                name: 'עונה 1 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zfr1x8uu/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kupa-rashit-s1-ep9',
                season: 1,
                ep: 9,
                name: 'עונה 1 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9g6hxdyc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'kupa-rashit-s1-ep10',
                season: 1,
                ep: 10,
                name: 'עונה 1 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_atp9dczt/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'kupa-rashit-s1-ep11',
                season: 1,
                ep: 11,
                name: 'עונה 1 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_m6ts083a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'kupa-rashit-s1-ep12',
                season: 1,
                ep: 12,
                name: 'עונה 1 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_9vny92qe/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'kupa-rashit-s1-ep13',
                season: 1,
                ep: 13,
                name: 'עונה 1 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xykp9qau/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'kupa-rashit-s1-ep14',
                season: 1,
                ep: 14,
                name: 'עונה 1 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mgove66l/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'kupa-rashit-s1-ep15',
                season: 1,
                ep: 15,
                name: 'עונה 1 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r8vnmkcs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'kupa-rashit-s1-ep16',
                season: 1,
                ep: 16,
                name: 'עונה 1 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qsppx5cn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'kupa-rashit-s1-ep17',
                season: 1,
                ep: 17,
                name: 'עונה 1 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tsz6366y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'kupa-rashit-s1-ep18',
                season: 1,
                ep: 18,
                name: 'עונה 1 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mkb6ofzb/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'kupa-rashit-s1-ep19',
                season: 1,
                ep: 19,
                name: 'עונה 1 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_caqiupm2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'kupa-rashit-s1-ep20',
                season: 1,
                ep: 20,
                name: 'עונה 1 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dsolgd88/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s1-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'kupa-rashit-s2-ep1',
                season: 2,
                ep: 1,
                name: 'עונה 2 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zmdljg8g/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kupa-rashit-s2-ep2',
                season: 2,
                ep: 2,
                name: 'עונה 2 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kxavyw9n/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kupa-rashit-s2-ep3',
                season: 2,
                ep: 3,
                name: 'עונה 2 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_juj9uaa7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kupa-rashit-s2-ep4',
                season: 2,
                ep: 4,
                name: 'עונה 2 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_28ruvlzc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kupa-rashit-s2-ep5',
                season: 2,
                ep: 5,
                name: 'עונה 2 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_fhen1fb5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kupa-rashit-s2-ep6',
                season: 2,
                ep: 6,
                name: 'עונה 2 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_izy77qyx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kupa-rashit-s2-ep7',
                season: 2,
                ep: 7,
                name: 'עונה 2 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qrz6imlk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kupa-rashit-s2-ep8',
                season: 2,
                ep: 8,
                name: 'עונה 2 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_n0i1khx6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kupa-rashit-s2-ep9',
                season: 2,
                ep: 9,
                name: 'עונה 2 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_lupa6vd7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'kupa-rashit-s2-ep10',
                season: 2,
                ep: 10,
                name: 'עונה 2 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_xm478vjs/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'kupa-rashit-s2-ep11',
                season: 2,
                ep: 11,
                name: 'עונה 2 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_g197oqsp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'kupa-rashit-s2-ep12',
                season: 2,
                ep: 12,
                name: 'עונה 2 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3g1tzc7j/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'kupa-rashit-s2-ep13',
                season: 2,
                ep: 13,
                name: 'עונה 2 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kvtuphm6/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'kupa-rashit-s2-ep14',
                season: 2,
                ep: 14,
                name: 'עונה 2 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_x2g9r4th/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'kupa-rashit-s2-ep15',
                season: 2,
                ep: 15,
                name: 'עונה 2 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_e3w7edqc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'kupa-rashit-s2-ep16',
                season: 2,
                ep: 16,
                name: 'עונה 2 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gbbascsx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'kupa-rashit-s2-ep17',
                season: 2,
                ep: 17,
                name: 'עונה 2 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_by2ib41h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'kupa-rashit-s2-ep18',
                season: 2,
                ep: 18,
                name: 'עונה 2 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0casqzkz/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'kupa-rashit-s2-ep19',
                season: 2,
                ep: 19,
                name: 'עונה 2 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0w4m9wy9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'kupa-rashit-s2-ep20',
                season: 2,
                ep: 20,
                name: 'עונה 2 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cyi4po0y/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s2-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'kupa-rashit-s3-ep1',
                season: 3,
                ep: 1,
                name: 'עונה 3 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_82w8k0c5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kupa-rashit-s3-ep2',
                season: 3,
                ep: 2,
                name: 'עונה 3 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_2ki7470h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kupa-rashit-s3-ep3',
                season: 3,
                ep: 3,
                name: 'עונה 3 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_g8cyt11h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kupa-rashit-s3-ep4',
                season: 3,
                ep: 4,
                name: 'עונה 3 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_cxas4zeg/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kupa-rashit-s3-ep5',
                season: 3,
                ep: 5,
                name: 'עונה 3 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_x3ws6gqf/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kupa-rashit-s3-ep6',
                season: 3,
                ep: 6,
                name: 'עונה 3 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_izrc96f1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kupa-rashit-s3-ep7',
                season: 3,
                ep: 7,
                name: 'עונה 3 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_o0cwkkdx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kupa-rashit-s3-ep8',
                season: 3,
                ep: 8,
                name: 'עונה 3 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_78f0wfds/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kupa-rashit-s3-ep9',
                season: 3,
                ep: 9,
                name: 'עונה 3 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0u7ww7ra/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'kupa-rashit-s3-ep10',
                season: 3,
                ep: 10,
                name: 'עונה 3 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_kgjp9o69/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'kupa-rashit-s3-ep11',
                season: 3,
                ep: 11,
                name: 'עונה 3 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_18dxu1pv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'kupa-rashit-s3-ep12',
                season: 3,
                ep: 12,
                name: 'עונה 3 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_36oxutp8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'kupa-rashit-s3-ep13',
                season: 3,
                ep: 13,
                name: 'עונה 3 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_gbkacurp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'kupa-rashit-s3-ep14',
                season: 3,
                ep: 14,
                name: 'עונה 3 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_u2xsbwcl/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'kupa-rashit-s3-ep15',
                season: 3,
                ep: 15,
                name: 'עונה 3 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mbsfbd14/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'kupa-rashit-s3-ep16',
                season: 3,
                ep: 16,
                name: 'עונה 3 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_doz50dac/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'kupa-rashit-s3-ep17',
                season: 3,
                ep: 17,
                name: 'עונה 3 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_0uqk5wrq/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'kupa-rashit-s3-ep18',
                season: 3,
                ep: 18,
                name: 'עונה 3 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_39qpmixn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'kupa-rashit-s3-ep19',
                season: 3,
                ep: 19,
                name: 'עונה 3 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zwn2iij7/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'kupa-rashit-s3-ep20',
                season: 3,
                ep: 20,
                name: 'עונה 3 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zwye398c/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s3-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'kupa-rashit-s4-ep1',
                season: 4,
                ep: 1,
                name: 'עונה 4 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_n43jd6mv/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kupa-rashit-s4-ep2',
                season: 4,
                ep: 2,
                name: 'עונה 4 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w947m7ob/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kupa-rashit-s4-ep3',
                season: 4,
                ep: 3,
                name: 'עונה 4 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_pcevjog2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kupa-rashit-s4-ep4',
                season: 4,
                ep: 4,
                name: 'עונה 4 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ibw56c1a/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kupa-rashit-s4-ep5',
                season: 4,
                ep: 5,
                name: 'עונה 4 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_q3gq4xv8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kupa-rashit-s4-ep6',
                season: 4,
                ep: 6,
                name: 'עונה 4 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vnfoyflo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kupa-rashit-s4-ep7',
                season: 4,
                ep: 7,
                name: 'עונה 4 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_13b9cvbn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kupa-rashit-s4-ep8',
                season: 4,
                ep: 8,
                name: 'עונה 4 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_w6dy5g0u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kupa-rashit-s4-ep9',
                season: 4,
                ep: 9,
                name: 'עונה 4 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_1l6hnkxl/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'kupa-rashit-s4-ep10',
                season: 4,
                ep: 10,
                name: 'עונה 4 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jl3sasxn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'kupa-rashit-s4-ep11',
                season: 4,
                ep: 11,
                name: 'עונה 4 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_024nre1r/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'kupa-rashit-s4-ep12',
                season: 4,
                ep: 12,
                name: 'עונה 4 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_mlmogo8p/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'kupa-rashit-s4-ep13',
                season: 4,
                ep: 13,
                name: 'עונה 4 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_rgn48t8i/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'kupa-rashit-s4-ep14',
                season: 4,
                ep: 14,
                name: 'עונה 4 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_t3zyukcc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'kupa-rashit-s4-ep15',
                season: 4,
                ep: 15,
                name: 'עונה 4 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_r54njmqc/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'kupa-rashit-s4-ep16',
                season: 4,
                ep: 16,
                name: 'עונה 4 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_oh3ibb1e/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'kupa-rashit-s4-ep17',
                season: 4,
                ep: 17,
                name: 'עונה 4 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_224zhzz1/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'kupa-rashit-s4-ep18',
                season: 4,
                ep: 18,
                name: 'עונה 4 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s5m9en7h/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'kupa-rashit-s4-ep19',
                season: 4,
                ep: 19,
                name: 'עונה 4 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6fpnrrj2/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'kupa-rashit-s4-ep20',
                season: 4,
                ep: 20,
                name: 'עונה 4 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_258n00fh/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep20.jpg',
                placeholder: '20'
            },
            {
                id: 'kupa-rashit-s4-ep21',
                season: 4,
                ep: 21,
                name: 'עונה 4 פרק 21',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jbskw8uo/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s4-ep21.jpg',
                placeholder: '21'
            },
            {
                id: 'kupa-rashit-s5-ep1',
                season: 5,
                ep: 1,
                name: 'עונה 5 פרק 1',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_csokhtwe/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep1.jpg',
                placeholder: '1'
            },
            {
                id: 'kupa-rashit-s5-ep2',
                season: 5,
                ep: 2,
                name: 'עונה 5 פרק 2',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_ygac97dd/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep2.jpg',
                placeholder: '2'
            },
            {
                id: 'kupa-rashit-s5-ep3',
                season: 5,
                ep: 3,
                name: 'עונה 5 פרק 3',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_y8emnwxk/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep3.jpg',
                placeholder: '3'
            },
            {
                id: 'kupa-rashit-s5-ep4',
                season: 5,
                ep: 4,
                name: 'עונה 5 פרק 4',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_wy8yk2x8/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep4.jpg',
                placeholder: '4'
            },
            {
                id: 'kupa-rashit-s5-ep5',
                season: 5,
                ep: 5,
                name: 'עונה 5 פרק 5',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_6hu0lscj/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep5.jpg',
                placeholder: '5'
            },
            {
                id: 'kupa-rashit-s5-ep6',
                season: 5,
                ep: 6,
                name: 'עונה 5 פרק 6',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_s0q279mn/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep6.jpg',
                placeholder: '6'
            },
            {
                id: 'kupa-rashit-s5-ep7',
                season: 5,
                ep: 7,
                name: 'עונה 5 פרק 7',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5p7jjjrp/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep7.jpg',
                placeholder: '7'
            },
            {
                id: 'kupa-rashit-s5-ep8',
                season: 5,
                ep: 8,
                name: 'עונה 5 פרק 8',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_5ngslrzw/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep8.jpg',
                placeholder: '8'
            },
            {
                id: 'kupa-rashit-s5-ep9',
                season: 5,
                ep: 9,
                name: 'עונה 5 פרק 9',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_jqv5sitx/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep9.jpg',
                placeholder: '9'
            },
            {
                id: 'kupa-rashit-s5-ep10',
                season: 5,
                ep: 10,
                name: 'עונה 5 פרק 10',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_obykbxe5/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep10.jpg',
                placeholder: '10'
            },
            {
                id: 'kupa-rashit-s5-ep11',
                season: 5,
                ep: 11,
                name: 'עונה 5 פרק 11',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_zxfko38u/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep11.jpg',
                placeholder: '11'
            },
            {
                id: 'kupa-rashit-s5-ep12',
                season: 5,
                ep: 12,
                name: 'עונה 5 פרק 12',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_tlmlvinr/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep12.jpg',
                placeholder: '12'
            },
            {
                id: 'kupa-rashit-s5-ep13',
                season: 5,
                ep: 13,
                name: 'עונה 5 פרק 13',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_7nsefeax/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep13.jpg',
                placeholder: '13'
            },
            {
                id: 'kupa-rashit-s5-ep14',
                season: 5,
                ep: 14,
                name: 'עונה 5 פרק 14',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_vi0ry1k9/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep14.jpg',
                placeholder: '14'
            },
            {
                id: 'kupa-rashit-s5-ep15',
                season: 5,
                ep: 15,
                name: 'עונה 5 פרק 15',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_qpghua73/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep15.jpg',
                placeholder: '15'
            },
            {
                id: 'kupa-rashit-s5-ep16',
                season: 5,
                ep: 16,
                name: 'עונה 5 פרק 16',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_3689jjet/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep16.jpg',
                placeholder: '16'
            },
            {
                id: 'kupa-rashit-s5-ep17',
                season: 5,
                ep: 17,
                name: 'עונה 5 פרק 17',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_h1ep540j/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep17.jpg',
                placeholder: '17'
            },
            {
                id: 'kupa-rashit-s5-ep18',
                season: 5,
                ep: 18,
                name: 'עונה 5 פרק 18',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_53p36y85/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep18.jpg',
                placeholder: '18'
            },
            {
                id: 'kupa-rashit-s5-ep19',
                season: 5,
                ep: 19,
                name: 'עונה 5 פרק 19',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_dv1lnase/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep19.jpg',
                placeholder: '19'
            },
            {
                id: 'kupa-rashit-s5-ep20',
                season: 5,
                ep: 20,
                name: 'עונה 5 פרק 20',
                streamURL: 'https://r.il.cdn-redge.media/webcache/gorigin/hls/oil/kancdn/vod/1_yjw40b1s/LIBCODER_SMOOTH_1080_KAN/Manifest.ism/playlist.m3u8?fmp4',
                imageURL: 'images/kanbox/kupa-rashit/s5-ep20.jpg',
                placeholder: '20'
            }
        ]
    }
];
