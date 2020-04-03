
let nominal_to_binary_tr_list = function (_attr, _full_data_attr, _clusters_data_attr, _a, _title_prefix) {
  let full_count = getFullDataCount(_full_data_attr)
  let cluter_count = getClusterDataCount(_clusters_data_attr)
  
  //console.log(full_count, cluter_count)
  
  let levels = parseLevels(_full_data_attr)
  //console.log(levels)
  
  let levelsAvgList = {}
  
  //let fullDataEntroy = 0
  
  levels.forEach(function(level) {
    let avg = {
      full_data: _full_data_attr[level],
      full_data_p: (_full_data_attr[level] / full_count),
      clusters: {},
      clusters_p: {}
    }
    
    for (let c in _clusters_data_attr) {
      let count = _clusters_data_attr[c][level]
      avg.clusters[c] = 0
      if (typeof(count) === 'number') {
         avg.clusters[c] = _clusters_data_attr[c][level]
         avg.clusters_p[c] = (_clusters_data_attr[c][level] / cluter_count[c])
      }
    }
    
    levelsAvgList[level] = avg
  })
  
  
  // -----------------------------
  
  //console.log(levelsAvgList)
  let fullDataEntropy = calcFullDataEntrpy(levelsAvgList)
  let clusterEntropy = calcClustersEntrpy(_clusters_data_attr, levelsAvgList)
  //console.log(fullDataEntropy, clusterEntropy)
  
  // ------------------------------
  
  let trList = []
  
  var _to_fixed = $("#decimal_places").val();
  _to_fixed = parseInt(_to_fixed, 10);
  
  levels.forEach(function(level) {
    let tr = $('<tr class="freq-tr"></tr>')
    
    let pAvg = levelsAvgList[level].full_data / full_count
    tr.append('<th>var' + _a + ': ' + _attr + '=' + level.trim() + ' </th>')
    tr.append('<td class="fulldata freq" title="Full Data ' + _attr + '=' + level + ' Freq." '
      + 'data-ori-value="' + levelsAvgList[level].full_data + '" data-p="' + pAvg + '">'
              + _float_to_fixed(levelsAvgList[level].full_data, _to_fixed) + '</td>');
    
    let pMax
    let pMin
    for (let c in levelsAvgList[level].clusters) {
      let p = levelsAvgList[level].clusters[c] / cluter_count[c]
      if (!pMax || p > pMax) {
        pMax = p
      }
      if (!pMin || p < pMin) {
        pMin = p
      }
    }
    
    for (let c in levelsAvgList[level].clusters) {
      let td = $('<td class="freq" title="Cluster ' + c + ' ' + _attr + '=' + level + ' Freq." ' 
              + 'data-ori-value="' + levelsAvgList[level].clusters[c] + '">'
              + _float_to_fixed(levelsAvgList[level].clusters[c], _to_fixed) + '</td>')
      
      let p = levelsAvgList[level].clusters[c] / cluter_count[c]
      td.attr('data-prop', p)
      if (p > pAvg) {
        td.addClass('small')
      }
      else if (p < pAvg) {
        td.addClass('large')
      }
      if (pMax && pMin && pMax > pMin) {
        if (p === pMax) {
          td.addClass('smallest')
        }
        else if (p === pMin) {
          td.addClass('largest')
        }
      }
      tr.append(td);
    }
    
    trList.push(tr)
  })
  
  // ------------------------------
  
  let entropyTr = $('<tr class="entropy-tr"></tr>')
  
  entropyTr.append('<th>var' + _a + ': ' + _attr + ' (Entropy)</th>')
  entropyTr.append('<td class="fulldata entropy" title="' + _title_prefix + ' Entropy" '
    + 'data-ori-value="' + fullDataEntropy + '">'
            + _float_to_fixed(fullDataEntropy, _to_fixed) + '</td>');

  let eMax
  let eMin
  for (let c in clusterEntropy) {
    let e = clusterEntropy[c]
    if (!eMax || e > eMax) {
      eMax = e
    }
    if (!eMin || e < eMin) {
      eMin = e
    }
  }

  for (let c in clusterEntropy) {
    let td = $('<td class="entropy" title="Cluster ' + c + ' ' + _attr + ' Entropy" data-ori-value="' + clusterEntropy[c] + '">'
            + _float_to_fixed(clusterEntropy[c], _to_fixed) + '</td>')
    let e = clusterEntropy[c]
    /*
    if (e > fullDataEntropy) {
      td.addClass('large')
    }
    else if (e < fullDataEntropy) {
      td.addClass('small')
    }
    if (eMax && eMin && eMax > eMin) {
      if (e === eMax) {
        td.addClass('largest')
      }
      else if (e === eMin) {
        td.addClass('smallest')
      }
    }
    */
    entropyTr.append(td)
  }

  trList.push(entropyTr)
  
  // -----------------------
  
  return trList
}

let getFullDataCount = function (_full_data_attr) {  
  let full_count = 0
  for (let key in _full_data_attr) {
    full_count = full_count + _full_data_attr[key]
  }
  return full_count
}

let getClusterDataCount = function (_clusters_data_attr) {
  let cluter_count = {}
  for (let c in _clusters_data_attr) {
    if (typeof(cluter_count[c]) !== 'number') {
      cluter_count[c] = 0
    }
    
    for (let key in _clusters_data_attr[c]) {
      cluter_count[c] = cluter_count[c] + _clusters_data_attr[c][key]
    }
  }
  return cluter_count
}

let parseLevels = function (_full_data_attr) {
  let levels = []
  for (let key in _full_data_attr) {
    if (levels.indexOf(key) === -1) {
      levels.push(key)
    }
  }

  levels.sort()
  
  return levels
}

let calcFullDataEntrpy = function (levelsAvgList) {
  let pList = []
  for (let level in levelsAvgList) {
    pList.push(levelsAvgList[level].full_data_p)
  }
  
  return calcEntropy(pList)
}

let calcClustersEntrpy = function (_clusters_data_attr, levelsAvgList) {
  let entropyList = {}
  for (let c in _clusters_data_attr) {
    let pList = []
    for (let level in levelsAvgList) {
      pList.push(levelsAvgList[level].clusters_p[c])
    }
    entropyList[c] = calcEntropy(pList)
  }
  
  return entropyList
}

let calcEntropy = function (pList) {
  if (pList.length === 0) {
    return 0
  }
  
  let entropy = 0
  pList.forEach(function (p) {
    if (typeof(p) !== 'number' || p === 0) {
      return false
    }
    
    entropy = entropy + (p * Math.log(p))
  })
  
  if (entropy === 0) {
    return 0
  }
  
  return entropy * -1
}