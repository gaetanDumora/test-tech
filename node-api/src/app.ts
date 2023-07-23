import fastify from 'fastify'
import { startServer } from './plugins/server.js'
import { loadServerConfig } from './plugins/config/server.config.js'

const main = async () => {
    process.on('unhandledRejection', (err) => {
        console.error(err)
        process.exit(1)
    })

    const server = fastify(loadServerConfig)

    await server.register(startServer)

    await server.listen({
        port: parseInt(process.env.PORT!),
        host: '127.0.0.1',
    })
    for (const signal of ['SIGINT', 'SIGTERM']) {
        // Use once() so that double signals exits the app
        process.once(signal, () => {
            server.log.info({ signal }, 'closing application')
            server
                .close()
                .then(() => {
                    server.log.info({ signal }, 'application closed')
                    process.exit(0)
                })
                .catch((err) => {
                    server.log.error({ err }, 'Error closing the application')
                    process.exit(1)
                })
        })
    }
}

main()
