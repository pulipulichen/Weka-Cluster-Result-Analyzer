
var _load_textarea = function(evt) {
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
        var _file_name = local.toJSON().slice(0,19).replace(/:/g, "-");
        _file_name = "output_" + _file_name + ".csv";

        // ---------------------------

        _process_file(_result, function (_result) {
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
        });
};


var _load_file = function(evt) {
        //console.log(1);
        if(!window.FileReader) return; // Browser is not compatible


    $('body').addClass('loading')

        
        var _panel = $(".file-process-framework");
        
        _panel.find(".loading").removeClass("hide");

        var reader = new FileReader();
        var _result;

        var _file_name = evt.target.files[0].name;
        var _pos = _file_name.lastIndexOf(".");
        _file_name = _file_name.substr(0, _pos)
                + _output_filename_surffix
                + _file_name.substring(_pos, _file_name.length);
        _file_name = _file_name + _output_filename_ext;
        
        reader.onload = function(evt) {
                if(evt.target.readyState !== 2) return;
                if(evt.target.error) {
                        alert('Error while reading file');
                        return;
                }

                //filecontent = evt.target.result;

                //document.forms['myform'].elements['text'].value = evt.target.result;
                _result =    evt.target.result;

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
        };


        //console.log(_file_name);

        reader.readAsText(evt.target.files[0]);
};
