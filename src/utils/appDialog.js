// Global imperative dialog & toast controller (pengganti window.alert / window.confirm / window.prompt)

let dialogListener = null;
let toastListener = null;
const pendingQueue = [];

export const registerDialogHost = (listener) => {
  dialogListener = listener;
  while (pendingQueue.length > 0 && dialogListener) {
    dialogListener(pendingQueue.shift());
  }
  return () => {
    if (dialogListener === listener) dialogListener = null;
  };
};

export const registerToastHost = (listener) => {
  toastListener = listener;
  return () => {
    if (toastListener === listener) toastListener = null;
  };
};

const enqueueDialog = (payload) => {
  return new Promise((resolve) => {
    const item = { ...payload, resolve };
    if (dialogListener) {
      dialogListener(item);
    } else {
      pendingQueue.push(item);
    }
  });
};

const inferVariantFromMessage = (message, fallback = 'info') => {
  const lower = String(message || '').toLowerCase();
  if (
    lower.includes('hapus') ||
    lower.includes('cabut') ||
    lower.includes('kosongkan') ||
    lower.includes('reset') ||
    lower.includes('peringatan') ||
    lower.includes('ditolak') ||
    lower.includes('tolak') ||
    lower.includes('buka kunci')
  ) {
    return 'danger';
  }
  if (
    lower.includes('belum dapat') ||
    lower.includes('belum dicentang') ||
    lower.includes('melebihi batas') ||
    lower.includes('tidak diizinkan') ||
    lower.includes('wajib diisi') ||
    lower.includes('tidak ditemukan') ||
    lower.includes('kesalahan')
  ) {
    return 'warning';
  }
  if (lower.includes('berhasil') || lower.includes('sahkan') || lower.includes('publikasikan')) {
    return 'success';
  }
  return fallback;
};

/**
 * Pengganti window.alert()
 */
export const appAlert = (message, options = {}) => {
  const text = String(message ?? '');
  return enqueueDialog({
    type: 'alert',
    title: options.title || '',
    message: text,
    confirmText: options.confirmText || 'Mengerti',
    variant: options.variant || inferVariantFromMessage(text, 'info'),
  });
};

/**
 * Pengganti window.confirm() -> Promise<boolean>
 */
export const appConfirm = (message, options = {}) => {
  const text = String(message ?? '');
  return enqueueDialog({
    type: 'confirm',
    title: options.title || '',
    message: text,
    confirmText: options.confirmText || 'Lanjutkan',
    cancelText: options.cancelText || 'Batal',
    variant: options.variant || inferVariantFromMessage(text, 'info'),
  });
};

/**
 * Pengganti window.prompt() -> Promise<string | null>
 */
export const appPrompt = (message, defaultValue = '', options = {}) => {
  const text = String(message ?? '');
  return enqueueDialog({
    type: 'prompt',
    title: options.title || '',
    message: text,
    defaultValue: String(defaultValue ?? ''),
    placeholder: options.placeholder || '',
    confirmText: options.confirmText || 'Simpan',
    cancelText: options.cancelText || 'Batal',
    readOnly: Boolean(options.readOnly),
    variant: options.variant || 'info',
  });
};

/**
 * Floating toast ringan (pojok kanan bawah, tanpa menggeser layout)
 */
export const appToast = (message, options = {}) => {
  const text = String(message ?? '');
  if (!text) return;
  if (toastListener) {
    toastListener({
      message: text,
      variant: options.variant || inferVariantFromMessage(text, 'success'),
      duration: options.duration || 3200,
    });
  }
};
