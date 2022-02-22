
ZOHO.CREATOR.init().then(function (data) {
  var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
  console.log("query params", queryParams );
  
  var attvArray = [];
  var sortedArray = [];
  if (Object.keys(queryParams).length > 0) {
    var config = {
      appName: "customer-portal",
      reportName: "All_Users",
      page: 1,
      pageSize: 1,
      criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
    };

    getCompanyId(config );
    /*ZOHO.CREATOR.API.getAllRecords(config)
      .then((response) => {
        
        var companyID = "";
        if (response.data.length > 0) {
          // console.log(response.data[0]["Company"]["ID"]);
          var company = response.data;
          companyID = response.data[0]["Company"]["ID"];
          return companyID;
        }
      })
      .then((companyID) => {
        //fetch all dots under the company
        const dotsConfig = {
          appName: "customer-portal",
          reportName: "DOTs",
          page: 1,
          pageSize: 10,
          criteria: "(Company == " + companyID + ")",
        };
        ZOHO.CREATOR.API.getAllRecords(dotsConfig)
          .then((response) => {
            if (response.data.length > 0) {
              const allDots = response.data;
              var dotId = _.pluck(allDots, "ID");
              console.log(allDots);
              return dotId;
            }
          })
          .then((dotId) => {    
            var i = 0;

            function allAttackVector() {
              const attackVectorConfig = {
                appName: "customer-portal",
                reportName: "Reptile_Attack_Vector_Result_Report",
                page: 1,
                pageSize: 10,
                criteria: "(DOT == " + dotId[i] + ")",
              };

              ZOHO.CREATOR.API.getAllRecords(attackVectorConfig).then(
                (response) => {
                  var attackVectors = response.data;

                  attackVectors.forEach((item) => {
                    var attackVectorNew = _.pick(item, 'Attack_Vector', 'DOT', 'Total')
                    attvArray.push(attackVectorNew);
                  });
                  sortedArray = _.sortBy(attvArray,'Total').reverse();
                  console.log(sortedArray);
                  if (i < dotId.length - 1) {
                    i++;
                    allAttackVector();
                  }                                  
                }
              )
            }            
            allAttackVector();
          })
          
      }).then(function(){
        sortedArray = _.sortBy(attvArray,'Total');
      })*/
  }
});

async function getCompanyId(config ){
  let response = await ZOHO.CREATOR.API.getAllRecords(config);
  console.log("get company id", response );
}
