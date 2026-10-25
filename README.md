# useHttp cancel repro (@inertiajs/react 3.9.1)

`useHttp` keeps the `AbortController` of the newest request in one shared ref,
and the `finally` of every request sets it to `null`. Two bugs follow:

1. When an older request finishes while a newer one is in flight, `cancel()`
   does nothing, and the newer request still finishes.
2. The token from `onCancelToken` aborts the newest request, not the request
   it was made for.

## Run it

```sh
pnpm install
pnpm exec playwright install chromium-headless-shell
pnpm test
```

The two tests assert the expected behavior, so both fail on 3.9.1:

```
1) cancel() stops B after A has finished
   Expected: "1: done\n2: HttpCancelledError"
   Received: "1: done\n2: done"

2) the token of A cancels A, not B
   Expected: A is cancelled, B finishes
   Received: "2: HttpCancelledError\n1: done"
```

To try it by hand, run `pnpm dev`, open http://localhost:5199, click
"Start A then B", wait a second, then click "Cancel". B still finishes.

The page is `src/main.jsx`. `vite.config.js` adds a `/slow` endpoint that
answers after `delay` ms.
