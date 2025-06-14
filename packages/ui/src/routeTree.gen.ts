/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppImport } from './routes/app'
import { Route as IndexImport } from './routes/index'
import { Route as AppIndexImport } from './routes/app/index'
import { Route as AppPageIdImport } from './routes/app/$pageId'

// Create/Update Routes

const AppRoute = AppImport.update({
  id: '/app',
  path: '/app',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRoute,
} as any).lazy(() => import('./routes/app/index.lazy').then((d) => d.Route))

const AppPageIdRoute = AppPageIdImport.update({
  id: '/$pageId',
  path: '/$pageId',
  getParentRoute: () => AppRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/app': {
      id: '/app'
      path: '/app'
      fullPath: '/app'
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/app/$pageId': {
      id: '/app/$pageId'
      path: '/$pageId'
      fullPath: '/app/$pageId'
      preLoaderRoute: typeof AppPageIdImport
      parentRoute: typeof AppImport
    }
    '/app/': {
      id: '/app/'
      path: '/'
      fullPath: '/app/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
  }
}

// Create and export the route tree

interface AppRouteChildren {
  AppPageIdRoute: typeof AppPageIdRoute
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppPageIdRoute: AppPageIdRoute,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/app': typeof AppRouteWithChildren
  '/app/$pageId': typeof AppPageIdRoute
  '/app/': typeof AppIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/app/$pageId': typeof AppPageIdRoute
  '/app': typeof AppIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/app': typeof AppRouteWithChildren
  '/app/$pageId': typeof AppPageIdRoute
  '/app/': typeof AppIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/app' | '/app/$pageId' | '/app/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/app/$pageId' | '/app'
  id: '__root__' | '/' | '/app' | '/app/$pageId' | '/app/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRoute: typeof AppRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRoute: AppRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/app"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/app": {
      "filePath": "app.tsx",
      "children": [
        "/app/$pageId",
        "/app/"
      ]
    },
    "/app/$pageId": {
      "filePath": "app/$pageId.tsx",
      "parent": "/app"
    },
    "/app/": {
      "filePath": "app/index.tsx",
      "parent": "/app"
    }
  }
}
ROUTE_MANIFEST_END */
