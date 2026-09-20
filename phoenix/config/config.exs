import Config

config :app, AppWeb.Endpoint,
  adapter: Bandit.PhoenixAdapter,
  render_errors: [formats: [html: AppWeb.ErrorHTML], layout: false]

config :logger, level: :info

import_config "#{config_env()}.exs"
