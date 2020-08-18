// 외부 JSON 가져오기
// Localhost에서 작동시킬 시 보안 문제로 로딩 안될 수 있음. 보안 설정을 잠깐 끄거나 서버에 올려서 돌리시오.
function loadJSON(jsonPath, isAsync, callback) {   
    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonPath, isAsync);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}

var furdb = {};

// 이 오브젝트의 키값은 무조건 소문자로만 받고 공백이 있어서는 안 됨
// key of this object must be lowercase and contains no space char
const creatorThesaurus = {
    "bluefox":"블루폭스",
    "atoama":"아토아마",
    "amanojaku":"아토아마",
    "atelieramanojaku":"아토아마",
    "아마노자쿠":"아토아마",
    "k-line":"케이라인",
    "kline":"케이라인",
    "binari":"키루",
    "비나리":"키루",
    "kiru":"키루",
    "likeapalette":"Yohen",
    "팔레트":"Yohen",
    "라이크어팔레트":"Yohen",
    "요헨":"Yohen",
    "y0hen":"Yohen",
    "lycan":"라이칸",
    "sin":"퍼플뱃",
    "신":"퍼플뱃",
    "젤리독":"바토",
    "플러피젤리독":"바토",
    "fluffyjellydog":"바토",
    "jellydog":"바토",
    "블랙문":"내장",
    "blackmoon":"내장",
    "blackon":"내장",
    "미니미":"Ohiya",
    "minimi":"Ohiya",
    "소지":"Sozi",
    
    "diy":"자작",
    "selfmade":"자작"
}

const tagDocumentation = {
    "creator_name":{"ko":"퍼슈트의 제작자를 나타냅니다. 자작 퍼슈트의 경우 '자작'을 사용하십시오","en":"Creator of the fursuit. Use '자작' for DIY suits"},
    "name_ko":{"ko":"퍼슈트 캐릭터의 이름 (한국어)","en":"Name of the character in Korean"},
    "name_en":{"ko":"퍼슈트 캐릭터의 이름 (영어)","en":"Name of the character in English"},
    "actor_name":{"ko":"퍼슈트 오너의 이름 (한국어)","en":"Name of the actor in Korean"},
    "species_ko":{"ko":"퍼슈트 캐릭터의 종 (한국어)","en":"Species of the character in Korean"},
    "style":{"ko":"퍼슈트 캐릭터의 스타일 (Real, Real Toon, Kemo, Kemo Toon, Semi)","en":"Style of the character (Real, Real Toon, Kemo, Kemo Toon, Semi)"},
    "is_partial":{"ko":"캐릭터가 파셜인지 여부 (TRUE, FALSE)","en":"If the suit is partial-suit (TRUE, FALSE)"},
    "country":{"ko":"오너의 국적 (ISO 3166-1 Alpha-3 코드)","en":"Nationality of the actor in ISO 3166-1 Alpha-3 Code"},
    "birthday_from":{"ko":"생일 검색에서 가장 이른 날짜. 해당 날짜를 포함함 (yyyymmdd)","en":"Earliest day in birthday search, inclusive (yyyymmdd)"},
    "birthday_to":{"ko":"생일 검색에서 가장 늦은 날짜. 해당 날짜를 포함함 (yyyymmdd)","en":"Latest day in birthday search, inclusive (yyyymmdd)"}
}

const specialSearchTags = [
    "birthday_from", "birthday_to"
]

const i18n = {
    "ko": {
        "TagSyntaxError": "태그가 올바르지 않게 입력되었습니다: ",
        "TagOptions": "태그 옵션:",
        "SearchTags": "검색어",
        "IsExactMatch": "검색어 정확히 매칭",
        "Submit": "검색",
        "WillShowAllOnEmptySearch": "입력 칸을 비우고 검색하면 모든 퍼슈트를 보여줍니다",
        "AdvancedSearch": "고급 검색",
        "SimpleSearch": "쉬운 검색",
        "SimpleSearchCreator": "제작자: ",
        "SimpleSearchNameKo": "이름 (한국어): ",
        "SimpleSearchNameEn": "이름 (영어): ",
        "SimpleSearchBirthday": "생일 (yyyymmdd): ",
        "SimpleSearchSpecies": "종: ",
        "SimpleSearchIsPartial": "파셜 여부: "
    },
    "en": {
        "TagSyntaxError": "Entered tag is malformed: ",
        "TagOptions": "Tag Options:",
        "SearchTags": "Search Tags",
        "IsExactMatch": "Exact Match?",
        "Submit": "Submit",
        "WillShowAllOnEmptySearch": "Blank search tag will show all the fursuits",
        "AdvancedSearch": "Advanced Search",
        "SimpleSearch": "Easy Search",
        "SimpleSearchCreator": "Creator: ",
        "SimpleSearchNameKo": "Name (Korean): ",
        "SimpleSearchNameEn": "Name (English): ",
        "SimpleSearchBirthday": "Birthday (yyyymmdd): ",
        "SimpleSearchSpecies": "Species: ",
        "SimpleSearchIsPartial": "Partial? "
    }
}

var lang = "ko";

const dropdownIdToDBname = {
    "literal_dog":["개"],
    "literal_wolf":["늑대"],
    "literal_cat":["고양이"],
    "group_felidae":["고양이과","고양잇과","사자","호랑이","표범","카라칼","퓨마","쿠거","마운틴라이언"],
    "literal_fox":["여우"],
    "literal_rabbit":["토끼"],
    "group_aves":["새","조류","앵무","수리","올빼미","부엉이"],
    "group_pisces":["어류","물고기","잉어"],
    "literal_dragon":["드래곤"],
    "literal_deer":["사슴","노루"],
    "group_raccoons":["레서판다","라쿤","너구리"]
}

function pageinit() {
    // DB 로드
    loadJSON("db.json", true, response => {
        furdb = JSON.parse(response);
    });
    // 선택된 언어로 문서 출력
    reloadI18n();
}

function reloadI18n() {    
    let tagdocOutput = "";
    
    tagdocOutput += "<p>"+i18n[lang].TagOptions+"</p><ul>";
    Object.keys(tagDocumentation).forEach(it => {
        tagdocOutput += "<li>"+it+" &ndash; "+tagDocumentation[it][lang]+"</li>"
    });
    tagdocOutput += "</ul><p>"+i18n[lang].WillShowAllOnEmptySearch+"</p>";
    
    document.getElementById("tagdoc").innerHTML = tagdocOutput;
    
    // 검색폼 다국어화
    document.getElementById("simplesearch_header").innerText = i18n[lang].SimpleSearch;
    document.getElementById("simplesearch_input_creatorname_string").innerText = i18n[lang].SimpleSearchCreator;
    document.getElementById("simplesearch_input_furname_ko_string").innerText = i18n[lang].SimpleSearchNameKo;
    document.getElementById("simplesearch_input_furname_en_string").innerText = i18n[lang].SimpleSearchNameEn;
    document.getElementById("simplesearch_input_bday_title_string").innerText = i18n[lang].SimpleSearchBirthday;
    document.getElementById("simplesearch_dropdown_species_string").innerText = i18n[lang].SimpleSearchSpecies;
    document.getElementById("simplesearch_input_is_partial_string").innerText = i18n[lang].SimpleSearchIsPartial;
    document.getElementById("simple_submit_button").setAttribute("value", i18n[lang].Submit);
    
    
    document.getElementById("searchform_header").innerText = i18n[lang].AdvancedSearch;
    document.getElementById("searchtags_string").innerText = i18n[lang].SearchTags;
    document.getElementById("exactmatch_string").innerText = i18n[lang].IsExactMatch;
    document.getElementById("submit_button").setAttribute("value", i18n[lang].Submit);
}

function setLangKo() {
    lang = "ko";
    reloadI18n();
}
function setLangEn() {
    lang = "en";
    reloadI18n();
}

function makeOutput(searchResults) {
    let output = "";
    
    searchResults.forEach(it => {
        let displayFurName = (it.name_ko + " " + it.name_en).trim()
        if (displayFurName == "") displayFurName = "???";
        let displayActorName = (it.actor_name).trim();
        if (displayActorName == "") displayActorName = "???";
        let displayActorLink = (it.actor_link.includes(":") ? "" : "@") + it.actor_link
        if (displayActorLink == "@") displayActorLink = "???";
        
        output += "<div class=\"furBox\">" +
        "<div class=\"imgBox\"><img class=\"furimg\" src=\"" + it.photo + "\"></div>" +
        "<div chass=\"infoBox\">" +
        "<h4>" + displayFurName + "</h4>" +
        "<h5>" + displayActorName + "</h5>" +
        "<h5>" + displayActorLink + "</h5>" +
        "</div></div>";
    });
    
    document.getElementById("searchResults").innerHTML = output;
}

function simplequery() {
    let creatorName = document.getElementById("simplesearch_input_creatorname").value;
    if (creatorName == "") creatorName = undefined;
    let furNameKo = document.getElementById("simplesearch_input_furname_ko").value;
    if (furNameKo == "") furNameKo = undefined;
    let furNameEn = document.getElementById("simplesearch_input_furname_en").value;
    if (furNameEn == "") furNameEn = undefined;
    let birthdayFrom = document.getElementById("simplesearch_input_bday_from").value;
    if (birthdayFrom == "") birthdayFrom = undefined;
    let birthdayTo = document.getElementById("simplesearch_input_bday_to").value;
    if (birthdayTo == "") birthdayTo = undefined;
    let species = document.getElementById("simplesearch_dropdown_species").value;
    if (species == "dont_care") species = undefined;
    let isPartial = document.getElementById("simplesearch_input_is_partial").value;
    if (isPartial == "dont_care") isPartial = undefined;
    
    let searchFilter = {};
    
    if (creatorName !== undefined) searchFilter.creator_name = creatorName;
    if (furNameKo !== undefined) searchFilter.name_ko = furNameKo;
    if (furNameEn !== undefined) searchFilter.name_en = furNameEn;
    if (birthdayFrom !== undefined) searchFilter.birthday_from = birthdayFrom;
    if (birthdayTo !== undefined) searchFilter.birthday_to = birthdayTo;
    if (isPartial !== undefined) searchFilter.is_partial = isPartial;
    if (species !== undefined) searchFilter.species_ko = dropdownIdToDBname[species];
    
    makeOutput(performSearch(searchFilter, false));
}

function query() {
    let query = document.getElementById("searchtags").value;
    let exactMatch = document.getElementById("exactmatch").checked;

    makeOutput(performSearch(parseSearchTags(query), exactMatch));
}

/*
Composes searchFilter by obtaining key-value pair from Danbooru tagging syntax
단부루식 태그 문법에서 key와 value를 분리해 searchFilter를 만듦
 */
function parseSearchTags(searchstrr) {
    let searchstr = searchstrr.trim();
    
    if (searchstr.length == 0) return undefined;
    
    let tokens = searchstr.split(' ');
    let searchFilter = new Object();
    // populate searchfilter object
    tokens.forEach(v => {
        // example tag: "creator:DIY"
        // split key-value
        let kvpair = v.split(':');
        searchFilter[kvpair[0]] = kvpair[1];
    });

    return searchFilter;
}

// 문자열을 검색하기 좋게 소문자로 바꾸고 띄어쓰기와 언더스코어를 없앰 (언더스코어는 사용자가 검색어에 띄어쓰기 대신 집어넣을 가능성 있음)
String.prototype.babostr = function() {
    return this.toLowerCase().replaceAll(" ","").replaceAll("_","");
}

/*
Perform search on the database (JSON)
JSON DB에서 검색 수행

May modify this code to perform searching by sending SQL query to real database
이 소스를 수정해 데이터베이스에 쿼리를 날리는 식으로 동작을 변경할 수 있음

## 검색 필터 규약

아래의 예시 필터를 보자:

filter = {
    "creator_name": "블루폭스",
    "species_ko": ["개","늑대"]
}

- 키값이 undefined여서는 안 됨
- 키값의 type이 array일 때에는, 그 조건에 한해 OR조건으로 처리
- 키값의 type이 object여서는 안 됨
- 이 외 type의 키값은 표준 매칭 방식을 따름

## 표준 매칭 방식

exactMatch가 참일 경우 문자열이 정확히 일치하는지를 검사, 그렇지 않으면 필터키값이 DB값의 일부인지 검사함

 */
function performSearch(searchFilter, exactMatch) {
    let isSearchTagEmpty = searchFilter === undefined;
    let foundFurs = [];

    let birthdayFrom = undefined;
    let birthdayTo = undefined;
    if (!isSearchTagEmpty) {
        birthdayFrom = searchFilter.birthday_from;
        birthdayTo = searchFilter.birthday_to;
    }
    
    console.log(searchFilter);
    console.log(exactMatch);
    
    for (const furid in furdb) {
        let searchMatches = true;
        
        // do not check for conditions if search term is empty -> will put every fursuits onto foundFurs
        // 검색 태그가 비어있으면 조건 검사를 하지 않음 -> searchMatches의 초기값이 참이기 때문에 모든 털들을 foundFurs에 집어넣게 됨
        if (!isSearchTagEmpty) {
            for (const searchCriterion in searchFilter) {

                try {
                    // check if the tag is valid
                    // 태그가 올바른지 검사
                    if (searchCriterion in furdb[furid]) {
                        const arraySearchMode = Array.isArray(searchFilter[searchCriterion]);
                        
                        // 검색어 sanitise
                        let searchTerm = undefined;
                        if (arraySearchMode) {
                            searchTerm = searchFilter[searchCriterion].map(it => it.babostr());
                        }
                        else {
                            searchTerm = searchFilter[searchCriterion].babostr();
                        }
                        
                        // disambiguate search term if the criterion is creator_name
                        // 메이커 검색어의 동음이의 처리
                        if (searchCriterion == "creator_name") {
                            if (arraySearchMode) {
                                searchTerm = searchTerm.map(it => (creatorThesaurus[it] !== undefined) ? creatorThesaurus[searchTerm].babostr() : it);
                            }
                            else {
                                if (creatorThesaurus[searchTerm] !== undefined) {
                                    searchTerm = creatorThesaurus[searchTerm].babostr();
                                }
                            }
                        }
                        
                        console.log(searchTerm);
                        
                        if (arraySearchMode) {
                            let partialMatch = false;
                            searchTerm.forEach(it => {
                                partialMatch |= (exactMatch) ? (furdb[furid][searchCriterion].babostr() == it) : furdb[furid][searchCriterion].babostr().includes(it);
                            });
                            searchMatches &= partialMatch;
                        }
                        else {
                            searchMatches &= (exactMatch) ? (furdb[furid][searchCriterion].babostr() == searchTerm) : furdb[furid][searchCriterion].babostr().includes(searchTerm);
                        }
                        
                        // 위 대입 식이 searchMatches에 AND하기 때문에 모든 조건을 만족해야만 searchMatches가 최종적으로 true가 됨
                        // OR로 하려면 let searchMatches = false; 하고 searchMatches |= ... 하면 됨
                    }
                    // display error message if the tag is not valid
                    // 올바르지 않은 태그면 에러창 띄움
                    else if (!searchCriterion in specialSearchTags) {
                        alert(i18n[lang].TagSyntaxError + searchCriterion);
                        return undefined;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            
            // 생일 조건은 별도로 검사
            // check birthday condition here
            if ((birthdayFrom !== undefined || birthdayTo !== undefined) && furdb[furid].birthday.length < 1) {
                searchMatches = false;
            }
            if (
                ((birthdayFrom !== undefined && birthdayTo !== undefined) && (furdb[furid].birthday < birthdayFrom || furdb[furid].birthday > birthdayTo)) ||
                (birthdayFrom !== undefined && furdb[furid].birthday < birthdayFrom) ||
                (birthdayTo !== undefined && furdb[furid].birthday > birthdayTo)
            ) {
                searchMatches = false;
            }
        }

        
        // do not return "hidden" furs /  hidden인 퍼슈트는 반환하지 않음
        if (searchMatches && furdb[furid].hidden == "FALSE") {
            foundFurs.push(furdb[furid]);
        }
    }

    return foundFurs;
}
