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

export {
    getObjectByPath,
    getAllNestedKeys,
    changeNeuralSeekLastKey,
    discoveryCall,
    findFileByName
}