
class Router {
  _options = {}
  _routes = []

  constructor(options = {}) {
    this.options = options;

    this.get = this._addRoutes.bind(this, 'get');
    this.post = this._addRoutes.bind(this, 'post');
    this.put = this._addRoutes.bind(this, 'put');
    this.delete = this._addRoutes.bind(this, 'delete');
    this.patch = this._addRoutes.bind(this, 'patch');
    this.main = this.main.bind(this)
  }

  _addRoutes(method, path, handler) {
    this._routes.push({ method, path, handler })
  }

  async main(args) {
    const route = getRoute(this._routes, args);
    if (!route) {
      return defaultUnknownRoute(
        this._routes,
        normalizeRequestPath(args.__ow_path),
        args.__ow_method
      )
    }

    try {
      return await route.handler(args);
    } catch (error) {
      console.log('Error: ', error.message)
      return {
        statusCode: 500,
        body: `<h1>Internal Server Error</h1>`
      }
    }
  }
}

function getRoute(routes, args) {
  const requestMethod = args.__ow_method;
  const requestPath = normalizeRequestPath(args.__ow_path ?? '/')

  let route = routes.find(r => {
    const routePath = r.path.toLowerCase();
    const routeMethod = r.method.toLowerCase();
    return requestPath === routePath && requestMethod === routeMethod
  })

  if (!route) {
    let tokens
    route = routes.find(r => {
      if (requestMethod !== r.method) {
        return false
      }
      tokens = doPathPartsMatch(requestPath, r)
      return !!tokens
    })

    if (tokens) {
      args.params = {
        ...(args.params ?? {}),
        ...tokens,
      }
    }
  }
  return route
}

function normalizeRequestPath(path) {
  let p = (!path || path.trim() === '') ? '/' : path.trim()
  return p === '/' 
    ? '/' : 
    p.replace(/\/$/, '')
}

function doPathPartsMatch(eventPath, route) {
  const eventPathParts = eventPath.split('/')
  const routePathParts = route.path.split('/')

  // Fail fast if they're not the same length
  if (eventPathParts.length !== routePathParts.length) {
    return false
  }
  let tokens = {}

  // Start with 1 because the url should always start with the first back slash
  for (let i = 1; i < eventPathParts.length; ++i) {
    const pathPart = eventPathParts[i]
    const routePart = routePathParts[i]

    // If the part is a curly braces value
    let pathPartMatch = /\{(\w+)}/g.exec(routePart)
    if (pathPartMatch) {
      tokens[pathPartMatch[1]] = pathPart
      continue
    }

    // Fail fast if a part doesn't match
    if (routePart !== pathPart) {
      return false
    }
  }

  return tokens
}

function defaultUnknownRoute(routes, path, httpMethod) {
  const methodMatches = routes
    .filter(r => path === r.path.toLowerCase())
    .map(r => r.method.toUpperCase())

  if (methodMatches.length > 0) {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Methods': methodMatches.join(', ')
      }
    }
  }

  return {
    statusCode: 404,
    body: `${httpMethod.toUpperCase()}: ${path}`
  }
}

module.exports = Router;
