import jsonData from './title_parsing.json';

function getObjectByPath(obj, path) {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result.hasOwnProperty(key)) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
}

function getAllNestedKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys.push(fullPath);
        keys = keys.concat(getAllNestedKeys(obj[key], fullPath));
      } else {
        keys.push(fullPath);
      }
    }
  }

  return keys;
}

function changeNeuralSeekLastKey(key, stringToAdd){
  let newKey = key.split(".");
  newKey.pop();
  newKey.push(stringToAdd);

  return newKey.join(".");
}

function discoveryCall(url) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // You can add other headers if needed
    },
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('API request failed');
      }
    })
    .then(function (data) {
      // Handle the data here
    })
    .catch(function (error) {
      // Handle errors
      console.error(error);
    });
}


function findFileByName(name) {
  for (const obj of jsonData) {
    if (obj.archivo_formateado.includes(name)) {
      return {
        archivo_original: obj.archivo_original,
        URL_archivo_original: obj.URL_archivo_original,
      };
    }
  }

  return null;
}

function getTextFragmentUrl(
  passage_text,
  passage_start,
  answer_start,
  answer_end
) {
  var text_fragment_urls = [];
  var pos_start = answer_start - passage_start;
  var pos_end = answer_end - passage_start;
  var answer_text = passage_text.slice(pos_start, pos_end);
  //full answer text, no context
  text_fragment_urls.push("#:~:text=" + encodeURIComponent(answer_text));
  //full answer text, with context
  var text_before = passage_text.slice(0, pos_start);
  var text_after = passage_text.slice(pos_end);
  var context_after = get_context_after(text_after, 15);
  var context_before = get_context_before(text_before, 15);
  //text_fragment_urls.push('#:~:text=' + encodeURIComponent(answer_text) + ',-' + encodeURIComponent(context_after));
  text_fragment_urls.push(
    "#:~:text=" +
      encodeURIComponent(context_before) +
      "-," +
      encodeURIComponent(answer_text) +
      ",-" +
      encodeURIComponent(context_after)
  );
  return text_fragment_urls[1];
}

function getTextFragmentUrl_safe(
  passage_text,
  passage_start,
  answer_start,
  answer_end
) {
  getTextFragmentUrl(passage_text, passage_start, answer_start, answer_end);
  /*--wrap tags around answer in passage text--*/
  var pos_start = answer_start - passage_start;
  var pos_end = answer_end - passage_start;
  var answer_text = passage_text.slice(pos_start, pos_end);
  var text_fragment_url = "#:~:text=" + encodeURIComponent(answer_text);
  return text_fragment_url;
}

function highlightAnswer(
  passage_text,
  passage_start,
  answer_start,
  answer_end,
  open,
  closed
) {
  /*--wrap tags around answer in passage text--*/
  var position = answer_end - passage_start;
  var passage_with_highlight = [
    passage_text.slice(0, position),
    closed,
    passage_text.slice(position),
  ].join("");

  position = answer_start - passage_start;
  passage_with_highlight = [
    passage_with_highlight.slice(0, position),
    open,
    passage_with_highlight.slice(position),
  ].join("");

  return passage_with_highlight;
}

function extractAnswer(passage_text, passage_start, answer_start, answer_end) {
  /*--extract answer text from passage text--*/
  return passage_text.slice(
    answer_start - passage_start,
    answer_end - passage_start
  );
}

function normalizePassages(payload) {
  console.log(payload);
  /*--extract and normalize passage values from Discovery REST payload--*/
  function compare(a, b) {
    /*--for sorting--*/
    return b.confidence - a.confidence;
  }

  function stripEmphasis(passage_text) {
    /*--Strip <em> & </em> tags from string--*/
    var splitOpen = passage_text.split("<em>");
    var highlight = splitOpen.join("");
    var splitClosed = highlight.split("</em>");
    var highlight = splitClosed.join("");
    return highlight;
  }
  var passages = [];
  for (var i in payload.results) {
    var result = payload.results[i];
    var displayname = "";
    if ("extracted_metadata" in result) {
      var title = result.extracted_metadata.title;
      var filename = result.extracted_metadata.filename;

      /* if (title != "" && title != undefined) {
              displayname = result.extracted_metadata.title;
            } else if (filename != undefined) {
              displayname = result.extracted_metadata.filename;
            } */

      if (filename != "" && filename != undefined) {
        displayname = result.extracted_metadata.filename;
      } else if (title != undefined) {
        displayname = result.extracted_metadata.title;
      }
    }
    var url = "";
    if ("metadata" in result) {
      if ("source" in result.metadata) {
        if ("url" in result.metadata.source) {
          url = result.metadata.source.url;
        }
      }
    }
    for (var j in result.document_passages) {
      var document_passage = result.document_passages[j];
      var passage_text = document_passage.passage_text;
      var passage_start = document_passage.start_offset;
      var passage_end = document_passage.end_offset;
      var answers = document_passage.answers;
      for (var k in answers) {
        var answer = answers[k];
        var answer_text = answer.answer_text;
        var answer_start = answer.start_offset;
        var answer_end = answer.end_offset;
        var confidence = answer.confidence;
        if (answer_text.trim().length > 0) {
          passages.push({
            displayname: displayname,
            url: url + "./media/test.pdf",
            // getTextFragmentUrl(
            //   stripEmphasis(passage_text),
            //   passage_start,
            //   answer_start,
            //   answer_end
            // ),

            passage_text: highlightAnswer(
              stripEmphasis(passage_text),
              passage_start,
              answer_start,
              answer_end,
              '<span class="has-text-link has-background-link-light">',
              "</span>"
            ),
            passage_start: passage_start,
            passage_end: passage_end,
            answer_text: answer_text,
            answer_start: answer_start,
            answer_end: answer_end,
            confidence: confidence,
          });
        }
      }
    }
  }
  passages.sort(compare);
  return passages;
}


export {
  getObjectByPath,
  getAllNestedKeys,
  changeNeuralSeekLastKey,
  discoveryCall,
  findFileByName,
  getTextFragmentUrl,
  getTextFragmentUrl_safe,
  highlightAnswer,
  normalizePassages,
  extractAnswer,
}