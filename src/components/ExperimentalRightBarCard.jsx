import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from '@mui/material/Link';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

function ExperimentalRightBarCard({ cardTitle, cardText, cardScore, url }) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return (
        <Card className='info-card'>
            <div className="card-title-container">
                <h5 className="card-title"><Link href={url} underline='hover' target='_blank' rel='noopener' >{cardTitle}<OpenInNewIcon fontSize='small'/></Link></h5>
                <div className="card-score">
                    <h6>Precisión:  </h6>
                    <h6 className={cardScore > 60 ? "card-score-green" : "card-score-red"}>{cardScore}%</h6>
                </div>
            </div>
            <CardContent className="card-text">{cardText}</CardContent>
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {cardText}
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default ExperimentalRightBarCard;