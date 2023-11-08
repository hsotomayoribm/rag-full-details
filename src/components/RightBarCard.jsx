const RightBarCard = ({ cardTitle, cardText, cardScore }) => {
    if(cardScore > 60){
        return(
            <div className="card" >
                <div className="card-body">
                    <div className="card-title-container">
                        <h6 className="card-title">{cardTitle}</h6>
                        <div className="card-score">
                            <span >Precisión:</span> 
                            <span className="card-score-green">{cardScore}</span>
                        </div>
                    </div>
                    
                    <p className="card-text">{cardText}</p>
                </div>
            </div>)
    } 
    else{
        return(
            <div className="card" >
                <div className="card-body">
                    <div className="card-title-container">
                        <h6 className="card-title">{cardTitle}</h6>
                        <div className="card-score">
                            <span >Precisión:</span> 
                            <span className="card-score-red">{cardScore}</span>
                        </div>
                    </div>
                    <p className="card-text">{cardText}</p>
                </div>
            </div>)

    }

}

export default RightBarCard;