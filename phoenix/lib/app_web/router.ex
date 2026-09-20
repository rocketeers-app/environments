defmodule AppWeb.Router do
  use Phoenix.Router

  pipeline :browser do
    plug(:accepts, ["html"])
  end

  scope "/", AppWeb do
    pipe_through(:browser)

    get("/", PageController, :home)
  end
end
