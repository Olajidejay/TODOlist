const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const TodoTask = require('./models/TodoTask');



app.use('/static/', express.static('public'));

app.use(express.urlencoded({ extended: true}));

//configure mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});


app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
      const tasks = await TodoTask.find({});
      res.render('todo.ejs', { todoTask: tasks });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.post('/',async (req, res) => {
    const todoTask = new TodoTask ({
        content: req.body.content,
    });
    try { 
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redires('/');
    }
});

app.route("/edit/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
      const tasks = await TodoTask.find({});
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    } catch (err) {
      res.status(500).send(err);
    }
  }).post(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
      res.redirect("/");
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndRemove(id);
      res.redirect("/");
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  

app.listen(3000, () => console.log('Server listening on port 3000'));