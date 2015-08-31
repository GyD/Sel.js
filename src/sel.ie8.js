Poivre.prototype.on = function (eventName, eventHandler) {
    eventName = (eventName == 'ready') ? 'DOMContentLoaded' : eventName;
    return this.each(function () {
        if (this.addEventListener) {
            this.addEventListener(eventName, eventHandler);
        } else {
            this.attachEvent('on' + eventName, function () {
                eventHandler.call(el);
            });
        }
    });
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
        data = options.data || null;

    // create the request
    var request = new XMLHttpRequest();
    // open the request
    request.open(method, url, async);

    // check request status after load
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                if (options.success) {
                    options.success.call(this, this.responseText, request.statusText, this);
                }
            }

            if (undefined != options.statusCode && options.statusCode[this.status]) {
                options.statusCode[this.status].call(this);
            }
        }
    };

    // check request status after error
    request.onerror = function () {
        if (options.error) {
            options.error.call(request, this, request.statusText);
        }
    };

    if (null !== data && typeof data != 'string') {
        data = Poivre.param(data);
    }

    request.send(data);

    return request;
};