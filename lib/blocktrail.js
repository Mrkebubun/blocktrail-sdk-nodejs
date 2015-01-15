var blocktrail = {
    COIN: 100000000,
    PRECISION: 8,
    DUST: 546,
    BASE_FEE: 10000
};

blocktrail.toSatoshi = function(btc) {
    return parseInt((btc * blocktrail.COIN).toFixed(0), 10);
};

blocktrail.toBTC = function(satoshi) {
    return (satoshi / blocktrail.COIN).toFixed(blocktrail.PRECISION);
};

/**
 * patch the Q module to add spreadNodeify method to promises
 *  so that we can support multi parameter callbacks
 *
 * @param Q
 */
blocktrail.patchQ = function(Q) {
    if (Q.spreadNodeify) {
        return;
    }

    Q.spreadNodeify = spreadNodeify;
    function spreadNodeify(object, nodeback) {
        return Q(object).spreadNodeify(nodeback);
    }

    Q.makePromise.prototype.spreadNodeify = function (nodeback) {
        if (nodeback) {
            this.then(function (value) {
                Q.nextTick(function () {
                    nodeback.apply(void 0, [null].concat(value));
                });
            }, function (error) {
                Q.nextTick(function () {
                    nodeback(error);
                });
            });
        } else {
            return this;
        }
    };
};

module.exports = blocktrail;