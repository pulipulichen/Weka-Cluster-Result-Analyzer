
var _download_file = function (data, filename, type) {
        var a = document.createElement("a"),
                file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
                var url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);    
                }, 0); 
        }

};

// ----------------------------


var _download_file_button = function () {
        var _panel = $(".file-process-framework");
        
        var _file_name = _panel.find(".filename").val();
        var _data = _panel.find(".preview").val();
        if (_file_name.endsWith('.csv') === false) {
          _file_name = _file_name + '.csv'
        }
        _download_file(_data, _file_name, "csv");
};


var _download_numeric_variables_button = function () {
    var _panel = $(".file-process-framework");

    var _file_name = _panel.find(".filename").val().trim();
    _file_name = "numeric-" + _file_name;
    var _data = _panel.find(".preview").val().trim();

    // -----------------------
    
    var _fields_type = [];
    
    var _lines = _data.split("\n");
    var _fields_name = _lines[0].split(",");
    var _fields_value = {};
    var _count = (_lines.length-1);
    
    for (var _i = 1; _i < _lines.length; _i++) {
        var _values = _lines[_i].split(",");
        for (var _j = 0; _j < _values.length; _j++) {
            var _value = _values[_j];
            //console.log(_value);
            if (_value !== "?" && typeof(_fields_type[_j]) === "undefined") {
                var _is_numeric = isNaN(_value);
                _fields_type[_j] = _is_numeric;
            }
            
            if (typeof(_fields_value[_j]) === "undefined") {
                _fields_value[_j] = [];
            }
            _fields_value[_j][(_i-1)] = _value;
        }
    }
    
    //console.log(_fields_value);
    
    // -------------------------------------
    
    // 好了，我們把資料切割完了
    
    _data = [];
    
    var _line = [];
    for (var _i = 0; _i < _fields_type.length; _i++) {
        var _name = _fields_name[_i];
        if (_fields_type[_i] === false || _name === "cluster") {
            // 如果是數字
            if (_name !== 'cluster') {
                _name = 'var' + _i;
            }
            
            _line.push(_name);
        }
    }
    _data.push(_line.join(","));
    
    for (var _i = 0; _i < _fields_value[0].length; _i++) {
        _line = [];
        var _lost_data = false;
        for (var _j = 0; _j < _fields_type.length; _j++) {
            var _name = _fields_name[_j];
            if (_fields_type[_j] === false || _name === "cluster") {
                // 如果是數字
                var _value = '?';
                if (typeof(_fields_value[_j]) !== "undefined" && typeof(_fields_value[_j][_i]) !== "undefined") {
                    _value = _fields_value[_j][_i];
                }
                
                if (_value === "?") {
                    //_lost_data = true;
                    _value = '';
                    //console.log(_lost_data);
                }
                
                if (_name === "cluster") {
                    _value = parseInt(_value.split("cluster").join(""), 10);
                }
                
                _line.push(_value);
            }
        }
        
        if (_lost_data === false) {
            _data.push(_line.join(","));
        }
    }
    
    _data = _data.join("\n");
    
    // -----------------------

    _download_file(_data, _file_name, "csv");
};

var _download_cluster_file_button = function () {
        var _panel = $(".file-process-framework");
        
        var _file_name = _panel.find(".filename").val()
        if (_file_name.endsWith('.csv')) {
          _file_name = _file_name.slice(0, -4) + '-cluster.csv'
        }
        else {
          _file_name = _file_name + '-cluster.csv'
        }
        
        var _data = _panel.find(".preview-cluster").val();
        
        _download_file(_data, _file_name, "csv");
};

// ------------------------

var _download_contingency_table_button = function (_btn) {
    _btn = $(_btn);
    var _tr = _btn.parents("tr:first");
    var _name = _tr.find("th .name").text().trim();
    
    var _td = _tr.children().filter("td");
    //console.log(_td.length);
    
    // 先取得所有的水準
    var _levels = [];
    _td.eq(0).find("table:first tr").each(function (_i, _r) {
        var _l = $(_r).find("td:first").text().trim();
        //console.log(_l);
        if (_l !== "?") {
            _levels.push(_l);
        }
    });
    
    // 取得每一個cluster裡面的數量
    var _data = {};
    for (var _i = 1; _i < _td.length; _i++) {
        var _d = {};
        for (var _l = 0; _l < _levels.length; _l++) {
            _d[_levels[_l]] = 0;
        }
        
        _td.eq(_i).find('table tr').each(function (_j, _r) {
            _r = $(_r);
            var _level = _r.find("td:first").text().trim();
            if (_level !== '?') {
                //var _level_index = $.inArray(_level, _levels);
                var _freq = parseInt(_r.find("td:last").attr("freq-count"), 10);
                _d[_level] = _freq;
            }
        });
        _data['cluster' + _i] = _d;
    }
    
    var _csv = [];
    
    // 標題名字
    var _line = [""];
    for (var _n in _data) {
        _line.push("cluster:"+_n);
    }
    _csv.push(_line.join(","));
    
    for (var _i = 0; _i < _levels.length; _i++) {
        
        var _level = _levels[_i];
        var _label = _name+":"+_level;
        _line = [_label];
        
        for (var _n in _data) {
            var _freq = _data[_n][_level];
            _line.push(_freq);
        }
        
        _csv.push(_line.join(","));
    }
    
    _csv = _csv.join("\n");
    
    //console.log(_csv);
    var _panel = $(".file-process-framework");
    var _file_name = _panel.find(".filename").val().trim();
    _file_name = _name + "-" + _file_name;
    
    _download_file(_csv, _file_name, "csv");
};
