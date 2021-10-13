'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N', 'E', 'S', 'W'];
    sides.splice(sides.indexOf('N') + 1, 0, 'NbE', 'NNE', 'NEbN', 'NE', 'NEbE', 'ENE', 'EbN');
    sides.splice(sides.indexOf('E') + 1, 0, 'EbS', 'ESE', 'SEbE', 'SE', 'SEbS', 'SSE', 'SbE');
    sides.splice(sides.indexOf('S') + 1, 0, 'SbW', 'SSW', 'SWbS', 'SW', 'SWbW', 'WSW', 'WbS');
    sides.splice(sides.indexOf('W') + 1, 0, 'WbN', 'WNW', 'NWbW', 'NW', 'NWbN', 'NNW', 'NbW');

    return sides.map((side, i) => ({abbreviation: side, azimuth: (11.25 * i)}));
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    const regex = /{[^{}]+}/;
    const input = [str];
    while (input.length > 0) {
        let str = input.shift();
        let match = str.match(regex);
        if (match) {
            let variants = match[0].slice(1, -1).split(',');
            for (const variant of variants) {
                let replaced = str.replace(match[0], variant);
                if (!input.includes(replaced)) {
                    input.push(replaced)
                }
            }
        } else {
            yield str;
        }
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let arr = new Array(n).fill(0).map(() => []);
    let m = n - 1;
    arr[0][0] = 0;
    arr[m][m] = n * n - 1;

    for (let i = 1; i < n; i++) {
        if (i % 2 === 1) {
            arr[0][i] = arr[0][i - 1] + 1;
            for (let j = 1; j <= i; j++) {
                arr[j][i - j] = arr[0][i] + j;
            }
            arr[m][m - i] = arr[m][m - i + 1] - 1;
            for (let j = 1; j <= i; j++) {
                arr[m - j][m - i + j] = arr[m][m - i] - j;
            }
        } else {
            arr[i][0] = arr[i - 1][0] + 1;
            for (let j = 1; j <= i; j++) {
                arr[i - j][j] = arr[i][0] + j;
            }
            arr[m - i][m] = arr[m - i + 1][m] - 1;
            for (let j = 1; j <= i; j++) {
                arr[m - i + j][m - j] = arr[m - i][m] - j;
            }
        }
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {boolean}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let copy = [...dominoes];
    let domino = copy.shift();
    while (copy.length > 0) {
        let pairIndex = copy.findIndex(pair => {
            return domino[0] === pair[0]
                || domino[0] === pair[1]
                || domino[1] === pair[0]
                || domino[1] === pair[1];
        });
        if (pairIndex === -1) break;
        let pair = copy.splice(pairIndex, 1)[0];
        if (domino[0] === pair[0]) {
            domino = [domino[1], pair[1]];
        } else if (domino[0] === pair[1]) {
            domino = [domino[1], pair[0]];
        } else if (domino[1] === pair[0]) {
            domino = [domino[0], pair[1]];
        } else {
            domino = [domino[0], pair[0]];
        }
    }

    return copy.length === 0;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {string}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let ranges = [];
    let range = [nums[0]];
    for (let i = 1; i < nums.length; i++) {
        if ((nums[i - 1] + 1) === nums[i]) {
            range.push(nums[i]);
        } else {
            ranges.push(range);
            range = [nums[i]];
        }
    }
    ranges.push(range);

    return ranges
        .map(r => {
            if (r.length > 2) {
                return r[0] + '-' + r[r.length - 1];
            } else {
                return r.join();
            }
        })
        .join();
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
