import { useState, useEffect } from "react";

import "./App.css";
import { WebChatContainer, setEnableDebug } from "@ibm-watson/assistant-web-chat-react";
import { getObjectByPath, getAllNestedKeys, changeNeuralSeekLastKey, normalizePassages } from "./utils.js";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import Header from "./components/Header";
import DiscoveryRightBar from "./components/DiscoveryRightBar";

setEnableDebug(true);

//--GLOBAL VARIABLES--
var FIELDS = ["title", "text"];
var CHARACTERS = 250;
var RETURN = [
  "document_id",
  "extracted_metadata.filename",
  "extracted_metadata.title",
  "metadata.source.url",
];
var COLLECTION_IDS = [
  '58e60b62-4c08-2181-0000-018bd46ba83a',
  '02300ce4-6558-fd93-0000-018bd4e9483e',
  '131b8e2b-95c3-cf93-0000-018bc9625cd9',
  '167edcfd-669c-141e-0000-018bc9e5058b'
]

const apikey = import.meta.env.VITE_DISCOVERY_API_KEY;
const endpoint = import.meta.env.VITE_DISCOVERY_URL;
const project_id = import.meta.env.VITE_DISCOVERY_PROJECT_ID;

// query parameters
const version = import.meta.env.VITE_DISCOVERY_VERSION;

async function fetchDiscoveryData (query, setDiscoveryData) {
  try {
    const postData = {
      collection_ids: COLLECTION_IDS,
      natural_language_query: query,
      return: RETURN,
      table_results: {enabled: false},
      // count: 3,
      passages: {
        //object
        enabled: true, //boolean
        fields: FIELDS, //string[]
        characters: CHARACTERS, //integer
        find_answers: true, //boolean
      }
    };

    console.log(query);

    const response = await fetch(endpoint + "/v2/projects/" + project_id + "/query?version=" + version, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`apikey:${apikey}`)
      },
      body: JSON.stringify(postData)
    });

    if (response.ok) {
      const responseData = await response.json();
      setDiscoveryData(responseData);
      console.log(responseData);
    } else {
      throw new Error('Failed to post data');
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
};

function onBeforeRender(instance, setInstance) {
  setInstance(instance);
  instance.restartConversation();
}

function onAfterRender(instance, setScore, setAnswer, setDocument, setPassages, setQuery) {
  instance.changeView({ mainWindow: true, launcher: false });
  instance.on({ type: "send", handler: (event) => sendHandler(event, setQuery) });
  instance.on({ type: "receive", handler: (event) => receiveHandler(event, setScore, setAnswer, setDocument, setPassages) });
}

function sendHandler(event, setQuery) {
  setQuery(event.data.input.text);
}

function receiveHandler(event, setScore, setAnswer, setDocument, setPassages) {
  const eventsKeysArrays = [event.data.output.debug].map((event) => getAllNestedKeys(event));

  let isThereScore = false;
  let scoreKey;
  let passages;
  let passagesFound = false;

  eventsKeysArrays.forEach((eventKeyArray) => {
    eventKeyArray.forEach((eventKey) => {

      // Given that it ends in .score it will go the deepest possible
      // Meaning it will not detect a .score.something
      if (eventKey.includes(".score")) {
        isThereScore = true;
        scoreKey = eventKey;
      } else if (eventKey.includes(".passages") && passagesFound === false) {
        passages = eventKey;
        passagesFound = true;
      }
    });
  });

  if (isThereScore) {
    console.log(event.data.output.debug);
    const scoreData = getObjectByPath(event.data.output.debug, scoreKey);
    console.log(scoreData);

    const passagesKey = changeNeuralSeekLastKey(scoreKey, "passage");
    console.log(passagesKey);
    const passagesData = getObjectByPath(event.data.output.debug, passagesKey);
    console.log(passagesData);

    const documentKey = changeNeuralSeekLastKey(scoreKey, "document");
    const documentData = getObjectByPath(event.data.output.debug, documentKey);
    console.log(documentData);

    const passagesArray = getObjectByPath(event.data.output.debug, passages);
    console.log(passagesArray);

    setPassages(prevPassagesArray => [...passagesArray]);
    setScore(scoreData);
    setAnswer(passagesData);
    setDocument(documentData);
  }
}

function App() {
  const [instance, setInstance] = useState(null);
  const [score, setScore] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [neural_document, setDocument] = useState(null);
  const [passages, setPassages] = useState([]);
  const [webChatOptions, setWebChatOptions] = useState(null);
  const [discoveryData, setDiscoveryData] = useState(null);
  const [query, setQuery] = useState("");
  const [discoveryPassages, setDiscoveryPassages] = useState([]);

  useEffect(() => {
    console.log('La variable "query" ha cambiado:', query);
    if (query !== "") {
      fetchDiscoveryData(query, setDiscoveryData);
    } 
  }, [query]);

  useEffect(() => {
    if (discoveryData) {
      const discoveryChunks = normalizePassages(discoveryData);
      setDiscoveryPassages(discoveryChunks);
    }
  }, [discoveryData]);

  useEffect(() => {
    // RENDER FAVICON
    const faviconPath = import.meta.env.VITE_FAVICON;

    if (faviconPath) {
        const faviconLink = document.getElementById('favicon-link');
        faviconLink.href = faviconPath;
    }

    // PLACE CHAT IN THE MIDDLE
    const placeChat = () => {

      const customElement = document.querySelector('.webchat-container');
      
      // Realiza las operaciones que necesitas con customElement
      const webChatOptions = {
        integrationID: import.meta.env.VITE_ASSISTANT_INTEGRATION_ID,
        region: import.meta.env.VITE_ASSISTANT_REGION,
        serviceInstanceID: import.meta.env.VITE_ASSISTANT_SERVICE_INSTANCE_ID,
        element: customElement,
      };

      setWebChatOptions(webChatOptions);
    };

    sessionStorage.clear();
    
    const tiempoEspera = 1000; // 2000 milisegundos = 2 segundos
    const timeoutId = setTimeout(placeChat, tiempoEspera);

    // Limpia el temporizador si el componente se desmonta antes de que se cumplan los 2 segundos
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="gral-container">
      <Header logo={import.meta.env.VITE_HEADER_LOGO} />
      <div className="elements-container">
        <div className="left-column">
          <LeftBar instance={instance} answer={answer} className="consultas" />
        </div>
        <div className="center-column">
          <div className="webchat-container">
          {webChatOptions !== null && (
            <WebChatContainer
              id="esteId"
              config={webChatOptions}
              onBeforeRender={(instance) => onBeforeRender(instance, setInstance)}
              onAfterRender={(instance) => onAfterRender(instance, setScore, setAnswer, setDocument, setPassages, setQuery)}
            />
          )}
          </div>
        </div>
        <div className="right-column">
          {/*<RightBar passages={passages} receiveHandler={(event) => receiveHandler(event, setScore)} />*/}
          <DiscoveryRightBar passages={discoveryPassages} />
        </div>
      </div>
    </div>
  );
}

export default App;