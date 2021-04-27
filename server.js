const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')


app.use(cors()) // networking, get a better grasp on this please
app.use(express.json())

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    // password TODO: create connection string
    // #region 
        password: '#nioxus77',
    // #endregion
    database: 'NP4Me'
})

app.post('/login', (req, res) => {
    console.log(req.body)
    const name = req.body.name
    const location = req.body.location;
    const avatarImage = req.body.avatarImage;

    db.query('INSERT INTO User_Info (name, location, avatarImage) VALUES (?, ?, ?)',
    [name, location, avatarImage],
    (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send("Insertion completed")
        }
    })
})

app.post('/add-bucketlist', (req, res) => {
    console.log(req.body) // check for values being passed
    const name = req.body.name
    const location = req.body.location
    const image = req.body.image

    db.query('INSERT INTO Bucket_List (name, location, image) VALUES (?,?,?)', [name, location, image],
    (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send("Added to Bucketlist")
        }
    })
})

app.get('/bucketlist', (req, res) => {
  // could make more dyanmic, variable name instead of hardcoded query
  /* NOTE on this query:
        fix the duplicate issue on insertion and stop the problem at the source,
        this is a temporary fix with a crappy solution,
        the duplicates still exist!
  */
  db.query("SELECT * FROM Bucket_List group by name", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
})

app.listen('5000', () => {
    console.log('Port connected on port 5000')
})
