/**
 *
 */
var Poivre = (function () {

    var arr = [];

    var slice = arr.slice;

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
        if (Poivre.type(selector) == "object") {
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

            if (attribute == false && typeof element[key] == 'object') {
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
            return this.each(function () {
                var element = this;

                if (typeof value == 'object') {
                    return Poivre.each(value, function (i) {
                        element[key][i] = this;
                    });
                }

                element.setAttribute(key, value);
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
            var elements = elements || this, results = [];

            if (!Poivre.isArraylike(elements)) {
                elements = [elements];
            }

            Poivre.each(elements, function () {
                results.push.apply(results, slice.call(this.querySelectorAll(selector)));
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
         * @param elems
         * @returns {*}
         */
        pushStack: function (elems) {
            return Poivre.merge(Sel(), elems);
        },


        /**
         *
         * Compatibility: IE8+
         *
         * @param className
         * @returns {Poivre}
         */
        addClass: function (className) {
            return this.each(function () {
                var classList = this.classList;
                if (classList) {
                    classList.add(className);
                } else {
                    this.className += ' ' + className;
                }
            });
        },

        /**
         *
         * Compatibility: IE8+
         *
         * @param className
         * @returns {Poivre}
         */
        removeClass: function (className) {
            return this.each(function () {
                var classList = this.classList;
                var oldclassName = this.className;

                if (classList) {
                    classList.remove(className);
                } else {
                    oldclassName = oldclassName.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            });
        },

        /**
         *
         * Compatibility: IE8+
         *
         * @param className
         * @returns {boolean}
         */
        hasClass: function (className) {
            var element = this[0];

            if (!element) {
                return undefined;
            }

            if (element.classList) {
                return element.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
            }
        },
    };


    /**
     *
     * @param data
     * @returns {string}
     */
    Poivre.param = function (data) {
        var string = [];

        Poivre.each(data, function (index) {
            string.push(encodeURIComponent(index) + "=" + encodeURIComponent(this));
        });

        return string.join("&").replace(/%20/g, "+");
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

        if (Poivre.type(url) === "object") {
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
            data = Poivre.param(data);
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
        var value,
            i = 0,
            length = obj.length,
            isArray = Poivre.isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /**
     *
     * Compatibility: IE9+ (not tested IE8)
     * Source: jQuery 2
     *
     * @param object
     * @returns {*}
     */
    Poivre.type = function (object) {
        if (object == null) {
            return object + "";
        }
        // Support: Android<4.0, iOS<6 (functionish RegExp)
        if (typeof object === "object" || typeof object === "function") {
            return {}[toString.call(object)] || "object";
        } else {
            return typeof object;
        }
    };

    /**
     *
     * Compatibility: IE9+ (not tested IE8)
     * Source: jQuery 2
     *
     * @param obj
     * @returns {boolean}
     */
    Poivre.isWindow = function (obj) {
        return obj != null && obj === obj.window;
    };

    /**
     *
     * Compatibility: IE9+ (not tested IE8)
     * Source: jQuery 2
     *
     * @param obj
     * @returns {boolean}
     */
    Poivre.isArraylike = function (obj) {

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = "length" in obj && obj.length,
            type = Poivre.type(obj);

        if (type === "function" || Poivre.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
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
var Sel = function (selector) {
    return new Poivre(selector);
};