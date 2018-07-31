
callJS <- function() {
  message <- Filter(function(x) !is.symbol(x), as.list(parent.frame(1)))
  session <- shiny::getDefaultReactiveDomain()


  if(methods::is(message$id, "cytoscape")) {
    widget <- message$id
    message$id <- NULL
    widget$x$api <- c(widget$x$api, list(message))
    return(widget)
  }
  else if(is.character(messsage$id)) {
    method <- paste0("cytoscape:", message$method)
    session$sendCustomMessage(method, message)
    return(message$id)
  } else {
    stop("the `id` argument must be either a cytoscape htmlwidget or an ID of a cytoscape widget",
         call. = FALSE)
  }
}


#' Title
#'
#' @param id
#'
#' @return
#' @export
#'
#' @examples
toggle_mutation <- function(id, show = TRUE){
  method <- "toggle_mutation"
  callJS()
}



#' Title
#'
#' @param id
#' @param filter
#' @param options
#'
#' @return
#' @export
#'
#' @examples
cy_filter <- function(id, filter, options){
  method <- "filter"
  callJS()
}
