var data = [];
var id = 1;

d3.csv('burdens.csv', function(d) {
    return {
      id: +d.id,
      name: d.state,
      year: d.year,
      incomePerCapita: +d.incomePerCapita,
      taxPaidToOwnState: +d.taxPaidToOwnState,
      taxPaidToOtherState: +d.taxPaidToOtherState,
      taxPaidTotal: +d.taxPaidToOwnState + +d.taxPaidToOtherState,
      burdenRate: +d.burdenRate,
    };
  }, function(error, rows) {
    if (error) { console.log(error); }

    data = rows;
  });

function filterByState(row) {
  return row.id === id;
}
