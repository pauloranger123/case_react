
import { http, HttpResponse } from 'msw'
import { nfts } from '../data/nfts'

const STOCK_KEY = 'kurio-mock-stock'

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
const ORDERS_KEY = 'kurio-mock-orders'

type MockOrder = {
  number: string
  idempotencyKey: string
  status: 'confirmed'
  name: string
  email: string
  walletName: string
  walletAddress: string
  walletNetwork: string
  items: Array<{
    id: number
    name: string
    price: number
    available: number
    quantity: number
  }>
  subtotal: number
  discount: number
  total: number
  createdAt: string
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}


function getStock() {
  const savedStock = readStorage<Record<number, number>>(
    STOCK_KEY,
    {},
  )

  return Object.fromEntries(
    nfts.map((nft) => [
      nft.id,
      savedStock[nft.id] ?? nft.available,
    ]),
  ) as Record<number, number>
}


function saveStock(stock: Record<number, number>) {
  writeStorage(STOCK_KEY, stock)
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

    const stock = getStock()

    const updatedNfts = nfts.map((nft) => ({
      ...nft,
      available: stock[nft.id],
    }))

    const filteredNfts = updatedNfts.filter((nft) => {
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

    const stock = getStock()

    return HttpResponse.json({
      ...nft,
      available: stock[nft.id],
    })
  }),


  // Validar cupom de desconto
  http.post('/api/coupons/validate', async ({ request }) => {
    const body = (await request.json()) as {
      code?: string
      subtotal?: number
    }

    const code = body.code?.trim().toUpperCase()
    const subtotal = body.subtotal

    if (!code || typeof subtotal !== 'number' || !Number.isFinite(subtotal) || subtotal < 0) {
      return HttpResponse.json(
        { message: 'Informe um cupom e um subtotal válido.' },
        { status: 400 },
      )
    }

    const coupons: Record<string, { discountPercent: number }> = {
      KURIO10: { discountPercent: 10 },
      KURIO20: { discountPercent: 20 },
    }

    const coupon = coupons[code]

    if (!coupon) {
      return HttpResponse.json(
        { message: 'Cupom inválido ou expirado.' },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      code,
      discountPercent: coupon.discountPercent,
      discountAmount: Number((subtotal * coupon.discountPercent / 100).toFixed(8)),
    })
  }),

  // Validar itens, preços e estoque antes do checkout
http.post('/api/checkout/validate', async ({ request }) => {
  const body = (await request.json()) as {
    items?: Array<{
      id: number
      quantity: number
      price: string
    }>
    couponCode?: string
  }

  if (
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    body.items.some(
      (item) =>
        !Number.isInteger(item.id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        typeof item.price !== 'string' ||
        !Number.isFinite(Number(item.price)) ||
        Number(item.price) < 0,
    )
  ) {
    return HttpResponse.json(
      { message: 'Os itens do pedido são inválidos.' },
      { status: 400 },
    )
  }

  const validatedItems = []

  for (const item of body.items) {
    const nft = nfts.find((candidate) => candidate.id === item.id)

      if (!nft) {
        return HttpResponse.json(
          { message: `NFT de ID ${item.id} não encontrado.` },
          { status: 400 },
        )
      }

      const stock = getStock()
      const available = stock[nft.id]

    if (!nft) {
      return HttpResponse.json(
        { message: `NFT de ID ${item.id} não encontrado.` },
        { status: 400 },
      )
    }

    if (Number(item.price) !== nft.price) {
      return HttpResponse.json(
        { message: `O preço de "${nft.name}" foi alterado. Atualize o carrinho.` },
        { status: 409 },
      )
    }

    if (item.quantity > available) {
        return HttpResponse.json(
          { message: 'Estoque insuficiente para este NFT.' },
          { status: 409 },
        )
      }

    validatedItems.push({
      id: nft.id,
      name: nft.name,
      price: nft.price,
      available,
      quantity: item.quantity,
    })
  }

  const subtotal = validatedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  let discountPercent = 0

  if (body.couponCode) {
    const coupons: Record<string, number> = {
      KURIO10: 10,
      KURIO20: 20,
    }

    const coupon = coupons[body.couponCode.trim().toUpperCase()]

    if (coupon === undefined) {
      return HttpResponse.json(
        { message: 'Cupom inválido ou expirado.' },
        { status: 400 },
      )
    }

    discountPercent = coupon
  }

  const discount = Number(
    (subtotal * discountPercent / 100).toFixed(8),
  )

  return HttpResponse.json({
    valid: true,
    items: validatedItems,
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
  })
}),
// Criar pedido simulado
http.post('/api/checkout/orders', async ({ request }) => {
  const body = (await request.json()) as {
    items?: Array<{
      id: number
      quantity: number
      price: string
    }>
    idempotencyKey?: string
    couponCode?: string
    name?: string
    email?: string
    walletName?: string
    walletAddress?: string
    walletNetwork?: string
  }

  const idempotencyKey = body.idempotencyKey

if (typeof idempotencyKey !== 'string' || !idempotencyKey.trim()) {
  return HttpResponse.json(
    { message: 'A chave da tentativa de compra é obrigatória.' },
    { status: 400 },
  )
}

  const existingOrders = readStorage<MockOrder[]>(ORDERS_KEY, [])
  const existingOrder = existingOrders.find(
    (order) => order.idempotencyKey === idempotencyKey,
  )

  if (existingOrder) {
    return HttpResponse.json(existingOrder, { status: 200 })
  }

  if (
    typeof body.name !== 'string' ||
    !body.name.trim() ||
    typeof body.email !== 'string' ||
    !body.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
    typeof body.walletName !== 'string' ||
    !body.walletName.trim() ||
    typeof body.walletAddress !== 'string' ||
    !body.walletAddress.trim() ||
    typeof body.walletNetwork !== 'string' ||
    !body.walletNetwork.trim()
  ) {
    return HttpResponse.json(
      { message: 'Confira os dados do comprador e da carteira.' },
      { status: 400 },
    )
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return HttpResponse.json(
      { message: 'O pedido precisa conter pelo menos um NFT.' },
      { status: 400 },
    )
  }

  const validationResponse = await fetch('/api/checkout/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: body.items,
      couponCode: body.couponCode,
    }),
  })

  const validation = await validationResponse.json()

  if (!validationResponse.ok) {
    return HttpResponse.json(validation, {
      status: validationResponse.status,
    })
  }
  const stock = getStock()

  for (const item of validation.items) {
    stock[item.id] -= item.quantity
  }

  saveStock(stock)

  
const order: MockOrder = {
  number: `KUR-${Date.now().toString().slice(-8)}`,
  idempotencyKey,
  status: 'confirmed',
  name: body.name.trim(),
  email: body.email.trim(),
  walletName: body.walletName,
  walletAddress: body.walletAddress,
  walletNetwork: body.walletNetwork,
  items: validation.items,
  subtotal: validation.subtotal,
  discount: validation.discount,
  total: validation.total,
  createdAt: new Date().toISOString(),
}

const orders = readStorage<MockOrder[]>(ORDERS_KEY, [])
orders.push(order)
writeStorage(ORDERS_KEY, orders)

return HttpResponse.json(order, { status: 201 })

    
}),
]

