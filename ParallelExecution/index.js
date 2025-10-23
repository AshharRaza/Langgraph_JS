import {RunnableLambda} from '@langchain/core/runnables'
import { START, StateGraph,END } from '@langchain/langgraph'

const sentimentNode = new RunnableLambda({
    func: async(state) => {
        console.log(state)
        const data = state.text.toLowerCase()
        console.log(data)
        let sentiment = "neutral"
        if(data.includes("happy") || data.includes("good")) sentiment = "positive"
        if(data.includes("sad") || data.includes("bad")) sentiment = "positive"
        console.log(sentiment)
        return {sentiment}

    }
})

const SummaryNode = new RunnableLambda({
    func: async(state) => {
        console.log(state)
        const data = state.text.toLowerCase()
        const summary = data.split(" ").slice(0,5).join(" ") + "..."
        console.log(typeof summary)
        return {summary}


    }
})

const IntentNode = new RunnableLambda({
    func: async(state) => {
        console.log(state)
        const data = state.text.toLowerCase()
        let intent
        if(data.includes("order")) intent = "purchase"
        if(data.includes("help")) intent = "support"
        if(data.includes("refund")) intent = "compliant"
        console.log(intent)
        return {intent}


        
    }
})
const CombineNode = new RunnableLambda({
    func: async(state) => {
        console.log("comb",state)
        
    }
})

const graph = new StateGraph({
   channels: {
    summary: {type: "string"},
    intent: {type: "string"},
    sentiment: {type: "string"},
    text: {type: "string"},
    combine: {type: "string"}
   }
})

graph.addNode("Sentiment",sentimentNode)
graph.addNode("Summary",SummaryNode)
graph.addNode("Intent",IntentNode)
graph.addNode("Combine",CombineNode)


graph.addEdge(START,"Sentiment")
graph.addEdge(START,"Summary")
graph.addEdge(START,"Intent")

graph.addEdge("Sentiment","Combine")
graph.addEdge("Summary","Combine")
graph.addEdge("Intent","Combine")

graph.addEdge("Combine",END)
const compiled = graph.compile()

const result = await compiled.invoke({
    text: "I am happy with my order but need help tracking it."
})

console.log(result)




