import {RunnableLambda} from '@langchain/core/runnables'
import {StateGraph,START,END} from '@langchain/langgraph'




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


const graph =  new StateGraph({
    channels:{
        text:{type: "string"},
        sentiment: {type: "string"}
    }
})

graph.addNode("Sentiment",sentimentNode)
graph.addNode("positive",async(state) => {

    return {sentiment:"Are you positive"}
})
graph.addNode("negative",async(state) => {
    return {sentiment:"Are you negative"}
    
})

graph.addEdge(START,"Sentiment")

graph.addConditionalEdges("Sentiment",async(state) => {

    console.log("con",state)
    if(state.sentiment === "positive") return "positive"
    else if(state.sentiment === "negative") return "negative"
    else{
        return "Neutral"

    }


})

graph.addEdge("positive",END)
graph.addEdge("negative",END)

const complied = graph.compile()

const inputs = [
  "I am very happy today!",
  "This is so bad.",
  
];

for(const text of inputs){
    const result = await complied.invoke({text})
    console.log("-->",result)
}

