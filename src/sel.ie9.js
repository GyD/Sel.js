/**
 * Sel is compatible IE9+ for the moment
 * This file is maintained only to ensure than a IE9+
 *   compatible version will remain available.
 */
Poivre.each({
    /**
     *
     * Compatibility: IE8+
     *
     * @param className
     * @returns {Poivre}
     */
    addClass: function (className) {
        return this.each(function () {
            if (this.classList) {
                this.classList.add(className);
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
     * @returns {boolean}
     */
    hasClass: function (className) {
        if (!this[0]) {
            return undefined;
        }
        var element = this[0];

        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
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
            if (this.classList) {
                this.classList.remove(className);
            } else {
                this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        });
    }

}, function(i){
    Poivre.prototype[i] = this;
});
