'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let map = {
        ' _ \n| |\n|_|': '0',
        '   \n  |\n  |': '1',
        ' _ \n _|\n|_ ': '2',
        ' _ \n _|\n _|': '3',
        '   \n|_|\n  |': '4',
        ' _ \n|_ \n _|': '5',
        ' _ \n|_ \n|_|': '6',
        ' _ \n  |\n  |': '7',
        ' _ \n|_|\n|_|': '8',
        ' _ \n|_|\n _|': '9',
    };
    let rows = bankAccount.split('\n');
    let result = '';
    for (let i = 0; i < 9; i++) {
        let key = [
            rows[0].slice(3 * i, 3 * i + 3),
            rows[1].slice(3 * i, 3 * i + 3),
            rows[2].slice(3 * i, 3 * i + 3)
        ]
            .join('\n');
        result += map[key];
    }
    return Number.parseInt(result);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    while (text.length > columns) {
        let wordBoundary = text.length;
        for (let i = 1; i <= columns; i++) {
            let c = text.charAt(i);
            if (c === ' ') {
                wordBoundary = i;
            }
        }
        yield text.substring(0, wordBoundary);
        text = text.substr(wordBoundary + 1);
    }

    yield text;
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const order = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const isFlush = (suitsMap) => Object.values(suitsMap).every(count => count === 5);
    const isStraight = (valuesMap, aceLast) => Object.keys(valuesMap).length === 5
        && Object.keys(valuesMap)
            .map(v => order.indexOf(v, aceLast ? 1 : 0))
            .sort((a, b) => a - b)
            .every((v, i, arr) => {
                return (arr[i] - arr[0]) === i;
            });
    const isFourOfKind = (valuesMap) => Object.values(valuesMap).find(count => count === 4);
    const isFullHouse = (valuesMap) => isThreeOfKind(valuesMap) && isPair(valuesMap);
    const isThreeOfKind = (valuesMap) => Object.values(valuesMap).find(count => count === 3);
    const isTwoPairs = (valuesMap) => Object.values(valuesMap).filter(count => count === 2).length === 2;
    const isPair = (valuesMap) => Object.values(valuesMap).find(count => count === 2);

    let suits = hand.reduce((suits, card) => {
        let suit = card.substr(-1, 1);
        suits[suit] = (suits[suit] || 0) + 1;
        return suits;
    }, {});
    let values = hand.reduce((values, card) => {
        let value = card.substr(0, card.length - 1);
        values[value] = (values[value] || 0) + 1;
        return values;
    }, {});

    if (isStraight(values) || isStraight(values, true)) {
        return isFlush(suits)
            ? PokerRank.StraightFlush
            : PokerRank.Straight;
    }
    if (isFlush(suits)) return PokerRank.Flush;
    if (isFourOfKind(values)) return PokerRank.FourOfKind;
    if (isFullHouse(values)) return PokerRank.FullHouse;
    if (isThreeOfKind(values)) return PokerRank.ThreeOfKind;
    if (isTwoPairs(values)) return PokerRank.TwoPairs;
    if (isPair(values)) return PokerRank.OnePair;

    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let rows = figure
        .split('\n')
        .map(row => [...row]);
    const isTopLeft = (top, left) => rows[top][left] === '+'
        && (rows[top + 1][left] === '|' || rows[top + 1][left] === '+')
        && (rows[top][left + 1] === '-' || rows[top][left + 1] === '+');
    const getWidth = (top, left) => {
        for (let i = left + 1; i < rows[top].length; i++) {
            if (rows[top][i] === '+' && (rows[top + 1][i] === '|' || rows[top + 1][i] === '+')) {
                return i - left + 1;
            }
        }
        return 0;
    }
    const getHeight = (top, left) => {
        for (let i = top + 1; i < rows.length; i++) {
            if (rows[i][left] === '+' && (rows[i][left + 1] === '-' || rows[i][left + 1] === '+')) {
                return i - top + 1;
            }
        }
        return 0;
    }
    const buildRect = (top, left, width, height) => {
        return '+' + '-'.repeat(width - 2) + '+\n'
            + ('|' + ' '.repeat(width - 2) + '|\n').repeat(height - 2)
            + '+' + '-'.repeat(width - 2) + '+\n';
    }
    for (let top = 0; top < rows.length; top++) {
        for (let left = 0; left < rows[top].length; left++) {
            if (isTopLeft(top, left)) {
                const width = getWidth(top, left);
                const height = getHeight(top, left);
                if (width && height) {
                    yield buildRect(top, left, width, height);
                }
            }
        }
    }
}


module.exports = {
    parseBankAccount: parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
