# Imports
library(shiny)

# UI
ui <- function() {
  htmlTemplate("public/index.html")
}

# Server
server <- function(input, output, session) {

  # Communciation with the front end
  observeEvent(input$checkComms, {
    print(input$checkComms$data)
    session$sendCustomMessage(type = "returnComms",
      message = list(data = "Comms check.")
    )
  })

}

# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

# Run App
shinyApp(ui, server)
