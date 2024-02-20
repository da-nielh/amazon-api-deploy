const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const app = express();
app.use(cors({origin:true}));

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Success!'
    })
});

app.post('/payment/create', async(req, res) => {
    const total = req.query.total; // Access total from the request body
    if (total > 0){
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: total,
                currency: 'USD'
            });
            console.log(paymentIntent);
            res.status(201).json({
                clientSecret: paymentIntent.client_secret
            });
        } catch (error) {
            console.error('Error creating payment intent:', error);
            res.status(500).json({ error: 'Unable to create payment intent' });
        }
    } else {
        res.status(403).json({
            message: 'Total must be greater than 0'
        })
    }
});

app.listen(5001, (err) => {
    if (err) throw err
    console.log('Server Runing port: 5001, http://localhost:5001')
})
