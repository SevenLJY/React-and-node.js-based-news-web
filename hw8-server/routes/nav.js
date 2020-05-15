var express = require ("express");
var router = express.Router ();
var fetch = require ('node-fetch');

const GKEY = 'e30df047-0233-49a8-8e4e-51f891722bf9';
const NKEY = 'qjUBG173VSCnPH2s8Y1ThmVokXJFAfBv';

router.get ('/category', function (req, res) {
    var params = req.query;
    var section = params.key;
    var source = params.source;
    var url = '';
    if (source === 'N') { // NY Times
        if (section === 'home')
            url = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + NKEY;
        else
            url = 'https://api.nytimes.com/svc/topstories/v2/' + section + '.json?api-key=' + NKEY;

        fetch (url)
            .then (response => response.text ())
            .then (function (data) {
                let filteredData = filterNYData (JSON.parse (data));
                res.send (JSON.stringify (filteredData));
            })
            .catch ('NY Times: failed to send requests')
    } else { // Guardian
        if (section === 'home') {
            url = 'https://content.guardianapis.com/search?api-key=' + GKEY + '&section=(sport|business|technology|politics)&show-blocks=all';
        } else {
            if (section === 'sports') {
                section = 'sport';
            }
            url = 'https://content.guardianapis.com/' + section + '?api-key=' + GKEY + '&show-blocks=all';
        }
        fetch (url)
            .then (response => response.text ())
            .then (function (data) {
                let filteredData = filterGuardianData (JSON.parse (data));
                res.send (JSON.stringify (filteredData));
            })
            .catch ('Guardian: failed to send requests')
    }

});

router.get ('/search', function (req, res) {
    const params = req.query;
    const source = params.source;
    const keyword = params.keyword;
    if (source === 'G') {
        const url = 'https://content.guardianapis.com/search?q=' + keyword + '&api-key=' + GKEY + '&show-blocks=all';
        fetch (url)
            .then (res => res.json ())
            .then (data => res.send (filterGuardianData (data)))
            .catch ((e) => console.log (e));
    } else {
        const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + keyword + '&api-key=' + NKEY;
        fetch (url)
            .then (res => res.json ())
            .then (data => res.send (filterNYDataSearch (data)))
            .catch ((e) => console.log (e));
    }
});

function filterNYData (data) {
    let results = data.results;
    let len = data.num_results;
    let filteredData = {'data': []};
    let dataList = [];
    for (let i = 0; i < len; ++i) {
        if (checkNYCompleted (results[i])) {
            let article = {};
            article['source'] = 'N';
            article['title'] = results[i].title;
            article['section'] = getSection (results[i].section);
            article['image'] = getNYImg (results[i].multimedia);
            let date = new Date (results[i].published_date);
            article['date'] = formatDate (date);
            article['description'] = results[i].abstract;
            article['id'] = results[i].url;
            article['share'] = results[i].url;
            dataList.push (article);
        }
        if (dataList.length === 10)
            break;
    }
    filteredData['data'] = dataList;
    return filteredData;
}

function filterNYDataSearch (data) {
    let docs = data.response.docs;
    let len = docs.length;
    let filteredData = {'data': []};
    let dataList = [];
    for (let i = 0; i < len; ++i) {
        if (checkNYSearchCompleted (docs[i])) {

            let article = {};
            article['source'] = 'N';
            article['title'] = docs[i].headline.main;
            article['section'] = getSection (docs[i].news_desk);
            article['image'] = getNYImgSearch (docs[i].multimedia);
            let date = new Date (docs[i].pub_date);
            article['date'] = formatDate (date);
            article['id'] = docs[i].web_url;
            console.log(docs[i].web_url);
            article['share'] = docs[i].web_url;
            dataList.push (article);
        }
        if (dataList.length === 10)
            break;

    }
    filteredData['data'] = dataList;
    return filteredData;
}

function getNYImgSearch (imgList) {
    if (Array.isArray (imgList)) {
        let length = imgList.length;
        for (let i = 0; i < length; ++i) {
            if (imgList[i].width >= 2000) {
                return "https://static01.nyt.com/" + imgList[i].url;
            }
        }
    }

    return 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
}

function getNYImg (imgList) {
    if (Array.isArray (imgList)) {
        let length = imgList.length;
        for (let i = 0; i < length; ++i) {
            if (imgList[i].width >= 2000) {
                return imgList[i].url;
            }
        }
    }

    return 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
}

function checkNYSearchCompleted (data) {
    return data.headline.main && data.news_desk && data.pub_date && data.web_url;
}

function checkNYCompleted (data) {
    return data.title && data.section && data.published_date && data.abstract && data.url;
}

function formatDate (date) {
    let result = [];
    result.push (date.getFullYear ());
    let month = date.getMonth () + 1;
    if (month < 10) {
        month = '0' + month;
    }
    result.push (month);
    let day = date.getDate ();
    if (day < 10) {
        day = '0' + day;
    }
    result.push (day);
    return result.join ('-');
}

function filterGuardianData (data) {
    let results = data.response.results;
    let len = results.length;
    let filteredData = {'data': []};
    let dataList = [];
    for (let i = 0; i < len; ++i) {
        if (checkGCompleted (results[i])) {
            let article = {};
            article['source'] = 'G';
            article['title'] = results[i].webTitle;
            article['section'] = getSection (results[i].sectionId);
            article['image'] = getGuardianImg (results[i].blocks);
            let date = new Date (results[i].webPublicationDate);
            article['date'] = formatDate (date);
            article['description'] = results[i].blocks.body[0].bodyTextSummary;
            article['id'] = results[i].id;
            article['share'] = results[i].webUrl;
            dataList.push (article);
        }
        if (dataList.length === 10)
            break;
    }
    filteredData['data'] = dataList;
    return filteredData;
}

function checkGCompleted (data) {
    return data.webTitle && data.sectionId && data.webPublicationDate && data.blocks.body[0].bodyTextSummary && data.id;
}

function getGuardianImg (blocks) {
    if (blocks.main !== undefined) {
        let elements = blocks.main.elements;
        if (elements[0].type === 'image') {
            let imgList = elements[0].assets;
            let len = imgList.length;
            if (len > 0) {
                return imgList[len - 1].file;
            }
        }
    }


    return 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
}

function getSection (section) {
    let target = section.toLowerCase ();
    switch (target) {
        case 'world':
            return 'WORLD';
        case 'sport':
            return 'SPORTS';
        case 'sports':
            return 'SPORTS';
        case 'politics':
            return 'POLITICS';
        case 'business':
            return 'BUSINESS';
        case 'technology':
            return 'TECHNOLOGY';
        default:
            return 'HEALTH';

    }
}

module.exports = router;