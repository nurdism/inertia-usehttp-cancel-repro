import { useHttp } from "@inertiajs/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

function Repro() {
  const http = useHttp({});
  const [log, setLog] = useState([]);
  const add = (line) => setLog((all) => [...all, line]);

  const start = (n, delayMs) =>
    http
      .get(`/slow?n=${n}&delay=${delayMs}`)
      .then(() => add(`${n}: done`))
      .catch((error) => add(`${n}: ${error.name}`));

  // Token variant: keep the token of request A, then cancel it while B runs.
  let tokenA;
  const startWithToken = () => {
    http
      .get("/slow?n=1&delay=3000", { onCancelToken: (token) => (tokenA = token) })
      .then(() => add("1: done"))
      .catch((error) => add(`1: ${error.name}`));
    start(2, 3000);
    window.tokenA = () => tokenA.cancel();
  };

  return (
    <div>
      {/* A is short and B is long, so A ends while B is still in flight. */}
      <button onClick={() => { start(1, 300); start(2, 3000); }}>Start A then B</button>
      <button onClick={() => http.cancel()}>Cancel</button>
      <button onClick={startWithToken}>Start A (keep token) then B</button>
      <button onClick={() => window.tokenA()}>Cancel A by its token</button>
      <pre id="log">{log.join("\n")}</pre>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Repro />);
