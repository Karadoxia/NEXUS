// Rust service tool that forwards a JSON payload to the Rust microservice.
// The Rust endpoint is expected to accept `{ operation, numbers }` and return
// `{ result }` as in the default implementation.
export function rustTool() {
  return {
    name: "rust-service",
    description:
      "Send a request to the Rust microservice; supports `sum` operation on an array of numbers.",
    async call(input: any) {
      const url =
        process.env.RUST_SERVICE_URL ||
        process.env.NEXT_PUBLIC_RUST_SERVICE_URL ||
        "http://localhost:8081/tool";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error(`Rust service responded with ${res.status}`);
      }
      return res.json();
    },
  };
}
