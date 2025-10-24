import { MemorySaver,StateGraph,START,END } from "@langchain/langgraph";
import {RunnableLambda} from '@langchain/core/runnables'

const memory = new MemorySaver()

console.log(memory)

const FirstNode = new RunnableLambda({
    func: async(state) => {
        console.log(state.text)

        return {...state,text:"good"}
    }
})

const SecondNode = new RunnableLambda({
    func: async(state) => {
        console.log(state.text)
    }
})

const graph = new StateGraph({
    channels: {
        text: {type: "string"},
        message: {type: "string"}
    }
})

graph.addNode("first",FirstNode)
graph.addNode("second",SecondNode)

graph.addEdge(START,"first")
graph.addEdge("first","second")
graph.addEdge("second",END)

const compiled = graph.compile({checkpointer: memory})

const result = await compiled.invoke({text:"Hello"},{configurable: {thread_id: "chat-001"}})
console.log(result)

console.log(memory.writes)
