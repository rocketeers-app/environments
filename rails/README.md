# Ruby on Rails

Minimal Rails 8 app (Ruby 3.4) whose root page renders the Rocketeers placeholder.

- Production uses sqlite at `storage/production.sqlite3`; `rails db:migrate` creates it.
- `SECRET_KEY_BASE` must be set in production; Rocketeers writes one into the env file.
- HTTPS redirects are off unless `RAILS_FORCE_SSL=1`, so the plain-HTTP health check gets a 200.
