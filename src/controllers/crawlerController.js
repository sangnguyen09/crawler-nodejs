import {
    validationResult
} from "express-validator";
import cheerio from 'cheerio';
import request from 'request-promise';

export const crawlerController = async (req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.map(item => {
            errorArr = [...errorArr, item.msg]; // dung push vao mang
        });
        //Logging
        return res.status(500).send(errorArr);
    }

    try {
       let listnew = await crawler(req.body.link)
        res.status(200).send(listnew);
    } catch (error) {
        console.log(error)
    }
}

const crawler = async (url) => {
    let arrContent = []
    const URL = 'https://www.thesaigontimes.vn'
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
    arrContent = getContent($,arrContent, url);
    let list_news = $('#ctl00_cphContent_Article_LienQuan >table >tbody >tr >td div.Item1').toArray()
    if (!list_news.length) {
        return arrContent
    }
    for (let item of list_news) {
        let url_news_related = URL + $(item).find('a').attr('href')
        options.uri = url_news_related
        let as = await request(options)
        arrContent = getContent(as,arrContent,url_news_related);

    }
   
    return arrContent

}

const getContent = ($,arrContent, url) => {

    var title = $('#ARTICLE_DETAILS span.Title').text();
    var author = $('#ARTICLE_DETAILS span.ReferenceSourceTG').text();
    var date = $('#ARTICLE_DETAILS span.Date').text();
    arrContent = [...arrContent, {
        title,
        author,
        date,
        url
    }]
    return arrContent
}