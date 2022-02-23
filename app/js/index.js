const APP_NAME = "customer-portal";
const USER_REPORT_NAME = "All_Users";
const DOT_REPORT_NAME = "DOTs";
const ATTACT_REPORT_NAME = "Reptile_Attack_Vector_Result_Report";

const attackTests = [
  {
    Attack_Vector: {
      display_value: 'HOS',
      ID: "4184941000000259001"
    },
    DOT: {
      display_value: 'DOT 2',
      ID: "4184941000000282115"
    },
    Total: "48.2"
  },
  {
    Attack_Vector: {
      display_value: 'CSA',
      ID: "4184941000000259002"
    },
    DOT: {
      display_value: 'DOT 2',
      ID: "4184941000000282115"
    },
    Total: "42.8"
  },
  {
    Attack_Vector: {
      display_value: 'Dq Files',
      ID: "4184941000000259003"
    },
    DOT: {
      display_value: 'DOT 3',
      ID: "4184941000000282116"
    },
    Total: "53.0"
  },
  {
    Attack_Vector: {
      display_value: 'Safety',
      ID: "4184941000000259004"
    },
    DOT: {
      display_value: 'DOT 3',
      ID: "4184941000000282116"
    },
    Total: "71.54"
  },
  {
    Attack_Vector: {
      display_value: 'Driver Onboarding',
      ID: "4184941000000259005"
    },
    DOT: {
      display_value: 'DOT 3',
      ID: "4184941000000282116"
    },
    Total: "66.2"
  },
  {
    Attack_Vector: {
      display_value: 'Dq Files',
      ID: "4184941000000259002"
    },
    DOT: {
      display_value: 'DOT 4',
      ID: "4184941000000282117"
    },
    Total: "57.98"
  },
  {
    Attack_Vector: {
      display_value: 'Safety',
      ID: "4184941000000259004"
    },
    DOT: {
      display_value: 'DOT 4',
      ID: "4184941000000282117"
    },
    Total: "49.76"
  },
  {
    Attack_Vector: {
      display_value: 'Safety',
      ID: "4184941000000259004"
    },
    DOT: {
      display_value: 'DOT 4',
      ID: "4184941000000282117"
    },
    Total: "83.6"
  },
]

ZOHO.CREATOR.init().then(function(data){
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
    return;
  }

  const dots = await getAllDots(company_id);
  const attacks = await getAttackVector(dots ); 
  console.log(attacks);
  return attacks;
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
  let dotId = [];
  if (response.data.length > 0) {
    const allDots = response.data;
    dotId = _.pluck(allDots, "ID");
  }
  return dotId;
}

async function getAttackVector(dots ){
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
}

async function getAttackItem(config ){
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
