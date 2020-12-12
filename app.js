const express = require('express');
const app = express();

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{
    return res.sendFile('index.html');
});

const port  = process.env.PORT || 3000;

app.listen(port, (error) => {
    if(error){
        console.log("Server couldn't start...", error);
    }
    console.log(`Server started on port ${port}`)
});