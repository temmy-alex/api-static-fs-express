const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));

const readJson = fs.readFileSync('./data/series.json');
const data = JSON.parse(readJson);

app.get('/', (req, res) => {
    const notif = req.query.notif
    res.render('index', { data, notif:notif })
});

app.get('/add', (req, res) => {
    res.render('add')
});

app.post('/add', (req, res) => {
    const { title, country } = req.body;

    data.push({ ID: data.length + 1, Title: title, Country: country });
    fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
    res.redirect('/?notif=success')
});

app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    let dataId;

   for(let i = 0; i < data.length; i++){
       if(Number(id) === data[i].ID){
           dataId = i;
       }
   }

   res.render('edit', { data: data[dataId] });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { title, country } = req.body;

    let dataId;
    for(let i = 0; i < data.length; i++){
        if(Number(id) === data[i].ID){
            dataId = i;
        }
    }

    data[dataId].Title = title;
    data[dataId].Country = country;

    fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
    
    res.redirect('/?notif=success');
})

app.listen(port, () => console.log(`JSON Bread listening on port ${port}!`))