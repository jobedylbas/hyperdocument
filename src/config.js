const config = {}

config.web = {}

config.web.port = process.env.PORT || 3000
config.web.env = process.env.NODE_ENV || 'development'
config.web.isProd = process.env.NODE_ENV === 'production'

module.exports = config
