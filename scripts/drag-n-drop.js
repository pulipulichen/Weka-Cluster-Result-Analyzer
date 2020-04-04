let dragNDrop = {
  enable: true,
  init: function () {
    /*
    var fileselect = $("#fileselect"),
            filedrag = $("#filedrag"),
            submitbutton = $("#submitbutton");

    // file select
    fileselect.addEventListener("change", dragNDrop.fileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

      // file drop
      filedrag.addEventListener("dragover", dragNDrop.fileDragHover, false);
      filedrag.addEventListener("dragleave", dragNDrop.fileDragHover, false);
      filedrag.addEventListener("drop", dragNDrop.fileSelectHandler, false);
      filedrag.style.display = "block";

      // remove submit button
      submitbutton.style.display = "none";
    }
    */
    $(window).mouseout(function () {
      dragNDrop.enable = true
    })
    $(document).mouseout(function () {
      dragNDrop.enable = true
    })
    $(window).blur(function () {
      dragNDrop.enable = true
    })
    $(document).blur(function () {
      dragNDrop.enable = true
    })
    /*
    $(window).focus(function () {
      dragNDrop.enable = false
    })
    */
    $(document).mousedown(function () {
      dragNDrop.enable = false
    })
    
    let $body = $('body')
    let timer
    
    $body.on('dragover', function (event) {
      if (dragNDrop.enable === false) {
        return false
      }
      event.stopPropagation();
      event.preventDefault();
      $body.addClass('dragover')
    })
    $body.on('dragleave', function (event) {
      if (timer) {
        clearTimeout(timer)
      }
      event.stopPropagation();
      event.preventDefault();
      timer = setTimeout(function () {
        $body.removeClass('dragover')
      }, 1000)
      
    })
    $body.on('drop', function (event) {
      if (dragNDrop.enable === false) {
        return false
      }
      event.stopPropagation()
      event.preventDefault()
      dragNDrop.enable = true
      $body.removeClass('dragover')
      
      dragNDrop.fileSelectHandler(event)
    })
  },
  // file drag hover
//  fileDragHover: function (e) {
//    e.stopPropagation();
//    e.preventDefault();
//    e.target.className = (e.type === "dragover" ? "hover" : "");
//  },

  // file selection
  fileSelectHandler: function (e) {

    // cancel event and hover styling
    //dragNDrop.fileDragHover(e);

    // fetch FileList object
    //console.log(e)
    var files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;

    // process all File objects
    for (let i = 0; i < files.length; i++) {
      //ParseFile(f);
      //console.log(f.type)
      let f = files[i]
      dragNDrop.processFile(f, e)
      //console.log(i)
    }
  },
  processFile: function (file) {
    if (!file) {
      console.log('沒有檔案？')
      return false
    }
    
    dragNDrop.enable = true
    $('body').addClass('loading')
    //console.log(file)
    //_process_file_object(file)
    
    let reader = new FileReader()
    
    reader.onload = function (evt) {
      if (evt.target.readyState !== 2)
        return;
      if (evt.target.error) {
        alert('Error while reading file');
        return;
      }

      //filecontent = evt.target.result;

      //document.forms['myform'].elements['text'].value = evt.target.result;
      let _result = evt.target.result
      //console.log(_result)
      _process_file_object(_result, _build_file_name(file), type)
    }
    
    
    let type = file.type
    if (type === 'application/vnd.oasis.opendocument.spreadsheet'
          || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsText(file)
    }
  }
}

if (window.File 
        && window.FileList 
        && window.FileReader) {
  dragNDrop.init();
}