'use server';

import { revalidateTag } from 'next/cache';

export default async function revalidate(tag: string) {
  return revalidateTag(tag);
}