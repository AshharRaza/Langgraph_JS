import {RunnableLambda} from '@langchain/core/runnables'
import {StateGraph, START,END} from '@langchain/langgraph'
import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
import dotenv from 'dotenv'
import fs from 'fs'


dotenv.config()
    

const model = new ChatGoogleGenerativeAI({
    model:'gemini-2.0-flash',
    apiKey:process.env.API_KEY
})

const loadMessage = () => {

    return JSON.parse(fs.readFileSync("memory.json","utf-8"))
}

const SaveMessage = (data) => {
    fs.writeFileSync("memory.json", JSON.stringify(data))
}
let messages 
const AskNode = new RunnableLambda({
 func : async(state) => {

    // console.log("meads",messages)
    // console.log(state)
    messages = await loadMessage() || []
    const data = state.message
    console.log("adsdsa",messages)
    const aiReplay = await model.invoke(data)
    // // console.log(aiReplay)
    

    messages.push({'user':data,'ai': aiReplay.content})
    // console.log(messages)

    return {...state, response: messages}


 }
})

const graph = new StateGraph({
    channels: {
        message: {type: "string"},
        response: {type: "array"},
        
    }
})

graph.addNode("Ask",AskNode)
graph.addEdge(START,"Ask")
graph.addEdge("Ask",END)

const compiled = graph.compile()

let result
result = await compiled.invoke({message:"Hi"})
console.log(result.response)
SaveMessage(result.response)


result = await compiled.invoke({message:"one line joke"})
console.log(result.response)
SaveMessage(result.response)

// console.log(result)//

