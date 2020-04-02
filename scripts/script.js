
var _process_file = function(_input, _callback) {

    //------------------
    
    _input = _input.replace(/'\\'/g, "");
    _input = _input.replace(/\\''/g, "");
    //_input = _input.replace(new RegExp("\''", 'g'), "");
    //console.log(_input);
    //_input = _input.replace("\\''", "");

    var _needle = "\n@data\n";
    var _pos =    _input.indexOf(_needle);
    if (_pos === -1) {
      _pos = _input.indexOf("@data") - 1;
    }
    //console.log(_pos);
    var _result;
    var _arff_mode = true;
    if (_pos > -1) {
        _result = _input.substring(_pos + _needle.length, _input.length).trim();
    }
    else {
        _arff_mode = false;
        _result = _input.substring(_input.indexOf("\n")+1, _input.length).trim();
    }
    
    // -----------------
    var _attr_list = [];
    var _attr_values = [];
    if (_arff_mode === true) {
        var _attr_input = _input.substr(0, _pos);
        var _lines = _attr_input.split("\n");
        var _attr_needle = "@attribute ";
        for (var _i = 0; _i < _lines.length; _i++) {
            var _line = _lines[_i];
            if (_line.indexOf(_attr_needle) === 0) {
                    var _fields = _line.split(" ");
                    var _attr = _fields[1];
                    _attr_list.push(_attr);
                    var _values = _fields[2].slice(1, -1).split(',')
                    _attr_values.push(_values)
            }
        }
        //console.log(_attr_list);
        
        if (_result.startsWith('{') && _result.endsWith('}')) {
          //console.log('aaa')
          let output = []
          _result.split('\n').forEach(line => {
            let fields = new Array(_attr_list.length)
            
            line.trim().slice(1, -1).split(',').forEach(field => {
              let pos = field.indexOf(' ')
              let i = field.slice(0, pos)
              i = parseInt(i, 10)
              let value = field.slice(pos+1)
              fields[i] = value
            })
            
            for (let i = 0; i < _attr_list.length; i++) {
              if (typeof(fields[i]) === 'undefined') {
                fields[i] = _attr_values[i][0]
              }
            }
            output.push(fields.join(','))
          })
          _result = output.join('\n')
        }
    }
    else {
        var _attr_line = _input.substr(0, _input.indexOf("\n")).trim();
        _attr_list = _attr_line.split(",");
    }
    _result = _attr_list.join(",") + "\n" + _result;
    _draw_stat_table(_result);
        
    if (typeof(_callback) === "function") {
        _callback(_result);
    }
    
};


// ----------------------------

// ----------------------------

var FULL_DATA;
var CLUSTER_DATA;
var TO_FIXED;

// ---------------------

var _draw_stat_abs_table = function () {
        var _stat_table = $(".stat-result");
        var _abs_table = $(".stat-result-abstract");
        
        var _thead_tr = _stat_table.find("thead tr").clone();
        _thead_tr.find("th:first").html(DICT["Cluster"]);
        _thead_tr.find("th:eq(1)").remove();
        //_thead_tr.find("th:last").remove();
        _abs_table.find("thead").empty().append(_thead_tr);
        
        
        // -------------------
        var _good = [];
        var _bad = [];
        
        // -------------------
        var _avg_tr_list = _stat_table.find("tbody tr.compare-data");
        for (var _r = 0; _r < _avg_tr_list.length; _r++) {
                var _attr = _avg_tr_list.eq(_r).find("th:first").text();
                if (_attr.indexOf("(Avg.)") > -1) {
                    _attr = _attr.substr(0, _attr.length-7).trim();
                }
                var _td_list = _avg_tr_list.eq(_r).find("td:not(.sse):not(.freq-list)");
                for (var _d = 1; _d < _td_list.length; _d++) {
                        var _cluster = _d-1;
                        
                        var _avg = _avg_tr_list.eq(_r).find(`td:eq(${_d})`).text();
                        try {
                          eval('_avg = ' + _avg)
                        }
                        catch (e) {
                          console.error(_avg_tr_list.eq(_r).find(`th:eq(0)`).text() + ' is nominal')
                        }
                        
                        if (typeof(_good[_cluster]) === "undefined") {
                            _good[_cluster] = [];
                        }
                        if (typeof(_bad[_cluster]) === "undefined") {
                            _bad[_cluster] = [];
                        }
                        
                        var _set_attr = _attr;
                        var _td = _td_list.eq(_d);
                        if (_td.hasClass("freq")) {
                                continue;
                        }
                        
                        if (_td.hasClass("smallest") || _td.hasClass("largest")) {
                            _set_attr = _set_attr + "*";
                        }
                        if (_td.hasClass("smallest")) {
                            _set_attr = '<span class="smallest">' + _set_attr + '</span>';
                        }
                        if (_td.hasClass("largest")) {
                            _set_attr = '<span class="largest">' + _set_attr + '</span>';
                        }
                        
                        _set_attr = `<span data-avg="${_avg}">${_set_attr}</span>`
                        
                        if (_td.hasClass("small") || _td.hasClass("x-small") || _td.hasClass("xx-small")) {
                            _bad[_cluster].push(_set_attr);
                        }
                        if (_td.hasClass("large") || _td.hasClass("x-large") || _td.hasClass("xx-large")) {
                            _good[_cluster].push(_set_attr);
                        }
                }
        }
        
        // ----------------------------------------
        
        var _good_tr = _abs_table.find("tr.good").empty();
        _good_tr.append("<th>" + DICT["Larger than Avg."] + "</th>");
        for (var _i = 0; _i < _good.length; _i++) {
                var _value = _good[_i].join("<br />");
                _good_tr.append('<td><div>' + _value + '</div></td>');
        }
        
        var _bad_tr = _abs_table.find("tr.bad").empty();
        _bad_tr.append("<th>" + DICT["Smaller than Avg."] + "</th>");
        for (var _i = 0; _i < _bad.length; _i++) {
                var _value = _bad[_i].join("<br />");
                _bad_tr.append('<td><div>' + _value + '</div></td>');
        }
        
        //setTimeout(() => {
          _abs_table.find('thead tr th:not(:first)').each((_i, th) => {
            //console.log($('table.stat-result:first tr.compare-data:first td:eq(' + (_i+1) + ')').length)
            let count = $('table.stat-result:first tr.compare-data:first td:eq(' + (_i+1) + ')').text()
            //let button = $('<button type="button" onclick="TagCloud.donwload(this, ' + (_i+1) + ', ' + count + ')">下載</button>').appendTo($(th))
          })
        //}, 1000)
};

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
                }
                else {
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
                        _sse = _sse + (_center - _data)*(_center - _data);
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
                        var _sse = (1-_avg)*(1-_avg)*_count 
                                        + _avg*_avg*(_total_count-_count);
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

var _output_filename_surffix="_output";
var _output_filename_ext=".csv";

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
  result.slice(result.indexOf('\n')+1).split('\n').forEach(line => {
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
                var _data = "<tr><td class='freq-list'>" + _array_json[_i].key + "</td><td class='freq-list' freq-count='" + _array_json[_i].value + "'>" + _value + "</td></tr>";
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
