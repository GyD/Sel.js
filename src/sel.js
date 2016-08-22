/**
 *
 */
var Poivre = (function () {

    var arr = [];

    var slice = arr.slice;

    /**
     *
     * Compatibility: IE9+ (not tested IE8)
     * Source: jQuery 2
     *
     * @param obj
     * @returns {boolean}
     */
    var isArraylike = function (obj) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && "length" in obj && obj.length,
            type = typeof obj;

        if (type === "function" || (obj != null && obj === obj.window)) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    };

    /**
     *
     * @param data
     * @returns {string}
     */
    var param = function (data) {
        var string = [];

        Poivre.each(data, function (index) {
            string.push(encodeURIComponent(index) + "=" + encodeURIComponent(this));
        });

        return string.join("&").replace(/%20/g, "+");
    };

    /**
     *
     * @param selector
     * @param context
     * @returns {Poivre}
     * @constructor
     */
    function Poivre(selector, context) {
        if (!selector) {
            return this;
        }

        if (typeof selector == "object") {
            return this.pushStack([selector]);
        }

        return this.find(selector, context || document);
    }

    /**
     * Poivre prototypes
     *
     * @type {Object}
     */
    Poivre.prototype = {

        length: 0,

        splice: arr.splice,

        sort: arr.sort,

        /**
         *
         * @param key
         * @returns {*}
         */
        get: function (key, attribute) {
            var element = this[0];

            if (!element) {
                return null;
            }

            if (typeof element[key] == 'string' || typeof element[key] == 'object' || attribute == false) {
                return element[key];
            }

            return element.getAttribute(key);
        },

        /**
         *
         * @param key
         * @param value
         * @returns {Poivre}
         */
        set: function (key, value) {
            value = value || "";
            return this.each(function () {
                var element = this;

                if (typeof value == 'object') {
                    return Poivre.each(value, function (i) {
                        element[key][i] = this;
                    });
                }

                if (typeof element[key] !== 'undefined') {
                    element[key] = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
        },

        /**
         *
         * @see: Emakina.each
         *
         * @param callback
         * @param args
         * @returns {Poivre}
         */
        each: function (callback, args) {
            Poivre.each(this, callback, args);

            return this;
        },

        /**
         *
         * @param selector
         * @param elements
         * @returns {Poivre}
         */
        find: function (selector, elements) {
            var elements = elements || this,
                results = [];

            if (!isArraylike(elements)) {
                elements = [elements];
            }

            Poivre.each(elements, function () {
                var element = this.parentNode || this;
                results.push.apply(results, slice.call(element.querySelectorAll(selector)));
            });

            return this.pushStack(results);
        },

        /**
         *
         * Compatibility: IE9+
         *
         * @param eventName
         * @param eventHandler
         * @returns {Poivre}
         */
        on: function (eventName, eventHandler) {
            eventName = (eventName == 'ready') ? 'DOMContentLoaded' : eventName;
            return this.each(function () {
                this.addEventListener(eventName, eventHandler);
            });
        },

        /**
         *
         * @param elements
         * @returns {*}
         */
        pushStack: function (elements) {
            return Poivre.merge(Sel(), elements);
        },


        /**
         *
         * Compatibility: IE10+
         *
         * @param className
         * @returns {Poivre}
         */
        addClass: function (className) {
            return this.each(function () {
                this.classList.add(className);
            });
        },

        /**
         *
         * Compatibility: IE10+
         *
         * @param className
         * @returns {Poivre}
         */
        removeClass: function (className) {
            return this.each(function () {
                this.classList.remove(className);
            });
        },

        /**
         *
         * Compatibility: IE10+
         *
         * @param className
         * @returns {boolean}
         */
        hasClass: function (className) {
            var element = this[0];

            if (!element) {
                return undefined;
            } else {
                return element.classList.contains(className);
            }
        },

        /**
         * Prepend element(s) to current(s) one
         *
         * @param elements
         * @returns {*}
         */
        prepend: function (elements) {
            if (!isArraylike(elements)) {
                elements = [elements];
            }

            return Poivre.each(this, function (i, parent) {
                Poivre.each(elements, function (k, element) {
                    parent.insertBefore(element, parent.firstChild);
                });
            });
        },

        /**
         * Append element(s) to current(s)
         *
         * @param elements
         * @returns {*}
         */
        append: function (elements) {
            if (!isArraylike(elements)) {
                elements = [elements];
            }

            return Poivre.each(this, function (i, parent) {
                Poivre.each(elements, function (k, appendElement) {
                    parent.appendChild(appendElement);
                });
            });
        }
    };

    /**
     *
     * Options:
     *  {
     *    url: {string},
     *    method: {string} 'post|get',
     *    async: {boolean} true|false,
     *    success: {function},
     *    error: {function},
     *    statusCode: {
     *      200: {function}
     *    }
     *    data: {string|Array|PlainObject}
     *  }
     *
     * @param url
     * @param options
     */
    Poivre.ajax = function (url, options) {

        if (typeof url === "object") {
            options = url;
            url = options.url;
        }

        options = options || {};
        // if method is not defined, use GET method
        var method = options.method || 'GET',
            // async is enablde by default
            async = options.async || true,
            // data are null by default
            data = options.data || null,

            // create the request
            request = new XMLHttpRequest();

        // open the request
        request.open(method, url, async);

        // check request status after load
        request.onload = function () {
            var successCall = options.success,
                statusCalls = options.statusCode,
                status = request.status;

            if (status >= 200 && status < 400) {
                if (successCall) {
                    successCall.call(request, request.responseText, status, this);
                }
            }

            if (statusCalls && statusCalls[status]) {
                statusCalls[status].call(request);
            }
        };

        // check request status after error
        request.onerror = function () {
            if (options.error) {
                options.error.call(request, request.statusText);
            }
        };

        if (null != data && typeof data != 'string') {
            data = param(data);
        }

        request.send(data);

        return request;
    };

    /**
     *
     * Compatibility: IE9+ (not tested IE8)
     * Source: jQuery 2
     *
     * @param obj
     * @param callback
     * @param args
     * @returns {*}
     */
    Poivre.each = function (obj, callback, args) {
        var length, i = 0;

        if ( isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }

        return obj;
    };

    /**
     *
     * @param first
     * @param second
     * @returns {*}
     */
    Poivre.merge = function (first, second) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    };


    return Poivre;
})();

/**
 *
 * @param selector
 * @constructor
 */
var Sel = function (selector, context) {
    return new Poivre(selector, context);
};