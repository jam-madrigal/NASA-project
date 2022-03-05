// Paginating our endpoints
function getPagination(query) {
    // Our query returns the limit parameter as a string, so we convert it to the absolute value, both to make sure it is positive and a number
    const page = Math.abs(query.page);
    const limit = Math.abs(query.limit);
    // How many documents to skip depending on the page we want. Since the limit defines the length of the page, we will always need to skip enough pages to reach the page we want (page -1), ex. if a limit of 50, and we want page 2, we must skip 50, and this formula will always give us that number
    const skip = (page -1) * limit;

    return {
        skip,
        limit
    };
}