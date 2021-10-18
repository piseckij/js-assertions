'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {boolean}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let index = 0;
    let visited = new Array(puzzle.length).fill(0)
        .map((v, i) => new Array(puzzle[i].length).fill(false));

    const canFindStartedFrom = (i, j) => {
        if (puzzle[i] && puzzle[i][j] === searchStr[index]) {
            index++;
            visited[i][j] = true;
            if (index === searchStr.length) return true;
            if (visited[i - 1] && !visited[i - 1][j] && canFindStartedFrom(i - 1, j)) {
                return true;
            }
            if (visited[i + 1] && !visited[i + 1][j] && canFindStartedFrom(i + 1, j)) {
                return true;
            }
            if (!visited[i][j - 1] && canFindStartedFrom(i, j - 1)) {
                return true;
            }
            if (!visited[i][j + 1] && canFindStartedFrom(i, j + 1)) {
                return true;
            }
            index--;
            visited[i][j] = false;
        }
        return false;
    }

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            if (canFindStartedFrom(i, j)) {
                return true;
            }
        }
    }

    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    let output = [];
    let generate = (k, arr) => {
        if (k === 1) {
            output.push(arr.join(''));
        } else {
            generate(k - 1, arr);
            for (let i = 0; i < k - 1; i++) {
                let j = k % 2 === 0 ? i : 0;
                let tmp = arr[k - 1];
                arr[k - 1] = arr[j];
                arr[j] = tmp;
                generate(k - 1, arr);
            }
        }
    };
    generate(chars.length, [...chars]);
    for (let i = 0; i < output.length; i++) {
        yield output[i];
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let values = [];
    for (let i = 0; i < quotes.length; i++) {
        values[i] = 0;
        for (let j = i - 1; j >= 0 && quotes[j] <= quotes[i]; j--) {
            values[j] = 0;
            values[i] += (quotes[i] - quotes[j]);
        }
    }
    return values.reduce((sum, v) => sum + v, 0);
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function (url) {
        let codes = [];
        let code = [];
        for (let i = 0; i < url.length; i++) {
            code[code.length] = this.urlAllowedChars.indexOf(url[i]);
            if (code.length === 2) {
                codes.push(code[0] << 8 | code[1]);
                code = [];
            }
        }
        if (code.length === 1) {
            codes.push(code);
        }
        return String.fromCharCode(...codes);
    },

    decode: function (code) {
        let result = [];
        for (let i = 0; i < code.length; i++) {
            let codes = code.charCodeAt(i);
            if (codes > 255) {
                let first = codes >> 8;
                let second = 255 & codes;
                result.push(this.urlAllowedChars[first]);
                result.push(this.urlAllowedChars[second]);
            } else {
                result.push(this.urlAllowedChars[codes]);
            }
        }
        return result.join('');
    }
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
