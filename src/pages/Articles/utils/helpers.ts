export const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Дата не указана";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch {
        return "Дата не указана";
    }
};

export const getArticlePreview = (content: string | undefined): string => {
    if (!content) return "Нет содержимого";
    const text = content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
};
