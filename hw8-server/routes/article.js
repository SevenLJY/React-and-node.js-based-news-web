var express = require ("express");
var router = express.Router ();
var fetch = require ('node-fetch');

const GKEY = 'e30df047-0233-49a8-8e4e-51f891722bf9';
const NKEY = 'qjUBG173VSCnPH2s8Y1ThmVokXJFAfBv';

router.get ('/', function (req, res) {
    var params = req.query;
    var id = params.id;
    var source = params.source;
    if (source === 'G') {
        const url = 'https://content.guardianapis.com/' + id + '?api-key=' + GKEY + '&show-blocks=all';
        fetch (url)
            .then (res => res.text ())
            .then (function (response) {
                res.send (JSON.stringify (filterG (JSON.parse (response), id)));
            })
    } else {
        const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + id + '")&api-key=' + NKEY;
        fetch (url)
            .then (res => res.text ())
            .then (function (response) {
                res.send (JSON.stringify (filterNY (JSON.parse (response), id)));
            });
    }
});


function filterG (data, id) {
    let content = data.response.content;
    let article = {};
    article['title'] = content.webTitle;
    article['image'] = getImgG (content.blocks.main.elements[0].assets);
    article['date'] = formatDate (content.webPublicationDate);
    article['description'] = content.blocks.body[0].bodyTextSummary;
    article['share'] = content.webUrl;
    article['source'] = 'G';
    article['section'] = getSection(content.sectionId);
    article['id'] = id;
    return article;
}

function filterNY (data, id) {
    let docs = data.response.docs[0];
    let article = {};
    article['title'] = docs.headline.main;
    article['image'] = getImgNY (docs.multimedia);
    article['date'] = formatDate (docs.pub_date);
    article['description'] = docs.abstract;
    article['share'] = docs.web_url;
    article['source'] = 'N';
    article['section'] = getSection(docs.section_name);
    article['id'] = id;
    return article;
}

function getImgG (list) {
    let len = list.length;
    if (len > 0) {
        return list[len - 1].file;
    }
    return 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
}

function getImgNY (list) {
    if (Array.isArray (list)) {
        let length = list.length;
        for (let i = 0; i < length; ++i) {
            if (list[i].width >= 2000) {
                return 'https://static01.nyt.com/' + list[i].url;
            }
        }
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
}

function formatDate (dateStr) {
    let date = new Date (dateStr);
    let list = [];
    let day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if(month < 10){
        month = '0' + month;
    }
    list.push (date.getFullYear ());
    list.push (day);
    list.push (month);
    return list.join ('-');
}


function getSection(section){
    if(section === 'sport')
        return 'SPORTS';
    return section.toUpperCase();
}

module.exports = router;