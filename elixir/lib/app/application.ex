defmodule App.Application do
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    port = Application.get_env(:app, :port, 4000)

    children = [
      {Bandit, plug: App.Router, ip: {127, 0, 0, 1}, port: port}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: App.Supervisor)
  end
end
