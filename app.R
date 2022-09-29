# Imports
library(shiny)

# UI
ui <- function() {
  htmlTemplate("public/index.html")
}

# Server
server <- function(input, output, session) {

}

# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

# Run App
shinyApp(ui, server)
