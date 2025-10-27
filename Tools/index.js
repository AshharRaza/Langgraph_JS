import {tool} from '@langchain/core/tools'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import {z} from 'zod'
import dotenv from 'dotenv'
import { HumanMessage } from 'langchain'


dotenv.config()
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  apiKey:process.env.API_KEY
})

const TodaysDate = tool(
  async() => {
    console.log("this is running Date")
    const date = new Date().toLocaleDateString()
    console.log(date)
    return date
  },
  {
    name:"GetDate",
    description: "This is Todays Time",
    schema:z.object({})
  }
)

const TimeDate = tool(
  async() => {
    const time = new Date().toLocaleTimeString()
    // console.log(date)
    return time
  },
  {
    name:"GetTime",
    description: "This is Todays Time",
    schema:z.object({})
  }
)

const availableTools = model.bindTools([TodaysDate,TimeDate])

const AskFun = async() => {

  // let messages = [
  //   new HumanMessage('Aaj ka date aur time kya hai?') // User ka question
  // ];
      let result

  let res = await availableTools.invoke("what is the current time")
  // messages.push(res)
  
  console.log(res.tool_calls)
  if(res.tool_calls && res.tool_calls.length > 0)
  {

    console.log("ads")
    for(const tools_item of res.tool_calls){
      // console.log(tools_item)

      if(tools_item.name === "GetDate"){
        result = await TodaysDate.invoke({})
        console.log(result)
      }
       if(tools_item.name === "GetTime"){

        result = await TimeDate.invoke({})

      }
      
      // const toolId = 
      const aireplay = await model.invoke(result)
    console.log(aireplay.content)
    return 

    }
   
   
    
  }
   else{
      console.log(res.content)
    }

}
AskFun()