// Date ko readable format mein convert karo

export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

export const formatDateTime = (dateStr, timeStr) => {
    return `${formatDate(dateStr)} • ${timeStr}`
}