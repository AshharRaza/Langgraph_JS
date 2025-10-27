import {tool} from '@langchain/core/tools'
import { ChatGoogleGenerativeAI} from '@langchain/google-genai'
import {z} from 'zod'
import dotenv from 'dotenv'

dotenv.config()
const calculatorTool = tool(
    
    async({text}) => {
        console.log(`this is running is ${text}`)
        return
     },
    
    {
        name:"Calculator",
        description: 'Evaluates mathematical expressions like "2 + 2" or "sqrt(16)".',
        schema: z.object({})
        
    }
)

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash',
    apiKey:process.env.API_KEY
})

const toolsCalls = model.bindTools([calculatorTool])

const AskForToll = async() => {
    const result = await toolsCalls.invoke("sum of 2+2 is ")
    console.log(result.tool_calls)
    if(result.tool_calls && result.tool_calls.length > 0){
        let FINAL
        for(const toolItem of result.tool_calls){
            console.log(toolItem)

            if(toolItem.name === "Calculator"){
                FINAL = await calculatorTool.invoke({})
            }
        }
        console.log(FINAL)
    }
}
AskForToll()