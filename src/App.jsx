import { useReducer } from "react";
import "./App.css";
import OperatorButton from "./components/OperatorButton";
import DigitButton from "./components/DigitButton";
import { ACTIONS } from "./feature/Action";

const InitialState = {
  currentOperand: "0",
  previousOperand: null,
};
const reducers = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload,
          overwrite: false,
        };
      }
      if (state.currentOperand === "0" && payload === "0") return state;
      else if (state.currentOperand === "0" && payload !== "0") {
        return { currentOperand: payload };
      }
      if (payload === "." && state.currentOperand.includes(".")) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload}`,
      };
      break;
    case ACTIONS.OPERATION:
      if (state.currentOperand == "0" && state.previousOperand == null) {
        return state;
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          currentOperand: null,
          operation: payload,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload,
        currentOperand: state.currentOperand,
      };

      break;
    case ACTIONS.EQUAVALEN:
      if (
        state.previousOperand == null ||
        state.operation == null ||
        state.currentOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
        overwrite: true,
      };
      break;
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          overwrite: false,
          currentOperand: "0",
        };

      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: "0" };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
      break;
    case ACTIONS.CLEAR:
      return {};
      break;
  }
};
function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  let result = "";

  if (isNaN(prev) || isNaN(current)) return "";
  switch (operation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      result = parseFloat(prev / current);
      break;

    default:
      break;
  }
  return result.toString();
}
const INTEGER_FORMAT = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null || operand == "") return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMAT.format(integer);
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducers,
    InitialState
  );
  return (
    <div className="container">
      <div className="output">
        <div className="display">
          {previousOperand} {operation}
        </div>
        <div className="currentValue">{formatOperand(currentOperand)}</div>
      </div>
      <button onClick={() => dispatch({ type: "CLEAR" })} className="clear">
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        Del
      </button>
      <OperatorButton dispatch={dispatch} operator={"/"} />
      <DigitButton dispatch={dispatch} digit={"1"} />
      <DigitButton dispatch={dispatch} digit={"2"} />
      <DigitButton dispatch={dispatch} digit={"3"} />
      <OperatorButton dispatch={dispatch} operator={"-"} />
      <DigitButton dispatch={dispatch} digit={"4"} />
      <DigitButton dispatch={dispatch} digit={"5"} />
      <DigitButton dispatch={dispatch} digit={"6"} />
      <OperatorButton dispatch={dispatch} operator={"*"} />
      <DigitButton dispatch={dispatch} digit={"7"} />
      <DigitButton dispatch={dispatch} digit={"8"} />
      <DigitButton dispatch={dispatch} digit={"9"} />
      <OperatorButton dispatch={dispatch} operator={"+"} />
      <DigitButton dispatch={dispatch} digit={"."} />
      <DigitButton dispatch={dispatch} digit={"0"} />
      <button onClick={() => dispatch({ type: ACTIONS.EQUAVALEN })} id="equal">
        =
      </button>
    </div>
  );
}

export default App;
