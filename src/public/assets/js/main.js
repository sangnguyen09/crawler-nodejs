let itemsNotFormatted = [];

function getContent() {
    let valueInput = $('#link-news').val()
    $(".loading").css({"display":"block"})
    $.ajax({
        url: "/crawler",
        type: "post",
        data: {
            link: valueInput
        },
        success: function (data) {
            itemsNotFormatted = data
            $(".loading").css({"display":"none"})
            $('.download').css("display","flex")
        },
        error: function (err) {
            err.responseJSON.map(item => {
                $(".loading").css({"display":"none"})
                alertify.notify(item, 'error', 5)
            })
        }
    })
}

$(document).ready(function () {

    $('#get-info').bind('click', function () {
        getContent()

    })
    $('.download').bind('click', function () {
        download()
    })

})


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download() {
    var headers = {
        url: "URL",
        title: 'Title',
        author: "Author",
        date: "Date",
    };

    var itemsFormatted = [];

    // format the data
    itemsNotFormatted.forEach((item) => {
        itemsFormatted.push({
            url: item.url,
            title: item.title.replace(/,/g, ''), // remove commas to avoid errors,
            author: item.author,
            date: item.date.replace(/,/g, ''),
        });
    });

    var fileTitle = 'list-news'; // or 'my-unique-title'

    exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}