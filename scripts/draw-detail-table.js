/* global DICT, _stat_avg, nominal_to_binary_tr_list */

/**
 * 繪製統計表格
 * @param {String} _result
 */
var _draw_stat_table = async function (_result) {
  // ---------------------------
  // 讀取資料
  //var _lines = _result.split("\n");
  _result = parse_result_to_object(_result)
  if (!_result) {
    return false
  }
  
  var _attr_list = _result.attr_list
  var _cluster_data = _result.cluster_data
  var _cluster_count = _result.cluster_count
  var _full_data = _result.full_data
  var _full_count = _result.full_count
  
  // --------------------------
  
  var _to_fixed = $("#decimal_places").val();
  _to_fixed = parseInt(_to_fixed, 10);
  
  // 繪製表格
  var _table = $(".stat-result");
  var _thead = _table.find("thead tr").empty();
  var _tbody = _table.find("tbody").empty();

  // -------------------------
  // 先畫開頭
  _thead.append('<th>' + DICT['Attributes'] + '</th>');
  _thead.append('<th class="fulldata">' + DICT['Full Data and Avg.'] + '</th>');
  for (var _i = 0; _i < _cluster_data.length; _i++) {
    if (typeof (_cluster_count[_i]) === "undefined") {
      continue;
    }

    //let count = $('table.stat-result:first tbody tr.compare-data:first td:eq(' + (_i+1) + ')').text()
    //count = parseInt(count, 10)
    //console.log('<th>' + DICT['Cluster 1'] + _i + DICT['Cluster 2'] + '(' +  _cluster_count[_i] + ') </th>')
    _thead.append('<th>' + DICT['Cluster 1'] + _i + DICT['Cluster 2'] + ' (' + _cluster_count[_i] + ') '
            + '<br /><button type="button" onclick="TagCloud.donwload(this, ' + _i + ', ' + _cluster_count[_i] + ')">下載</button>'
            + '<button type="button" class="draw-cloud" onclick="TagCloud.draw(this, ' + _i + ', ' + _cluster_count[_i] + ')"><i class="cloud icon"></i></button>'
            + ' </th>');
    // <button type="button" onclick="TagCloud.donwload(this, ' + _i + ', ' + count + ')">下載</button>
    
    await sleep()
  }
  //_thead.append('<th>' +    DICT['SSE_TH'] + '</th>');

  // -------------------------
  // 再畫數量


  var _count_avg = _float_to_fixed((_full_count / (_cluster_count.length - 1)), _to_fixed);

  var _count_tr = $('<tr class="compare-data"></tr>').appendTo(_tbody);
  _count_tr.append('<th>' + DICT['Count'] + '</th>');
  _count_tr.append('<td title="Full Data, count" class="fulldata count">'
          + _full_count + '<br />(平均: ' + _count_avg + ')'
          + '</td>');

  var _row_data = _cluster_count;
  for (var _i = 0; _i < _cluster_count.length; _i++) {
    if (typeof (_cluster_count[_i]) === "undefined") {
      continue;
    }
    var _classname = "normal";
    if (_cluster_count[_i] > (_full_count / (_cluster_count.length - 1))) {
      _classname = "large";
    } else if (_cluster_count[_i] < (_full_count / (_cluster_count.length - 1))) {
      // 如果小於，則表示小於
      _classname = "small";
    }
    _count_tr.append('<td class="marks count ' + _classname + '" title="Cluster ' + _i + ', count" data-ori-value="' + _cluster_count[_i] + '">'
            + _cluster_count[_i] + '</td>');
    
    await sleep()
  }
  //_count_tr.append('<td></td>');

  // ---------------------------

  if (_row_data.length > 1 && arrayMin(_row_data) !== arrayMax(_row_data)) {
    //console.log([arrayMin(_row_data), arrayMax(_row_data)]);
    // 如果有最大值跟最小值的差別，才作這樣的標示

    // 表示最小值
    _count_tr.find('td[data-ori-value="' + arrayMin(_row_data) + '"]').addClass("smallest");

    // 表示最小值
    _count_tr.find('td[data-ori-value="' + arrayMax(_row_data) + '"]').addClass("largest");
  }


  // ------------------------
  // 再畫屬性

  var _start = 0;
  //console.log(_attr_list[0]);
  if (_attr_list[0] === "Instance_number") {
    _start = 1;
  }

  for (var _a = _start; _a < _attr_list.length - 1; _a++) {
    var _attr = _attr_list[_a];

    if (typeof (_full_data[_attr]) === "undefined") {
      continue;
    }

    var _avg_tr = $('<tr class="avg-tr compare-data"></tr>');
    var _stddev_tr = $('<tr class="std-tr"></tr>');
    var _cov_tr = $('<tr class="cov-tr"></tr>');

    //_avg_tr.append('<td>' + _attr + ':<br /> Avg. (Std.) </td>');

    var _full_data_attr = _full_data[_attr];

    var _title_prefix = 'Full Data, ' + _attr + ' ';
    if (_is_array(_full_data_attr)) {

      _avg_tr.append('<th>var' + _a + ': ' + _attr + ' (Avg.) </th>');
      _stddev_tr.append('<th>var' + _a + ': ' + _attr + ' (Std.) </th>');
      _cov_tr.append('<th>var' + _a + ': ' + _attr + ' (CoV.) </th>');

      var _full_avg = _stat_avg(_full_data_attr);
      var _full_stddev = _stat_stddev(_full_data_attr);
      var _full_cov = 0
      if (_full_avg !== 0) {
        _full_cov = _full_stddev / _full_avg
      }
      _avg_tr.append('<td class="fulldata avg" title="' + _title_prefix + ' Avg." data-ori-value="' + _full_avg + '">'
              + _float_to_fixed(_full_avg, _to_fixed) + '</td>');
      _stddev_tr.append('<td class="fulldata std" title="' + _title_prefix + ' Std." data-ori-value="' + _full_stddev + '">'
              + _float_to_fixed(_full_stddev, _to_fixed) + '</td>');
      _cov_tr.append('<td class="fulldata cov" title="' + _title_prefix + ' CoV." data-ori-value="' + _full_cov + '">'
              + _float_to_fixed(_full_cov, _to_fixed) + '</td>');
    } else {
      _avg_tr.append('<th>var' + _a + ': <span class="name">' + _attr + '</span> (Prop.) '
              + '<br /><button type="button" class="ui tiny button " onclick="_download_contingency_table_button(this)"><i class="download icon"></i></button>'
              + '</th>');

      //console.log("full data不是陣列: " + _attr);
      //console.log(_full_data_attr);
      //console.log(_calc_mode(_full_data_attr));
      var _freq_data = _calc_mode(_full_data_attr);
      _avg_tr.append('<td class="fulldata prop" title="' + _title_prefix + ' Prop."><div>'
              + _freq_data.full + '</div></td>');
      _avg_tr.removeClass('compare-data')
    }


    var _row_data = [];
    let cluster_levels = {}

    for (var _i = 0; _i < _cluster_count.length; _i++) {
      if (typeof (_cluster_data[_i]) === "undefined") {
        continue;
      }
      var _attr_data = _cluster_data[_i][_attr];

      if (_is_array(_attr_data)) {
        // 是數值
        var _avg = _stat_avg(_attr_data);
        _row_data.push(_avg);
        var _stddev = _stat_stddev(_attr_data)
        let cov = 0
        if (_avg !== 0) {
          cov = _stddev / _avg
        }
        
        // 然後來計算它與整體cov的差異
        let covFullDelta = _full_cov - cov

        var _classname = "normal";

        if (_avg > _full_avg) {
          _classname = "large";
          if ((_avg - _stat_avg) > _full_avg) {
            _classname = "x-large";
          }
          if ((_avg - _stat_avg) > (_full_avg + _full_stddev)) {
            _classname = "xx-large";
          }
        }
        if (_avg < _full_avg) {
          _classname = "small";
          if ((_avg + _stat_avg) < _full_avg) {
            _classname = "x-small";
          }
          if ((_avg + _stat_avg) < (_full_avg - _full_stddev)) {
            _classname = "xx-small";
          }
        }

        var _title_prefix = 'Cluster ' + _i + ', ' + _attr + ' ';

        _avg_tr.append('<td class="mark avg ' + _classname + '" title="' + _title_prefix + ' Avg." data-ori-value="' + _avg + '">'
                + _float_to_fixed(_avg, _to_fixed)
                + '</td>');
        _stddev_tr.append('<td class="std" title="' + _title_prefix + ' Std." data-ori-value="' + _stddev + '">'
                + _float_to_fixed(_stddev, _to_fixed)
                + '</td>');
        _cov_tr.append('<td class="cov" title="' + _title_prefix + ' CoV." data-ori-value="' + cov + '" data-cov-full-delta="' + covFullDelta + '">'
                + _float_to_fixed(cov, _to_fixed)
                + '</td>');
      } else {
        // 不是數值

        //console.log("cluster data不是陣列: " + _i + " - " + _attr);
        //console.log(_attr_data);
        var _freq_data = _calc_mode(_attr_data);
        _avg_tr.append('<td class="mark prop ' + _classname + '" title="' + _title_prefix + ' Prop."><div>'
                + _freq_data.full
                + '</div></td>');
        
        cluster_levels[_i] = _attr_data
      }
    } // for (var _i = 0; _i < _cluster_count.length; _i++) {

    // 分群品質算法
    //_avg_tr.append('<td class="checkbox sse">'
    //                + '<input type="checkbox" class="sse" name="sse" value="' + _attr + '" checked="checked" />'
    //                + '</td>');
    //_stddev_tr.append('<td class="sse"></td>');
    //_avg_tr.find("input.sse").change(_calc_cluster_score);

    if (_row_data.length > 0 && arrayMin(_row_data) !== arrayMax(_row_data)) {
      _avg_tr.find('td[data-ori-value="' + arrayMin(_row_data) + '"]').addClass("smallest");
      _avg_tr.find('td[data-ori-value="' + arrayMax(_row_data) + '"]').addClass("largest");
    }

    _avg_tr.appendTo(_tbody);
    if (_is_array(_full_data_attr)) {
      _stddev_tr.appendTo(_tbody)
      _cov_tr.appendTo(_tbody)
    }
    
    if (_is_array(_full_data_attr) === false) {
      let levels = Object.keys(_full_data_attr).sort()
      _avg_tr.attr('data-levels', levels.join(','))
      
      // 如果是Freq，那我們多加NominalToBinary的選項
      nominal_to_binary_tr_list(_attr, _full_data_attr, cluster_levels, _a, _title_prefix).forEach(tr => {
        tr.appendTo(_tbody)
      })
      
    }
    
    await sleep()
  } // for (var _a = _start; _a < _attr_list.length - 1; _a++) {

  _change_show_fulldata();
  _change_show_std();

  // ---------------------

  await _draw_stat_abs_table();

  FULL_DATA = _full_data;
  CLUSTER_DATA = _cluster_data;
  TO_FIXED = _to_fixed;
  //_calc_cluster_score();
};

let parse_result_to_object = function (_result) {
  // ---------------------------
  // 讀取資料
  //console.log(_result)
  var _lines = _result.split("\n");
  //console.log(_lines[0])
  
  var _needle1 = "Instance_number";
  var _needle2 = "Cluster";
  if (_lines[0].substr(0, _needle1.length).toLowerCase() !== _needle1.toLowerCase()
          && _lines[0].substring((_lines[0].length - _needle2.length), _lines[0].length).toLowerCase() !== _needle2.toLowerCase()) {
    console.log(["資料錯誤: 缺少Cluster或Instance_number欄位", _lines[0].substring((_lines[0].length - _needle2.length), _lines[0].length).toLowerCase() !== _needle2]);
    alert("資料錯誤: 缺少Cluster或Instance_number欄位");
    return false;
  }

  var _attr_list = [];
  var _cluster_data = [];
  var _cluster_count = [];
  var _full_data = {};
  var _full_count = _lines.length - 1;
  
  var _attr_levels = {}

  for (var _i = 0; _i < _lines.length; _i++) {
    var _fields = _lines[_i].split(",");
    if (_i === 0) {
      // 讀取屬性名稱
      _attr_list = _fields;
    } else {
      // 讀取資料

      // 要先知道是那個cluster
      // cluster4
      var _cluster = _fields[(_fields.length - 1)];
      _cluster = _cluster.substring(7, _cluster.length);
      _cluster = parseInt(_cluster, 10);

      if (typeof (_cluster_data[_cluster]) === "undefined") {
        _cluster_data[_cluster] = {};
      }
      if (typeof (_cluster_count[_cluster]) === "undefined") {
        _cluster_count[_cluster] = 0;
      }
      _cluster_count[_cluster]++;

      for (var _f = 0; _f < _fields.length - 1; _f++) {
        var _value = _fields[_f].trim();
        var _attr = _attr_list[_f];

        if (_attr === "Instance_number") {
          continue;
        }
        
        // 在這邊，做quote跟comma的判斷
//        if (_value.startsWith('"') && _value.endsWith('"')) {
//          _value = _value.slice(1, -1)
//          
//          if (_value.lastIndexOf(',') === _value.length - 3) {
//            _value = _value.split(',').join('')
//            _value = new Number(_value)
//          }
//        }

        // 判斷是否是數值
        if (isNaN(_value) === false) {
          // 如果是數值
          _value = parseFloat(_value, 10);

          if (typeof (_full_data[_attr]) !== "object" 
                  || typeof (_full_data[_attr].push) === "undefined") {
            _full_data[_attr] = [];
          }
          //console.log([_attr, typeof(_full_data[_attr]), typeof(_full_data[_attr].push)]);
          _full_data[_attr].push(_value);

          // --------------

          if (typeof (_cluster_data[_cluster][_attr]) === "undefined" 
                  || typeof (_cluster_data[_cluster][_attr].push) === "undefined") {
            _cluster_data[_cluster][_attr] = [];
          }
          _cluster_data[_cluster][_attr].push(_value);
        } else {
          // 如果不是表格
          var _cat = _value;

          if (typeof (_full_data[_attr]) === "undefined") {
            _full_data[_attr] = {};
          }
          if (typeof (_cluster_data[_cluster][_attr]) === "undefined") {
            _cluster_data[_cluster][_attr] = {};
          }

          if (typeof (_full_data[_attr][_cat]) === "number") {
            _full_data[_attr][_cat] = _full_data[_attr][_cat] + 1;
          } else {
            _full_data[_attr][_cat] = 1;
          }

          if (typeof (_cluster_data[_cluster][_attr][_cat]) === "number") {
            _cluster_data[_cluster][_attr][_cat] = _cluster_data[_cluster][_attr][_cat] + 1;
          } else {
            _cluster_data[_cluster][_attr][_cat] = 1;
          }
          
          if (Array.isArray(_attr_levels[_attr]) === false) {
            _attr_levels[_attr] = []
          }
          if (_attr_levels[_attr].indexOf(_cat) === -1) {
            _attr_levels[_attr].push(_cat)
          }
        }
      }
    }
  }

  //console.log(_full_data);
  //console.log(_cluster_data)
  
  //_attr_levels = remove_unknown_cat(_attr_levels)
  //console.log(_attr_levels)
  
  return {
    attr_list: _attr_list,
    full_data: _full_data,
    full_count: _full_count,
    cluster_data: _cluster_data,
    cluster_count: _cluster_count
  }
}

let remove_unknown_cat = function (_attr_levels) {
  let _temp_attr_levels = {}
  for (let level in _attr_levels) {
    let levels = _attr_levels[level]
    if (levels.length === 1 && levels[0] === '?') {
      continue
    }
    _temp_attr_levels[level] = levels
  }
  _attr_levels = _temp_attr_levels
  //console.log(_attr_levels)
  
  return _attr_levels
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
}