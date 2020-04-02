
var _process_file = function (_input, _callback) {

  //------------------

  _input = _input.replace(/'\\'/g, "");
  _input = _input.replace(/\\''/g, "");
  //_input = _input.replace(new RegExp("\''", 'g'), "");
  //console.log(_input);
  //_input = _input.replace("\\''", "");

  let _result
  if (_input.indexOf("\n@data\n") > -1
          || _input.indexOf("@data") > -1) {
    _result = _process_file_in_arff(_input)
  } else {
    _result = _process_file_in_csv(_input)
  }

  _draw_stat_table(_result);

  if (typeof (_callback) === "function") {
    _callback(_result);
  }

}

let _process_file_in_arff = function (_input) {

  //_input = _input.replace(new RegExp("\''", 'g'), "");
  //console.log(_input);
  //_input = _input.replace("\\''", "");

  var _needle = "\n@data\n";
  var _pos = _input.indexOf(_needle);
  if (_pos === -1) {
    _pos = _input.indexOf("@data") - 1;
  }
  var _result;
  var _arff_mode = true;
  if (_pos > -1) {
    _result = _input.substring(_pos + _needle.length, _input.length).trim();
  }

  // -----------------
  var _attr_list = [];
  var _attr_values = [];
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
        let value = field.slice(pos + 1)
        fields[i] = value
      })

      for (let i = 0; i < _attr_list.length; i++) {
        if (typeof (fields[i]) === 'undefined') {
          fields[i] = _attr_values[i][0]
        }
      }
      output.push(fields.join(','))
    })
    _result = output.join('\n')
  }

  _result = _attr_list.join(",") + "\n" + _result;
  return _result
}


let _process_file_in_csv = function (_input) {
  let _result = _input.substring(_input.indexOf("\n") + 1, _input.length).trim();

  var _attr_line = _input.substr(0, _input.indexOf("\n")).trim();
  let _attr_list = _attr_line.split(",");

  _result = _attr_list.join(",") + "\n" + _result;

  return _result
}