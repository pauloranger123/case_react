
export type NFT = {
  id: number
  image: string
  name: string
  creator: string
  price: number
  category: string
  blockchain: string
  description: string
  available: number
}

export const nfts: NFT[] = [
  {
    id: 1,
    image: '/images/jg2.png',
    name: 'Digital Ape #002',
    creator: 'Kurio Studio',
    price: 0.45,
    category: 'collectibles',
    blockchain: 'ethereum',
    description:
      'Uma peça digital da coleção Digital Ape, criada para colecionadores que apreciam arte digital.',
    available: 12,
  },
  {
    id: 2,
    image: '/images/jg3.png',
    name: 'Digital Ape #003',
    creator: 'Kurio Studio',
    price: 0.32,
    category: 'art',
    blockchain: 'polygon',
    description:
      'Uma obra digital da coleção Digital Ape, com identidade visual própria.',
    available: 8,
  },
  {
    id: 3,
    image: '/images/jg4.png',
    name: 'Digital Ape #004',
    creator: 'Kurio Studio',
    price: 0.28,
    category: 'collectibles',
    blockchain: 'ethereum',
    description:
      'Um colecionável digital da coleção Digital Ape disponível no marketplace Kurio.',
    available: 5,
  },
  {
    id: 4,
    image: '/images/jg1.png',
    name: 'Digital Ape #001',
    creator: 'Kurio Studio',
    price: 0.51,
    category: 'art',
    blockchain: 'polygon',
    description:
      'Uma peça da coleção Digital Ape que combina arte e colecionismo digital.',
    available: 10,
  },
]
