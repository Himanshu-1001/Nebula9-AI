import express from 'express'
import cors from 'cors'
import OpenAI from "openai"


const app = express();
const port = process.env.PORT || 5000;
const openai = new OpenAI({apiKey: `${process.env.OPENAI_SECRET_KEY}`})

app.use(cors());
app.use(express.json());

app.post('/analyze-email', async (req, res) => {
    const { content } = req.body;
    console.log(content);
    try {
        const response =  await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an assistant that helps analyze email content and provide insights.',
                },
                {
                    role: 'user',
                    content: `Analyze the following email content and provide insights:\n\n"${content}"`,
                },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        res.json({ analysis: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});