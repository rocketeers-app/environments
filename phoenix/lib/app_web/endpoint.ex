defmodule AppWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :app

  plug(Plug.Static, at: "/", from: :app, gzip: false, only: ~w(assets favicon.ico robots.txt))
  plug(AppWeb.Router)
end
