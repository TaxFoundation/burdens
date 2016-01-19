(function() {
  'use strict';

  var burdens;
  var DATA_PATH = 'burdens.csv';
  var INITIAL_STATE = '1';
  var INITIAL_YEAR = '2012';

  $(function() {
    queue()
      .defer(d3.csv, DATA_PATH)
      .await(function(error, data) {
        if (error) { console.log(error); }

        burdens.initialize(data);
      });
  });

  burdens = {
    initialize: function(data) {
      this.data = data;
      this.drawTableState(this.filterByState(INITIAL_STATE));
    },

    filterByState: function(state) {
      var state = state || INITIAL_STATE;
      var stateData = burdens.data.filter(function(stateData) {
        return stateData.id == state;
      });

      return stateData;
    },

    filterByYear: function(year) {
      var year = year || INITIAL_YEAR;
      var yearData = burdens.data.filter(function(yearData) {
        return yearData.year == year;
      });
    },

    drawTableState: function(data) {
      d3.select('#burdens').selectAll('tr').remove();

      var states = d3.select('#burdens').selectAll('tr');

      states.data(data).enter().append('tr').html(function(d) {
        return '<td>' + d.year + '</td>'
        + '<td>' + d.burdenRate + '</td>'
        + '<td>' + d.incomePerCapita + '</td>'
        + '<td>' + d.taxPaidToOwnState + '</td>'
        + '<td>' + d.taxPaidToOtherState + '</td>'
        + '<td>' + (+d.taxPaidToOwnState + +d.taxPaidToOtherState) + '</td>';
      });
    },
  };

})();
