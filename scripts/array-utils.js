
var arrayMin = function (arr) {
    return arr.reduce(function (p, v) {
        return ( p < v ? p : v );
    });
};

var arrayMax = function (arr) {
    return arr.reduce(function (p, v) {
        return ( p > v ? p : v );
    });
};

var _is_array = function (_obj) {
        return (typeof(_obj) === "object" 
                        && Object.prototype.toString.call( _obj ) === '[object Array]');
};
