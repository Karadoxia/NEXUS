# Rust multi-stage build for nexus-service
FROM rust:1.72 as builder
WORKDIR /usr/src/app

# copy workspace manifest and dependencies
COPY Cargo.toml Cargo.lock ./
# copy compute crate so workspace builds
COPY crates/compute ../compute
COPY crates/service/src ./src

# build release
RUN cargo build --release

# runtime image
FROM gcr.io/distroless/cc-debian11
COPY --from=builder /usr/src/app/target/release/nexus-service /usr/local/bin/nexus-service
CMD ["nexus-service"]
