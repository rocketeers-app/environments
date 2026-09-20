defmodule AppWeb.PageController do
  use Phoenix.Controller, formats: [:html]

  def home(conn, _params) do
    page = Path.join(:code.priv_dir(:app), "static/index.html")

    conn
    |> put_resp_content_type("text/html")
    |> send_file(200, page)
  end
end
