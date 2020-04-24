/* global DICT */

var _draw_stat_abs_table = async function () {
  var _stat_table = $(".stat-result");
  var _abs_table = $(".stat-result-abstract");

  var _thead_tr = _stat_table.find("thead tr").clone();
  _thead_tr.find("th:first").html(DICT["Cluster"]);
  _thead_tr.find("th:eq(1)").remove();
  //_thead_tr.find("th:last").remove();
  _abs_table.find("thead").empty().append(_thead_tr);


  // -------------------
  var _good = [];
  var _best = []
  var _bad = [];
  var _worst = []

  // -------------------
  var _avg_tr_list = _stat_table.find("tbody tr.compare-data");
  for (var _r = 0; _r < _avg_tr_list.length; _r++) {
    var _attr = _avg_tr_list.eq(_r).find("th:first").text();
    if (_attr.indexOf("(Avg.)") > -1) {
      _attr = _attr.substr(0, _attr.length - 7).trim();
    }
    //console.log(_attr)
    //var _td_list = _avg_tr_list.eq(_r).find("td:not(.sse):not(.freq-list)");
    var _td_list = _avg_tr_list.eq(_r).find("td:not(.sse):not(.prop-list)")
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
      if (typeof (_best[_cluster]) === "undefined") {
        _best[_cluster] = [];
      }
      if (typeof (_worst[_cluster]) === "undefined") {
        _worst[_cluster] = [];
      }

      var _set_attr = _attr;
      var _td = _td_list.eq(_d);
      if (_td.hasClass("prop")) {
        continue;
      }
      
      if (_set_attr.startsWith('var')) {
        _set_attr = _set_attr.slice(3)
      }

      if (_td.hasClass("smallest") || _td.hasClass("largest")) {
        //_set_attr = _set_attr + "*";
      }
      if (_td.hasClass("smallest")) {
        _set_attr = '<span class="smallest">' + _set_attr + '</span>';
      }
      if (_td.hasClass("largest")) {
        _set_attr = '<span class="largest">' + _set_attr + '</span>';
      }

      _set_attr = `<span data-avg="${_avg}">${_set_attr}</span>`

      if (_td.hasClass('smallest')) {
        _worst[_cluster].push(_set_attr)
      }
      else if (_td.hasClass('largest')) {
        _best[_cluster].push(_set_attr)
      }
      else if (_td.hasClass("small") || _td.hasClass("x-small") || _td.hasClass("xx-small")) {
        _bad[_cluster].push(_set_attr);
      }
      else if (_td.hasClass("large") || _td.hasClass("x-large") || _td.hasClass("xx-large")) {
        _good[_cluster].push(_set_attr);
      }
      
      await sleep()
    } // for (var _d = 1; _d < _td_list.length; _d++) {
  } // for (var _r = 0; _r < _avg_tr_list.length; _r++) {

  // ----------------------------------------

  var _good_tr = _abs_table.find("tr.good").empty();
  let _good_th = $("<th>" + DICT["Larger than Avg."] + "</th>")
          .css({
            'background-color': '#DEEBD6'
          })
  _good_tr.append(_good_th);
  for (var _i = 0; _i < _good.length; _i++) {
    var _value = _good[_i].join("<br />");
    let td = $('<td><div>' + _value + '</div></td>')
            .css({
              'vertical-align': 'top'
            })
    _good_tr.append(td);
    await sleep()
  }

  var _bad_tr = _abs_table.find("tr.bad").empty();
  let _bad_th = $("<th>" + DICT["Smaller than Avg."] + "</th>")
          .css({
            'background-color': '#F7CFCE'
          })
  _bad_tr.append(_bad_th);
  for (var _i = 0; _i < _bad.length; _i++) {
    var _value = _bad[_i].join("<br />");
    let td = $('<td><div>' + _value + '</div></td>')
            .css({
              'vertical-align': 'top'
            })
    _bad_tr.append(td);
    await sleep()
  }
  
  var _worst_tr = _abs_table.find("tr.worst").empty();
  let _worst_th = $("<th>" + DICT["Smallest"] + "</th>")
          .css({
            'background-color': '#F7CFCE',
            'color': 'red'
          })
  _worst_tr.append(_worst_th);
  for (var _i = 0; _i < _worst.length; _i++) {
    var _value = _worst[_i].join("<br />");
    let td = $('<td><div>' + _value + '</div></td>')
            .css({
              color: 'red',
              'vertical-align': 'top'
            })
    _worst_tr.append(td);
    await sleep()
  }
  
  var _best_tr = _abs_table.find("tr.best").empty();
  let _best_th = $("<th>" + DICT["Largest"] + "</th>")
          .css({
            'background-color': '#DEEBD6',
            'color': 'green'
          })
  _best_tr.append(_best_th);
  for (var _i = 0; _i < _best.length; _i++) {
    var _value = _best[_i].join("<br />");
    let td = $('<td><div>' + _value + '</div></td>')
            .css({
              color: 'green',
              'vertical-align': 'top'
            })
    _best_tr.append(td)
    await sleep()
  }

  //setTimeout(() => {
  _abs_table.find('thead tr th:not(:first)').each((_i, th) => {
    //console.log($('table.stat-result:first tr.compare-data:first td:eq(' + (_i+1) + ')').length)
    let count = $('table.stat-result:first tr.compare-data:first td:eq(' + (_i + 1) + ')').text()
    //let button = $('<button type="button" onclick="TagCloud.donwload(this, ' + (_i+1) + ', ' + count + ')">下載</button>').appendTo($(th))
  })
  //}, 1000)
};
