const express = require('express')

const db = require('../data/dbConfig.js')

const router = express.Router()


// `````````GET``````````
//get accounts
router.get('/', (req, res) => {

    db('accounts').limit(req.query.limit || 5).orderBy('id', 'desc')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(err => {
            handleError(err, res)
        })
})

//get account by id
router.get('/:id', (req, res) => {
    db.select('*')
        .from('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            console.log(account)
            if (!account) {
                res.status(404).json({ message: 'id doesnt exist' })
            } else {
                res.status(200).json({ data: account })
            }

        })
        .catch(err => {
            handleError(err, res)
        })
})

// `````````POST``````````
router.post('/', (req, res) => {

    if (!req.body.name || !req.body.budget) {
        res.status(400).json({ message: 'missing required fields name or budget' })
    }

    db('accounts')
        .insert(req.body).returning('id')
        .then(id => {
            console.log(id)
            db('accounts').where({ id: id[0] }).first()
                .then(accountPosted => {
                    res.status(201).json({ data: accountPosted })
                })
        })
        .catch(err => {
            handleError(err, res)

        })
})

//`````````PUT````````````
router.put('/:id', (req, res) => {

    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: 'nothing to update was given' })
    }

    db('accounts')
        .where({ id: req.params.id })
        .update(req.body)
        .then(numberUpdated => {
            db('accounts')
                .where({ id: req.params.id })
                .then(accountUpdated => {
                    if(numberUpdated>0){
                        res.status(200).json({ data: accountUpdated })
                    }else{
                        res.status(404).json({message: 'id not found'})
                    }
               
                })
                .catch(err => {
                    handleError(err, res)
                })


        })
        .catch(err => {
            db('accounts')
            .then(accounts => {
               if(accounts.filter(account => account.name === req.body.name)) {
                   res.status(400).json({message: 'name is not unique'})
               }else{
                handleError(err, res)
               }
            })
       
        })
    })

    //```````DELETE``````````
    router.delete('/:id', (req, res) => {
        db('accounts')
        .where({id: req.params.id})
        .first()
        .then( accountDeleted => {
            db('accounts')
            .where({id: req.params.id})
            .del()
            .then( numberDeleted => {
                if(numberDeleted > 0){
                    res.status(200).json({data: accountDeleted})
                } else {
                    res.status(404).json({message: 'id not found'})
                }
            })
            .catch(err => {
                handleError(err, res)
            })
        }) 
        .catch(err => {
            handleError(err, res)
        })
      
    })


    //`````Helpers/Error Handling
    function handleError(error, res) {
        console.log(error)
        res.status(500).json({ ErrorMessage: error.message })
    }


    module.exports = router