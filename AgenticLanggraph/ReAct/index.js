import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from 'dotenv'

dotenv.config()

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.API_KEY
});

const getWeather = tool((input) => {  //tool1
  console.log("dasdaiso",input)

  
  const data = { Pune: "28°C", Delhi: "31°C", Mumbai: "30°C" };
    const temp = data[input.location];
    return temp ? `The weather in ${input.location} is ${temp}.` : "City not found!";
}, {
  name: 'get_weather',
  description: 'Call to get the current weather.',
  schema: z.object({
    location: z.string().describe("Location to get the weather for."),
  })
})
const getTime = tool(    //tool 2
  (input) => {
    const city = input.city.toLowerCase();
    const time = {
      delhi: "10:30 AM",
      mumbai: "10:28 AM",
      pune: "10:32 AM",
    };
    return time[city] || "City not found!";
  },
  {
    name: "get_time",
    description: "Get the current time in a given city.",
    schema: z.object({
      city: z.string().describe("City name to get the time for."),
    }),
  }
);

const agent = createReactAgent({ llm: model, tools: [getWeather,getTime] });
// console.log(agent)
let inputs = { messages: [{ role: "user", content: "hi" }] };

let stream = await agent.invoke(inputs)

console.log(stream)

