const furdb = {
    "1": {
        "name": "Tawolf",
        "owner": "Latko",
        "photo": "20200726_0007_brushed.jpg",
        "photocopyright": "2020 VulpeOwO",
        "species": "Wolf",
        "maker": "Bluefox",
        "style": "Kemo"
    },
    "2": {
        "name": "Sanbeom",
        "owner": "Hameong",
        "photo": "20200726_0027.jpg",
        "photocopyright": "2020 VulpeOwO",
        "species": "Cougar",
        "maker": "DIY",
        "style": "Real"
    },
    "3": {
        "name": "Endo",
        "owner": "Anamorphic",
        "photo": "20200726_0148_brushed.jpg",
        "photocopyright": "2020 VulpeOwO",
        "species": "Cat",
        "maker": "AseoL",
        "style": "Kemo"
    },
    "4": {
        "name": "Wooreh",
        "owner": "Nuhbi",
        "photo": "20200726_0229.jpg",
        "photocopyright": "2020 VulpeOwO",
        "species": "Cat",
        "maker": "Bluefox",
        "style": "Kemo"
    },
    "5": {
        "name": "Vulpe",
        "owner": "CuriousTorvald",
        "photo": "20191211_0041.jpg",
        "photocopyright": "2019 VulpeOwO",
        "species": "Fox",
        "maker": "DIY",
        "style": "Semi"
    }
}

const i18n = {
    "ko": {
        "TagSyntaxError": "태그가 올바르지 않게 입력되었습니다."
    },
    "en": {
        "TagSyntaxError": "Entered tags are malformed."
    }
}

const lang = "ko";

function query() {
    let query = document.getElementById("searchtags").value;
    let searchFilter = parseSearchTags(query);

    let searchResults = performSearch(searchFilter);


    //document.getElementById("searchResults").innerText = "Hello, world " + searchFilter.species + " " + searchFilter.maker;
    let output = "";
    
    searchResults.forEach(it => {
        output += "<div class=\"furBox\">" +
        "<div class=\"imgBox\"><img class=\"furimg\" src=\"" + it.photo + "\"></div>" +
        "<h4>" + it.name + "</h4>" +
        "<h5>" + it.owner + "</h5>" +
        "</div>";
    });
    
    document.getElementById("searchResults").innerHTML = output;
}

/*
Composes searchFilter by obtaining key-value pair from Danbooru tagging syntax
단부루식 태그 문법에서 key와 value를 분리해 searchFilter를 만듦
 */
function parseSearchTags(searchstr) {
    let tokens = searchstr.split(' ');
    let searchFilter = new Object();
    // populate searchfilter object
    tokens.forEach(v => {
        // example tag: "maker:DIY"
        // split key-value
        let kvpair = v.split(':');
        searchFilter[kvpair[0]] = kvpair[1];
    });

    return searchFilter;
}

/*
Actually perform searching from in-line JSON object
소스에 박아넣은 JSON 오브젝트에서 검색을 수행함

May modify this code to perform searching from database or external JSON
이 소스를 수정해 데이터베이스에 쿼리를 날리든가, 외부 JSON을 가져와 검색하는 식으로 동작을 변경할 수 있음
 */
function performSearch(searchFilter) {
    let foundFurs = [];
    // example filter = {
    //     "maker": "bluefox",
    //     "species": "wolf"
    // }
    for (const furid in furdb) {
        let searchMatches = true;
                
        for (const searchCriterion in searchFilter) {

            try {
                searchMatches &= furdb[furid][searchCriterion].toLowerCase().includes(searchFilter[searchCriterion].toLowerCase());
                // 대소문자를 구분하지 않게 하기 위해 toLowerCase를 사용 
                // searchMatches에 and하기 때문에 모든 조건을 만족해야만 searchMatches가 최종적으로 true가 됨
                // 여기서는 includes를 사용해서 부분적 매칭이 되게 함
            }
            catch (e) {}
        }

        if (searchMatches) {
            foundFurs.push(furdb[furid]);
        }
    }

    return foundFurs;
}
