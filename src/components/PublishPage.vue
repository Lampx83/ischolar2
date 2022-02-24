<template>
  <TheHeader/>

  <div class="row m-0">
    <div class="col-md-12 pt-5 pb-5">
      <table id="example">
        <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Office</th>
          <th>Extn.</th>
          <th>Start date</th>
          <th>Salary</th>
        </tr>
        </thead>
      </table>
    </div>
  </div>
  <TheFooter/>


</template>

<script>
import $ from "jquery";
import TheHeader from './shared/TheHeader'
import TheFooter from './shared/TheFooter'

window.$ = window.jQuery = require('jquery');
import "datatables.net-dt/css/jquery.dataTables.css";
import DataTable from "datatables.net-dt";

export default {
  name: "PublishPage",
  components: {
    TheHeader,
    TheFooter
  }
  ,
  mounted() {
    $('#example tfoot th').each(function () {
      var title = $(this).text();
      $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    const dt = new DataTable('#example', {
      "processing": true,
      "serverSide": true,
      "ajax": {
        url: "https://vncodelab.com/api/v1/test?c=" + params.c,
        //  url: "https://localhost/api/v1/test?c=" + params.c,
        type: "POST",
        contentType: "application/json",
        data: function (d) {
          return JSON.stringify(d)
        }
      },
      initComplete: function () {
        // Apply the search
        this.api().columns().every(function () {
          var that = this;
          $('input', this.footer()).on('keyup change', function (e) {
            if (that.search() !== this.value) that.search(this.value);
            // if serverside draw() only on enter
            if (e.keyCode == 13) that.draw();
          });
        });
      }
      //"ajax": "https://vncodelab.com/api/v1/test"
    });
    // Array to track the ids of the details displayed rows
    var detailRows = [];

    $('#example tbody').on('click', 'tr td', function () {
      var tr = $(this).closest('tr');
      var row = dt.row(tr);
      var idx = $.inArray(tr.attr('id'), detailRows);

      if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();

        // Remove from the 'open' array
        detailRows.splice(idx, 1);
      } else {
        tr.addClass('details');
        row.child(format(row.data())).show();

        // Add to the 'open' array
        if (idx === -1) {
          detailRows.push(tr.attr('id'));
        }
      }
    });

    // On each draw, loop over the `detailRows` array and show any child rows
    dt.on('draw', function () {
      $.each(detailRows, function (i, id) {
        $('#' + id + ' td').trigger('click');
      });
    });
  }
}

function format(d) {
  let t = ["Quartile", "Title", "Scopus Sub-Subject Area", "Publisher", "CiteScore 2020", "E-ISSN", "Open Access", "Percent Cited", "Percentile", "RANK", "SJR", "SNIP", "Scholarly Output", "Scopus ASJC Code (Sub-subject Area)", "Scopus Source ID", "Top 10% (CiteScore Percentile)", "URL Scopus Source ID", "Homepage", "Contact", "How_to_publish"]
  let s = "";

  for (let i = 4; i < d.length; i++) {
    if (d[i])
      s = s + t[i] + ': ' + d[i] + ' <br>'
  }

  return s

}
</script>

<style scoped>

</style>