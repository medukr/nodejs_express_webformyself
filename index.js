const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('611421fcec5a012d2076d0f0');
        req.user = user
        next()
    } catch (e) {
        console.log('--->e',e);
    }
})


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://andrii:ul0rHs9F7Q3ezi5l@cluster0.q78fk.mongodb.net/coursesShop?retryWrites=true&w=majority`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'asd@example.com',
                name: 'Asdnovich',
                cart: { items: [] }
            })

            await user.save()
        }

        app.listen(PORT, ()=> {
            console.log('--->',`Server is running on http://localhost:${PORT}`);
        })
    } catch (e) {
        console.log('--->e', e);
    }
}

start();