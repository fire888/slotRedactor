

export const SLOT_MACHINE_CONFIG = {
    symbol: {
        width: 289,
        height: 259,
    },
    verticalDivider: 0,
    horizontalDivider: 0,
    frameTop: 0,
    frameBottom: -3,
    frameLeft: 0,
    frameRight: 0,
    ANIMATION_SLOTS: {
        beginTween: {
            fromValue: 0,
            middleValueOne: -0.7,
            middleValueTwo: 0.7,
            toValue: 2.3,
            duration: 400,
        },
        endTween: {
            middleValueOneAddToDist: 0.3,
            middleValueTwoAddToDist: -0.3,
            duration: 400,
            timeSoundOffset: -100,
        },
        playStates: {
            speed: 0.28,
            dist: 16,
            slotsOffset: 8,
            scattersOffset: 0,
        },
    },
    ANIMATION_SYMBOLS: {
        timeAnimationLine: 1300,
        autoPlayStates: {
            timeShowTotalWin: 1500,
            timeShowWinLine: 1500,
        },
        playStates: {
            timeShowTotalWin: 1500,
            timeShowWinLine: 1500,
        },
        freeStates: {
            // timeShowTotalWin: 1500,
            timeShowWinLine: 1500,
            timeAnimationBonus: 230,
            pauseAfterLastBonusItem: 3000,
        },
    },
    length: 4,
}


export const SUPER_PRIZE_EFFECT_CONFIG = {
    text: {
        titles: {
            'BIG_WIN': 'Win!',
            'SUPER_WIN': 'Big Win!',
            'MEGA_WIN': 'Mega Win!',
            'JACKPOT': 'Super Win!'
        },
        styleNumbers: [
            "TitleFont",
            {
                "fontWeight": "bold",
                dropShadow: true,
                dropShadowAngle: 0.7,
                dropShadowBlur: 10,
                dropShadowColor: "#152228",
                dropShadowDistance: 2,
                fill: [
                    "#d8c22e",
                    "#fdfdcc",
                    "#fbc115"
                ],
                fontFamily: "Arial Black",
                fontSize: 250,
                letterSpacing: 0,
                stroke: "#ff33cc",
                strokeThickness: 9,
            },
            {
                chars: [['0', '9'], '.']
            }
        ]
    },
    toggleShowTime: 1000,
    toggleHideTime: 300,
    money: {
        minHeight: -200,
        maxHeight: -1200,
        width: 1500,
        num: 1500,
        y: 0,
    },
    dark: {
        color: 0x000020,
        alpha: 0.9,
        blend: 'MULTIPLY',
    },
    speedMoneyBetsInSec: 130,
    lights: {
        keyTexture: 'light2.png',
        num: 10,
        blendMode: 'ADD',
        r: 1500,
    },
    popups: {
        'BIG_WIN': { keyImg: 'win00', anchor: [.5, 0.3] },
        'SUPER_WIN': { keyImg: 'win01', anchor: [.5, .4] },
        'MEGA_WIN': { keyImg: 'win02', anchor: [.5, .5] },
        'JACKPOT': { keyImg: 'win03',anchor: [.5, .45] },
    }
}
