import {RunnableLambda} from '@langchain/core/runnables'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import {StateGraph,START,END} from '@langchain/langgraph'
import dotenv from 'dotenv'

dotenv.config()


const model = new ChatGoogleGenerativeAI({
    model:"gemini-2.0-flash",
    apiKey:process.env.API_KEY
})

const SummaryNode = new RunnableLambda({
    func: async(state)  => {
        const data = state.text

        const aiReplay = await model.invoke(data)

        return {...state,summary:aiReplay.content}
    }
})

const SentimentNode = new RunnableLambda({
    func: async(state) => {
        const sentiment = await model.invoke(`
            What is the Sentiment of the summary answer with these options
            -Technical
            -Jokes
            -Action
            ${state.summary}
            `)
            return {...state,sentiment:sentiment.content}
    }
})
const TranslationNode = new RunnableLambda({
    func: async(state) => {
        const translation = await model.invoke(`
            Translate the summary : ${state.summary}
            `)
        return {...state,translation:translation.content}
    }
})

const graph = new StateGraph({
    channels:{
        summary: {type: "string"},
        sentiment:{type:"string"},
        translation: {type:"string"},
        text: {type: "string"}

    }
})

graph.addNode("Summary",SummaryNode)
graph.addNode("Sentiment",SentimentNode)
graph.addNode("Translation",TranslationNode)

graph.addEdge(START,"Summary")
graph.addEdge("Summary","Sentiment")
graph.addEdge("Sentiment","Translation")
graph.addEdge("Translation",END)

const complied = graph.compile()

const result = await complied.invoke({text:"This repository documents my learning journey and practical experiments with **LangGraph (JS)** — a framework that empowers developers to build **dynamic AI agents**, **multi-step workflows**, and **state-managed LLM applications** with graph-based execution.LangGraph allows you to control and visualize how information flows between nodes, enabling **parallel execution**, **memory persistence**, and **advanced orchestration** between tools and models."
})

console.log("Result",
    `Summary : ${result.summary}
    Sentiment: ${result.sentiment}
    translation: ${result.translation}
    
    `
)