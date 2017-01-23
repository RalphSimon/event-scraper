var Xray = require('x-ray');
var x = Xray({
  filters: {
    trim: function(value) {
      return typeof value === 'string' ? value.trim() : value;
    },
    match: function(value) {
      if (value) {
        return typeof value === 'string' ? value.match(/\w+/g).join(' ') : value;
      }
    },
    splitStart: function(value) {
      let newString = value.split(', ');

      if (newString[0]) {
        return typeof newString[0] === 'string' ? newString[0].trim() : newString[0];
      }
    },
    splitEnd: function(value) {
      let newString = value.split(', ');

      if (newString[1]) {
        return typeof newString[1] === 'string' ? newString[1].trim() : newString[1];
      }
    },
    splitAtBreak: function(value) {
      let newString = value.split('\n');
      let lastString = newString[newString.length - 1];

      if (lastString) {
        return typeof lastString === 'string' ? lastString.trim() : lastString;
      }
    },
    returnStrings: function (value) {
      let strings = value.split('\n');
      return strings;
    }
  }
});

function sanitize(data) {
  for (let i = 0; i < data.length; i++) {
    let date = data[i].date.trim();
    let title = data[i].title.trim();
    if (data[i].venue) {
      let venue = data[i].venue.match(/\w+/g).join(' ');
      console.log(venue);
    }

    data[i].date = date;
    data[i].title = title;
    data[i].venue = venue;
  }

  // console.log(data);
  return data;
}

/* SIMPLE VERSION: @date, @title, @venue */
// x('https://www.uitinvlaanderen.be/agenda/theatervoorstelling/antwerpen',
//   '.cf-search-summary',
//   [{
//     date: '.search-result-calendarsummary | trim',
//     title: '.search-result-title | trim',
//     venue: '.search-result-detail | match'
//   }])
//     .paginate('.pagination .next a@href')
//     .write('theatervoorstellingen.json');

/* EXTENDED VERSION:
    @date,
    @time,
    @title
    @venue,
    @address,
    @price
    @description
*/
x('https://www.uitinvlaanderen.be/agenda/theatervoorstelling/antwerpen',
  '.cf-search-summary',
  [{
    date: '.search-result-calendarsummary | trim',
    title: '.search-result-title | trim',
    venue: '.search-result-detail | splitEnd',
    details: x('.cf-search-summary .row a@href', {
      time: '.cf-time',
      price: '#block-system-main > div > div.col-sm-8 > table > tbody > tr:nth-child(3) > td:nth-child(2)@text | splitAtBreak',
      shortDescription: '.short-description | trim',
      longDescription: '.long-description | trim'
    })
  }])
    .paginate('.pagination .next a@href')
    .write('theatervoorstellingen.json');

/* @address */
// #block-system-main > div > div.col-sm-8 > table > tbody > tr:nth-child(2) > td:nth-child(2)@text

/* @price */
// #block-system-main > div > div.col-sm-8 > table > tbody > tr:nth-child(4) > td:nth-child(2)
