
/* global DICT */

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
      _attr = _attr.substr(0, _attr.length - 7).trim();
    }
    var _td_list = _avg_tr_list.eq(_r).find("td:not(.sse):not(.freq-list)");
    for (var _d = 1; _d < _td_list.length; _d++) {
      var _cluster = _d - 1;

      var _avg = _avg_tr_list.eq(_r).find(`td:eq(${_d})`).text();
      try {
        eval('_avg = ' + _avg)
      } catch (e) {
        console.error(_avg_tr_list.eq(_r).find(`th:eq(0)`).text() + ' is nominal')
      }

      if (typeof (_good[_cluster]) === "undefined") {
        _good[_cluster] = [];
      }
      if (typeof (_bad[_cluster]) === "undefined") {
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
    let count = $('table.stat-result:first tr.compare-data:first td:eq(' + (_i + 1) + ')').text()
    //let button = $('<button type="button" onclick="TagCloud.donwload(this, ' + (_i+1) + ', ' + count + ')">下載</button>').appendTo($(th))
  })
  //}, 1000)
};
