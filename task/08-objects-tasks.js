'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.assign(new proto.constructor(), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function SelectorBuilder() {
    this.order = new Array(6).fill(0);
    this.data = {
        class: [],
        attr: [],
        pseudoClass: []
    };
    this.checkSingle = (key) => {
        if (this.data[key]) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
    }
    this.checkOrder = (order) => {
        if (this.order.indexOf(1, order + 1) !== -1) {
            throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        this.order[order] = 1;
    }

    this.element = function(value) {
        this.checkSingle('element');
        this.checkOrder(0);
        this.data.element = value;
        return this;
    };

    this.id = function(value) {
        this.checkSingle('id');
        this.checkOrder(1);
        this.data.id = '#' + value;
        return this;
    };

    this.class = function(value) {
        this.checkOrder(2);
        this.data.class.push('.' + value);
        return this;
    };

    this.attr = function(value) {
        this.checkOrder(3);
        this.data.attr.push('[' + value + ']');
        return this;
    };

    this.pseudoClass = function(value) {
        this.checkOrder(4);
        this.data.pseudoClass.push(':' + value);
        return this;
    };

    this.pseudoElement = function(value) {
        this.checkSingle('pseudoElement');
        this.checkOrder(5);
        this.data.pseudoElement = '::' + value;
        return this;
    };

    this.stringify = function() {
        return (this.data.element || '')
        + (this.data.id || '')
        + this.data.class.join('')
        + this.data.attr.join('')
        + this.data.pseudoClass.join('')
        + (this.data.pseudoElement || '');
    }
}

function SelectorCombinator(selector1, combinator, selector2) {
    this.selector1 = selector1;
    this.combinator = combinator;
    this.selector2 = selector2;

    this.stringify = () => `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
}

const cssSelectorBuilder = {

    element: function(value) {
        return new SelectorBuilder().element(value);
    },

    id: function(value) {
        return new SelectorBuilder().id(value);
    },

    class: function(value) {
        return new SelectorBuilder().class(value);
    },

    attr: function(value) {
        return new SelectorBuilder().attr(value);
    },

    pseudoClass: function(value) {
        return new SelectorBuilder().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new SelectorBuilder().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new SelectorCombinator(selector1, combinator, selector2);
    },
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
