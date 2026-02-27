use axum::{routing::get, Router, response::Json, serve};
use serde::Serialize;
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[derive(Serialize)]
struct Health {
    status: &'static str,
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(root)).route("/health", get(health));

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
