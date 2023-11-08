import axios from "axios";
import { useState, useEffect } from "react";

const questionsUrl =  import.meta.env.VITE_NEURAL_SEEK_QUESTIONS_URL;
const apikey = import.meta.env.VITE_NEURAL_SEEK_APIKEY;

const arrowSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="arrow-svg" viewBox="0 0 16 16">
    <path d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
    <path d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
  </svg>
);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const LeftBar = ({ instance, answer }) => {
  const [data, setData] = useState(null);
  const maxQuestionsToShow = 5;
  const questions = [];
  const options = {
    headers: {
      apikey: apikey,
      Accept: "*/*",
      'Access-Control-Allow-Origin': '*'
    },
  };

  useEffect(() => {
    axios.post(questionsUrl, "", options).then((response) => {
      setData(response.data);
    });
    console.log("Cambios");
    console.log(data);
  }, [answer]);

  const sendToAssistant = (input) => {
    const msg = {};
    msg.input = {};
    msg.input.text = input;
    instance.send(msg, { silent: false });
  };

  if (!data || !data.rows) {
    return null;
  }
  else {
    const dataSorted = data.rows.sort((a,b) => b.ucount - a.ucount)

    for (let i = 0; i < maxQuestionsToShow; i++) {
      if(dataSorted[i]){
        if (dataSorted[i] && dataSorted[i].questions){
          const userGenerated = dataSorted[i].questions.filter((question) => question.source == "user")
          const randomIndex = Math.floor(Math.random() * userGenerated.length);
          const randomUserGenQuestion = userGenerated[randomIndex]

          questions.push(capitalize(randomUserGenQuestion.q));
        }
      }
    }
  }

  return (
    <div className="list-group">
      <a href="#" className="list-group-item list-group-item-action disabled list-title" aria-current="true">
        Búsquedas Populares
      </a>

      {questions.map((question, i) => {
        return (
          <a onClick={() => sendToAssistant(question)} className="list-group-item list-group-item-action list-item-left left-bar-anchor" key={i}>
            {arrowSvg}
            {question}
          </a>
        );
      })}
    </div>
  );
};

export default LeftBar;
