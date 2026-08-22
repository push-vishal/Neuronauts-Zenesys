import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dwcnkuazzjrqvcchkocr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XZgIKeNEgCEnMHGlM0DWNg_7W8WFOJz';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to upload invoice documents to Supabase Storage
 */
export async function uploadInvoiceDocument(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `invoices/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.warn('Storage upload warning:', error.message);
      return {
        path: filePath,
        publicUrl: `${supabaseUrl}/storage/v1/object/public/invoices/${filePath}`,
        simulated: true,
      };
    }

    const { data: publicUrlData } = supabase.storage.from('invoices').getPublicUrl(filePath);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      simulated: false,
    };
  } catch (err) {
    console.error('Storage Exception:', err);
    return {
      path: filePath,
      publicUrl: URL.createObjectURL(file),
      simulated: true,
    };
  }
}

/**
 * Helper to upload expense receipts to Supabase Storage
 */
export async function uploadExpenseReceipt(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `receipts/${fileName}`;

  try {
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.warn('Storage receipt upload warning:', error.message);
      return {
        path: filePath,
        publicUrl: `${supabaseUrl}/storage/v1/object/public/receipts/${filePath}`,
        simulated: true,
      };
    }

    const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(filePath);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      simulated: false,
    };
  } catch (err) {
    console.error('Storage Receipt Exception:', err);
    return {
      path: filePath,
      publicUrl: URL.createObjectURL(file),
      simulated: true,
    };
  }
}
