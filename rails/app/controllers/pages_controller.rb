class PagesController < ApplicationController
  def home
    render html: Rails.root.join("app/views/pages/home.html").read.html_safe, layout: false
  end
end
