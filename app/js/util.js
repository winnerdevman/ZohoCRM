async function getAttackInfo(dot_info ){
    let attackValue = [];
    for (let i = 0; i < dot_info.length; i++){
        let dot_item = dot_info[i];
        let attacks = dot_item["Attacks"];

        for (let j = 0; j < attacks.length; j++ ){
            let attack_item = attacks[j];
            let attack_vector = attack_item["Attack_Vector"];
            let attack_total = attack_item["Total"];

            if (attackValue[attack_vector["ID"]]){
                if (attackValue[attack_vector["ID"]]["Total"] < attack_total ){
                    attackValue[attack_vector["ID"]]["Total"] = attack_total;
                }
            }else{
                attackValue[attack_vector["ID"]] = {"Attack_Vector": attack_vector, "Total": attack_total };
            }
            
            let color_info = await getColorInfo(dot_item["ID"], attack_vector["ID"]);
        }
    }

    let at_arr = [];
    for(const item in attackValue){
        at_arr.push(attackValue[item]);
    }
    at_arr.sort(function(a,b){return b.Total - a.Total})
    return {dot_info: dot_info, attack_info: at_arr };
}