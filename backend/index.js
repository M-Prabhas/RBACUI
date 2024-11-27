const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

let users = [];  // In-memory data 

app.get("/",function(req,res){
    console.log("hello world")
});


app.post('/createuser', (req, res) => {
    const { name, email, password, read, write, readwrite, activate } = req.body;

    if (!name || !email || !password) {
        return res.send({ errormessage: 'Missing required fields' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        read,
        write,
        readwrite,
        active: activate
    };

    users.push(newUser);
    res.send({user:newUser});
});

app.put('/updateuser/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email, password, read, write, readwrite, active } = req.body;

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.send({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.read = read !== undefined ? read : user.read;
    user.write = write !== undefined ? write : user.write;
    user.readwrite = readwrite !== undefined ? readwrite : user.readwrite;
    user.active = active !== undefined ? active : user.active;

    res.send({updateduser:user});
});

app.delete('/deleteuser/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser);
});

app.get('/getusers', (req, res) => {
    res.send({users:users});
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
