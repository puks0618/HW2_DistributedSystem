from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END
from langchain_ollama import ChatOllama
import json
import re

class AgentState(TypedDict):
    title: str
    content: str
    email: str
    strict: bool
    task: str
    llm: Any
    planner_proposal: Dict[str, Any]
    reviewer_feedback: Dict[str, Any]
    turn_count: int

def extract_first_json(s: str) -> dict:
    try:
        match = re.search(r'\{.*?\}', s, re.DOTALL)
        if match:
            return json.loads(match.group())
        else:
            raise ValueError("No valid JSON object found in model response.")
    except Exception as e:
        print("\n⚠️ JSON parse error:", e)
        print("Model returned:\n", s)
        raise

def planner_node(state: AgentState) -> Dict[str, Any]:
    print("--- NODE: Planner ---")
    llm = state["llm"]
    prompt = f"""
    Title: {state['title']}
    Content: {state['content']}
    Return JSON with 3 lowercase topical tags and a summary under 25 words:
    {{"tags": [...], "summary": "..."}}
    """
    result = llm.invoke(prompt).content.strip()
    proposal = extract_first_json(result)
    return {"planner_proposal": proposal}

def reviewer_node(state: AgentState) -> Dict[str, Any]:
    print("--- NODE: Reviewer ---")
    # Simulate a forced issue on the first two turns, then approve
    if state["turn_count"] < 3:
        feedback = {
            "has_issue": True,
            "reason": f"Simulated issue at turn {state['turn_count']} for correction loop testing."
        }
    else:
        feedback = {
            "has_issue": False,
            "reason": "No issues detected after revision."
        }
    return {"reviewer_feedback": feedback}

def supervisor_node(state: AgentState) -> Dict[str, Any]:
    return {"turn_count": state["turn_count"] + 1}

def router_logic(state: AgentState) -> str:
    if not state.get("planner_proposal"):
        return "planner"
    if state["reviewer_feedback"].get("has_issue"):
        return "planner"
    return END

def run_agentic_graph():
    llm = ChatOllama(model="phi3:mini", temperature=0.2)

    initial_state: AgentState = {
        "title": "Vector Clocks and Conflict Resolution",
        "content": "Explains vector clocks, partial ordering, and how conflicts are detected and resolved across replicas.",
        "email": "",
        "strict": True,
        "task": "generate-tags-and-summary",
        "llm": llm,
        "planner_proposal": {},
        "reviewer_feedback": {},
        "turn_count": 0
    }

    graph = StateGraph(AgentState)
    graph.add_node("planner", planner_node)
    graph.add_node("reviewer", reviewer_node)
    graph.add_node("supervisor", supervisor_node)

    graph.set_entry_point("supervisor")
    graph.add_conditional_edges("supervisor", router_logic, {"planner": "planner", END: END})
    graph.add_edge("planner", "reviewer")
    graph.add_edge("reviewer", "supervisor")

    chain = graph.compile()
    for step in chain.stream(initial_state):
        print("\n--- Step Result ---")
        print(step)

if __name__ == "__main__":
    run_agentic_graph()