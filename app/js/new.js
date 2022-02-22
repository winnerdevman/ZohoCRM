ZOHO.CREATOR.init().then(function (data) {
  var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();

  if (Object.keys(queryParams).length > 0) {
    var config = {
      appName: "customer-portal",
      reportName: "All_Users",
      page: 1,
      pageSize: 1,
      criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
    };

    ZOHO.CREATOR.API.getAllRecords(config)
      .then((response) => {
        var companyID = "";
        if (response.data.length > 0) {
          // console.log(response.data[0]["Company"]["ID"]);
          var company = response.data;
          companyID = response.data[0]["Company"]["ID"];

          return companyID;

          debugger;
          

          // console.log(attackVectorList);
          // var uniqueAttackVectorList = [...new Set(attackVectorList)];
          //     console.log(uniqueAttackVectorList);
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

              debugger;
              var dotId = _.pluck(allDots, "ID");

                allDots.map((dot) => {
                  $("#dotFilterList").append(
                    `<li><input type='checkbox' class='dot check' data-val='${dot.ID}'/>${dot.Name}</li>`
                  );

                   $('.left-legend').append(`<div class="data-row">
                   <div class="data-col ${dot.ID}">${dot.Name}</div>
                    </div>`)

                    $('.rti-data .av-legend-container').before(`<div class="data-row data-content ${dot.ID}"></div>`);
                    $(`.rti-data .${dot.ID}`).prepend(`<div class="data-col bg-gray dot-high-val"></div>`);
                })

              return dotId;
            }
          })
          .then((dotId) => {
            var attackVectorList = [];
            var attackVectorNames = [];
            var allAttackVectors = [];
            var allAttackVectorIds = [];
            var i = 0;
            function allAttackVector(){
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
                  console.log(attackVectors);

                  var attId = _.pluck(attackVectors, "Attack_Vector");
                  var attackVectorId = _.pluck(attId, "ID");
                  var attackName = _.pluck(attId, "display_value");  

                  attackVectors.forEach((item)=>{
                    var attID = item.Attack_Vector.ID;
                    var attackDotId = item.DOT.ID;
                    var total = item.Total;
                    
                    // _.isMatch(attId, {'ID': attackVectorId})
                    
                    debugger
                    $(`.rti-data .${attackDotId}`).append(`<div class="data-col ${attID}"><span class="circle has-val" data-index-val=${total}></span></div>`)
                    debugger
                  })

                  attackVectorList = attackVectorList.concat(attackVectorId);
                  attackVectorNames = attackVectorNames.concat(attackName);
                  allAttackVectors = _.uniq(attackVectorNames);
                  allAttackVectorIds = _.uniq(attackVectorList);
                  attackVectorObj = _.object(allAttackVectorIds, allAttackVectors)
                  debugger

                  
                  if(i<dotId.length-1){
                    i++;
                    allAttackVector();
                    }
                    else{

                        _.mapObject(attackVectorObj, function(val, key) {
                            $('.av-legend-container').append(`<div data-attack=${key} class="data-col ${key}"><span class="av-legend">${val}</span></div>`);

                            $('#attackFilterList').append(`<li><input type="checkbox" class="avsort check" data-val=${key}/>${val}</li>`);
                          });
                    }
                }
              )
            }
            allAttackVector();            
          })
      });
  }
});
