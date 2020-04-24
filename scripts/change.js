
var _change_show_fulldata = function () {

  var _show = ($("#show_fulldata:checked").length === 1);
  //console.log([$("#show_fulldata").attr("checked"), _show]);

  var _cells = $(".stat-result .fulldata");
  if (_show) {
    _cells.show();
  } else {
    _cells.hide();
  }
};

var _change_show_std = function () {
  var _show = ($("#show_std:checked").length === 1);

  var _cells = $(".stat-result tr.std-tr, .stat-result tr.cov-tr, .stat-result tr.freq-tr, .stat-result tr.entropy-tr");
  if (_show) {
    _cells.show();
  } else {
    _cells.hide();
  }
};

var _change_sse = function () {
  _calc_cluster_score();
};

var _change_to_fixed = async function () {
  var _to_fixed = $("#decimal_places").val();
  _to_fixed = parseInt(_to_fixed, 10);

  var _tds = $("*[data-ori-value]");
  for (var _i = 0; _i < _tds.length; _i++) {
    var _td = _tds.eq(_i);
    var _value = _td.data("ori-value");
    _value = parseFloat(_value, 10);
    _value = _float_to_fixed(_value, _to_fixed);
    _td.text(_value);
    
    await sleep()
  }
};
