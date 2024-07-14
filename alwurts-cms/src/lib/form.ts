export const convertToFormData = (data: Record<string, any>) => {
  const formData = new FormData();
  for (const key of Object.keys(data)) {
    if (data[key] instanceof FileList) {
      formData.append(key, data[key][0]);
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};