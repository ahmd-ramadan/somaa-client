import fs from 'fs'

// Load from DB or file (here it's just JSON)
const domains = JSON.parse(fs.readFileSync('../json/allowed_images_domains.json', 'utf-8'))

const config = `
/** This file is auto-generated before build **/
export default {
  images: {
    domains: ${JSON.stringify(domains)}
  }
}
`

fs.writeFileSync('./next.config.mjs', config)

console.log('✅ next.config.mjs updated with domains:', domains)
