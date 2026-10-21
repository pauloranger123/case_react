
export default function Hero() {
  return (
    <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#E7A04B]">
          Descubra a arte digital
        </p>

        <h1 className="text-4xl font-black uppercase leading-tight tracking-wide text-[#F5E9D8] sm:text-5xl">
          Seja dono do futuro da arte digital
        </h1>

        <p className="mt-5 max-w-md text-sm leading-7 text-[#BDAA97]">
          Explore coleções únicas, descubra novos artistas e encontre
          peças digitais que merecem fazer parte da sua coleção.
        </p>

        <a
          href="#catalogo"
          className="mt-7 inline-flex rounded-md bg-[#D99045] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#21140C] transition hover:bg-[#F0AA5B]"
        >
          Explorar NFTs
        </a>
      </div>

      <div className="mx-auto w-full max-w-md">
        <img
          src="/images/jg1.png"
          alt="NFT em destaque da coleção Kurio"
          className="aspect-[4/5] w-full rounded-xl object-cover"
        />
      </div>
    </section>
  )
}
