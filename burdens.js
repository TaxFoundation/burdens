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

  queue()
    .defer(d3.csv, DATA_PATH)
    .await(function(error, data) {
      if (error) { console.log(error); }

      burdens.initialize(data);
    });

  burdens = {
    initialize: function(data) {
      this.data = data;
      this.viewControl();

      d3.select('#state').on('change', function(e) {
        var state = d3.select(this).property('value');
        burdens.drawTable(burdens.filterByState(state));
      });

      d3.select('#years').on('change', function(e) {
        var year = d3.select(this).property('value');
        burdens.drawTable(burdens.filterByYear(year));
      });

      d3.selectAll('input[name=dollars]').on('change', function() {
        var view = d3.select('input[name=view-type]:checked').property('value');
        if (view === 'year') {
          var year = d3.select('#years').property('value');
          burdens.drawTable(burdens.filterByYear(year));
        } else {
          var state = d3.select('#state').property('value');
          burdens.drawTable(burdens.filterByState(state));
        }
      });

      d3.selectAll('input[name=view-type]').on('change', function() {
        burdens.viewControl();
      });
    },

    viewControl: function() {
      var view = d3.select('input[name="view-type"]:checked').property('value');

      if (view === 'year') {
        d3.select('#state').style({ display: 'none' });
        d3.select('#years').style({ display: 'block' });
        var year = d3.select('#years').property('value');
        burdens.drawTable(burdens.filterByYear(year));
      } else {
        d3.select('#years').style({ display: 'none' });
        d3.select('#state').style({ display: 'block' });
        var state = d3.select('#state').property('value');
        burdens.drawTable(burdens.filterByState(state));
      }
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

      return yearData;
    },

    adjustDollars: function(value, year) {
      if (d3.select('input[name="dollars"]:checked').property('value') === 'real') {
        return formatDollars(value * ADJUSTMENTS[year]);
      } else {
        return formatDollars(value);
      }
    },

    drawTable: function(data) {
      d3.select('#burdens').selectAll('tr').remove();

      var rows = d3.select('#burdens').selectAll('tr');
      var view = d3.select('input[name="view-type"]:checked').property('value');
      var firstColumn = '';

      rows.data(data).enter().append('tr').html(function(d) {
        var firstColumn = '';

        if (view === 'state') {
          firstColumn = '<td class="number">' + d.year + '</td>';
        } else {
          firstColumn = '<td>' + d.state + '</td>';
        }

        return firstColumn
        + '<td class="number">' + formatPercents(d.burdenRate) + '</td>'
        + '<td class="number">' + burdens.adjustDollars(d.incomePerCapita, +d.year) + '</td>'
        + '<td class="number">' + burdens.adjustDollars(d.taxPaidToOwnState, +d.year) + '</td>'
        + '<td class="number">' + burdens.adjustDollars(d.taxPaidToOtherState, +d.year) + '</td>'
        + '<td class="number">' + burdens.adjustDollars(+d.taxPaidToOwnState + +d.taxPaidToOtherState, +d.year) + '</td>';
      });
    },

  };

})();
