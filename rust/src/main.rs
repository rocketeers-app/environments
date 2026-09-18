use std::env;
use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

const PAGE: &str = include_str!("index.html");

fn handle(stream: TcpStream) -> std::io::Result<()> {
    let mut reader = BufReader::new(stream.try_clone()?);
    let mut request_line = String::new();
    reader.read_line(&mut request_line)?;

    loop {
        let mut line = String::new();
        if reader.read_line(&mut line)? == 0 || line == "\r\n" || line == "\n" {
            break;
        }
    }

    let mut parts = request_line.split_whitespace();
    let method = parts.next().unwrap_or("");
    let path = parts.next().unwrap_or("");

    let (status, content_type, body) = match (method, path) {
        ("GET", "/") | ("HEAD", "/") => ("200 OK", "text/html; charset=utf-8", PAGE),
        (_, "/") => ("405 Method Not Allowed", "text/plain; charset=utf-8", "Method Not Allowed"),
        _ => ("404 Not Found", "text/plain; charset=utf-8", "Not Found"),
    };

    let mut stream = stream;
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    )?;
    if method != "HEAD" {
        stream.write_all(body.as_bytes())?;
    }
    stream.flush()
}

fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("127.0.0.1:{port}");
    let listener = TcpListener::bind(&addr).expect("failed to bind");
    println!("listening on {addr}");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                thread::spawn(move || {
                    let _ = handle(stream);
                });
            }
            Err(error) => eprintln!("connection failed: {error}"),
        }
    }
}
