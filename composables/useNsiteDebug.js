import { SimplePool } from 'nostr-tools/pool'
import * as nip19 from 'nostr-tools/nip19'

export const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.ditto.pub'
]

export const DEFAULT_BLOSSOMS = [
  'https://nostr.download',
  'https://blossom.primal.net',
  'https://blssm.us'
]

export const GATEWAY_HOSTS = [
  'https://nsite.lol',
  'https://nsite.run'
]

const ROOT_KIND = 15128
const NAMED_KIND = 35128
const LEGACY_KIND = 34128
const RELAY_LIST_KIND = 10002
const BLOSSOM_LIST_KIND = 10063

const sortNewestFirst = (left, right) => right.created_at - left.created_at

const normalizeWsUrl = (value = '') => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  try {
    const withProtocol = trimmed.includes('://') ? trimmed : `wss://${trimmed}`
    const parsed = new URL(withProtocol)

    if (parsed.protocol === 'http:') {
      parsed.protocol = 'ws:'
    }

    if (parsed.protocol === 'https:') {
      parsed.protocol = 'wss:'
    }

    return parsed.toString().replace(/\/$/, '')
  } catch {
    return ''
  }
}

const normalizeHttpUrl = (value = '') => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  try {
    const withProtocol = trimmed.includes('://') ? trimmed : `https://${trimmed}`
    const parsed = new URL(withProtocol)
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return ''
  }
}

const normalizeList = (values, normalizer) => {
  const rawValues = Array.isArray(values)
    ? values
    : String(values || '')
        .split(/[,\n]/)
        .map((value) => value.trim())
        .filter(Boolean)

  return Array.from(new Set(rawValues.map(normalizer).filter(Boolean)))
}

const getFirstTagValue = (tags, tagName) => tags.find((tag) => tag[0] === tagName)?.[1] || ''

const getTagValues = (tags, tagName) => tags.filter((tag) => tag[0] === tagName && tag[1]).map((tag) => tag[1])

const collectUrlTags = (tags, allowedNames = []) => {
  const urls = []

  for (const tag of tags || []) {
    if (!tag[1]) {
      continue
    }

    const nameMatches = allowedNames.length === 0 || allowedNames.includes(tag[0])
    const valueLooksLikeUrl = /^https?:\/\//.test(tag[1])

    if (nameMatches && valueLooksLikeUrl) {
      urls.push(tag[1])
    }
  }

  return Array.from(new Set(urls.map(normalizeHttpUrl).filter(Boolean)))
}

const normalizePath = (value = '/') => {
  const trimmed = value.trim() || '/'
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

const looksLikeFilePath = (path) => /\/[^/]+\.[a-z0-9]+$/i.test(path)

const toPathCandidates = (path) => {
  const normalized = normalizePath(path)
  const candidates = [normalized]

  if (normalized === '/') {
    candidates.push('/index.html')
    return candidates
  }

  if (normalized.endsWith('/')) {
    candidates.push(`${normalized}index.html`)
    return candidates
  }

  if (!looksLikeFilePath(normalized)) {
    candidates.push(`${normalized}/index.html`)
  }

  return candidates
}

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const chunkArray = (values, size) => {
  const chunks = []

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size))
  }

  return chunks
}

const decodePubkeyInput = (value) => {
  const input = String(value || '').trim()

  if (!input) {
    throw new Error('Enter an npub or raw hex pubkey to inspect an Nsite.')
  }

  if (/^[a-f0-9]{64}$/i.test(input)) {
    return {
      input,
      pubkey: input.toLowerCase(),
      npub: nip19.npubEncode(input.toLowerCase()),
      source: 'hex'
    }
  }

  const decoded = nip19.decode(input)

  if (decoded.type !== 'npub') {
    throw new Error('Only npub and raw hex pubkeys are supported right now.')
  }

  return {
    input,
    pubkey: decoded.data,
    npub: input,
    source: 'npub'
  }
}

const isValidNamedSiteIdentifier = (value = '') => /^[a-z0-9-]{1,13}$/.test(value) && !value.endsWith('-')

const pubkeyToBase36 = (pubkey) => BigInt(`0x${pubkey}`).toString(36).padStart(50, '0')

const buildGatewayLinks = ({ npub, pubkey, identifier = '' }) => {
  const cleanIdentifier = String(identifier || '').trim().toLowerCase()
  const canonicalNamedLabel = cleanIdentifier && isValidNamedSiteIdentifier(cleanIdentifier)
    ? `${pubkeyToBase36(pubkey)}${cleanIdentifier}`
    : ''

  return GATEWAY_HOSTS.map((host) => ({
    host,
    rootUrl: `${host.replace(/\/$/, '')}/${''}`,
    siteUrl: cleanIdentifier && canonicalNamedLabel
      ? `https://${canonicalNamedLabel}.${new URL(host).host}`
      : `https://${npub}.${new URL(host).host}`,
    namedUrl: canonicalNamedLabel
      ? `https://${canonicalNamedLabel}.${new URL(host).host}`
      : '',
    rootSiteUrl: `https://${npub}.${new URL(host).host}`,
    hasNamedGateway: Boolean(canonicalNamedLabel),
    confidence: cleanIdentifier && canonicalNamedLabel ? 'canonical' : cleanIdentifier ? 'needs-canonical-id' : 'canonical'
  }))
}

const queryEvents = async (relays, filter) => {
  const normalizedRelays = normalizeList(relays, normalizeWsUrl)
  const pool = new SimplePool()

  try {
    const events = await pool.querySync(normalizedRelays, filter)
    return [...events].sort(sortNewestFirst)
  } finally {
    pool.close(normalizedRelays)
  }
}

const queryLatest = async (relays, filter) => {
  const events = await queryEvents(relays, {
    ...filter,
    limit: filter.limit || 20
  })

  return events[0] || null
}

const parseRelayList = (event) => {
  if (!event) {
    return []
  }

  return Array.from(
    new Set(
      (event.tags || [])
        .filter((tag) => (tag[0] === 'r' || tag[0] === 'relay') && tag[1])
        .map((tag) => normalizeWsUrl(tag[1]))
        .filter(Boolean)
    )
  )
}

const parseManifestEvent = (event, mode = 'root') => {
  if (!event) {
    return null
  }

  const tags = event.tags || []
  const pathTags = tags.filter((tag) => tag[0] === 'path' && tag[1] && tag[2])
  const paths = pathTags.map((tag) => ({
    path: tag[1],
    hash: tag[2]
  }))

  return {
    id: event.id,
    kind: event.kind,
    pubkey: event.pubkey,
    created_at: event.created_at,
    identifier: getFirstTagValue(tags, 'd'),
    title: getFirstTagValue(tags, 'title'),
    description: getFirstTagValue(tags, 'description'),
    source: getFirstTagValue(tags, 'source'),
    servers: collectUrlTags(tags, ['server']),
    relayHints: collectUrlTags(tags, ['relay']),
    paths,
    raw: event,
    mode
  }
}

const parseLegacyFiles = (events) => {
  return events.map((event) => ({
    id: event.id,
    pubkey: event.pubkey,
    created_at: event.created_at,
    path: getFirstTagValue(event.tags || [], 'd'),
    hash: getFirstTagValue(event.tags || [], 'x'),
    raw: event
  })).filter((entry) => entry.path && entry.hash)
}

const resolveManifestPath = (manifest, requestedPath) => {
  if (!manifest) {
    return {
      requestedPath: normalizePath(requestedPath),
      candidates: toPathCandidates(requestedPath),
      match: null
    }
  }

  const candidates = toPathCandidates(requestedPath)
  const match = manifest.paths.find((entry) => candidates.includes(entry.path)) || null

  return {
    requestedPath: normalizePath(requestedPath),
    candidates,
    match
  }
}

const checkBlobAvailability = async (hash, servers) => {
  const checks = await Promise.all(
    normalizeList(servers, normalizeHttpUrl).map(async (server) => {
      const url = `${server}/${hash}`

      try {
        const response = await fetch(url, { method: 'HEAD' })
        return {
          server,
          ok: response.ok,
          status: response.status,
          contentType: response.headers.get('content-type') || '',
          contentLength: response.headers.get('content-length') || '',
          url
        }
      } catch (error) {
        return {
          server,
          ok: false,
          status: 0,
          error: error.message,
          url
        }
      }
    })
  )

  return checks
}

const inspectSite = async ({ pubkeyInput, identifier = '', path = '/', relays = DEFAULT_RELAYS, blossoms = DEFAULT_BLOSSOMS }) => {
  const identity = decodePubkeyInput(pubkeyInput)
  const normalizedRelays = normalizeList(relays, normalizeWsUrl)
  const normalizedBlossoms = normalizeList(blossoms, normalizeHttpUrl)
  const cleanIdentifier = String(identifier || '').trim().toLowerCase()
  const gatewayLinks = buildGatewayLinks({
    npub: identity.npub,
    pubkey: identity.pubkey,
    identifier: cleanIdentifier
  })

  const relayListEvent = await queryLatest(normalizedRelays, {
    kinds: [RELAY_LIST_KIND],
    authors: [identity.pubkey]
  })

  const relayHints = parseRelayList(relayListEvent)
  const manifestRelays = relayHints.length > 0 ? relayHints : normalizedRelays

  const [rootEvent, namedEvent, legacyEvents, blossomEvent, profileEvent] = await Promise.all([
    queryLatest(manifestRelays, { kinds: [ROOT_KIND], authors: [identity.pubkey] }),
    cleanIdentifier
      ? queryLatest(manifestRelays, { kinds: [NAMED_KIND], authors: [identity.pubkey], '#d': [cleanIdentifier] })
      : Promise.resolve(null),
    queryEvents(manifestRelays, cleanIdentifier
      ? { kinds: [LEGACY_KIND], authors: [identity.pubkey], '#d': [cleanIdentifier], limit: 100 }
      : { kinds: [LEGACY_KIND], authors: [identity.pubkey], limit: 100 }),
    queryLatest(manifestRelays, { kinds: [BLOSSOM_LIST_KIND], authors: [identity.pubkey] }),
    queryLatest(manifestRelays, { kinds: [0], authors: [identity.pubkey] })
  ])

  const rootManifest = parseManifestEvent(rootEvent, 'root')
  const namedManifest = parseManifestEvent(namedEvent, 'named')
  const activeManifest = cleanIdentifier ? namedManifest || rootManifest : rootManifest
  const blossomServers = Array.from(new Set([
    ...collectUrlTags(blossomEvent?.tags || []),
    ...(activeManifest?.servers || []),
    ...normalizedBlossoms
  ]))
  const pathResolution = resolveManifestPath(activeManifest, path)
  const blobChecks = pathResolution.match
    ? await checkBlobAvailability(pathResolution.match.hash, blossomServers)
    : []

  return {
    identity,
    identifier: cleanIdentifier,
    requestedPath: normalizePath(path),
    relays: normalizedRelays,
    relayList: {
      event: relayListEvent,
      urls: relayHints
    },
    profile: profileEvent ? safeJsonParse(profileEvent.content) : null,
    manifests: {
      root: rootManifest,
      named: namedManifest,
      active: activeManifest
    },
    legacy: {
      events: legacyEvents,
      files: parseLegacyFiles(legacyEvents)
    },
    blossoms: {
      event: blossomEvent,
      urls: blossomServers
    },
    pathResolution,
    blobChecks,
    gatewayLinks
  }
}

const toSiteKey = (manifest) => `${manifest.pubkey}:${manifest.kind}:${manifest.identifier || 'root'}`

const manifestToExplorerItem = (manifest) => {
  const npub = nip19.npubEncode(manifest.pubkey)
  const links = buildGatewayLinks({
    npub,
    pubkey: manifest.pubkey,
    identifier: manifest.identifier
  })

  return {
    id: toSiteKey(manifest),
    kind: manifest.kind,
    mode: manifest.kind === ROOT_KIND ? 'Root site' : 'Named site',
    pubkey: manifest.pubkey,
    npub,
    identifier: manifest.identifier,
    title: manifest.title || (manifest.identifier ? `/${manifest.identifier}` : npub.slice(0, 18)),
    description: manifest.description,
    pathCount: manifest.paths.length,
    updatedAt: manifest.created_at,
    servers: manifest.servers,
    source: manifest.source,
    uploader: null,
    links,
    event: manifest.raw
  }
}

const buildProfileMap = async (relays, pubkeys = []) => {
  const uniquePubkeys = Array.from(new Set(pubkeys.filter(Boolean)))

  if (uniquePubkeys.length === 0) {
    return {}
  }

  const batches = chunkArray(uniquePubkeys, 80)
  const events = await Promise.all(
    batches.map((authors) => queryEvents(relays, {
      kinds: [0],
      authors,
      limit: authors.length
    }))
  )

  const map = {}

  for (const group of events) {
    for (const event of group) {
      if (map[event.pubkey]) {
        continue
      }

      const content = safeJsonParse(event.content) || {}

      map[event.pubkey] = {
        name: content.display_name || content.name || '',
        picture: content.picture || '',
        nip05: content.nip05 || '',
        about: content.about || ''
      }
    }
  }

  return map
}

const exploreSites = async ({ relays = DEFAULT_RELAYS, limit = 300 }) => {
  const normalizedRelays = normalizeList(relays, normalizeWsUrl)
  const [rootEvents, namedEvents] = await Promise.all([
    queryEvents(normalizedRelays, { kinds: [ROOT_KIND], limit }),
    queryEvents(normalizedRelays, { kinds: [NAMED_KIND], limit })
  ])

  const manifests = [...rootEvents, ...namedEvents]
    .map((event) => parseManifestEvent(event, event.kind === ROOT_KIND ? 'root' : 'named'))
    .filter(Boolean)
    .sort((left, right) => right.created_at - left.created_at)

  const deduped = []
  const seen = new Set()

  for (const manifest of manifests) {
    const key = toSiteKey(manifest)
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(manifestToExplorerItem(manifest))
    }
  }

  const profileMap = await buildProfileMap(normalizedRelays, deduped.map((site) => site.pubkey))
  const withProfiles = deduped.map((site) => ({
    ...site,
    uploader: {
      name: profileMap[site.pubkey]?.name || '',
      picture: profileMap[site.pubkey]?.picture || '',
      nip05: profileMap[site.pubkey]?.nip05 || ''
    }
  }))

  return {
    relays: normalizedRelays,
    sites: withProfiles,
    counts: {
      total: withProfiles.length,
      root: withProfiles.filter((site) => site.kind === ROOT_KIND).length,
      named: withProfiles.filter((site) => site.kind === NAMED_KIND).length
    }
  }
}

export const useNsiteDebug = () => ({
  DEFAULT_RELAYS,
  DEFAULT_BLOSSOMS,
  GATEWAY_HOSTS,
  decodePubkeyInput,
  normalizeRelayList: (values) => normalizeList(values, normalizeWsUrl),
  normalizeBlossomList: (values) => normalizeList(values, normalizeHttpUrl),
  isValidNamedSiteIdentifier,
  pubkeyToBase36,
  buildGatewayLinks,
  inspectSite,
  exploreSites
})
