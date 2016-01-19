(function() {
  'use strict';

  var burdens;
  var DATA_PATH = 'burdens.csv';
  var INITIAL_STATE = '1';
  var INITIAL_YEAR = '2012';
  var formatPercents = d3.format(',.1%');
  var formatDollars = d3.format("$,.2f");

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

      $('#state').change(function(e) {
        var state = $(this).val();
        console.log(state);
        burdens.drawTableState(burdens.filterByState(state));
      });
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
        return '<td class="number">' + d.year + '</td>'
        + '<td class="number">' + formatPercents(d.burdenRate) + '</td>'
        + '<td class="number">' + formatDollars(d.incomePerCapita) + '</td>'
        + '<td class="number">' + formatDollars(d.taxPaidToOwnState) + '</td>'
        + '<td class="number">' + formatDollars(d.taxPaidToOtherState) + '</td>'
        + '<td class="number">' + formatDollars(+d.taxPaidToOwnState + +d.taxPaidToOtherState) + '</td>';
      });
    },
  };

})();
