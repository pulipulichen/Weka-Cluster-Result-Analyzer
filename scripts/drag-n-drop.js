let dragNDrop = {
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
    
  },
  // file drag hover
  fileDragHover: function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type === "dragover" ? "hover" : "");
  },

  // file selection
  fileSelectHandler: function (e) {

    // cancel event and hover styling
    dragNDrop.fileDragHover(e);

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, f; f = files[i]; i++) {
      ParseFile(f);
    }
  }
}

if (window.File && window.FileList && window.FileReader) {
  dragNDrop.init();
}