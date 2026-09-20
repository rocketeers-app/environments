import Config

config :app, AppWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4000],
  debug_errors: true,
  secret_key_base: String.duplicate("dev", 22)
