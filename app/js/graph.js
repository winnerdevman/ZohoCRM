
function drawGraph(dot_info, attack_info, color_data ){    
    var left_legend_obj = $("#left-legend");
    var av_legend_obj = $("#av-legend-container");
    var rti_obj = $("#rti-data");
    $(rti_obj).find(".data-content").remove();
    var header_row_obj = $("#rti-data .header-row");
    var left_total_legend_obj = $("#left-total-legend");
    var data_content_container = $(".data-content-container");

    $(left_legend_obj).html("");
    $(av_legend_obj).html("");
    $(header_row_obj).html('');
    $(left_total_legend_obj).html('<div class="data-col">Index</div>');
    
    for(var i = 0; i < dot_info.length; i++ ){
        var dot_item = dot_info[i];
        var dot_attacks = dot_item["Attacks"];
        if (dot_attacks ){
            var data_row = $("<div>")
                .addClass("data-row").appendTo(left_legend_obj);
            $("<div>").addClass("data-col " + dot_item["ID"]).text(dot_item["Name"]).appendTo(data_row);

            var data_row = $("<div>").addClass("data-row")
                .appendTo(left_total_legend_obj);
            $("<div>").addClass("data-col total-" + dot_item["ID"]).text(dot_item["Index"])
                .appendTo(data_row);

            var data_content = $("<div>").addClass("data-row data-content " + dot_item["ID"])
                .appendTo(data_content_container);
            for (var j = 0; j < attack_info.length; j++ ){
                var attack_item = attack_info[j];
                var attack_vector = attack_item["Attack_Vector"];
                $("<div>").addClass("data-col attack-" + attack_vector["ID"])
                        .html('<span class="circle no-val"></span>').appendTo(data_content);
            }

            for (var j = 0; j < dot_attacks.length; j++){
                var attack_vect = dot_attacks[j]["Attack_Vector"]
                var id = attack_vect["ID"];
                var total = dot_attacks[j]["Total"];
                var has_class = "has-val";
                if (attack_vect["rec_val"] && attack_vect["rec_val"] != "" ){
                    has_class = "rec-val";
                }
                $(data_content).find(".attack-" + id )
                    .html('<span class="circle ' + has_class + '" data-index-val="' + total + '"></span>' );
            }
        }
    }

    for (var i = 0; i < attack_info.length; i++ ){
        var attack_item = attack_info[i];
        var attack_vector = attack_item["Attack_Vector"];
        var data_col = $("<div>").addClass("data-col").appendTo(av_legend_obj);
        $("<span>").addClass("av-legend").text(attack_vector["display_value"]).appendTo(data_col);
        $("<div>").addClass("data-col attack-" + attack_vector["ID"]).text(attack_item["Reptile_Theory_Index_0_100"]).appendTo(header_row_obj);
    }

    console.log(color_data );
    color_data = color_data.data;
    for (var i = 0; i < color_data.length; i++){
        var color_item = color_data[i];
        var dot_id = color_item["DOT"]["ID"];
        var attack_id = color_item["Reptile_Index_Theory_Attack_Vector"]["ID"];
        console.log("." + dot_id + " .attack-" + attack_id + " span");
        $("." + dot_id + " .attack-" + attack_id + " span").removeClass("has-val").addClass("rec-val");
    }
}