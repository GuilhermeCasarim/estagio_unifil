const fs = require('fs')
const path = require('path')

const buildFullPath = (basePath, routePath) => {
	const normalizedBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
	const normalizedRoute = routePath === '/' ? '' : routePath
	return `${normalizedBase}${normalizedRoute}` || '/'
}

const toHelperName = (fullPath) => {
	const normalized = fullPath
		.replace(/^\/+/, '')
		.replace(/\/+$/g, '')
		.replace(/\//g, '_')
		.replace(/[:*]/g, '')
		.replace(/[^a-zA-Z0-9_]/g, '')
		.toLowerCase()

	return normalized ? `${normalized}_path` : 'root_path'
}

const getActionName = (routeLayer) => {
	const routeStack = routeLayer.route && routeLayer.route.stack ? routeLayer.route.stack : []
	const actionLayer = routeStack[routeStack.length - 1]
	const handlerName = actionLayer && actionLayer.handle && actionLayer.handle.name ? actionLayer.handle.name : 'handler'
	return handlerName.replace(/^bound\s+/, '')
}

const getControllerLabelFromFile = (fileName) => {
	return fileName
		.replace(/\.js$/i, '')
		.replace(/controller$/i, '')
		.toLowerCase()
}

const buildControllerActionMap = (controllersDir) => {
	const controllerActionMap = new Map()

	if (!fs.existsSync(controllersDir)) {
		return controllerActionMap
	}

	const files = fs.readdirSync(controllersDir).filter((file) => file.endsWith('.js'))

	files.forEach((file) => {
		const controllerModule = require(path.join(controllersDir, file))
		const controllerLabel = getControllerLabelFromFile(file)

		if (typeof controllerModule === 'function') {
			const actionName = controllerModule.name || 'call'
			controllerActionMap.set(controllerModule, `${controllerLabel}#${actionName}`)
			return
		}

		if (!controllerModule || typeof controllerModule !== 'object') {
			return
		}

		Object.keys(controllerModule).forEach((key) => {
			if (typeof controllerModule[key] === 'function') {
				controllerActionMap.set(controllerModule[key], `${controllerLabel}#${key}`)
			}
		})

		const proto = Object.getPrototypeOf(controllerModule)
		if (!proto) {
			return
		}

		Object.getOwnPropertyNames(proto)
			.filter((name) => name !== 'constructor' && typeof controllerModule[name] === 'function')
			.forEach((name) => {
				controllerActionMap.set(controllerModule[name], `${controllerLabel}#${name}`)
			})
	})

	return controllerActionMap
}

const resolveControllerAction = (routeLayer, controllerActionMap) => {
	const routeStack = routeLayer.route && routeLayer.route.stack ? routeLayer.route.stack : []

	for (let index = routeStack.length - 1; index >= 0; index -= 1) {
		const candidate = routeStack[index]
		if (candidate && candidate.handle && controllerActionMap.has(candidate.handle)) {
			return controllerActionMap.get(candidate.handle)
		}
	}

	return `unknown#${getActionName(routeLayer)}`
}

const extractRouteRows = (basePath, router, controllerActionMap) => {
	if (!router || !router.stack) {
		return []
	}

	return router.stack
		.filter((layer) => layer.route)
		.flatMap((layer) => {
			const fullPath = buildFullPath(basePath, layer.route.path)
			const methods = Object.keys(layer.route.methods)
				.filter((method) => layer.route.methods[method])
				.map((method) => method.toUpperCase())

			return methods.map((method) => ({
				'Path / Url': toHelperName(fullPath),
				'HTTP Verb': method,
				'Path': fullPath,
				'Controller#Action': resolveControllerAction(layer, controllerActionMap)
			}))
		})
}

const getMappedRoutes = (registeredRouters, controllersDir) => {
	const controllerActionMap = buildControllerActionMap(controllersDir)

	return registeredRouters.flatMap((moduleRef) =>
		extractRouteRows(moduleRef.basePath, moduleRef.router, controllerActionMap)
	)
		.sort((left, right) => {
			const controllerCompare = String(left['Controller#Action']).localeCompare(String(right['Controller#Action']))
			if (controllerCompare !== 0) {
				return controllerCompare
			}

			return String(left['HTTP Verb']).localeCompare(String(right['HTTP Verb']))
		})
}

const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;')

const renderRoutesPage = (routes) => {
	const rows = routes.map((route) => `
		<tr class="route-row" data-path="${escapeHtml(route['Path']).toLowerCase()}">
			<td>${escapeHtml(route['Path / Url'])}</td>
			<td>${escapeHtml(route['HTTP Verb'])}</td>
			<td>${escapeHtml(route['Path'])}</td>
			<td>${escapeHtml(route['Controller#Action'])}</td>
		</tr>
	`).join('')

	return `<!doctype html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Routes</title>
	<style>
		:root {
			--bg: #1e1f24;
			--row-dark: #2f3136;
			--row-light: #44464b;
			--text: #f3f3f3;
			--muted: #c7c7c7;
			--red: #ff2a2a;
			--line: #bcbcbc;
		}
		* { box-sizing: border-box; }
		body {
			margin: 0;
			padding: 8px 6px;
			font-family: Arial, Helvetica, sans-serif;
			background: var(--bg);
			color: var(--text);
		}
		h1 {
			margin: 0 0 12px;
			color: var(--red);
			font-size: 34px;
			font-weight: 700;
		}
		p {
			margin: 0 0 12px;
			color: #ececec;
			font-size: 26px;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			table-layout: fixed;
		}
		thead tr.head-1 th {
			color: #ffffff;
			font-size: 30px;
			padding: 10px 8px;
			text-align: center;
			border-bottom: 3px solid var(--line);
		}
		thead tr.head-2 th {
			background: transparent;
			padding: 8px;
			font-size: 30px;
			text-align: center;
		}
		thead tr.head-2 th:first-child {
			color: var(--red);
			text-decoration: underline;
		}
		thead tr.head-2 th:nth-child(3) {
			text-align: left;
		}
		tbody td {
			padding: 14px 16px;
			font-size: 29px;
			color: #fafafa;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		tbody tr:nth-child(odd) td { background: var(--row-dark); }
		tbody tr:nth-child(even) td { background: var(--row-light); }
		#pathMatch {
			width: 280px;
			height: 34px;
			padding: 4px 10px;
			font-size: 28px;
			color: #f6f6f6;
			background: #2b2d32;
			border: 1px solid #8a8a8a;
			outline: none;
		}
		#pathMatch::placeholder { color: #9da0ad; }
		.footer {
			margin-top: 10px;
			color: var(--muted);
			font-size: 22px;
		}
		code {
			background: #2b2d32;
			padding: 2px 6px;
			border-radius: 4px;
			color: #fff;
		}
	</style>
</head>
<body>
	<h1>Routes</h1>
	<p>Routes match in priority from top to bottom</p>
	<table>
		<thead>
			<tr class="head-1">
				<th>Helper</th>
				<th>HTTP Verb</th>
				<th>Path</th>
				<th>Controller#Action</th>
			</tr>
			<tr class="head-2">
				<th>Path / Url</th>
				<th></th>
				<th>
					<input id="pathMatch" type="text" placeholder="Path Match" />
				</th>
				<th></th>
			</tr>
		</thead>
		<tbody>${rows}</tbody>
	</table>
	<div class="footer">Total: <strong id="routesTotal">${routes.length}</strong></div>
	<script>
		const pathMatchInput = document.getElementById('pathMatch')
		const routeRows = Array.from(document.querySelectorAll('.route-row'))
		const routesTotal = document.getElementById('routesTotal')

		pathMatchInput.addEventListener('input', () => {
			const term = pathMatchInput.value.trim().toLowerCase()
			let visibleCount = 0

			routeRows.forEach((row) => {
				const pathValue = row.dataset.path || ''
				const visible = !term || pathValue.includes(term)
				row.style.display = visible ? '' : 'none'
				if (visible) visibleCount += 1
			})

			routesTotal.textContent = visibleCount
		})
	</script>
</body>
</html>`
}

const registerRoutesExplorer = (app, registeredRouters, options = {}) => {
	const environment = options.environment || process.env.NODE_ENV || 'development'

	if (environment !== 'development') {
		return
	}

	const controllersDir = options.controllersDir || path.join(__dirname, 'controllers')

	app.get('/routes', (req, res) => {
		const routes = getMappedRoutes(registeredRouters, controllersDir)
		const wantsJsonByQuery = String(req.query.format || '').toLowerCase() === 'json'
		const accepts = req.accepts(['html', 'json'])

		if (wantsJsonByQuery || accepts === 'json') {
			return res.json({ routes })
		}

		return res.type('html').send(renderRoutesPage(routes))
	})
}

module.exports = registerRoutesExplorer