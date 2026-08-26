'use server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/["']/g, "").trim();
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)?.replace(/["']/g, "").trim();

const supabaseAdmin = createClient(supabaseUrl!, supabaseKey!, { 
  auth: { persistSession: false } 
});

export async function uploadImageServer(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("Nenhum arquivo enviado.");

    // Gera um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz o upload para o bucket 'imagens-salao' no Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('imagens-salao')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      throw new Error("Erro no Storage: " + uploadError.message);
    }

    // Pega a URL pública permanente da imagem na nuvem
    const { data } = supabaseAdmin.storage
      .from('imagens-salao')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    throw new Error(err.message || "Erro ao fazer upload da imagem.");
  }
}