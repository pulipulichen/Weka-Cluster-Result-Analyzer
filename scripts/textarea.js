
/* global _output_filename_surffix, _output_filename_ext, XLSX */

var _load_textarea = async function (evt) {
  var _panel = $(".file-process-framework");

  // --------------------------

  var _result = _panel.find(".input-mode.textarea").val();
  if (_result.trim() === "") {
    return;
  }

  // ---------------------------

  _panel.find(".loading").removeClass("hide");

  // ---------------------------
  var d = new Date();
  var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

  var local = new Date(utc);
  var _file_name = local.toJSON().slice(0, 19).replace(/:/g, "-");
  _file_name = "output_" + _file_name + ".csv";

  // ---------------------------

  await _process_file(_result, function (_result) {
    _panel.find(".preview").val(_result);
    setPreviewCluster(_result)
    _panel.find(".filename").val(_file_name);

    _panel.find(".loading").addClass("hide");
    _panel.find(".display-result").show();
    _panel.find(".display-result .encoding").hide();

    var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
    if (_auto_download === true) {
      _panel.find(".download-file").click();
    }
  }); // await _process_file(_result, function (_result) {
};


var _load_file = function (evt) {
  //console.log(1);
  if (!window.FileReader) {
    return; // Browser is not compatible
  }

  $('body').addClass('loading')

  var _panel = $(".file-process-framework");

  _panel.find(".loading").removeClass("hide");

  var reader = new FileReader();
  var _result;
  let type

  var _file_name = evt.target.files[0].name;
  var _pos = _file_name.lastIndexOf(".");
  _file_name = _file_name.substr(0, _pos)
          + _output_filename_surffix
          + _file_name.substring(_pos, _file_name.length);
  _file_name = _file_name + _output_filename_ext;

  reader.onload = async function (evt) {
    if (evt.target.readyState !== 2) {
      _panel.find(".loading").addClass("hide");
      return;
    }
    if (evt.target.error) {
      alert('Error while reading file');
      _panel.find(".loading").addClass("hide");
      return;
    }

    //filecontent = evt.target.result;

    //document.forms['myform'].elements['text'].value = evt.target.result;
    _result = evt.target.result
    
    await _process_file_object(_result, _file_name, type)
  };


  type = evt.target.files[0].type
  if (type === 'application/vnd.oasis.opendocument.spreadsheet'
          || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    let size = evt.target.files[0].size
    console.log('size', size)
    if (size > 25000000) {
      window.alert('ODS/XLSX檔案大小請低於2.5MB。')
      _panel.find(".loading").addClass("hide");
      return false
    }
    
    reader.readAsBinaryString(evt.target.files[0])
  } else {
    reader.readAsText(evt.target.files[0])
  }
}

let _build_file_name = function (_file) {
  var _file_name = _file.name;
  var _pos = _file_name.lastIndexOf(".");
  _file_name = _file_name.substr(0, _pos)
          + _output_filename_surffix
          + _file_name.substring(_pos, _file_name.length);
  _file_name = _file_name + _output_filename_ext;
  
  return _file_name
}

let _process_file_object = async function (_result, _file_name, type) {
  //console.log(type)
  
  if (!_file_name) {
    _file_name = _build_file_name(_result)
  }
  if (!type) {
    type = _result.type
  }
  
  if (type === 'application/vnd.oasis.opendocument.spreadsheet'
          || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    //console.log('ods')
    //console.log(_result.size)
    //return false
    try {
      let retcsv = await readxlsx(_result)
      //console.log(retcsv)
      _result = retcsv
    } catch (e) {
      alert(e)
      $('body').removeClass('loading')
    }
    //return false
  }

  //console.log(evt.target.files[0].type)
  //if ()

  try {
    _send_to_process_file(_result, _file_name)
  } catch (e) {
    $('body').removeClass('loading')
  }
}

let _send_to_process_file = function (_result, _file_name) {
  var _panel = $(".file-process-framework");
  _process_file(_result, function (_result) {
    _panel.find(".preview").val(_result);

    setPreviewCluster(_result)

    _panel.find(".filename").val(_file_name);

    $(".file-process-framework .myfile").val("");
    $(".file-process-framework .loading").addClass("hide");
    _panel.find(".display-result").show();
    _panel.find(".display-result .encoding").show();

    var _auto_download = (_panel.find('[name="autodownload"]:checked').length === 1);
    if (_auto_download === true) {
      _panel.find(".download-file").click();
    }

    $('body').removeClass('loading')

    //_download_file(_result, _file_name, "txt");
  });
}
/**
 * @Author https://firsemisphere.blogspot.com/2017/02/javascriptsheetjsjs-xlsxjs.html
 */
let readxlsx = async function (inpdata) {
  //讀取xlsx檔

  //參數
  //inpdata為由input file讀入之data
  //fmt為讀取格式，可有"json"或"csv"，csv格式之分欄符號為逗號，分行符號為[\n]

  //說明
  //所使用函式可參考js-xlsx的GitHub文件[https://github.com/SheetJS/js-xlsx]


  //to_json
//  let to_json = function (workbook) {
//    var result = {};
//    workbook.SheetNames.forEach(function (sheetName) {
//      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
//      if (roa.length > 0) {
//        result[sheetName] = roa;
//      }
//    });
//    return result;
//  }


  //to_csv
    


  //讀檔
  //console.log('開始讀檔')
  try {
    var workbook = await XLSX.readAsync(inpdata, {type: 'binary'});
    //var workbook = XLSX.read(inpdata, {type: 'binary'});
  }
  catch (e) {
    window.alert(e)
    return false
  }
  //console.log('讀檔完成')

  //轉為json物件回傳
  return await to_csv(workbook);

}

let to_csv = async function (workbook) {
  var result = [];
  for (let i in workbook.SheetNames) {
    let sheetName = workbook.SheetNames[i]
    
    /*
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if (csv.length > 0) {
      result.push('SHEET: ' + sheetName);
      result.push('\n');
      result.push(csv);
    }
    */
    var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    var csv = []
    var attrList
    //csv.push('SHEET: ' + sheetName);
    //csv.push('\n');
    for (let j = 0; j < json.length; j++) {
      if (j === 0) {
        attrList = Object.keys(json[0])
        csv.push(attrList.join(','))
      }
      
      let valueList = attrList.map(function (key) {
        return json[j][key]
      })
      csv.push(valueList.join(','))
      
      if (j % 1000 === 0) {
        await sleep()
      }
    }
    
    //csv = csv.join('\n').trim()
    //console.log(csv)
    //return csv
//    console.log(csv.join('\n'))
//    //await sleep()
    return csv.join('\n')
  }
  
  
  //console.log(result)
  return result;
}