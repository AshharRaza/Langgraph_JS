//Channel are you to transfer data from one node to another node

import { RunnableLambda } from "@langchain/core/runnables"
import { StateGraph,START,END } from "@langchain/langgraph"

const AskNode = new RunnableLambda({
    func: async(state) => {            
        console.log(state)
        return {...state,message:"what is happening"}

    }
})

const HelloNode = new RunnableLambda({
    func: async(state) => {
        console.log(state)        

    }
})

const graph = new StateGraph({channels: {
    message: {type: "string"}            //This is the channel and defining the type also
}})       

graph.addNode("Ask",AskNode)           
graph.addNode("Hello",HelloNode)

graph.addEdge(START,"Ask")           
graph.addEdge("Ask","Hello")
graph.addEdge("Ask",END)

const compiled = graph.compile()      

await compiled.invoke({message: "hello how are you"})           