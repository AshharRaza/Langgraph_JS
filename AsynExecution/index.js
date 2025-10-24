import {END, START, StateGraph} from '@langchain/langgraph'

const graph = new StateGraph({
    channels: {
        text: { type: "string" },
    sentiment: { type: "string" },
    tracking: { type: "string" },
    final: { type: "string" },

    }
})

graph.addNode("Sentiment", async (state) => {
  console.log("🧩 Running Sentiment Analysis...");
  const text = state.text;
  const sentiment = text.includes("happy") ? "Positive 😊" : "Neutral 😐";
  return { sentiment };
});

graph.addNode("Tracking", async (state) => {
  console.log("📦 Running Order Tracking Analysis...");
  const text = state.text;
  const tracking = text.includes("track") ? "Tracking request found 🚚" : "No tracking info";
  return { tracking };
});

graph.addNode("Combine", async (state) => {
  console.log("🧠 Combining Results...");
  const { sentiment, tracking } = state;
  const summary = `Summary: Sentiment = ${sentiment}, Tracking = ${tracking}`;
  return { final: summary };
});


graph.addEdge(START, "Sentiment");
graph.addEdge(START, "Tracking");
graph.addEdge(["Sentiment", "Tracking"], "Combine");
graph.addEdge("Combine", END);

const compiled = graph.compile();

const result = await compiled.invoke({
  text: "I am happy with my order but need help tracking it.",
});

console.log("✅ Final Result:", result);