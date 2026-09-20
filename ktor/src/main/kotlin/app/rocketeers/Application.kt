package app.rocketeers

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*

fun main() {
    val port = System.getenv("PORT")?.toIntOrNull() ?: 8080
    val page = object {}.javaClass.getResource("/index.html")!!.readText()

    embeddedServer(Netty, port = port, host = "127.0.0.1") {
        routing {
            get("/") { call.respondText(page, ContentType.Text.Html) }
        }
    }.start(wait = true)
}
