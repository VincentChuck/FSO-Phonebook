const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
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
app.use(cors())
app.use(express.static('build'))

const generateID = () => {
    return Math.floor(Math.random()*100000)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: `${body.name} already exists`
        })
    }

    const person = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
    const personCount = persons.length
    const time = new Date()

    res.send(`
        <div>
            Phonebook has info for ${personCount} people </br>
            ${time}
        </div>
    `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)
    person
    ? res.json(person)
    : ( res.statusMessage = "Current person doesn't exist",
        res.status(404).end()
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)
    res.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})