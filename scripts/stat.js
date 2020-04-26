
var _float_to_fixed = function (_float, _fixed) {
  var _place = 1;
  for (var _i = 0; _i < _fixed; _i++) {
    _place = _place * 10;
  }
  return Math.round(_float * _place) / _place;
};

var _stat_avg = function (_ary) {
  let missingCount = 0
  var sum = _ary.reduce(function (a, b) {
    let output = 0
    if (typeof(a) === 'number' && isNaN(a) === false) {
      output = output + a
    }
    else {
      missingCount++
    }
    
    if (typeof(b) === 'number' && isNaN(b) === false) {
      output = output + b
    }
    else {
      missingCount++
    }
    
    return output;
  });
  
  if ((_ary.length - missingCount) < 1) {
    return 0
  }
  
  var avg = sum / (_ary.length - missingCount);
  if (isNaN(avg)) {
    console.log('NaN', _ary)
  }
  return avg;
};

var _stat_stddev = function (_ary) {
  var i, j, total = 0, mean = 0, diffSqredArr = [];
  let missingCount = 0
  for (i = 0; i < _ary.length; i += 1) {
    if (typeof(_ary[i]) === 'number' && isNaN(_ary[i]) === false) {
      total += _ary[i];
    }
    else {
      missingCount++
    }
  }
  if ((_ary.length - missingCount) < 1) {
    return 0
  }
  
  mean = total / (_ary.length - missingCount);
  for (j = 0; j < _ary.length; j += 1) {
    if (typeof(_ary[j]) !== 'number' || isNaN(_ary[j])) {
      continue
    }
    diffSqredArr.push(Math.pow((_ary[j] - mean), 2));
  }
  return (Math.sqrt(diffSqredArr.reduce(function (firstEl, nextEl) {
    return firstEl + nextEl;
  }) / (_ary.length - missingCount)));
};

var _normalize_numeric_data = function (_number, _max, _min) {
  return (_number - _min) / (_max - _min);
};
