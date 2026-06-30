import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router"

import Error from "~/components/ErrorBoundary"
import Header from "~/components/Header"
import tailwindStyles from "~/styles/tailwind.css?url"

import type {Route} from "./+types/root"

const App = () => {
    return (
        <html lang="en">
            <head>
                <title>nyc 2026</title>
                <link rel="stylesheet" href={tailwindStyles} />
                <link rel="icon" href="https://fav.farm/🗽" />
                <meta charSet="utf-8" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <meta
                    httpEquiv="Content-Type"
                    content="text/html;charset=utf-8"
                />

                <Meta />
                <Links />
            </head>

            <body className="bg-white text-black">
                <div className="min-h-screen">
                    <Header />

                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export const ErrorBoundary = ({error}: Route.ErrorBoundaryProps) => {
    return (
        <html lang="en">
            <head>
                <title>nyc 2026</title>
                <link rel="stylesheet" href={tailwindStyles} />
                <link rel="icon" href="https://fav.farm/🗽" />
                <meta charSet="utf-8" />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />

                <meta
                    httpEquiv="Content-Type"
                    content="text/html;charset=utf-8"
                />

                <Meta />
                <Links />
            </head>

            <body className="bg-white text-black">
                <Error error={error} />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default App
