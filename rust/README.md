# Rust

Minimal Rust app (standard library only, no crates) for the Rocketeers **Rust** environment.

- Build: `cargo build --release --locked` (binary: `target/release/app`, copied to `bin/app` on deploy)
- Run: `PORT=8080 ./bin/app` (listens on `127.0.0.1:$PORT`)
