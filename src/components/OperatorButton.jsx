import { ACTIONS } from "../feature/Action";
function OperatorButton({ operator, dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.OPERATION, payload: operator })}
    >
      {operator}
    </button>
  );
}

export default OperatorButton;
