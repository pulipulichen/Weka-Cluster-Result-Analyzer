
/* global DICT */

// ----------------------------

// ----------------------------

var FULL_DATA;
var CLUSTER_DATA;
var TO_FIXED;

// ---------------------

// ---------------------

var _calc_cluster_score = function () {
  // https://www.quora.com/How-can-we-choose-a-good-K-for-K-means-clustering
  var _full_data = FULL_DATA;
  var _cluster_data = CLUSTER_DATA;
  var _to_fixed = TO_FIXED;

  var _attr_sse = 0;
  for (var _attr in _full_data) {
    if ($('[name="sse"][value="' + _attr + '"]:checked').length === 0) {
      continue;
    }

    var _full_data_attr = _full_data[_attr];

    //console.log(_full_data_attr);
    var _cluster_data_attr = [];
    for (var _i = 0; _i < _cluster_data.length; _i++) {
      _cluster_data_attr[_i] = _cluster_data[_i][_attr];
    }

    if (_is_array(_full_data_attr) === true) {
      // 如果是數字
      //console.log(_cluster_data_attr);
      _attr_sse = _attr_sse + _calc_cluster_score_numeric(_full_data_attr, _cluster_data_attr);
    } else {
      // 如果是類別
      //console.log(_attr);
      _attr_sse = _attr_sse + _calc_cluster_score_nominal(_full_data_attr, _cluster_data_attr);
      // 2.322701673495139
    }
  }

  var _result = _attr_sse;
  $("#cluster_score")
          .attr("data-ori-value", _result)
          .html(_result);
};

var _calc_cluster_score_numeric = function (_full_data_attr, _cluster_data_attr) {
  var _max = arrayMax(_full_data_attr);
  var _min = arrayMin(_full_data_attr);

  var _sse = 0;
  for (var _i = 0; _i < _cluster_data_attr.length; _i++) {
    var _center = _stat_avg(_cluster_data_attr[_i]);
    _center = _normalize_numeric_data(_center, _max, _min);
    //console.log(_center);
    for (var _j = 0; _j < _cluster_data_attr[_i].length; _j++) {
      var _data = _cluster_data_attr[_i][_j];
      _data = _normalize_numeric_data(_data, _max, _min);
      _sse = _sse + (_center - _data) * (_center - _data);
    }
  }

  return _sse;
};

var _calc_cluster_score_nominal = function (_full_data_attr, _cluster_data) {
  var _total_sse = 0;

  // A: 5
  // B: 2
  // C: 1
  // Total: 8
  // A: 1 1 1 1 1 0 0 0    avg: 5/8
  // B: 0 0 0 0 0 1 1 0    avg; 2/8
  // C: 0 0 0 0 0 0 0 1    avg; 1/8
  for (var _i = 0; _i < _cluster_data.length; _i++) {
    var _cluster_data_attr = _cluster_data[_i];

    var _total_count = 0;
    for (var _cate in _cluster_data_attr) {
      var _count = _cluster_data_attr[_cate];
      _total_count = _total_count + _count;
    }
    //console.log(_total_count);
    for (var _cate in _cluster_data_attr) {
      var _count = _cluster_data_attr[_cate];
      var _avg = _count / _total_count;
      var _sse = (1 - _avg) * (1 - _avg) * _count
              + _avg * _avg * (_total_count - _count);
      //_sse = _sse / _total_count;
      //console.log([_i, _cate, _total_count, _count]);
      //console.log([_avg, _sse]);
      _total_sse = _total_sse + _sse;
    }
  }
  return _total_sse;
};



// ---------------------

// -------------------------------------

// -------------------------------------

var _output_filename_surffix = "_output";
var _output_filename_ext = ".csv";

// -------------------------------------

let setPreviewCluster = function (result) {
  //console.log(result)
  let header = result.slice(0, result.indexOf('\n')).split(',')
  let clusterFieldIndex
  for (let i = 0; i < header.length; i++) {
    if (header[i] === 'cluster') {
      clusterFieldIndex = i
      break
    }
  }

  if (clusterFieldIndex === undefined) {
    return false
  }

  let clusterResult = ['cluster']
  result.slice(result.indexOf('\n') + 1).split('\n').forEach(line => {
    let fields = line.split(',')
    let cluster = fields[clusterFieldIndex]
    if ((cluster.startsWith('"') && cluster.endsWith('"'))
            || (cluster.startsWith("'") && cluster.endsWith("'"))) {
      cluster = cluster.slice(1, -1)
    }

    clusterResult.push(cluster)

  })

  $('#previewCluster').val(clusterResult.join('\n'))
  //console.log(clusterResult.join('\n'))
}

var _calc_mode = function (_json) {
  var _array_json = [];

  var _sum = 0;
  for (var _key in _json) {
    _array_json.push({
      "key": _key,
      "value": _json[_key]
    });
    _sum = _sum + _json[_key];
  }

  _array_json = _array_json.sort(function (_a, _b) {
    return (_b.value - _a.value);
  });

  //console.log(_array_json);
  var _top_result = [];
  var _full_result = [];
  for (var _i = 0; _i < _array_json.length; _i++) {
    var _value = parseInt(_array_json[_i].value / _sum * 100, 10) + "%";
    var _data = "<tr><td class='prop-list'>" + _array_json[_i].key + "</td><td class='prop-list' freq-count='" + _array_json[_i].value + "'>" + _value + "</td></tr>";
    if (_i < 5) {
      _top_result.push(_data);
    }
    _full_result.push(_data);
  }
  if (_array_json.length > 5) {
    _top_result.push("...");
  }

  var _full = "<table><tbody>" + _full_result.join('') + "</tbody></table>";

  var _result = {
    top: _top_result.join("<br />\n"),
    full: _full
  };

  return _result;
};

// -----------------------
