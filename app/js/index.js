const APP_NAME = "customer-portal";
const USER_REPORT_NAME = "All_Users";
const DOT_REPORT_NAME = "DOTs";
const ATTACT_REPORT_NAME = "Reptile_Attack_Vector_Result_Report";
const COLOR_REPORT_NAME = "All_Recommendation_Engines";

ZOHO.CREATOR.init().then(function(data){
  $('body').waitMe({
    effect : 'bounce',
    text : '',
    bg : "rgba(255,255,255,0.7)",
    color : "#000"
  });
  
  let queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
  let config = {};
  if (Object.keys(queryParams).length > 0 ){
    config = {
      appName: APP_NAME,
      reportName: USER_REPORT_NAME,
      page: 1,
      pageSize: 1,
      criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
    }
  }

  retrieveInfo(config );
});

async function retrieveInfo(config ){
  const company_id = await getCompanyId(config );
  if (company_id == "" ){
    alert("CompanyId don't exist");
    $('body').waitMe("hide");
    return;
  }

  let dot_info = await getAllDots(company_id);
  for (var i = 0; i < dot_info.length; i++ ){
    try {
      const attack_info = await getAttackItem(dot_info[i]["ID"]);      
      let dot_value = await getDotTotal(dot_info[i]["ID"]);
      dot_info[i]["Attacks"] = attack_info;  
      dot_info[i]["Index"] = dot_value["Reptile_Theory_Index_0_100"];
    } catch (error) {
      $('body').waitMe("hide");
      return;
    }    
  }

  let attack_info = await getAttackIndex(company_id);
  dot_info.sort(function(a,b){return b.Index - a.Index});
  attack_info.sort(function(a,b){return b.Reptile_Theory_Index_0_100 - a.Reptile_Theory_Index_0_100});
  //graph_data = await getAttackInfo(dot_info );
  color_data = await getColorInfo();
  drawGraph(dot_info, attack_info, color_data );
  $('body').waitMe("hide");
}

async function getDotTotal(dot_id ){
  let config = {
    appName: "customer-portal",
    reportName: "Total_Reptile_Index_Score_Report",
    page: 1,
    pageSize: 1,
    criteria: "(DOT == " + dot_id + ")",
  };
  let response = await ZOHO.CREATOR.API.getAllRecords(config );
  return response.data[0];

}

async function getAttackIndex(companyID){
  let config = {
    appName: "customer-portal",
    reportName: "Attack_vector_multi_DOT_Score_Report",
    page: 1,
    pageSize: 10,
    criteria: '(Company == ' + companyID + ')',
  }

  let response = await ZOHO.CREATOR.API.getAllRecords(config);
  console.log(response);
  return response.data;

}

async function getCompanyId(config ){
  let response = await ZOHO.CREATOR.API.getAllRecords(config);
  let companyID = "";
  if (response.data.length > 0 ){ 
    companyID = response.data[0]["Company"]["ID"];
  }
  return companyID;
}

async function getAllDots(companyID ){
  const dotsConfig = {
    appName: APP_NAME,
    reportName: DOT_REPORT_NAME,
    page: 1,
    pageSize: 10,
    criteria: "(Company == " + companyID + ")",
  };

  let response = await ZOHO.CREATOR.API.getAllRecords(dotsConfig);
  let dotInfo = {};
  if (response.data.length > 0) {
    dotInfo = response.data;
  }
  return dotInfo;
}

/*async function getAttackVector(dots ){
  let attacks = [];
  for (var i = 0; i < dots.length; i++ ){
    if (i > 0 ) continue;
    var dot = dots[i];
    const config = {
      appName: APP_NAME,
      reportName: ATTACT_REPORT_NAME,
      page: 1,
      pageSize: 10,
      criteria: "(DOT == " + dot + ")",
    }
    let item = await getAttackItem(config ); 
    attacks = [... item ];
  }
  return attacks;
}*/

async function getAttackItem(dot_id ){
  const config = {
    appName: APP_NAME,
    reportName: ATTACT_REPORT_NAME,
    page: 1,
    pageSize: 10,
    criteria: "(DOT == " + dot_id + ")",
  }
  let response = await ZOHO.CREATOR.API.getAllRecords(config);
  var attackVectors = response.data;

  let attvArray = [];
  for (var i = 0; i < attackVectors.length; i++ ){
    var item = attackVectors[i];
    var attackVectorNew = _.pick(item, 'Attack_Vector', 'DOT', 'Total')
    attvArray.push(attackVectorNew);
  }

  return attvArray;
}

async function getColorInfo(){
  const config = {
    appName: APP_NAME,
    reportName: "All_Recommendation_Engines",
  }
  let response = await ZOHO.CREATOR.API.getAllRecords(config);
  return response;
}