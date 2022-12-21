export function stopEvent(event: Event): boolean {
    event.preventDefault();
    event.stopPropagation();

    return false;
}
