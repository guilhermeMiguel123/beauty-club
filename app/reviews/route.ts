import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDOYabDZqaPwwlHED-wOG6V4-V0nv0Pq4o";

  try {
    // 1. Busca automática do Place ID usando o nome e a cidade do salão
    const searchQuery = encodeURIComponent("Beauty Club Anapolis Goias");
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${API_KEY}`
    );
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return NextResponse.json({ error: "Local não encontrado no Google Maps." }, { status: 404 });
    }

    const placeId = searchData.results[0].place_id;

    // 2. Busca os detalhes e as avaliações reais usando o ID encontrado
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,name,rating&language=pt-BR&key=${API_KEY}`,
      { next: { revalidate: 86400 } } // Cache de 24h para economizar requisições
    );
    const detailsData = await detailsRes.json();

    if (detailsData.result && detailsData.result.reviews) {
      // Filtra apenas avaliações com nota 4 ou 5 e que tenham texto escrito
      const avaliacoesBoas = detailsData.result.reviews.filter(
        (rev: any) => rev.rating >= 4 && rev.text && rev.text.trim() !== ""
      );
      return NextResponse.json(avaliacoesBoas);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar avaliações." }, { status: 500 });
  }
}