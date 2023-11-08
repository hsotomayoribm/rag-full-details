import "../App.css"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const BottomBar = () => {

    const fakeData = [];
    for(let i = 0; i < 3; i++){
        fakeData.push("NombreCarpeta/OtraCarpeta/Archivo");
    }

    return (
        <List sx={{
            width: '100%',
            position: 'relative',
          }}>
            <ListItem sx={{ fontWeight: 800 }}>
                Top 3 archivos más consultados
            </ListItem>
            
            {
                fakeData.map((filePath, i) => {
                    return <div key={i}><Divider/><ListItem key={i}> <ListItemText>{filePath}</ListItemText></ListItem></div>
                })
            }
        </List>
    );
}

export default BottomBar;