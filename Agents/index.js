import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Runnable } from "@langchain/core/runnables";
import dotenv from 'dotenv'
// import { pull } from "langchain/hub";
import {createReactAgent} from '@langchain/langgraph/prebuilt'
import { END, START, StateGraph } from "@langchain/langgraph";

dotenv.config()
const search = {
    name: "searchTool",
    description: "Search the web for information",
    func: async(query) => {
        `Search results for ${query}: Some dummy data`
    }
}



const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    apiKey: process.env.API_KEY
})

async function CreateAgents() {
    // const prompt = await pull("hwchase17/react")
    
    // const llmTools = llm.bindTools([search])

    const agent = createReactAgent({
    llm, // Gemini API
    tools: [search], // Dummy search tool
    // prompt,
  });
    return agent
}

async function agentNode(state) {
    const agent = await CreateAgents()
    console.log(agent)
}
const graph = new StateGraph({
    channels:{
        input: {type: "string"},
        text:{type:"string"}
    }
})

graph.addNode("agentNode",agentNode)
graph.addEdge(START,"agentNode")
graph.addEdge("agentNode",END)

const app = graph.compile()

async function RunMain() {
    const result = await app.invoke({input:"What is the weather in Delhi"})
    console.log(result)
}
RunMain()
