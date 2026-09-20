defmodule App.MixProject do
  use Mix.Project

  def project do
    [
      app: :app,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      releases: [app: [include_executables_for: [:unix]]]
    ]
  end

  def application do
    [mod: {App.Application, []}, extra_applications: [:logger]]
  end

  defp deps do
    [
      {:phoenix, "~> 1.7.14"},
      {:bandit, "~> 1.6"}
    ]
  end
end
