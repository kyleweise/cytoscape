#' @title Cytoscape Network Chart
#'
#' @param df data.frame or tibble
#' @param id character column name where df used
#' @param source character column name where df used
#' @param target character column name where df used
#' @param nodes data.frame or tibble
#' @param edges data.frame or tibble
#' @param json pass single json object. This option over-rules all others.
#' @param message
#' @param width
#' @param height
#' @param elementId
#'
#' @import htmlwidgets
#' @importFrom jsonlite toJSON
#'
#' @export
#'
#' @examples
#'
#'  nodes <- data.frame(id = c('a','b'))
#'  edges <- data.frame(id = 'ab', source = 'a', target = 'b')
#'
#'  cytoscape(nodes = nodes, edges = edges)
#'
cytoscape <- function(df = NULL,
                      nodes = NULL,
                      edges = NULL,
                      json = NULL,
                      id = 'id',
                      source = 'source',
                      target = 'target',
                      message = NULL,
                      width = NULL,
                      height = NULL,
                      elementId = NULL) {

  # forward options using x
  x = list(
    message = message,
    nodes = nodes,
    edges = edges,
    json = json,
    layout = jsonlite::toJSON(list(name = 'grid', rows = 1),
                              auto_unbox = TRUE),
    node_style = jsonlite::toJSON(list('background-color' = '#666',
                                       'label' = 'data(id)'),
                                  auto_unbox = TRUE),
    edge_style = jsonlite::toJSON(list('width' = 3,
                                       'line-color' = '#ccc',
                                       'target-arrow-color' = '#ccc',
                                       'target-arrow-shape' = 'triangle'),
                                  auto_unbox = TRUE)
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'cytoscape',
    x,
    width = width,
    height = height,
    package = 'cytoscape',
    elementId = elementId
  )
}

#' Shiny bindings for cytoscape
#'
#' Output and render functions for using cytoscape within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a cytoscape
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name cytoscape-shiny
#'
#' @export
cytoscapeOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'cytoscape', width, height, package = 'cytoscape')
}

#' @rdname cytoscape-shiny
#' @export
renderCytoscape <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, cytoscapeOutput, env, quoted = TRUE)
}
