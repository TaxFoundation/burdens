(function() {
  'use strict';

  var burdens;
  var DATA_PATH = 'burdens.csv';
  var INITIAL_STATE = '1';
  var INITIAL_YEAR = '2012';
  var formatPercents = d3.format(',.1%');
  var formatDollars = d3.format('$,.2f');
  var ADJUSTMENTS = {
    1977: 3.789316804,
    1978: 3.519759468,
    1979: 3.163574057,
    1980: 2.786713938,
    1981: 2.524820117,
    1982: 2.378972674,
    1983: 2.304829088,
    1984: 2.210739312,
    1985: 2.134577902,
    1986: 2.094278319,
    1987: 2.020449471,
    1988: 1.941182614,
    1989: 1.852305413,
    1990: 1.757181911,
    1991: 1.685688725,
    1992: 1.636357364,
    1993: 1.589463832,
    1994: 1.549011261,
    1995: 1.506595838,
    1996: 1.463632688,
    1997: 1.430451331,
    1998: 1.408480442,
    1999: 1.378278557,
    2000: 1.333386972,
    2001: 1.296683635,
    2002: 1.276468077,
    2003: 1.247978588,
    2004: 1.215554966,
    2005: 1.175659829,
    2006: 1.138865706,
    2007: 1.107316626,
    2008: 1.066377136,
    2009: 1.070181963,
    2010: 1.052913512,
    2011: 1.020692531,
    2012: 1,
  };

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
        burdens.drawTableState(burdens.filterByState(state));
      });

      $('input[name=dollars]').change(function() {
        var state = $('#state').val();
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

    adjustDollars: function(value, year) {
      if ($('input[name="dollars"]:checked').val() === 'real') {
        return value * ADJUSTMENTS[year];
      } else {
        return value;
      }
    },

    drawTableState: function(data) {
      d3.select('#burdens').selectAll('tr').remove();

      var states = d3.select('#burdens').selectAll('tr');

      states.data(data).enter().append('tr').html(function(d) {
        return '<td class="number">' + d.year + '</td>'
        + '<td class="number">' + formatPercents(d.burdenRate) + '</td>'
        + '<td class="number">' + formatDollars(burdens.adjustDollars(d.incomePerCapita, +d.year)) + '</td>'
        + '<td class="number">' + formatDollars(burdens.adjustDollars(d.taxPaidToOwnState, +d.year)) + '</td>'
        + '<td class="number">' + formatDollars(burdens.adjustDollars(d.taxPaidToOtherState, +d.year)) + '</td>'
        + '<td class="number">' + formatDollars(burdens.adjustDollars(+d.taxPaidToOwnState + +d.taxPaidToOtherState, +d.year)) + '</td>';
      });
    },
  };

})();
