const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const bodyParser = require('body-parser')


app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
//get users data
let users=[]

app.get('/users', (req,res)=>{
    res.send(users)
})


//add users and store them in array
app.post('/users', async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = {
            name:req.body.name,
            password:hashedPassword,
        }
        console.log(hashedPassword)
        users.push(user)
    }catch(err){
        console.log(err)
    }
    
    res.send('users added')
})



//verify the password

app.post('/users/login', async(req,res)=>{
    const user = users.find(user=> user.name === req.body.name)
    if(user === null){
        return res.status(500).send('No Users')
    }
    try{
        if(await bcrypt.compare(req.body.password , user.password)){
            res.send('user logged in')
        }else{
            res.send('username or password is wrong')
        }   
    }catch(err){
        console.log(err)
    }
})



app.listen(3000, ()=>{
    console.log('server running on port 3000')
})