defmodule App.Router do
  @moduledoc false
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    page = Path.join(:code.priv_dir(:app), "static/index.html")

    conn
    |> put_resp_content_type("text/html")
    |> send_file(200, page)
  end

  match _ do
    send_resp(conn, 404, "Not found")
  end
end
