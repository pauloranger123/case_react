
import { http, HttpResponse } from 'msw'
import { nfts } from '../data/nfts'

type MockUser = {
  id: string
  name: string
  email: string
  passwordHash: string
}

type MockSession = {
  token: string
  userId: string
}

const USERS_KEY = 'kurio-mock-users'
const SESSIONS_KEY = 'kurio-mock-sessions'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', bytes)

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function publicUser(user: MockUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

function getSession(request: Request) {
  const authorization = request.headers.get('Authorization')
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : ''

  const sessions = readStorage<MockSession[]>(SESSIONS_KEY, [])
  const session = sessions.find((item) => item.token === token)

  if (!session) return null

  const users = readStorage<MockUser[]>(USERS_KEY, [])
  const user = users.find((item) => item.id === session.userId)

  return user ? { session, user } : null
}

export const handlers = [
  // Cadastro
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      name?: string
      email?: string
      password?: string
    }

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!name || !email || !password || password.length < 8) {
      return HttpResponse.json(
        { message: 'Informe nome, e-mail e senha com pelo menos 8 caracteres.' },
        { status: 400 },
      )
    }

    const users = readStorage<MockUser[]>(USERS_KEY, [])

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado.' },
        { status: 409 },
      )
    }

    const user: MockUser = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: await hashPassword(password),
    }

    users.push(user)
    writeStorage(USERS_KEY, users)

    const token = crypto.randomUUID()
    const sessions = readStorage<MockSession[]>(SESSIONS_KEY, [])

    sessions.push({ token, userId: user.id })
    writeStorage(SESSIONS_KEY, sessions)

    return HttpResponse.json(
      { user: publicUser(user), token },
      { status: 201 },
    )
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return HttpResponse.json(
        { message: 'Informe e-mail e senha.' },
        { status: 400 },
      )
    }

    const users = readStorage<MockUser[]>(USERS_KEY, [])
    const passwordHash = await hashPassword(password)

    const user = users.find(
      (item) =>
        item.email === email && item.passwordHash === passwordHash,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'E-mail ou senha inválidos.' },
        { status: 401 },
      )
    }

    const token = crypto.randomUUID()
    const sessions = readStorage<MockSession[]>(SESSIONS_KEY, [])

    sessions.push({ token, userId: user.id })
    writeStorage(SESSIONS_KEY, sessions)

    return HttpResponse.json({ user: publicUser(user), token })
  }),

  // Recuperar a sessão
  http.get('/api/auth/session', ({ request }) => {
    const current = getSession(request)

    if (!current) {
      return HttpResponse.json(
        { message: 'Sessão inválida ou expirada.' },
        { status: 401 },
      )
    }

    return HttpResponse.json({ user: publicUser(current.user) })
  }),

  // Logout
  http.post('/api/auth/logout', ({ request }) => {
    const authorization = request.headers.get('Authorization')
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : ''

    const sessions = readStorage<MockSession[]>(SESSIONS_KEY, [])
    writeStorage(
      SESSIONS_KEY,
      sessions.filter((session) => session.token !== token),
    )

    return new HttpResponse(null, { status: 204 })
  }),

  // Catálogo de NFTs
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)

    const search = url.searchParams.get('q')?.toLowerCase()
    const category = url.searchParams.get('category')
    const blockchain = url.searchParams.get('blockchain')

    const filteredNfts = nfts.filter((nft) => {
      const matchesSearch =
        !search ||
        nft.name.toLowerCase().includes(search) ||
        nft.creator.toLowerCase().includes(search)

      const matchesCategory =
        !category || category === 'all' || nft.category === category

      const matchesBlockchain =
        !blockchain ||
        blockchain === 'all' ||
        nft.blockchain === blockchain

      return matchesSearch && matchesCategory && matchesBlockchain
    })

    return HttpResponse.json({
      items: filteredNfts,
      total: filteredNfts.length,
    })
  }),

  // Detalhes de um NFT
  http.get('/api/nfts/:nftId', ({ params }) => {
    const id = Number(params.nftId)
    const nft = nfts.find((item) => item.id === id)

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado.' },
        { status: 404 },
      )
    }

    return HttpResponse.json(nft)
  }),
]
