export const timeFormat = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(new Date(`1970-01-01T${date}:00`))
}