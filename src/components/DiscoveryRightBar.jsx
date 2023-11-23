import ExperimentalRightBarCard from "./ExperimentalRightBarCard";
import { findFileByName } from "../utils";

const DiscoveryRightBar = ({ passages }) => {
  console.log(passages);
  if(passages.length != 0){
    const totalConfidence = passages
      .slice(0, 2) // Obtener solo los primeros tres pasajes
      .reduce((acc, curr) => acc + curr.confidence, 0);
    const averageConfidence = (totalConfidence * 100 / Math.min(passages.length, 3)).toFixed(1);

    return (
      <div className=" list-group list-title-right">
        <a href="#" className="list-group-item list-group-item-action disabled list-title" aria-current="true">
          Fuentes
        </a>
        <div className="card-score" style={{ marginTop: "10px", marginLeft:"12px" }}>
          <h6>Confianza:  </h6>
          <h6>{averageConfidence}%</h6>
        </div>
        <div className="card-group2">
          {passages
            .slice(0, 3) // Obtener solo los primeros tres elementos
            .map((passage, index) => {
              const dataOriginal = findFileByName(passage.displayname);
              let  archivo_original = null;
              let  URL_archivo_original = null;
              console.log(index);
              if(dataOriginal && dataOriginal.archivo_original && dataOriginal.URL_archivo_original){
                archivo_original = dataOriginal.archivo_original;
                URL_archivo_original = dataOriginal.URL_archivo_original;
              } else {
                return null
              }
              return (
                <ExperimentalRightBarCard
                  key={index} // Use a unique key for each item when mapping
                  cardTitle={archivo_original}
                  cardText={passage.passage_text}
                  cardScore={(passage.confidence * 100).toFixed(1)}
                  url={URL_archivo_original}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
  else{
    return (
        <div className="list-group list-title-right">
          <a href="#" className="list-group-item list-group-item-action disabled list-title" aria-current="true">
            Fuentes
          </a>
      
          <div className="card-group2">
            <div className="card" >
                <div className="card-body">
                    <div className="card-title-container">
                        <h6 className="card-title-empty">No se ha realizado ninguna búsqueda de momento</h6>
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
  }
}

export default DiscoveryRightBar;