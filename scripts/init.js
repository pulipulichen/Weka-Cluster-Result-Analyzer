
/* global _load_textarea, _load_file, _download_numeric_variables_button, _download_file_button, _download_cluster_file_button, _copy_table, _copy_csv_table, _copy_cluster_table, _change_to_fixed, _change_show_fulldata, _change_show_std */

// -----------------------

$(function () {
    var _panel = $(".file-process-framework");
    _panel.find(".input-mode.textarea").click(_load_textarea).keyup(_load_textarea);
    _panel.find(".myfile").change(_load_file);
    _panel.find(".download-file").click(_download_file_button);
    _panel.find(".download-numeric-variables").click(_download_numeric_variables_button);
    _panel.find(".download-cluster-file").click(_download_cluster_file_button);
    
    $('.menu .item').tab();
    $("button.copy-table").click(_copy_table);
    $("button.copy-csv").click(_copy_csv_table);
    $("button.copy-cluster").click(_copy_cluster_table);
    $("#decimal_places").change(_change_to_fixed);
    
    $("#show_fulldata").change(_change_show_fulldata);
    $("#show_std").change(_change_show_std);
    
    // 20170108 測試用
    //$.get("data.csv", function (_data) {
    $.get("data/data-work.csv", function (_data) {
            $("#input_mode_textarea").val(_data);
            $("#input_mode_textarea").keyup();
    });
    
});