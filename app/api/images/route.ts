// app/api/images/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') || 'products';

  const allowedFolders: Record<string, string> = {
    products: 'images/products',
    carousel: 'images/carousel',
    services: 'images/services',
  };

  const targetDir = allowedFolders[folder] || allowedFolders.products;
  const fullPath = path.join(process.cwd(), 'public', targetDir);

  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(fullPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
    const images = files
      .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map((file) => `/${targetDir}/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar imagens' }, { status: 500 });
  }
}