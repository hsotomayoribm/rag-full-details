import { useState, useEffect } from "react";
import RightBarCard from "./RightBarCard";
import ExperimentalRightBarCard from "./ExperimentalRightBarCard";
import { findFileByName } from "../utils";

const RightBar = ({ passages }) => {

  if(passages.length != 0){
    return (
      <div className=" list-group list-title-right">
        <a href="#" className="list-group-item list-group-item-action disabled list-title" aria-current="true">
          Fuentes
        </a>
        <div className="card-group2">
          {passages
            .sort((a, b) => b.score - a.score) // Sort passages by score in descending order
            .slice(0, 3) // Take the top 3 passages
            .map((passage, index) => {
              // Si se quiere agregar la funcionalidad de agregar url y cambiar el nombre del documento se debe descomentar la siguiente linea y agregar la url como props a la ExperimentalRightBarCard
              // const { archivo_original, URL_archivo_original } = findFileByName(passage.document);

              return (
                <ExperimentalRightBarCard
                  key={index} // Use a unique key for each item when mapping
                  cardTitle={passage.document}
                  cardText={passage.passage}
                  cardScore={passage.score}
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

export default RightBar;