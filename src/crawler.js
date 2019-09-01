import cheerio from 'cheerio';
import request from 'request-promise';
import fs from 'fs';
import fastcsv from 'fast-csv'

let arrContent = []
const URL = 'https://www.thesaigontimes.vn'
//   Hàm lấy dữ liệu từ website


async function crawler(url) {
    let options = {
        uri: url,
        transform: function (body) {
            //  Sử dụng cheerio.load để lấy dữ liệu trả về
            return cheerio.load(body);
        }
    };
    //Gửi 1 request tới website
    let $ = await request(options)
     // lấy content tin chính
    getContent($);

  let list_news = $('#ctl00_cphContent_Article_LienQuan >table >tbody >tr >td div.Item1').toArray()
  
  for( let  item of list_news) {
         let url_news_related = URL + $(item).find('a').attr('href')
         options.uri = url_news_related
          let as = await  request(options)
            getContent(as);
          
  }
  console.log(arrContent)
  const ws = fs.createWriteStream("list-news.csv");
    fastcsv
    .write(arrContent, { headers: true, })
    .pipe(ws);
 
}

const getContent = ($) => {

        var title = $('#ARTICLE_DETAILS span.Title').text();
        var author = $('#ARTICLE_DETAILS span.ReferenceSourceTG').text();
        var date = $('#ARTICLE_DETAILS span.Date').text();
        arrContent = [...arrContent, {
            title,
            author,
            date
        }]
 
}

crawler('https://www.thesaigontimes.vn/293490/can-cu-nao-de-xu-phat-cac-ngan-hang-tang-lai-suat-huy-dong-cao.html')