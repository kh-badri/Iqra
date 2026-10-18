import { db, type BookmarkItem } from './db';

export async function exportBookmarksToJson(): Promise<{ count: number; filename: string }> {
  const bookmarks = await db.bookmarks.toArray();
  const exportData = {
    app: 'Iqra',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalBookmarks: bookmarks.length,
    bookmarks: bookmarks.map((b) => ({
      type: b.type,
      refId: b.refId,
      title: b.title,
      subtitle: b.subtitle,
      extraData: b.extraData,
      createdAt: b.createdAt,
    })),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `iqra-bookmarks-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { count: bookmarks.length, filename };
}

export async function importBookmarksFromJson(file: File): Promise<{ importedCount: number; message: string }> {
  const text = await file.text();
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error('File tidak valid. Harap pilih file JSON bookmark Iqra yang sah.');
  }

  const rawBookmarks = Array.isArray(parsed) ? parsed : parsed.bookmarks;
  if (!Array.isArray(rawBookmarks)) {
    throw new Error('Format data tidak sesuai. File harus berisi daftar bookmark.');
  }

  let importedCount = 0;
  for (const item of rawBookmarks) {
    if (!item.refId || !item.type || !item.title) continue;

    // Check if refId already exists
    const existing = await db.bookmarks.where('refId').equals(item.refId).first();
    if (!existing) {
      await db.bookmarks.add({
        type: item.type,
        refId: item.refId,
        title: item.title,
        subtitle: item.subtitle,
        extraData: item.extraData,
        createdAt: item.createdAt || Date.now(),
      });
      importedCount++;
    }
  }

  return {
    importedCount,
    message: `Berhasil mengimpor ${importedCount} bookmark baru.`,
  };
}
