// Pagination generator function
export function generatePagination(currentPage, totalItems, perPage, pageGap) {
    const totalPages = Math.ceil(totalItems / perPage);
    const pages = [];

    // Add "Previous" button
    pages.push({
        id: currentPage - 1,
        name: "Previous",
        isDisabled: currentPage === 1
    });

    // Prepend pages
    for (let i = Math.max(1, currentPage - pageGap); i < currentPage; i++) {
        pages.push({ id: i, name: i.toString() });
    }

    // Current page
    pages.push({ id: currentPage, name: currentPage.toString(), current: true });

    // Append pages
    for (let i = currentPage + 1; i <= Math.min(totalPages, currentPage + pageGap); i++) {
        pages.push({ id: i, name: i.toString() });
    }

    // Add "Next" button
    pages.push({
        id: currentPage + 1,
        name: "Next",
        isDisabled: currentPage === totalPages
    });

    return {
        totalPages,
        pages
    };
}