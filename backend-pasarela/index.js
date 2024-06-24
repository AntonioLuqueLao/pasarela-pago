const express = require("express");
const app = express();
const env = require("dotenv").config({ path: "./.env" });
const cors= require("cors")
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.use(express.json());
app.use(cors());
const PORT = 3002

app.get("/config", (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
});

app.post("/create-payment-intent", async (req, res) => {
    const {amount, currency} = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
              enabled: true,
            },
          });

        res.status(200).send({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.error("Error creating payment intent:", error.message);
        return res.status(400).send({
            error: {
                message: error.message,
            },
        });
    }
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
    console.log("Listening on port 3002");
});
