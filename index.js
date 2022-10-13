require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('person', (req, res) => {
    return req.method === 'POST'
    ? JSON.stringify(
        {
            name: req.body.name,
            number: req.body.number
        }
    )
    : null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person', )) 

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    // if (persons.some(person => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: `${body.name} already exists`
    //     })
    // }

    const person = new Person({
        "name": body.name,
        "number": body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
    const personCount = Person.find({}).then(persons => persons.length)
    const time = new Date()

    personCount.then(count => {
        res.send(`
            <div>
                Phonebook has info for ${count} people </br>
                ${time}
            </div>
        `)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)
    res.status(204).end()
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})