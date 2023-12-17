const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

async function main(message) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}

module.exports = main;
