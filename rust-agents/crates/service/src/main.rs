use axum::{routing::{get, post}, Router, response::Json, extract::Json as JsonExtract, serve, body::{Body, to_bytes}};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .route("/tool", post(tool_handler));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8081));
    println!("Rust service listening on {}", addr);
    let listener = TcpListener::bind(addr).await.unwrap();
    serve(listener, app.into_make_service()).await.unwrap();
}

async fn root() -> &'static str {
    "NEXUS Rust service"
}

async fn health() -> Json<Health> {
    Json(Health { status: "ok" })
}

#[derive(Deserialize, Serialize)]
struct ToolRequest {
    operation: String,
    numbers: Vec<i32>,
}

#[derive(Serialize, Deserialize)]
struct ToolResponse {
    result: i32,
}

async fn tool_handler(JsonExtract(body): JsonExtract<ToolRequest>) -> Json<ToolResponse> {
    let res = match body.operation.as_str() {
        "sum" => body.numbers.iter().sum(),
        // placeholder for additional operations
        _ => 0,
    };
    Json(ToolResponse { result: res })
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use axum::http::Method;
    use tower::util::ServiceExt; // for `oneshot`

    #[tokio::test]
    async fn health_endpoint() {
        let app = Router::new()
            .route("/", get(root))
            .route("/health", get(health))
            .route("/tool", post(tool_handler));
        let resp = app
            .oneshot(Request::builder().uri("/health").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let bytes = to_bytes(resp.into_body(), 1024).await.unwrap();
        assert_eq!(bytes, "{\"status\":\"ok\"}".as_bytes());
    }

    #[tokio::test]
    async fn tool_sum_endpoint() {
        let app = Router::new()
            .route("/tool", post(tool_handler));
        let req_body = ToolRequest {
            operation: "sum".to_string(),
            numbers: vec![1, 2, 3],
        };
        let resp = app
            .oneshot(
                Request::builder()
                    .method(Method::POST)
                    .uri("/tool")
                    .header("content-type", "application/json")
                    .body(Body::from(serde_json::to_string(&req_body).unwrap()))
                    .unwrap(),
            )
            .await
            .unwrap();
        let bytes = to_bytes(resp.into_body(), 1024).await.unwrap();
        let txt = String::from_utf8_lossy(&bytes);
        dbg!(&txt);
        assert!(txt.contains("\"result\":6"));
    }
}
