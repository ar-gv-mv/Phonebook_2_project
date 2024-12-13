import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
const app = express()
const PORT = 3001
app.use(morgan('tiny'))
morgan.token('body', function getBody (req) {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})

app.use(morgan(':body'))
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.get('/', (request, response) => { 
    response.send('Hi')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(per => per.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

  })


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(per => per.id !== id)
  
    response.status(204).end()
  })
app.get('/info', (request, response) => {
    const time = new Date()
    const personsTotal = persons.length
    response.send(`Phonebook has info for ${personsTotal} <br/> ${time}`)
  })

app.post('/api/persons', (request, response) => {
    const {name, number} = request.body

    if (!name) {
        return response.status(400).json({
            error: 'Name is missing!'
        })
    } else if (!number) {
        return response.status(400).json({
            error: 'Number is missing!'
        })
    }

    const personName = persons.find(person => JSON.stringify(person.name) === JSON.stringify(name))
    
    if (personName) {
        return response.status(400).json({
            error: 'name must be unique!'
        })
    }

    function randomId() {
        return Math.floor(Math.random() * 1000000000)
    }
    const pers = {
        id: randomId(),
        name: name,
        number: number
    }

    persons = persons.concat(pers)
    response.json(pers)
})

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})